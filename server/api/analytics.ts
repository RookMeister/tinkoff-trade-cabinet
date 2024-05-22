import { Helpers } from 'tinkoff-invest-api'
import type { Etf, Share } from 'tinkoff-invest-api/cjs/generated/instruments'
import type { OperationItem } from 'tinkoff-invest-api/src/generated/operations'
import { ApiTinkoff, etfs, shares } from '~/server/db'

interface MyOperations {
  operations: OperationItem[]
  allYield: number
  expectedYield: number
  share?: Share
  etf?: Etf
}
const operationsUsers: Map<string, OperationItem[]> = new Map()

export default defineEventHandler(async (event) => {
  const { token = '' } = parseCookies(event)
  const api = new ApiTinkoff(token)
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
    withoutOvernights: false,
  }

  async function getOperationsByCursor() {
    const arrOperations = operationsUsers.get(token) ?? []
    const length = arrOperations.length

    if (length >= 1000) {
      const cursor = arrOperations.at(-1)?.cursor || ''
      const operationsRes = await api.getOperationsByCursor({ ...paramsOperations, cursor })
      arrOperations.push(...operationsRes.items)
    }
    else if (length === 0) {
      const operationsRes = await api.getOperationsByCursor(paramsOperations)
      operationsUsers.set(token, operationsRes.items)
      arrOperations.push(...operationsRes.items)
    }
    return arrOperations
  }

  const operations = await getOperationsByCursor()

  const portfolio = await api.getPortfolio(accountId)
  const objecPortfolioPosition = Object.fromEntries(portfolio.positions.map(pos => [pos.figi, pos]))

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
          share,
          etf,
        }
      }
      const expectedYield = objecPortfolioPosition[o.figi]?.expectedYield
      const averagePositionPrice = objecPortfolioPosition[o.figi]?.averagePositionPrice
      const quantity = objecPortfolioPosition[o.figi]?.quantity

      if (isin && expectedYield && averagePositionPrice && quantity && myOperations[isin])
        myOperations[isin].expectedYield = Helpers.toNumber(expectedYield)

      if (isin && averagePositionPrice && quantity && myOperations[isin])
        myOperations[isin].expectedYield += Helpers.toNumber(averagePositionPrice) * Helpers.toNumber(quantity)

      if (isin && myOperations[isin] && ((o.type === 15) || (o.type === 21) || (o.type === 22)) && (o.instrumentType !== 'currency')) {
        myOperations[isin].allYield += Helpers.toNumber(o.payment) || 0

        myOperations[isin].operations.push(o)
      }
    }
  }

  await setMyOperations()
  // const endTime = new Date().getTime()
  // console.log('end', endTime - startTime, operationsUsers.get(token)?.length)
  return Object.values(myOperations)
})
