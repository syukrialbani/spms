import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UserRole } from '../model/types'
import {
  usersApi,
  type CreateUserPayload,
  type UpdateUserPayload,
} from './usersApi'

export const usersQueryKeys = {
  all: ['users'] as const,
  list: (params?: { search?: string; role?: string }) =>
    ['users', 'list', params ?? {}] as const,
  options: (role?: UserRole) => ['users', 'options', role ?? 'ALL'] as const,
}

export const useUsersQuery = (params?: { search?: string; role?: string }) =>
  useQuery({
    queryKey: usersQueryKeys.list(params),
    queryFn: () => usersApi.list(params),
  })

export const useUserPicOptionsQuery = (role?: UserRole) =>
  useQuery({
    queryKey: usersQueryKeys.options(role),
    queryFn: () => usersApi.listOptions(role).then((res) => res.data),
  })

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.all })
    },
  })
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      usersApi.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.all })
    },
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => usersApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.all })
    },
  })
}
