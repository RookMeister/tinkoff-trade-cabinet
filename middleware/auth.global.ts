export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('token')

  if (!token.value && to.path !== '/login')
    return navigateTo('/login')

  const { data } = await useFetch('/api/auth')
  const success = data.value?.success
  if (!success && to.path !== '/login')
    return navigateTo('/login')
})
