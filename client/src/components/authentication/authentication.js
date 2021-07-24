export const getTokenFromLocalStorage = () => {
  return window.localStorage.getItem('token')
}

const getPayload = () => {
  const token = getTokenFromLocalStorage()
  if (!token) return false
  const parts = token.split('.')
  if (parts.length < 3) return false
  return JSON.parse(atob(parts[1]))
}

export const userIsAuthenticated = () => {
  const payload = getPayload()
  if (!payload) return false
  const now = Math.round(Date.now() / 1000)
  return now < payload.exp
}