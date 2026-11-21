import { apiClient } from '@shared/api'
import type {
  DeliveryOrderKind,
  DeliveryOrderMaterialItem,
  DeliveryOrderRecord,
  DeliveryOrderStatus,
} from '../model/types'

export type DeliveryOrderListResponse = {
  data: DeliveryOrderRecord[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  statusCounts: Record<'All' | DeliveryOrderStatus, number>
}

export type DeliveryOrderListParams = {
  search?: string
  status?: string
  kind?: DeliveryOrderKind
  page?: number
  limit?: number
}

export type CreateDoFromSpmsPayload = {
  kind: DeliveryOrderKind
  spmsRecordIds: string[]
  expedition: string
  service: string
  supportOriginMaterial: string
  supportDestinationMaterial: string
  awbTransfer: string
  materialSerialNumbers: string[]
}

export type CreateStandaloneDoPayload = {
  kind: DeliveryOrderKind
  expedition: string
  service: string
  supportOriginMaterial: string
  supportDestinationMaterial: string
  awbTransfer: string
  orderNumber: string
  customer: string
  ticketNumber?: string
  requestDate?: string
  area: string
  dop: string
  siteName: string
  severity?: string
  datePickup?: string
  onDeliveryDate?: string
  qtyBox?: string
  weight?: string
  packaging?: string
  materials: DeliveryOrderMaterialItem[]
}

export type ProcessDoPayload = {
  onDeliveryDate?: string
  datePickup?: string
  qtyBox?: string
  weight?: string
  packaging?: string
}

export const deliveryOrderApi = {
  list(
    params: DeliveryOrderListParams = { limit: 200 },
  ): Promise<DeliveryOrderListResponse> {
    return apiClient.get<DeliveryOrderListResponse>('/delivery-orders', {
      params,
    })
  },

  getByCode(deliveryOrder: string): Promise<DeliveryOrderRecord> {
    return apiClient.get<DeliveryOrderRecord>(
      `/delivery-orders/${encodeURIComponent(deliveryOrder)}`,
    )
  },

  createFromSpms(
    payload: CreateDoFromSpmsPayload,
  ): Promise<DeliveryOrderRecord> {
    return apiClient.post<DeliveryOrderRecord>(
      '/delivery-orders/from-spms',
      payload,
    )
  },

  createStandalone(
    payload: CreateStandaloneDoPayload,
  ): Promise<DeliveryOrderRecord> {
    return apiClient.post<DeliveryOrderRecord>(
      '/delivery-orders/standalone',
      payload,
    )
  },

  generatePickup(deliveryOrder: string): Promise<DeliveryOrderRecord> {
    return apiClient.post<DeliveryOrderRecord>(
      `/delivery-orders/${encodeURIComponent(deliveryOrder)}/generate-pickup`,
    )
  },

  process(
    deliveryOrder: string,
    payload: ProcessDoPayload,
  ): Promise<DeliveryOrderRecord> {
    return apiClient.patch<DeliveryOrderRecord>(
      `/delivery-orders/${encodeURIComponent(deliveryOrder)}/process`,
      payload,
    )
  },

  reject(deliveryOrder: string): Promise<DeliveryOrderRecord> {
    return apiClient.patch<DeliveryOrderRecord>(
      `/delivery-orders/${encodeURIComponent(deliveryOrder)}/reject`,
    )
  },

  update(
    deliveryOrder: string,
    payload: Partial<DeliveryOrderRecord>,
  ): Promise<DeliveryOrderRecord> {
    return apiClient.put<DeliveryOrderRecord>(
      `/delivery-orders/${encodeURIComponent(deliveryOrder)}`,
      payload,
    )
  },
}
