export type SpmsStatus =
  | 'New'
  | 'In Progress'
  | 'Waiting Approval'
  | 'Approved'
  | 'Rejected'

export type ReturnStatus = 'Not Returned' | 'Partial Return' | 'Returned' | 'Closed'

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical'

export type SpmsRecord = {
  id: string
  orderNumber: string
  customer: string
  customerOrderNumber: string
  requestDate: string
  area: string
  dop: string
  siteName: string
  categoryMaterial: string
  typeMaterial: string
  description: string
  partNumber: string
  qty: number
  supportOriginMaterial: string
  severity: Severity
  site: string
  statusSpms: SpmsStatus
  statusReturn: ReturnStatus
}
