import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_UNAUTHORIZED_EVENT } from '@shared/api/events'
import { loginRequest } from '../api/authApi'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { authSessionStorage } from './authSessionStorage'
import type { AuthSession, LoginCredentials, LoginOptions } from './types'

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()
  const [session, setSession] = useState<AuthSession | null>(() =>
    authSessionStorage.get(),
  )
  const [isReady] = useState(true)
  const { mutateAsync: requestLogin } = useMutation({
    mutationFn: loginRequest,
  })

  const login = useCallback(async (
    credentials: LoginCredentials,
    options: LoginOptions = { rememberMe: false },
  ) => {
    const nextSession = await requestLogin(credentials)

    authSessionStorage.set(nextSession, options.rememberMe)
    setSession(nextSession)

    return nextSession
  }, [requestLogin])

  const logout = useCallback(() => {
    authSessionStorage.clear()
    setSession(null)
    queryClient.clear()
  }, [queryClient])

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
