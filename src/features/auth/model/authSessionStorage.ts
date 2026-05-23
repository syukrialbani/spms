import { authTokenStorage } from '@shared/lib/auth-token'
import type { AuthSession } from './types'

const sessionKey = 'spms.authSession'
const rememberedUsernameKey = 'spms.rememberedUsername'
const rememberMeKey = 'spms.rememberMe'

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

const isAuthSession = (value: unknown): value is AuthSession => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const session = value as Partial<AuthSession>

  return (
    typeof session.id === 'number' &&
    typeof session.username === 'string' &&
    typeof session.accessToken === 'string' &&
    typeof session.refreshToken === 'string'
  )
}

export const authSessionStorage = {
  get() {
    const rawSession =
      getLocalStorage()?.getItem(sessionKey) ??
      getSessionStorage()?.getItem(sessionKey)

    if (!rawSession) {
      return null
    }

    try {
      const parsedSession: unknown = JSON.parse(rawSession)

      if (isAuthSession(parsedSession)) {
        return parsedSession
      }
    } catch {
      authTokenStorage.clear()
    }

    return null
  },
  getRememberedUsername() {
    return getLocalStorage()?.getItem(rememberedUsernameKey) ?? ''
  },
  isRememberMeEnabled() {
    return getLocalStorage()?.getItem(rememberMeKey) === 'true'
  },
  set(session: AuthSession, rememberMe: boolean) {
    const targetStorage = getPreferredStorage(rememberMe)
    const staleStorage = rememberMe ? getSessionStorage() : getLocalStorage()

    staleStorage?.removeItem(sessionKey)
    targetStorage?.setItem(sessionKey, JSON.stringify(session))
    authTokenStorage.setTokens(session, rememberMe)

    if (rememberMe) {
      getLocalStorage()?.setItem(rememberedUsernameKey, session.username)
      getLocalStorage()?.setItem(rememberMeKey, 'true')
    } else {
      getLocalStorage()?.removeItem(rememberedUsernameKey)
      getLocalStorage()?.removeItem(rememberMeKey)
    }
  },
  clear() {
    getLocalStorage()?.removeItem(sessionKey)
    getSessionStorage()?.removeItem(sessionKey)
    authTokenStorage.clear()
  },
}
