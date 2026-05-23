type StoredTokens = {
  accessToken: string
  refreshToken: string
}

const accessTokenKey = 'spms.accessToken'
const refreshTokenKey = 'spms.refreshToken'

const getLocalStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

const getSessionStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage
}

const getPreferredStorage = (rememberMe: boolean) =>
  rememberMe ? getLocalStorage() : getSessionStorage()

export const authTokenStorage = {
  getAccessToken() {
    return (
      getLocalStorage()?.getItem(accessTokenKey) ??
      getSessionStorage()?.getItem(accessTokenKey) ??
      null
    )
  },
  getRefreshToken() {
    return (
      getLocalStorage()?.getItem(refreshTokenKey) ??
      getSessionStorage()?.getItem(refreshTokenKey) ??
      null
    )
  },
  setTokens(tokens: StoredTokens, rememberMe: boolean) {
    const targetStorage = getPreferredStorage(rememberMe)
    const staleStorage = rememberMe ? getSessionStorage() : getLocalStorage()

    staleStorage?.removeItem(accessTokenKey)
    staleStorage?.removeItem(refreshTokenKey)
    targetStorage?.setItem(accessTokenKey, tokens.accessToken)
    targetStorage?.setItem(refreshTokenKey, tokens.refreshToken)
  },
  clear() {
    getLocalStorage()?.removeItem(accessTokenKey)
    getLocalStorage()?.removeItem(refreshTokenKey)
    getSessionStorage()?.removeItem(accessTokenKey)
    getSessionStorage()?.removeItem(refreshTokenKey)
  },
}
