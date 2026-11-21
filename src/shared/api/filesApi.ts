import { apiClient } from './client'

export type AttachmentCategory =
  | 'BA_DELIVERY'
  | 'BA_PICKUP'
  | 'DO_DOCUMENT'
  | 'OTHER'

export type UploadedAttachment = {
  id: string
  category: AttachmentCategory
  originalName: string
  storedKey: string
  mimeType: string
  sizeBytes: number
  originalBytes: number
  compressed: boolean
  bucket: string
  spmsRecordId?: string | null
  deliveryOrderId?: string | null
  createdAt: string
}

export type PresignedFileResponse = {
  id: string
  originalName: string
  mimeType: string
  sizeBytes: number
  compressed: boolean
  url: string
}

export const filesApi = {
  async upload(params: {
    file: File
    category: AttachmentCategory
    spmsRecordId?: string
    deliveryOrderId?: string
  }): Promise<UploadedAttachment> {
    const formData = new FormData()
    formData.append('file', params.file)
    formData.append('category', params.category)

    if (params.spmsRecordId) {
      formData.append('spmsRecordId', params.spmsRecordId)
    }

    if (params.deliveryOrderId) {
      formData.append('deliveryOrderId', params.deliveryOrderId)
    }

    return apiClient.post<UploadedAttachment, FormData>('/files/upload', formData)
  },

  getPresignedUrl(id: string): Promise<PresignedFileResponse> {
    return apiClient.get<PresignedFileResponse>(`/files/${encodeURIComponent(id)}/url`)
  },

  delete(id: string): Promise<{ message: string; id: string }> {
    return apiClient.delete<{ message: string; id: string }>(
      `/files/${encodeURIComponent(id)}`,
    )
  },
}
