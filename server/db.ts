import { TinkoffInvestApi } from 'tinkoff-invest-api'
import type { Currency, Etf, Share } from 'tinkoff-invest-api/cjs/generated/instruments'

export const shares: Map<string, Share> = new Map()
export const etfs: Map<string, Etf> = new Map()
export const currencies: Map<string, Currency> = new Map()

export class ApiTinkoff {
  protected api: TinkoffInvestApi

  constructor(token: string) {
    this.api = new TinkoffInvestApi({ token })
  }

  getAccounts() {
    return this.api.users.getAccounts({})
  }

  getPortfolio(accountId: string) {
    return this.api.operations.getPortfolio({ accountId })
  }

  getOperationsByCursor(paramsOperations: any) {
    return this.api.operations.getOperationsByCursor(paramsOperations)
  }

  async getShare(id: string) {
    const { instrument } = await this.api.instruments.shareBy({ id, idType: 1, classCode: '' })
    instrument && shares.set(instrument.name, instrument)
    instrument && shares.set(instrument.figi, instrument)
    return instrument
  }

  async getEtf(id: string) {
    const { instrument } = await this.api.instruments.etfBy({ id, idType: 1, classCode: '' })
    instrument && etfs.set(instrument.name, instrument)
    instrument && etfs.set(instrument.figi, instrument)
    return instrument
  }

  async getCurrency(id: string) {
    const { instrument } = await this.api.instruments.currencyBy({ id, idType: 1, classCode: '' })
    instrument && currencies.set(instrument.name, instrument)
    instrument && currencies.set(instrument.figi, instrument)
    return instrument
  }
}
