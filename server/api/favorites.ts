import '@total-typescript/ts-reset/filter-boolean'
import { TinkoffInvestApi } from 'tinkoff-invest-api'

export default defineEventHandler(async (event) => {
  const { token = '' } = parseCookies(event)
  const api = new TinkoffInvestApi({ token })
  const { accounts } = await api.users.getAccounts({})
  const accountId = accounts[0].id

  const { favoriteInstruments } = await api.instruments.getFavorites({ accountId })
  const idShares = favoriteInstruments.filter(({ instrumentType }) => instrumentType === 'share').map(({ figi }) => figi)
  const arrPromisesMyShared = idShares.map(id => api.instruments.shareBy({ id, idType: 1, classCode: '' }))
  const allData = await Promise.all([...arrPromisesMyShared])

  const { lastPrices } = await api.marketdata.getLastPrices({ figi: idShares })
  const objectLastPrices = Object.fromEntries(lastPrices.map(({ figi, price }) => [figi, price]))

  const favorites = allData.map(shape => shape.instrument).filter(Boolean)
  return favorites.map(shape => ({ ...shape, currentPrice: objectLastPrices[shape.figi] }))
})
