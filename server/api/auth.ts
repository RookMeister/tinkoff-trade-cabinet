import { TinkoffInvestApi } from 'tinkoff-invest-api'

export default defineEventHandler(async (event) => {
  const { token = '' } = parseCookies(event)
  if (!token) return { success: false, message: 'Отсутствует токен' }
  try {
    const api = new TinkoffInvestApi({ token })

    const { accounts } = await api.users.getAccounts({})
    return { success: true, accounts, message: 'Авторизация прошла успешно' }
  } catch (error) {
    return { success: false, message: 'Неверный токен' }
  }
})
