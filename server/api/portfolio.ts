import type { PortfolioPosition } from 'tinkoff-invest-api/src/generated/operations'
import { Helpers, TinkoffInvestApi } from 'tinkoff-invest-api'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token') || ''
  const api = new TinkoffInvestApi({ token })
  // получить список счетов
  const { accounts } = await api.users.getAccounts({})
  const accountId = accounts[0].id
  const portfolio = await api.operations.getPortfolio({ accountId })

  const idShares = portfolio.positions.filter(({ instrumentType }) => instrumentType === 'share').map(({ figi }) => figi)
  const idsCurrency = portfolio.positions.filter(({ instrumentType }) => instrumentType === 'currency').map(({ figi }) => figi)
  const arrPromisesMyShared = await api.instruments.shares({ instrumentStatus: 2 })
  const arrPromisesMyCurrency = await api.instruments.currencies({ instrumentStatus: 2 })

  const allData = {
    ...Object.fromEntries(arrPromisesMyShared.instruments.filter(({ figi }) => idShares.includes(figi)).map(item => [item.figi, item])),
    ...Object.fromEntries(arrPromisesMyCurrency.instruments.filter(({ figi }) => idsCurrency.includes(figi)).map(item => [item.figi, item])),
  }

  const portfolioData = {
    expectedYield: portfolio.expectedYield,
    positions: portfolio.positions.map((item: PortfolioPosition) => ({ ...item, ...allData[item.figi] })),
    totalAmountBonds: portfolio.totalAmountBonds,
    totalAmountCurrencies: portfolio.totalAmountCurrencies,
    totalAmountEtf: portfolio.totalAmountEtf,
    totalAmountFutures: portfolio.totalAmountFutures,
    totalAmountShares: portfolio.totalAmountShares,
  }

  return portfolioData
})
