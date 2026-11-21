import { apiClient } from '@shared/api'
import type {
  MasterCustomer,
  MasterDataResponse,
  MasterDop,
  MasterLocation,
  MasterMaterial,
  MasterSeveritySla,
  MasterSimpleItem,
  MasterTransactionStatus,
} from '../model/types'

export const masterDataApi = {
  getAll(): Promise<MasterDataResponse> {
    return apiClient.get<MasterDataResponse>('/master-data')
  },

  createCustomer(payload: {
    name: string
    requiresNeFe?: boolean
  }): Promise<MasterCustomer> {
    return apiClient.post<MasterCustomer>('/master-data/customers', payload)
  },

  deleteCustomer(id: string) {
    return apiClient.delete(`/master-data/customers/${id}`)
  },

  createDop(payload: {
    customerId: string
    dop: string
    area: string
    regional: string
    remarks?: string
    lspSupport?: string
  }): Promise<MasterDop> {
    return apiClient.post<MasterDop>('/master-data/dops', payload)
  },

  deleteDop(id: string) {
    return apiClient.delete(`/master-data/dops/${id}`)
  },

  createMaterial(payload: {
    description: string
    partNumber: string
    categoryMaterial: string
    typeMaterial: string
  }): Promise<MasterMaterial> {
    return apiClient.post<MasterMaterial>('/master-data/materials', payload)
  },

  deleteMaterial(id: string) {
    return apiClient.delete(`/master-data/materials/${id}`)
  },

  createSeveritySla(payload: {
    severity: string
    slaHours: string
    defaultService?: string
  }): Promise<MasterSeveritySla> {
    return apiClient.post<MasterSeveritySla>(
      '/master-data/severity-slas',
      payload,
    )
  },

  deleteSeveritySla(id: string) {
    return apiClient.delete(`/master-data/severity-slas/${id}`)
  },

  createTransactionStatus(payload: {
    code: string
    name: string
    skipPickup?: boolean
  }): Promise<MasterTransactionStatus> {
    return apiClient.post<MasterTransactionStatus>(
      '/master-data/transaction-statuses',
      payload,
    )
  },

  deleteTransactionStatus(id: string) {
    return apiClient.delete(`/master-data/transaction-statuses/${id}`)
  },

  createLocation(payload: {
    name: string
    type?: 'ORIGIN' | 'DESTINATION' | 'BOTH'
    address?: string
    pic?: string
  }): Promise<MasterLocation> {
    return apiClient.post<MasterLocation>('/master-data/locations', payload)
  },

  deleteLocation(id: string) {
    return apiClient.delete(`/master-data/locations/${id}`)
  },

  createExpedition(payload: { name: string }): Promise<MasterSimpleItem> {
    return apiClient.post<MasterSimpleItem>('/master-data/expeditions', payload)
  },

  deleteExpedition(id: string) {
    return apiClient.delete(`/master-data/expeditions/${id}`)
  },

  createService(payload: { name: string }): Promise<MasterSimpleItem> {
    return apiClient.post<MasterSimpleItem>('/master-data/services', payload)
  },

  deleteService(id: string) {
    return apiClient.delete(`/master-data/services/${id}`)
  },
}
