import { ApiTinkoff, currencies, etfs, shares } from '~/server/db'

export default defineEventHandler(async (event) => {
  const { token = '' } = parseCookies(event)

  const api = new ApiTinkoff(token)
  // получить список счетов
  const { accounts } = await api.getAccounts()
  const accountId = accounts[0].id
  const portfolio = await api.getPortfolio(accountId)

  const positions = []
  for (const item of portfolio.positions) {
    const share = item.instrumentType === 'share' ? shares.get(item.figi) || await api.getShare(item.figi) : undefined
    const etf = item.instrumentType === 'etf' ? etfs.get(item.figi) || await api.getEtf(item.figi) : undefined
    const currency = item.instrumentType === 'currency' ? currencies.get(item.figi) || await api.getCurrency(item.figi) : undefined

    const data = share || etf || currency
    positions.push({ ...item, name: data?.name, figi: data?.figi, isin: data?.isin, ticker: data?.ticker })
  }

  const portfolioData = {
    expectedYield: portfolio.expectedYield,
    positions,
    totalAmountBonds: portfolio.totalAmountBonds,
    totalAmountCurrencies: portfolio.totalAmountCurrencies,
    totalAmountEtf: portfolio.totalAmountEtf,
    totalAmountFutures: portfolio.totalAmountFutures,
    totalAmountShares: portfolio.totalAmountShares
  }

  return portfolioData
})
