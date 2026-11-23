import { apiClient } from '@shared/api'
import type {
  SpmsRecord,
  SpmsRequestorOption,
  SpmsStatus,
} from '../model/types'

export type SpmsListResponse = {
  data: SpmsRecord[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  statusCounts: Record<'All' | SpmsStatus, number>
}

export type SpmsListParams = {
  search?: string
  status?: string
  customer?: string
  page?: number
  limit?: number
}

export const spmsApi = {
  list(params: SpmsListParams = { limit: 200 }): Promise<SpmsListResponse> {
    return apiClient.get<SpmsListResponse>('/spms', { params })
  },

  async listRequestorOptions(): Promise<SpmsRequestorOption[]> {
    const res = await apiClient.get<{ data: SpmsRequestorOption[] }>(
      '/spms/requestor-options',
    )
    return res.data
  },

  getById(id: string): Promise<SpmsRecord> {
    return apiClient.get<SpmsRecord>(`/spms/${encodeURIComponent(id)}`)
  },

  create(payload: Record<string, unknown>): Promise<SpmsRecord> {
    return apiClient.post<SpmsRecord>('/spms', payload)
  },

  update(id: string, payload: Record<string, unknown>): Promise<SpmsRecord> {
    return apiClient.put<SpmsRecord>(
      `/spms/${encodeURIComponent(id)}`,
      payload,
    )
  },

  applyApproval(
    id: string,
    payload: {
      scope: 'delivery' | 'pickup'
      stage: 'approval1' | 'approval2' | 'closed'
      status: string
      by?: string
      date?: string
      notes?: string
    },
  ): Promise<SpmsRecord> {
    return apiClient.patch<SpmsRecord>(
      `/spms/${encodeURIComponent(id)}/approval`,
      payload,
    )
  },

  remove(id: string): Promise<{ message: string; id: string }> {
    return apiClient.delete<{ message: string; id: string }>(
      `/spms/${encodeURIComponent(id)}`,
    )
  },
}
