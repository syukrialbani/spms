import type { User } from '@entities/user'

export type LoginCredentials = {
  username: string
  password: string
}

export type LoginOptions = {
  rememberMe: boolean
}

export type AuthSession = User & {
  accessToken: string
  refreshToken: string
}
