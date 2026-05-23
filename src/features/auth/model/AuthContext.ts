import { createContext } from 'react'
import type { AuthSession, LoginCredentials } from './types'

export type AuthContextValue = {
  session: AuthSession | null
  isAuthenticated: boolean
  isReady: boolean
  login: (credentials: LoginCredentials) => Promise<AuthSession>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
