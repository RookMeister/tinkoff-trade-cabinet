import { Helpers, TinkoffInvestApi } from 'tinkoff-invest-api'
import type { OperationItem } from 'tinkoff-invest-api/src/generated/operations'
import type { Share } from 'tinkoff-invest-api/cjs/generated/instruments'

type MyOperations = OperationItem & { paymentNumber?: number, priceNumber?: number, yieldNumber?: number, yieldRelativeNumber?: number, isin: string }

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token') || ''
  const api = new TinkoffInvestApi({ token })
  const { accounts } = await api.users.getAccounts({})
  const accountId = accounts[0].id
  const operations = await api.operations.getOperationsByCursor({
    accountId,
    state: 0,
    instrumentId: '',
    cursor: '',
    limit: 1000,
    operationTypes: [],
    withoutCommissions: false,
    withoutTrades: false,
    withoutOvernights: false,
  })

  const idSharesOperations = operations.items.filter(({ instrumentType }) => instrumentType === 'share').map(({ figi }) => figi)
  const idSharesOperationsUnique = [...new Set(idSharesOperations)]
  const arrPromisesMyShared = idSharesOperationsUnique.map(id => api.instruments.shareBy({ id, idType: 1, classCode: '' }))

  const allData = await Promise.all([...arrPromisesMyShared])

  const positionsData = allData.reduce((target: { [key: string]: Share }, item) => {
    if (item.instrument)
      target[item.instrument.figi] = item.instrument
    return target
  }, {})

  const myOperations: MyOperations[] = []

  operations.items.forEach((o) => {
    if (o.state === 1) {
      myOperations.push({
        ...o,
        yieldNumber: Helpers.toNumber(o.yield),
        yieldRelativeNumber: Helpers.toNumber(o.yieldRelative),
        paymentNumber: Helpers.toNumber(o.payment),
        priceNumber: Helpers.toNumber(o.price),
        isin: positionsData[o.figi]?.isin || o.name,
      })
    }
  })

  return { operations: myOperations }
})
