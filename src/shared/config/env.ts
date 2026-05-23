const fallbackApiBaseUrl = 'https://dummyjson.com'

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

export const env = {
  apiBaseUrl: trimTrailingSlash(
    import.meta.env.VITE_API_BASE_URL ?? fallbackApiBaseUrl,
  ),
  appName: import.meta.env.VITE_APP_NAME ?? 'SPMS',
  mode: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const
