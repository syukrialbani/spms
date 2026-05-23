import { authTokenStorage } from '@shared/lib/auth-token'
import type { AuthSession } from './types'

const sessionKey = 'spms.authSession'

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

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
    const rawSession = getStorage()?.getItem(sessionKey)

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
  set(session: AuthSession) {
    getStorage()?.setItem(sessionKey, JSON.stringify(session))
    authTokenStorage.setTokens(session)
  },
  clear() {
    getStorage()?.removeItem(sessionKey)
    authTokenStorage.clear()
  },
}
