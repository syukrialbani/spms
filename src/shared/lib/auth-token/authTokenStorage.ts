type StoredTokens = {
  accessToken: string
  refreshToken: string
}

const accessTokenKey = 'spms.accessToken'
const refreshTokenKey = 'spms.refreshToken'

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

export const authTokenStorage = {
  getAccessToken() {
    return getStorage()?.getItem(accessTokenKey) ?? null
  },
  getRefreshToken() {
    return getStorage()?.getItem(refreshTokenKey) ?? null
  },
  setTokens(tokens: StoredTokens) {
    const storage = getStorage()

    storage?.setItem(accessTokenKey, tokens.accessToken)
    storage?.setItem(refreshTokenKey, tokens.refreshToken)
  },
  clear() {
    const storage = getStorage()

    storage?.removeItem(accessTokenKey)
    storage?.removeItem(refreshTokenKey)
  },
}
