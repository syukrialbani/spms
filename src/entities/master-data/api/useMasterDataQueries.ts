import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { masterDataApi } from './masterDataApi'

export const masterDataQueryKeys = {
  all: ['master-data'] as const,
}

export const useMasterDataQuery = () =>
  useQuery({
    queryKey: masterDataQueryKeys.all,
    queryFn: () => masterDataApi.getAll(),
  })

export const useMasterDataMutations = () => {
  const queryClient = useQueryClient()
  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: masterDataQueryKeys.all })

  return {
    createCustomer: useMutation({
      mutationFn: masterDataApi.createCustomer,
      onSuccess: invalidate,
    }),
    deleteCustomer: useMutation({
      mutationFn: masterDataApi.deleteCustomer,
      onSuccess: invalidate,
    }),
    createDop: useMutation({
      mutationFn: masterDataApi.createDop,
      onSuccess: invalidate,
    }),
    deleteDop: useMutation({
      mutationFn: masterDataApi.deleteDop,
      onSuccess: invalidate,
    }),
    createMaterial: useMutation({
      mutationFn: masterDataApi.createMaterial,
      onSuccess: invalidate,
    }),
    deleteMaterial: useMutation({
      mutationFn: masterDataApi.deleteMaterial,
      onSuccess: invalidate,
    }),
    createSeveritySla: useMutation({
      mutationFn: masterDataApi.createSeveritySla,
      onSuccess: invalidate,
    }),
    deleteSeveritySla: useMutation({
      mutationFn: masterDataApi.deleteSeveritySla,
      onSuccess: invalidate,
    }),
    createTransactionStatus: useMutation({
      mutationFn: masterDataApi.createTransactionStatus,
      onSuccess: invalidate,
    }),
    deleteTransactionStatus: useMutation({
      mutationFn: masterDataApi.deleteTransactionStatus,
      onSuccess: invalidate,
    }),
    createLocation: useMutation({
      mutationFn: masterDataApi.createLocation,
      onSuccess: invalidate,
    }),
    deleteLocation: useMutation({
      mutationFn: masterDataApi.deleteLocation,
      onSuccess: invalidate,
    }),
    createExpedition: useMutation({
      mutationFn: masterDataApi.createExpedition,
      onSuccess: invalidate,
    }),
    deleteExpedition: useMutation({
      mutationFn: masterDataApi.deleteExpedition,
      onSuccess: invalidate,
    }),
    createService: useMutation({
      mutationFn: masterDataApi.createService,
      onSuccess: invalidate,
    }),
    deleteService: useMutation({
      mutationFn: masterDataApi.deleteService,
      onSuccess: invalidate,
    }),
  }
}
