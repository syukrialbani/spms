import { apiClient } from '@shared/api'
import type { User, UserRole } from '../model/types'

export type UsersListResponse = {
  data: User[]
  total: number
}

export type UserPicOption = {
  id: number
  username: string
  name: string
  email: string
  phone: string
  role: UserRole
}

export type UserPicOptionsResponse = {
  data: UserPicOption[]
}

export type CreateUserPayload = {
  username: string
  email: string
  password: string
  firstName: string
  lastName?: string
  phone?: string
  role: UserRole
  isActive?: boolean
}

export type UpdateUserPayload = Partial<CreateUserPayload>

export const usersApi = {
  list(params?: { search?: string; role?: string }): Promise<UsersListResponse> {
    return apiClient.get<UsersListResponse>('/users', { params })
  },

  listOptions(role?: UserRole): Promise<UserPicOptionsResponse> {
    return apiClient.get<UserPicOptionsResponse>('/users/options', {
      params: role ? { role } : undefined,
    })
  },

  create(payload: CreateUserPayload): Promise<User> {
    return apiClient.post<User>('/users', payload)
  },

  update(id: number, payload: UpdateUserPayload): Promise<User> {
    return apiClient.put<User>(`/users/${id}`, payload)
  },

  remove(id: number): Promise<{ message: string; id: number }> {
    return apiClient.delete<{ message: string; id: number }>(`/users/${id}`)
  },
}
