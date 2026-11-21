import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { DeliveryOrderRecord } from '../model/types'
import {
  deliveryOrderApi,
  type CreateDoFromSpmsPayload,
  type CreateStandaloneDoPayload,
  type DeliveryOrderListParams,
  type ProcessDoPayload,
} from './deliveryOrderApi'

export const deliveryOrderQueryKeys = {
  all: ['delivery-orders'] as const,
  list: (params?: DeliveryOrderListParams) =>
    ['delivery-orders', 'list', params ?? {}] as const,
  detail: (deliveryOrder: string) =>
    ['delivery-orders', 'detail', deliveryOrder] as const,
}

export const useDeliveryOrdersQuery = (
  params: DeliveryOrderListParams = { limit: 200 },
) =>
  useQuery({
    queryKey: deliveryOrderQueryKeys.list(params),
    queryFn: () => deliveryOrderApi.list(params),
  })

export const useDeliveryOrderDetailQuery = (
  deliveryOrder: string | undefined,
) =>
  useQuery({
    queryKey: deliveryOrderQueryKeys.detail(deliveryOrder ?? ''),
    queryFn: () => deliveryOrderApi.getByCode(deliveryOrder!),
    enabled: Boolean(deliveryOrder),
  })

export const useCreateDoFromSpmsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateDoFromSpmsPayload) =>
      deliveryOrderApi.createFromSpms(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: deliveryOrderQueryKeys.all,
      })
      void queryClient.invalidateQueries({ queryKey: ['spms'] })
    },
  })
}

export const useCreateStandaloneDoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateStandaloneDoPayload) =>
      deliveryOrderApi.createStandalone(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: deliveryOrderQueryKeys.all,
      })
    },
  })
}

export const useGeneratePickupDoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (deliveryOrder: string) =>
      deliveryOrderApi.generatePickup(deliveryOrder),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: deliveryOrderQueryKeys.all,
      })
      void queryClient.invalidateQueries({ queryKey: ['spms'] })
    },
  })
}

export const useProcessDoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      deliveryOrder,
      payload,
    }: {
      deliveryOrder: string
      payload: ProcessDoPayload
    }) => deliveryOrderApi.process(deliveryOrder, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        deliveryOrderQueryKeys.detail(updated.deliveryOrder),
        updated,
      )
      void queryClient.invalidateQueries({
        queryKey: deliveryOrderQueryKeys.all,
      })
    },
  })
}

export const useRejectDoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (deliveryOrder: string) =>
      deliveryOrderApi.reject(deliveryOrder),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        deliveryOrderQueryKeys.detail(updated.deliveryOrder),
        updated,
      )
      void queryClient.invalidateQueries({
        queryKey: deliveryOrderQueryKeys.all,
      })
    },
  })
}

export const useUpdateDoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      deliveryOrder,
      payload,
    }: {
      deliveryOrder: string
      payload: Partial<DeliveryOrderRecord>
    }) => deliveryOrderApi.update(deliveryOrder, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        deliveryOrderQueryKeys.detail(updated.deliveryOrder),
        updated,
      )
      void queryClient.invalidateQueries({
        queryKey: deliveryOrderQueryKeys.all,
      })
    },
  })
}
