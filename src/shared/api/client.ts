import axios, {
  AxiosHeaders,
  isAxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@shared/config/env'
import { authTokenStorage } from '@shared/lib/auth-token'
import { ApiError, getErrorMessage, toApiError } from './errors'
import { emitApiError, emitUnauthorized } from './events'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type QueryValue = string | number | boolean | null | undefined

export type QueryParams = Record<string, QueryValue | QueryValue[]>

export type ApiRequestConfig<TBody = unknown> = Omit<
  AxiosRequestConfig<TBody>,
  'auth' | 'baseURL' | 'data' | 'method' | 'params' | 'url'
> & {
  auth?: boolean
  body?: TBody
  data?: TBody
  method?: HttpMethod
  params?: QueryParams
  skipGlobalError?: boolean
}

type ApiInternalRequestConfig = Omit<InternalAxiosRequestConfig, 'auth'> & {
  auth?: boolean
  skipGlobalError?: boolean
}

const serializeParams = (params: QueryParams) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value]

    values.forEach((item) => {
      if (item !== undefined && item !== null && item !== '') {
        searchParams.append(key, String(item))
      }
    })
  })

  return searchParams.toString()
}

const toAxiosApiError = (error: unknown) => {
  if (!isAxiosError(error)) {
    return toApiError(error)
  }

  const isNetworkError = !error.response

  return new ApiError(
    isNetworkError
      ? 'Koneksi bermasalah. Silakan coba lagi.'
      : getErrorMessage(error.response?.data),
    {
      code: error.code,
      data: error.response?.data,
      isNetworkError,
      status: error.response?.status,
    },
  )
}

export class ApiClient {
  readonly instance: AxiosInstance

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        Accept: 'application/json',
      },
      paramsSerializer: {
        serialize: serializeParams,
      },
      timeout: 30_000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use((config) => {
      const apiConfig = config as ApiInternalRequestConfig

      if (apiConfig.auth === false) {
        return config
      }

      const accessToken = authTokenStorage.getAccessToken()

      if (accessToken) {
        const headers = AxiosHeaders.from(config.headers)
        headers.set('Authorization', `Bearer ${accessToken}`)
        config.headers = headers
      }

      return config
    })

    this.instance.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        const apiError = toAxiosApiError(error)
        const config = isAxiosError(error)
          ? (error.config as ApiInternalRequestConfig | undefined)
          : undefined

        if (apiError.status === 401) {
          emitUnauthorized()
        }

        if (!config?.skipGlobalError) {
          emitApiError(apiError)
        }

        return Promise.reject(apiError)
      },
    )
  }

  async request<TResponse, TBody = unknown>(
    endpoint: string,
    config: ApiRequestConfig<TBody> = {},
  ) {
    const { body, data, ...requestConfig } = config
    const response = await this.instance.request<TResponse>({
      ...requestConfig,
      data: body ?? data,
      method: requestConfig.method ?? 'GET',
      url: endpoint,
    } as AxiosRequestConfig<TBody>)

    return response.data
  }

  get<TResponse>(endpoint: string, config?: ApiRequestConfig) {
    return this.request<TResponse>(endpoint, { ...config, method: 'GET' })
  }

  post<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: ApiRequestConfig<TBody>,
  ) {
    return this.request<TResponse, TBody>(endpoint, {
      ...config,
      body,
      method: 'POST',
    })
  }

  put<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: ApiRequestConfig<TBody>,
  ) {
    return this.request<TResponse, TBody>(endpoint, {
      ...config,
      body,
      method: 'PUT',
    })
  }

  patch<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: ApiRequestConfig<TBody>,
  ) {
    return this.request<TResponse, TBody>(endpoint, {
      ...config,
      body,
      method: 'PATCH',
    })
  }

  delete<TResponse>(endpoint: string, config?: ApiRequestConfig) {
    return this.request<TResponse>(endpoint, { ...config, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(env.apiBaseUrl)
