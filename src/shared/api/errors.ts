export type ApiErrorOptions = {
  status?: number
  code?: string
  data?: unknown
  isNetworkError?: boolean
}

export class ApiError extends Error {
  status?: number
  code?: string
  data?: unknown
  isNetworkError: boolean

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code
    this.data = options.data
    this.isNetworkError = options.isNetworkError ?? false
  }
}

const hasMessage = (value: unknown): value is { message: string } =>
  typeof value === 'object' &&
  value !== null &&
  'message' in value &&
  typeof value.message === 'string'

export const getErrorMessage = (value: unknown) => {
  if (hasMessage(value)) {
    return value.message
  }

  return 'Request gagal diproses. Silakan coba lagi.'
}

export const toApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof Error) {
    return new ApiError(error.message, { isNetworkError: true })
  }

  return new ApiError('Koneksi bermasalah. Silakan coba lagi.', {
    isNetworkError: true,
  })
}
