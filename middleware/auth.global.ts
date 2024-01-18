import { TinkoffInvestApi } from 'tinkoff-invest-api'

// export default defineEventHandler(async (event) => {
//   try {
//     const token = getCookie(event, 'token') || ''
//     const api = new TinkoffInvestApi({ token })

//     const { accounts } = await api.users.getAccounts({})
//     return accounts
//   }
//   catch (error) {
//     return error
//   }
// })

export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('token')

  if (!token.value && to.path !== '/login')
    return navigateTo('/login')

  const { data } = await useFetch('/api/auth')
  const success = data.value?.success
  if (!success && to.path !== '/login')
    return navigateTo('/login')
})
