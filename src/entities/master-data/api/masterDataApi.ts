import { apiClient } from '@shared/api'
import type {
  MasterCustomer,
  MasterDop,
  MasterLocation,
  MasterMaterial,
  MasterSeveritySla,
  MasterSimpleItem,
  MasterTransactionStatus,
} from '../model/types'

export const masterDataApi = {
  // ---- CUSTOMERS ----
  getCustomers(): Promise<{ data: MasterCustomer[] }> {
    return apiClient.get<{ data: MasterCustomer[] }>('/master-data/customers')
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

  // ---- DOPS (Customer -> DOP -> Area -> Regional) ----
  getDops(params?: {
    customerId?: string
    customerName?: string
  }): Promise<{ data: MasterDop[] }> {
    return apiClient.get<{ data: MasterDop[] }>('/master-data/dops', { params })
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

  // ---- MATERIALS / PRODUCTS ----
  getMaterials(params?: {
    category?: string
    type?: string
    search?: string
  }): Promise<{ data: MasterMaterial[] }> {
    return apiClient.get<{ data: MasterMaterial[] }>('/master-data/materials', {
      params,
    })
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

  // ---- SEVERITY & SLA ----
  getSeveritySlas(): Promise<{ data: MasterSeveritySla[] }> {
    return apiClient.get<{ data: MasterSeveritySla[] }>(
      '/master-data/severity-slas',
    )
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

  // ---- TRANSACTION STATUSES ----
  getTransactionStatuses(): Promise<{ data: MasterTransactionStatus[] }> {
    return apiClient.get<{ data: MasterTransactionStatus[] }>(
      '/master-data/transaction-statuses',
    )
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

  // ---- LOCATIONS / LSP ----
  getLocations(type?: 'ORIGIN' | 'DESTINATION' | 'BOTH'): Promise<{
    data: MasterLocation[]
  }> {
    return apiClient.get<{ data: MasterLocation[] }>('/master-data/locations', {
      params: type ? { type } : undefined,
    })
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

  // ---- EXPEDITIONS ----
  getExpeditions(): Promise<{ data: MasterSimpleItem[] }> {
    return apiClient.get<{ data: MasterSimpleItem[] }>(
      '/master-data/expeditions',
    )
  },

  createExpedition(payload: { name: string }): Promise<MasterSimpleItem> {
    return apiClient.post<MasterSimpleItem>('/master-data/expeditions', payload)
  },

  deleteExpedition(id: string) {
    return apiClient.delete(`/master-data/expeditions/${id}`)
  },

  // ---- SERVICES ----
  getServices(): Promise<{ data: MasterSimpleItem[] }> {
    return apiClient.get<{ data: MasterSimpleItem[] }>('/master-data/services')
  },

  createService(payload: { name: string }): Promise<MasterSimpleItem> {
    return apiClient.post<MasterSimpleItem>('/master-data/services', payload)
  },

  deleteService(id: string) {
    return apiClient.delete(`/master-data/services/${id}`)
  },
}
