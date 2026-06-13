import type { ReactNode } from 'react'

import type { SpmsMaterialFormValues, SpmsRequestFormValues } from './model'

export type SpmsApprovalRole = 'ADMIN_1' | 'ADMIN_2' | 'ADMIN_3' | 'REQUESTOR'

export type SpmsRequestFormProps = {
  currentRole?: SpmsApprovalRole
  currentUserName?: string
  initialValues?: SpmsRequestFormValues
  mode?: 'create' | 'edit'
  onCancel?: () => void
  onSave: (values: SpmsRequestFormValues) => void | Promise<void>
}

export type FieldName = Exclude<keyof SpmsRequestFormValues, 'materials'>
export type DetailFieldName = FieldName | 'materials'
export type MaterialFieldName = keyof SpmsMaterialFormValues
export type EvidenceFieldName =
  | 'deliveryEvidenceFileName'
  | 'pickupEvidenceFileName'

export type TimelineState = 'done' | 'active' | 'pending'

export type TimelineItem = {
  actor: string
  description: ReactNode
  label: string
  meta: string
  state: TimelineState
  timestamp?: string
}

export type ApprovalChainItem = {
  detail: string
  label: string
  state: TimelineState
}
