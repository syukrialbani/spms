import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './errors'

const shouldRetryRequest = (failureCount: number, error: Error) => {
  if (error instanceof ApiError && error.status && error.status < 500) {
    return false
  }

  return failureCount < 1
}

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: shouldRetryRequest,
      staleTime: 60 * 1000,
    },
  },
})
