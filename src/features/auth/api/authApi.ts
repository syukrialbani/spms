import { apiClient } from '@shared/api'
import type { AuthSession, LoginCredentials } from '../model/types'

export const loginRequest = (credentials: LoginCredentials) =>
  apiClient.post<AuthSession>(
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
