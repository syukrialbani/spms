export type SpmsStatus =
  | 'New'
  | 'In Progress'
  | 'Waiting Approval'
  | 'Approved'
  | 'Rejected'

export type ReturnStatus = 'Not Returned' | 'Partial Return' | 'Returned' | 'Closed'

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical'

export type WorkflowApprovalStatus =
  | 'DRAFT'
  | 'PENDING APPROVAL'
  | 'APPROVED'
  | 'REJECTED'

export type WorkflowClosedStatus = 'PENDING CUSTOMER' | 'CLOSED'

export type SpmsMaterialItem = {
  categoryMaterial: string
  typeMaterial: string
  description: string
  partNumber: string
  qty: number
  supportOriginMaterial: string
  supportDestinationMaterial?: string
}

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
  materials?: SpmsMaterialItem[]
  severity: Severity
  site: string
  statusSpms: SpmsStatus
  statusReturn: ReturnStatus
  createdBy?: string
  customerRequestor?: string
  supportDestinationMaterial?: string
  originLsp?: string
  destinationLsp?: string
  materialSerialNumber?: string
  stockStatus?: string
  systemLabel?: string
  stockRemark?: string
  reservationStatus?: string
  slaHours?: string
  awbTransfer?: string
  pmArea?: string
  baNumber?: string
  baType?: string
  deliveryStatus?: string
  sendBy?: string
  deliveryDateGoodUnit?: string
  serialNumberGoodUnit?: string
  descriptionMaterial?: string
  baStatusReturn?: string
  serialNumberFaultyUnit?: string
  pickupBy?: string
  pickupDate?: string
  evidenceFileName?: string
  deliveryEvidenceFileName?: string
  pickupEvidenceFileName?: string
  evidenceNotes?: string
  approval1By?: string
  approval1Status?: WorkflowApprovalStatus
  approval1Date?: string
  approval1Notes?: string
  approval2By?: string
  approval2Status?: WorkflowApprovalStatus
  approval2Date?: string
  approval2Notes?: string
  closedBy?: string
  closedStatus?: WorkflowClosedStatus
  closedDate?: string
  closedNotes?: string
  pickupApproval1By?: string
  pickupApproval1Status?: WorkflowApprovalStatus
  pickupApproval1Date?: string
  pickupApproval1Notes?: string
  pickupApproval2By?: string
  pickupApproval2Status?: WorkflowApprovalStatus
  pickupApproval2Date?: string
  pickupApproval2Notes?: string
  pickupClosedBy?: string
  pickupClosedStatus?: WorkflowClosedStatus
  pickupClosedDate?: string
  pickupClosedNotes?: string
}
