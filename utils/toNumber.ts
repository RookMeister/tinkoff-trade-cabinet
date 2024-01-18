import type { MoneyValue, Quotation } from 'tinkoff-invest-api/src/generated/common'

export function toNumber<T extends Quotation | MoneyValue | undefined>(value: T) {
  return (value ? value.units + value.nano / 1000000000 : 0)
}
