import { TinkoffInvestApi } from 'tinkoff-invest-api'

export default defineEventHandler(async (event) => {
  const { token = '' } = parseCookies(event)

  try {
    const api = new TinkoffInvestApi({ token })

    const { accounts } = await api.users.getAccounts({})
    return { success: true, accounts, message: 'Авторизация прошла успешно' }
  }
  catch (error) {
    if (!token)
      return { success: false, message: 'Отсутствует токен' }
    else
      return { success: false, message: 'Неверный токен' }
  }
})
