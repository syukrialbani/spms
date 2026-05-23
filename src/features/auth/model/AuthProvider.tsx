import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { API_UNAUTHORIZED_EVENT } from '@shared/api/events'
import { loginRequest } from '../api/authApi'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { authSessionStorage } from './authSessionStorage'
import type { AuthSession, LoginCredentials, LoginOptions } from './types'

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(() =>
    authSessionStorage.get(),
  )
  const [isReady] = useState(true)

  const login = useCallback(async (
    credentials: LoginCredentials,
    options: LoginOptions = { rememberMe: false },
  ) => {
    const nextSession = await loginRequest(credentials)

    authSessionStorage.set(nextSession, options.rememberMe)
    setSession(nextSession)

    return nextSession
  }, [])

  const logout = useCallback(() => {
    authSessionStorage.clear()
    setSession(null)
  }, [])

  useEffect(() => {
    window.addEventListener(API_UNAUTHORIZED_EVENT, logout)

    return () => window.removeEventListener(API_UNAUTHORIZED_EVENT, logout)
  }, [logout])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session?.accessToken),
      isReady,
      login,
      logout,
    }),
    [isReady, login, logout, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
