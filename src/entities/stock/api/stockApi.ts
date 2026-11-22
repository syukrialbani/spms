import { apiClient } from '@shared/api'
import type {
  StockAvailability,
  StockItem,
  StockListParams,
  StockListResponse,
  StockLspCount,
  StockOption,
  StockSystemLabel,
  StockUnitCategory,
} from '../model/types'

export type CreateStockPayload = {
  description: string
  partNumber?: string
  serialNumber: string
  unitCategory: StockUnitCategory
  lsp: string
  systemLabel: StockSystemLabel
  stockStatus: StockAvailability
  remark?: string
  stockDate?: string
  parentSerialNumber?: string
}

export type UpdateStockPayload = Partial<CreateStockPayload>

export const stockApi = {
  list(params?: StockListParams): Promise<StockListResponse> {
    return apiClient.get<StockListResponse>('/stock', { params })
  },

  options(params?: {
    search?: string
    lsp?: string
    unitCategory?: string
    stockStatus?: string
    limit?: number
  }): Promise<{ data: StockOption[] }> {
    return apiClient.get<{ data: StockOption[] }>('/stock/options', { params })
  },

  lsps(): Promise<{ data: StockLspCount[] }> {
    return apiClient.get<{ data: StockLspCount[] }>('/stock/lsps')
  },

  detail(id: string): Promise<StockItem> {
    return apiClient.get<StockItem>(`/stock/${id}`)
  },

  create(payload: CreateStockPayload): Promise<StockItem> {
    return apiClient.post<StockItem>('/stock', payload)
  },

  update(id: string, payload: UpdateStockPayload): Promise<StockItem> {
    return apiClient.put<StockItem>(`/stock/${id}`, payload)
  },

  remove(id: string): Promise<{ message: string; id: string }> {
    return apiClient.delete<{ message: string; id: string }>(`/stock/${id}`)
  },

  allocate(payload: {
    subModuleSn: string
    targetModuleSn: string
    notes?: string
  }): Promise<StockItem> {
    return apiClient.post<StockItem>('/stock/allocate', payload)
  },

  detach(payload: {
    subModuleSn: string
    notes?: string
  }): Promise<StockItem> {
    return apiClient.post<StockItem>('/stock/detach', payload)
  },
}
