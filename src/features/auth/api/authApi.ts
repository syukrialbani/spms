import { apiClient } from '@shared/api'
import type { AuthSession, LoginCredentials } from '../model/types'

type LoginRequestBody = LoginCredentials & {
  expiresInMins: number
}

export const loginRequest = (credentials: LoginCredentials) =>
  apiClient.post<AuthSession, LoginRequestBody>(
    '/auth/login',
    {
      ...credentials,
      expiresInMins: 60,
    },
    {
      auth: false,
      skipGlobalError: true,
    },
  )

export const logoutRequest = (refreshToken?: string | null) =>
  apiClient.post<{ message: string }, { refreshToken?: string }>(
    '/auth/logout',
    refreshToken ? { refreshToken } : {},
    {
      skipGlobalError: true,
    },
  )
