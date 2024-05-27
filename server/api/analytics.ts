import { Helpers, TinkoffInvestApi } from 'tinkoff-invest-api'
import type { Etf, Share } from 'tinkoff-invest-api/cjs/generated/instruments'
import type { OperationItem } from 'tinkoff-invest-api/src/generated/operations'
import { ApiTinkoff, etfs, shares } from '~/server/db'

interface MyOperations {
  operations: OperationItem[]
  allYield: number
  expectedYield: number
  dividendYield: number
  totalTax: number
  serviceFee: number
  brokerFee: number
  share?: Share
  etf?: Etf
}
const operationsUsers: Map<string, OperationItem[]> = new Map()

export default defineEventHandler(async (event) => {
  const { token = '' } = parseCookies(event)
  const api = new ApiTinkoff(token)
  const api1 = new TinkoffInvestApi({ token })
  // const startTime = new Date().getTime()
  // console.log('start', 0, operationsUsers.get(token)?.length)

  const { accounts } = await api.getAccounts()
  const accountId = accounts[0].id

  const paramsOperations = {
    accountId,
    state: 1,
    instrumentId: '',
    cursor: '',
    limit: 1000,
    operationTypes: [],
    withoutCommissions: false,
    withoutTrades: false,
    withoutOvernights: false
  }

  async function getOperationsByCursor() {
    const arrOperations = operationsUsers.get(token) ?? []
    const length = arrOperations.length

    if (length >= 1000) {
      const cursor = arrOperations.at(-1)?.cursor || ''
      const operationsRes = await api.getOperationsByCursor({ ...paramsOperations, cursor })
      arrOperations.push(...operationsRes.items)
    } else if (length === 0) {
      const operationsRes = await api.getOperationsByCursor(paramsOperations)
      operationsUsers.set(token, operationsRes.items)
      arrOperations.push(...operationsRes.items)
    }
    return arrOperations
  }

  const operations = await getOperationsByCursor()

  const portfolio = await api.getPortfolio(accountId)
  const objecPortfolioPosition = Object.fromEntries(portfolio.positions.map(pos => [pos.figi, pos]))

  const allData = {
    dividendYield: 0,
    totalTax: 0,
    serviceFee: 0,
    brokerFee: 0,
    typeInput: 0,
    typeOutput: 0,
    dividendYieldOp: [],
    totalTaxOp: [],
    serviceFeeOp: [],
    brokerFeeOp: [],
    typeInputOp: [],
    typeOutputOp: []
  }
  const myOperations: { [key: string]: MyOperations } = {}

  async function setMyOperations() {
    for (const o of operations) {
      const share = o.instrumentType === 'share' ? shares.get(o.name) || await api.getShare(o.figi) : undefined
      const etf = o.instrumentType === 'etf' ? etfs.get(o.name) || await api.getEtf(o.figi) : undefined
      const isin = share?.isin || etf?.isin

      if (isin && !myOperations[isin] && o.instrumentType !== 'currency') {
        myOperations[isin] = {
          operations: [],
          allYield: 0,
          expectedYield: 0,
          dividendYield: 0,
          totalTax: 0,
          serviceFee: 0,
          brokerFee: 0,
          share,
          etf
        }
      }
      const expectedYield = objecPortfolioPosition[o.figi]?.expectedYield
      const averagePositionPrice = objecPortfolioPosition[o.figi]?.averagePositionPrice
      const quantity = objecPortfolioPosition[o.figi]?.quantity

      if ((o.type === 2 || o.type === 5 || o.type === 8 || o.type === 11 || o.type === 13 || o.type === 14 || o.type === 32 || o.type === 33 || o.type === 34 || o.type === 35 || o.type === 36 || o.type === 37 || o.type === 3 || o.type === 39 || o.type === 40 || o.type === 41 || o.type === 42) && (o.instrumentType !== 'currency')) {
        allData.totalTax += Helpers.toNumber(o.payment) || 0
        allData.totalTaxOp.push(o)
        if (isin && myOperations[isin]) {
          myOperations[isin].totalTax += Helpers.toNumber(o.payment) || 0
        }
      }

      if ((o.type === 21 || o.type === 43) && (o.instrumentType !== 'currency')) {
        allData.dividendYield += Helpers.toNumber(o.payment) || 0
        allData.dividendYieldOp.push(o)
        if (isin && myOperations[isin]) {
          myOperations[isin].dividendYield += Helpers.toNumber(o.payment) || 0
        }
      }

      if (o.type === 12 && (o.instrumentType !== 'currency')) {
        allData.serviceFeeOp.push(o)
        allData.serviceFee += Helpers.toNumber(o.payment) || 0
      }

      if (o.type === 19 && (o.instrumentType !== 'currency')) {
        allData.brokerFeeOp.push(o)
        allData.brokerFee += Helpers.toNumber(o.payment) || 0
      }

      if (isin && expectedYield && myOperations[isin]) {
        myOperations[isin].expectedYield = Helpers.toNumber(expectedYield)
      }

      if (isin && averagePositionPrice && quantity && myOperations[isin]) {
        myOperations[isin].expectedYield += Helpers.toNumber(averagePositionPrice) * Helpers.toNumber(quantity)
      }

      if (isin && myOperations[isin] && ((o.type === 15) || (o.type === 22)) && (o.instrumentType !== 'currency')) {
        myOperations[isin].allYield += Helpers.toNumber(o.payment) || 0
      }

      if (o.type === 1 && (o.instrumentType !== 'currency')) {
        allData.typeInputOp.push(o)
        allData.typeInput += Helpers.toNumber(o.payment) || 0
      }
      if (o.type === 9 && (o.instrumentType !== 'currency')) {
        allData.typeOutputOp.push(o)
        if (o.payment?.currency === 'usd') {
          const { candles } = await api.getCandles({ figi: 'BBG0013HGFT4', from: new Date('2022-02-27T20:06:22.000Z'), to: new Date('2022-02-28T20:06:22.000Z'), interval: 5 })
          allData.typeOutput += candles[0] && candles[0].close ? Helpers.toNumber(candles[0].close) * Helpers.toNumber(o.payment) || 0 : 0
        } else {
          allData.typeOutput += Helpers.toNumber(o.payment) || 0
        }
      }

      if (isin && myOperations[isin])
        myOperations[isin].operations.push(o)
    }
  }

  await setMyOperations()
  // const endTime = new Date().getTime()
  // console.log('end', endTime - startTime, operationsUsers.get(token)?.length)
  return { allData, myOperations: Object.values(myOperations) }
})
