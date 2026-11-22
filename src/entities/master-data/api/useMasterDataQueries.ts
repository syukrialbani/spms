import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { masterDataApi } from './masterDataApi'

export const masterDataQueryKeys = {
  customers: ['master-data', 'customers'] as const,
  dops: (params?: { customerId?: string; customerName?: string }) =>
    ['master-data', 'dops', params ?? {}] as const,
  dopsAll: ['master-data', 'dops'] as const,
  materials: (params?: { category?: string; type?: string; search?: string }) =>
    ['master-data', 'materials', params ?? {}] as const,
  materialsAll: ['master-data', 'materials'] as const,
  severitySlas: ['master-data', 'severity-slas'] as const,
  transactionStatuses: ['master-data', 'transaction-statuses'] as const,
  locations: (type?: 'ORIGIN' | 'DESTINATION' | 'BOTH') =>
    ['master-data', 'locations', type ?? 'ALL'] as const,
  locationsAll: ['master-data', 'locations'] as const,
  expeditions: ['master-data', 'expeditions'] as const,
  services: ['master-data', 'services'] as const,
}

export const useMasterCustomersQuery = () =>
  useQuery({
    queryKey: masterDataQueryKeys.customers,
    queryFn: () => masterDataApi.getCustomers().then((res) => res.data),
  })

export const useMasterDopsQuery = (params?: {
  customerId?: string
  customerName?: string
}) =>
  useQuery({
    queryKey: masterDataQueryKeys.dops(params),
    queryFn: () => masterDataApi.getDops(params).then((res) => res.data),
  })

export const useMasterMaterialsQuery = (params?: {
  category?: string
  type?: string
  search?: string
}) =>
  useQuery({
    queryKey: masterDataQueryKeys.materials(params),
    queryFn: () => masterDataApi.getMaterials(params).then((res) => res.data),
  })

export const useMasterSeveritySlasQuery = () =>
  useQuery({
    queryKey: masterDataQueryKeys.severitySlas,
    queryFn: () => masterDataApi.getSeveritySlas().then((res) => res.data),
  })

export const useMasterTransactionStatusesQuery = () =>
  useQuery({
    queryKey: masterDataQueryKeys.transactionStatuses,
    queryFn: () =>
      masterDataApi.getTransactionStatuses().then((res) => res.data),
  })

export const useMasterLocationsQuery = (
  type?: 'ORIGIN' | 'DESTINATION' | 'BOTH',
) =>
  useQuery({
    queryKey: masterDataQueryKeys.locations(type),
    queryFn: () => masterDataApi.getLocations(type).then((res) => res.data),
  })

export const useMasterExpeditionsQuery = () =>
  useQuery({
    queryKey: masterDataQueryKeys.expeditions,
    queryFn: () => masterDataApi.getExpeditions().then((res) => res.data),
  })

export const useMasterServicesQuery = () =>
  useQuery({
    queryKey: masterDataQueryKeys.services,
    queryFn: () => masterDataApi.getServices().then((res) => res.data),
  })

export const useMasterDataMutations = () => {
  const queryClient = useQueryClient()

  return {
    createCustomer: useMutation({
      mutationFn: masterDataApi.createCustomer,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.customers,
        })
      },
    }),
    deleteCustomer: useMutation({
      mutationFn: masterDataApi.deleteCustomer,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.customers,
        })
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.dopsAll,
        })
      },
    }),
    createDop: useMutation({
      mutationFn: masterDataApi.createDop,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.dopsAll,
        })
      },
    }),
    deleteDop: useMutation({
      mutationFn: masterDataApi.deleteDop,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.dopsAll,
        })
      },
    }),
    createMaterial: useMutation({
      mutationFn: masterDataApi.createMaterial,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.materialsAll,
        })
      },
    }),
    deleteMaterial: useMutation({
      mutationFn: masterDataApi.deleteMaterial,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.materialsAll,
        })
      },
    }),
    createSeveritySla: useMutation({
      mutationFn: masterDataApi.createSeveritySla,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.severitySlas,
        })
      },
    }),
    deleteSeveritySla: useMutation({
      mutationFn: masterDataApi.deleteSeveritySla,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.severitySlas,
        })
      },
    }),
    createTransactionStatus: useMutation({
      mutationFn: masterDataApi.createTransactionStatus,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.transactionStatuses,
        })
      },
    }),
    deleteTransactionStatus: useMutation({
      mutationFn: masterDataApi.deleteTransactionStatus,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.transactionStatuses,
        })
      },
    }),
    createLocation: useMutation({
      mutationFn: masterDataApi.createLocation,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.locationsAll,
        })
      },
    }),
    deleteLocation: useMutation({
      mutationFn: masterDataApi.deleteLocation,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.locationsAll,
        })
      },
    }),
    createExpedition: useMutation({
      mutationFn: masterDataApi.createExpedition,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.expeditions,
        })
      },
    }),
    deleteExpedition: useMutation({
      mutationFn: masterDataApi.deleteExpedition,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.expeditions,
        })
      },
    }),
    createService: useMutation({
      mutationFn: masterDataApi.createService,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.services,
        })
      },
    }),
    deleteService: useMutation({
      mutationFn: masterDataApi.deleteService,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: masterDataQueryKeys.services,
        })
      },
    }),
  }
}
