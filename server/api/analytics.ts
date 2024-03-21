import { Helpers, TinkoffInvestApi } from 'tinkoff-invest-api'
import type { Share } from 'tinkoff-invest-api/cjs/generated/instruments'
import type { OperationItem } from 'tinkoff-invest-api/src/generated/operations'
import type { Quotation } from 'tinkoff-invest-api/src/generated/common'

interface MyOperations extends Share {
  operations: OperationItem[]
  allYield: number
  currentPrice?: Quotation
  expectedYield: number
}

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token') || ''
  const api = new TinkoffInvestApi({ token })

  const { accounts } = await api.users.getAccounts({})
  const accountId = accounts[0].id
  const operations = await api.operations.getOperationsByCursor({
    accountId,
    state: 1,
    instrumentId: '',
    cursor: '',
    limit: 1000,
    operationTypes: [],
    withoutCommissions: false,
    withoutTrades: false,
    withoutOvernights: false,
  })

  const portfolio = await api.operations.getPortfolio({ accountId })
  console.log(operations.items.filter(({ instrumentType }) => instrumentType === 'share').map(({ name, description }) => `${name} ${description}`))

  const idSharesOperations = operations.items.filter(({ instrumentType }) => instrumentType === 'share').map(({ figi }) => figi)
  const idSharesOperationsUnique = [...new Set(idSharesOperations)]
  const arrPromisesMyShared = idSharesOperationsUnique.map(id => api.instruments.shareBy({ id, idType: 1, classCode: '' }))
  const shapes = await Promise.all([...arrPromisesMyShared])
  const { lastPrices } = await api.marketdata.getLastPrices({ figi: idSharesOperationsUnique })

  const objectLastPrices = Object.fromEntries(lastPrices.map(({ figi, price }) => [figi, price]))
  const objecPortfolioPosition = Object.fromEntries(portfolio.positions.map(pos => [pos.figi, pos]))
  const objectShapes: { [key: string]: Share } = Object.fromEntries(shapes.filter(({ instrument }) => instrument).map(shape => [shape.instrument?.name, shape.instrument]))

  const myOperations: { [key: string]: MyOperations } = {}
  operations.items.forEach((o) => {
    const isin = objectShapes[o.name]?.isin
    if (isin && !myOperations[isin] && o.instrumentType !== 'currency') {
      const shape = objectShapes[o.name]
      myOperations[isin] = {
        operations: [],
        allYield: 0,
        expectedYield: 0,
        ...shape,
      }
    }
    const expectedYield = objecPortfolioPosition[o.figi]?.expectedYield
    console.log(1, expectedYield)

    const averagePositionPrice = objecPortfolioPosition[o.figi]?.averagePositionPrice
    const quantity = objecPortfolioPosition[o.figi]?.quantity

    if (expectedYield && averagePositionPrice && quantity && myOperations[isin]) {
      console.log(2, Helpers.toNumber(expectedYield))
      myOperations[isin].expectedYield = Helpers.toNumber(expectedYield)
    }
    if (averagePositionPrice && quantity && myOperations[isin])
      myOperations[isin].expectedYield += Helpers.toNumber(averagePositionPrice) * Helpers.toNumber(quantity)

    if (myOperations[isin] && ((o.type === 15) || (o.type === 21) || (o.type === 22)) && (o.instrumentType !== 'currency')) {
      myOperations[isin].allYield += Helpers.toNumber(o.payment) || 0

      myOperations[isin].currentPrice = objectLastPrices[o.figi]
      myOperations[isin].operations.push(o)
    }
  })
  return Object.values(myOperations)
})
