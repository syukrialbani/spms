import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { StockListParams } from '../model/types'
import {
  stockApi,
  type CreateStockPayload,
  type UpdateStockPayload,
} from './stockApi'

export const stockQueryKeys = {
  all: ['stock'] as const,
  list: (params?: StockListParams) => ['stock', 'list', params ?? {}] as const,
  options: (params?: {
    search?: string
    lsp?: string
    unitCategory?: string
    stockStatus?: string
    limit?: number
  }) => ['stock', 'options', params ?? {}] as const,
  lsps: ['stock', 'lsps'] as const,
  detail: (id: string) => ['stock', 'detail', id] as const,
}

export const useStockListQuery = (params?: StockListParams) =>
  useQuery({
    queryKey: stockQueryKeys.list(params),
    queryFn: () => stockApi.list(params),
  })

export const useStockOptionsQuery = (
  params?: {
    search?: string
    lsp?: string
    unitCategory?: string
    stockStatus?: string
    limit?: number
  },
  enabled = true,
) =>
  useQuery({
    queryKey: stockQueryKeys.options(params),
    queryFn: () => stockApi.options(params).then((res) => res.data),
    enabled,
  })

export const useStockLspsQuery = () =>
  useQuery({
    queryKey: stockQueryKeys.lsps,
    queryFn: () => stockApi.lsps().then((res) => res.data),
  })

export const useStockDetailQuery = (id?: string) =>
  useQuery({
    queryKey: stockQueryKeys.detail(id ?? ''),
    queryFn: () => stockApi.detail(id!),
    enabled: Boolean(id),
  })

export const useStockMutations = () => {
  const queryClient = useQueryClient()
  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: stockQueryKeys.all })

  return {
    create: useMutation({
      mutationFn: (payload: CreateStockPayload) => stockApi.create(payload),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: UpdateStockPayload }) =>
        stockApi.update(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) => stockApi.remove(id),
      onSuccess: invalidate,
    }),
    allocate: useMutation({
      mutationFn: (payload: {
        subModuleSn: string
        targetModuleSn: string
        notes?: string
      }) => stockApi.allocate(payload),
      onSuccess: invalidate,
    }),
    detach: useMutation({
      mutationFn: (payload: { subModuleSn: string; notes?: string }) =>
        stockApi.detach(payload),
      onSuccess: invalidate,
    }),
  }
}
