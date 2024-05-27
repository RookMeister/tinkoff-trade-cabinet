import type { MoneyValue, Quotation } from 'tinkoff-invest-api/src/generated/common'

export function useMoneyFormatKopek(value: MoneyValue | Quotation | number | undefined, isSign = false) {
  // const locale = 'ru-RU'
  // const currency = '₽'
  // const separator = '\u00A0'

  // const price = nano ? formatingPrice(units, nano) : units
  // const num = Math.abs(price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ')

  // const res = num.split('.')
  // const sign = isSign ? Number(price) >= 0 ? ' +' : ' –' : ''
  // return `${sign}${res[0]},${res[1]}${separator}${currency}`
  // const locale = 'ru-RU'
  const price = (value as MoneyValue).currency ? toNumber(value as MoneyValue) : value as number
  const currencies: Record<string, string> = {
    rub: '₽',
    usd: '$'
  }
  const separator = '\u00A0'
  if (price === undefined)
    return '–'

  if (price === 0 && value)
    return `${price}${separator}${currencies[(value as MoneyValue).currency || 'rub']}`

  const num = Math.abs(price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ')

  const res = num.split('.')
  const sign = isSign ? Number(price) >= 0 ? ' +' : ' –' : ''
  return `${sign}${res[0]},${res[1]}${separator}${currencies[(value as MoneyValue).currency || 'rub']}`
}
