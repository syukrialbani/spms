import type { ChipProps } from '@mui/material/Chip'
import type { ReturnStatus, Severity, SpmsStatus } from './types'

export const spmsStatuses: SpmsStatus[] = [
  'New',
  'In Progress',
  'Waiting Approval',
  'Approved',
  'Rejected',
]

export const getSpmsStatusColor = (status: SpmsStatus): ChipProps['color'] => {
  const colorMap: Record<SpmsStatus, ChipProps['color']> = {
    New: 'info',
    'In Progress': 'warning',
    'Waiting Approval': 'secondary',
    Approved: 'success',
    Rejected: 'error',
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
    'Not Returned': 'default',
    'Partial Return': 'warning',
    Returned: 'info',
    Closed: 'success',
  }

  return colorMap[status]
}
