import type { ChipProps } from '@mui/material/Chip'

import type { DeliveryOrderStatus } from './types'

export const deliveryOrderStatuses: DeliveryOrderStatus[] = [
  'OPEN',
  'ON_PROGRESS',
  'NEED_UPLOAD_DO',
  'NEED_REVIEW_DO',
  'CLOSED',
  'REJECTED',
]

export const deliveryOrderStatusLabels: Record<DeliveryOrderStatus, string> = {
  CLOSED: 'Closed',
  NEED_REVIEW_DO: 'Need Review DO',
  NEED_UPLOAD_DO: 'Need Upload DO',
  ON_PROGRESS: 'On Progress',
  OPEN: 'Open',
  REJECTED: 'Rejected',
}

export const getDeliveryOrderStatusLabel = (status: DeliveryOrderStatus) =>
  deliveryOrderStatusLabels[status]

export const getDeliveryOrderStatusColor = (
  status: DeliveryOrderStatus,
): ChipProps['color'] => {
  if (status === 'CLOSED') {
    return 'success'
  }

  if (status === 'REJECTED') {
    return 'error'
  }

  if (status === 'NEED_REVIEW_DO') {
    return 'info'
  }

  if (status === 'NEED_UPLOAD_DO') {
    return 'warning'
  }

  if (status === 'ON_PROGRESS') {
    return 'primary'
  }

  return 'default'
}
