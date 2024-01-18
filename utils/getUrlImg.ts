import { imageCodes } from '~/constants/index'

export function getUrlImg(isin: string) {
  return `https://invest-brands.cdn-tinkoff.ru/${imageCodes[isin] || isin}x160.png`
}
