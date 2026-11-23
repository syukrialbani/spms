import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { spmsApi, type SpmsListParams } from './spmsApi'

export const spmsQueryKeys = {
  all: ['spms'] as const,
  list: (params?: SpmsListParams) => ['spms', 'list', params ?? {}] as const,
  detail: (id: string) => ['spms', 'detail', id] as const,
  requestorOptions: () => ['spms', 'requestor-options'] as const,
}

export const useSpmsRequestorOptionsQuery = () =>
  useQuery({
    queryKey: spmsQueryKeys.requestorOptions(),
    queryFn: () => spmsApi.listRequestorOptions(),
    staleTime: 60_000,
  })

export const useSpmsListQuery = (params: SpmsListParams = { limit: 200 }) =>
  useQuery({
    queryKey: spmsQueryKeys.list(params),
    queryFn: () => spmsApi.list(params),
  })

export const useSpmsDetailQuery = (id: string | undefined) =>
  useQuery({
    queryKey: spmsQueryKeys.detail(id ?? ''),
    queryFn: () => spmsApi.getById(id!),
    enabled: Boolean(id),
  })

export const useCreateSpmsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => spmsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: spmsQueryKeys.all })
    },
  })
}

export const useUpdateSpmsMutation = (id: string | undefined) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => spmsApi.update(id!, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(spmsQueryKeys.detail(updated.id), updated)
      void queryClient.invalidateQueries({ queryKey: spmsQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: ['delivery-orders'] })
    },
  })
}
