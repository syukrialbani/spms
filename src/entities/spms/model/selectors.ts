import { spmsStorage } from './storage'
import {
  getDeliveryWorkflowStatus,
  getPickupWorkflowStatus,
  getTicketWorkflowStatus,
} from './status'
import type {
  DeliveryWorkflowStatus,
  ReturnStatus,
  SpmsMaterialItem,
  SpmsRecord,
  SpmsStatus,
} from './types'

export type DeliveryUploadStatus = DeliveryWorkflowStatus
export type PickupUploadStatus = ReturnStatus
export type TicketStatus = SpmsStatus

export const getSpmsRecordById = (id: string | undefined) =>
  spmsStorage.getById(id)

export const getSpmsRecordMaterials = (
  record: SpmsRecord,
): SpmsMaterialItem[] => {
  if (record.materials?.length) {
    return record.materials
  }

  const legacyMaterial: SpmsMaterialItem = {
    categoryMaterial: record.categoryMaterial,
    typeMaterial: record.typeMaterial,
    description: record.description,
    partNumber: record.partNumber,
    qty: 1,
    supportOriginMaterial: record.supportOriginMaterial,
    supportDestinationMaterial:
      record.supportDestinationMaterial ?? record.area,
  }

  return Array.from(
    { length: Math.max(1, record.qty || 1) },
    () => ({ ...legacyMaterial }),
  )
}

export const getDeliveryUploadStatus = (
  record: SpmsRecord,
): DeliveryUploadStatus => getDeliveryWorkflowStatus(record)

export const getPickupUploadStatus = (
  record: SpmsRecord,
): PickupUploadStatus => getPickupWorkflowStatus(record)

export const isDeliveryApprovalComplete = (record: SpmsRecord) =>
  record.approval1Status === 'APPROVED' &&
  record.approval2Status === 'APPROVED' &&
  record.closedStatus === 'CLOSED'

export const isPickupApprovalComplete = (record: SpmsRecord) =>
  record.pickupApproval1Status === 'APPROVED' &&
  record.pickupApproval2Status === 'APPROVED' &&
  record.pickupClosedStatus === 'CLOSED'

export const getTicketStatus = (record: SpmsRecord): TicketStatus =>
  getTicketWorkflowStatus(record)
