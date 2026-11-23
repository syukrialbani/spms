import { useEffect, useMemo, useState } from 'react'
import {
  spmsStatuses,
  useSpmsListQuery,
  type SpmsStatus,
} from '@entities/spms'

export type SpmsStatusFilter = 'All' | SpmsStatus

export function useSpmsList() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState<SpmsStatusFilter>('All')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 220)
    return () => window.clearTimeout(timer)
  }, [search])

  const { data, isLoading } = useSpmsListQuery({
    search: debouncedSearch || undefined,
    status: status === 'All' ? undefined : status,
    limit: 200,
  })

  const rows = useMemo(() => data?.data ?? [], [data])
  const totalMatched = data?.meta.total ?? rows.length

  const statusCounts = useMemo(() => {
    const serverCounts = data?.statusCounts
    return (['All', ...spmsStatuses] as SpmsStatusFilter[]).reduce(
      (result, option) => ({
        ...result,
        [option]: serverCounts?.[option] ?? 0,
      }),
      {} as Record<SpmsStatusFilter, number>,
    )
  }, [data?.statusCounts])

  return {
    isLoading,
    rows,
    totalMatched,
    search,
    setSearch,
    status,
    setStatus,
    statusCounts,
    statusOptions: ['All', ...spmsStatuses] as SpmsStatusFilter[],
  }
}
