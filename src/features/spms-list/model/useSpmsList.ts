import { useMemo, useState } from 'react'
import { spmsRecords, spmsStatuses, type SpmsStatus } from '@entities/spms'

export type SpmsStatusFilter = 'All' | SpmsStatus

export function useSpmsList() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<SpmsStatusFilter>('All')

  const rows = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return spmsRecords.filter((record) => {
      const matchesStatus = status === 'All' || record.statusSpms === status
      const matchesSearch =
        !keyword ||
        record.orderNumber.toLowerCase().includes(keyword) ||
        record.customer.toLowerCase().includes(keyword) ||
        record.customerOrderNumber.toLowerCase().includes(keyword) ||
        record.area.toLowerCase().includes(keyword) ||
        record.dop.toLowerCase().includes(keyword) ||
        record.siteName.toLowerCase().includes(keyword) ||
        record.partNumber.toLowerCase().includes(keyword)

      return matchesStatus && matchesSearch
    })
  }, [search, status])

  return {
    rows,
    search,
    setSearch,
    status,
    setStatus,
    statusOptions: ['All', ...spmsStatuses] as SpmsStatusFilter[],
  }
}
