import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  usersApi,
  type CreateUserPayload,
  type UpdateUserPayload,
} from './usersApi'

export const usersQueryKeys = {
  all: ['users'] as const,
  list: (params?: { search?: string; role?: string }) =>
    ['users', 'list', params ?? {}] as const,
}

export const useUsersQuery = (params?: { search?: string; role?: string }) =>
  useQuery({
    queryKey: usersQueryKeys.list(params),
    queryFn: () => usersApi.list(params),
  })

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: ['master-data'] })
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
      void queryClient.invalidateQueries({ queryKey: ['master-data'] })
    },
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => usersApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: ['master-data'] })
    },
  })
}
