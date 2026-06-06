import { useMemo, useState } from 'react'
import {
  getDeliveryUploadStatus,
  getPickupUploadStatus,
  getSpmsRecordMaterials,
  getTicketStatus,
  spmsStatuses,
  spmsStorage,
  type SpmsStatus,
} from '@entities/spms'

export type SpmsStatusFilter = 'All' | SpmsStatus

export function useSpmsList() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<SpmsStatusFilter>('All')
  const [records] = useState(() => spmsStorage.getAll())
  const statusCounts = useMemo(
    () =>
      (['All', ...spmsStatuses] as SpmsStatusFilter[]).reduce(
        (result, option) => ({
          ...result,
          [option]:
            option === 'All'
              ? records.length
              : records.filter((record) => getTicketStatus(record) === option)
                  .length,
        }),
        {} as Record<SpmsStatusFilter, number>,
      ),
    [records],
  )

  const rows = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return records.filter((record) => {
      const deliveryStatus = getDeliveryUploadStatus(record)
      const pickupStatus = getPickupUploadStatus(record)
      const ticketStatus = getTicketStatus(record)
      const matchesStatus = status === 'All' || ticketStatus === status
      const matchesMaterial = getSpmsRecordMaterials(record).some((material) =>
        [
          material.categoryMaterial,
          material.typeMaterial,
          material.description,
          material.partNumber,
          material.supportOriginMaterial,
          material.supportDestinationMaterial ?? '',
        ].some((value) => value.toLowerCase().includes(keyword)),
      )
      const matchesSearch =
        !keyword ||
        record.orderNumber.toLowerCase().includes(keyword) ||
        record.customer.toLowerCase().includes(keyword) ||
        record.customerOrderNumber.toLowerCase().includes(keyword) ||
        record.area.toLowerCase().includes(keyword) ||
        record.dop.toLowerCase().includes(keyword) ||
        record.siteName.toLowerCase().includes(keyword) ||
        record.partNumber.toLowerCase().includes(keyword) ||
        deliveryStatus.toLowerCase().includes(keyword) ||
        pickupStatus.toLowerCase().includes(keyword) ||
        ticketStatus.toLowerCase().includes(keyword) ||
        Boolean(matchesMaterial)

      return matchesStatus && matchesSearch
    })
  }, [records, search, status])

  return {
    rows,
    search,
    setSearch,
    status,
    setStatus,
    statusCounts,
    statusOptions: ['All', ...spmsStatuses] as SpmsStatusFilter[],
  }
}
