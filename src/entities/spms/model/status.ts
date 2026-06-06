import type { ChipProps } from '@mui/material/Chip'
import type {
  DeliveryWorkflowStatus,
  ReturnStatus,
  Severity,
  SpmsRecord,
  SpmsStatus,
} from './types'

export const spmsStatuses: SpmsStatus[] = [
  'New',
  'Need Upload Delivery',
  'Waiting Approval Delivery',
  'Waiting Review Delivery',
  'Closed Delivery',
  'Need Upload Pickup',
  'Waiting Approval Pickup',
  'Waiting Review Pickup',
  'Closed Pickup',
  'Closed',
]

export const deliveryWorkflowStatuses: DeliveryWorkflowStatus[] = [
  'New',
  'Need Upload Delivery',
  'Waiting Approval Delivery',
  'Waiting Review Delivery',
  'Closed Delivery',
]

export const returnStatuses: ReturnStatus[] = [
  'Need Upload Pickup',
  'Waiting Approval Pickup',
  'Waiting Review Pickup',
  'Closed Pickup',
  'Closed',
]

export const getSpmsStatusColor = (status: SpmsStatus): ChipProps['color'] => {
  const colorMap: Record<SpmsStatus, ChipProps['color']> = {
    New: 'default',
    'Need Upload Delivery': 'warning',
    'Waiting Approval Delivery': 'secondary',
    'Waiting Review Delivery': 'info',
    'Closed Delivery': 'primary',
    'Need Upload Pickup': 'warning',
    'Waiting Approval Pickup': 'secondary',
    'Waiting Review Pickup': 'info',
    'Closed Pickup': 'primary',
    Closed: 'success',
  }

  return colorMap[status]
}

export const getSeverityColor = (
  severity: Severity,
): ChipProps['color'] => {
  const colorMap: Record<Severity, ChipProps['color']> = {
    Low: 'success',
    Medium: 'info',
    High: 'error',
    Critical: 'error',
  }

  return colorMap[severity]
}

export const getReturnStatusColor = (
  status: ReturnStatus,
): ChipProps['color'] => {
  const colorMap: Record<ReturnStatus, ChipProps['color']> = {
    'Need Upload Pickup': 'warning',
    'Waiting Approval Pickup': 'secondary',
    'Waiting Review Pickup': 'info',
    'Closed Pickup': 'primary',
    Closed: 'success',
  }

  return colorMap[status]
}

export const getDeliveryWorkflowStatus = (
  record: SpmsRecord,
): DeliveryWorkflowStatus => {
  if (!record.deliveryOrderNumber) {
    return 'New'
  }

  if (
    !record.deliveryEvidenceFileName &&
    !record.evidenceFileName &&
    record.deliveryStatus !== 'DELIVERED'
  ) {
    return 'Need Upload Delivery'
  }

  if (record.approval1Status !== 'APPROVED') {
    return 'Waiting Approval Delivery'
  }

  if (record.approval2Status !== 'APPROVED') {
    return 'Waiting Review Delivery'
  }

  return 'Closed Delivery'
}

export const getPickupWorkflowStatus = (record: SpmsRecord): ReturnStatus => {
  if (record.closedStatus !== 'CLOSED') {
    return 'Need Upload Pickup'
  }

  if (!record.pickupEvidenceFileName) {
    return 'Need Upload Pickup'
  }

  if (record.pickupApproval1Status !== 'APPROVED') {
    return 'Waiting Approval Pickup'
  }

  if (record.pickupApproval2Status !== 'APPROVED') {
    return 'Waiting Review Pickup'
  }

  if (record.pickupClosedStatus !== 'CLOSED') {
    return 'Closed Pickup'
  }

  return 'Closed'
}

export const getTicketWorkflowStatus = (record: SpmsRecord): SpmsStatus => {
  const deliveryStatus = getDeliveryWorkflowStatus(record)

  if (deliveryStatus !== 'Closed Delivery') {
    return deliveryStatus
  }

  if (record.closedStatus !== 'CLOSED') {
    return 'Closed Delivery'
  }

  return getPickupWorkflowStatus(record)
}
