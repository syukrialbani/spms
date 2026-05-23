import { env } from '@shared/config/env'
import { authTokenStorage } from '@shared/lib/auth-token'
import { ApiError, getErrorMessage, toApiError } from './errors'
import { emitApiError, emitUnauthorized } from './events'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type QueryValue = string | number | boolean | null | undefined

export type QueryParams = Record<string, QueryValue | QueryValue[]>

export type ApiRequestConfig = Omit<RequestInit, 'body' | 'headers' | 'method'> & {
  auth?: boolean
  body?: unknown
  headers?: Record<string, string>
  method?: HttpMethod
  params?: QueryParams
  skipGlobalError?: boolean
}

type InternalRequestConfig = Omit<ApiRequestConfig, 'headers'> & {
  url: string
  method: HttpMethod
  headers: Headers
}

type RequestInterceptor = (
  config: InternalRequestConfig,
) => InternalRequestConfig | Promise<InternalRequestConfig>

type ResponseContext = {
  request: InternalRequestConfig
  response: Response
}

type ResponseInterceptor = <T>(
  data: T,
  context: ResponseContext,
) => T | Promise<T>

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value)

const buildUrl = (baseUrl: string, endpoint: string, params?: QueryParams) => {
  const url = new URL(
    isAbsoluteUrl(endpoint) ? endpoint : `${baseUrl}/${endpoint.replace(/^\/+/, '')}`,
  )

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      const values = Array.isArray(value) ? value : [value]

      values.forEach((item) => {
        if (item !== undefined && item !== null && item !== '') {
          url.searchParams.append(key, String(item))
        }
      })
    })
  }

  return url.toString()
}

const parseResponse = async (response: Response) => {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json() as Promise<unknown>
  }

  return response.text()
}

const buildRequestBody = (body: unknown, headers: Headers) => {
  if (body === undefined || body === null) {
    return undefined
  }

  if (
    typeof body === 'string' ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob
  ) {
    return body
  }

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return JSON.stringify(body)
}

export class ApiClient {
  private baseUrl: string
  private requestInterceptors = new Set<RequestInterceptor>()
  private responseInterceptors = new Set<ResponseInterceptor>()

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.add(interceptor)

    return () => this.requestInterceptors.delete(interceptor)
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.add(interceptor)

    return () => this.responseInterceptors.delete(interceptor)
  }

  async request<T>(endpoint: string, config: ApiRequestConfig = {}) {
    const headers = new Headers(config.headers)

    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json')
    }

    let internalConfig: InternalRequestConfig = {
      ...config,
      url: buildUrl(this.baseUrl, endpoint, config.params),
      method: config.method ?? 'GET',
      headers,
    }

    for (const interceptor of this.requestInterceptors) {
      internalConfig = await interceptor(internalConfig)
    }

    const body = buildRequestBody(internalConfig.body, internalConfig.headers)
    const fetchConfig: RequestInit = {
      cache: internalConfig.cache,
      credentials: internalConfig.credentials ?? 'include',
      headers: internalConfig.headers,
      integrity: internalConfig.integrity,
      keepalive: internalConfig.keepalive,
      method: internalConfig.method,
      mode: internalConfig.mode,
      redirect: internalConfig.redirect,
      referrer: internalConfig.referrer,
      referrerPolicy: internalConfig.referrerPolicy,
      signal: internalConfig.signal,
      body,
    }

    try {
      const response = await fetch(internalConfig.url, fetchConfig)
      const data = await parseResponse(response)

      if (!response.ok) {
        throw new ApiError(getErrorMessage(data), {
          status: response.status,
          data,
        })
      }

      let result = data as T

      for (const interceptor of this.responseInterceptors) {
        result = await interceptor(result, {
          request: internalConfig,
          response,
        })
      }

      return result
    } catch (error) {
      const apiError = toApiError(error)

      if (apiError.status === 401) {
        emitUnauthorized()
      }

      if (!internalConfig.skipGlobalError) {
        emitApiError(apiError)
      }

      throw apiError
    }
  }

  get<T>(endpoint: string, config?: ApiRequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  post<T>(endpoint: string, body?: unknown, config?: ApiRequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'POST', body })
  }

  put<T>(endpoint: string, body?: unknown, config?: ApiRequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body })
  }

  patch<T>(endpoint: string, body?: unknown, config?: ApiRequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body })
  }

  delete<T>(endpoint: string, config?: ApiRequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(env.apiBaseUrl)

apiClient.addRequestInterceptor((config) => {
  if (config.auth === false) {
    return config
  }

  const accessToken = authTokenStorage.getAccessToken()

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`)
  }

  return config
})
