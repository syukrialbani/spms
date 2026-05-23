import type { ApiError } from './errors'

export const API_ERROR_EVENT = 'spms:api-error'
export const API_UNAUTHORIZED_EVENT = 'spms:api-unauthorized'

export type ApiErrorEventDetail = {
  message: string
  status?: number
  code?: string
}

const canDispatch = () => typeof window !== 'undefined'

export const emitApiError = (error: ApiError) => {
  if (!canDispatch()) {
    return
  }

  window.dispatchEvent(
    new CustomEvent<ApiErrorEventDetail>(API_ERROR_EVENT, {
      detail: {
        message: error.message,
        status: error.status,
        code: error.code,
      },
    }),
  )
}

export const emitUnauthorized = () => {
  if (!canDispatch()) {
    return
  }

  window.dispatchEvent(new Event(API_UNAUTHORIZED_EVENT))
}
