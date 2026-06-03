import { spmsStorage } from './storage'
import type { SpmsMaterialItem, SpmsRecord } from './types'

export type DeliveryUploadStatus = 'OPEN' | 'DELIVERED'
export type PickupUploadStatus = 'OPEN' | 'UNRETURN' | 'ROK' | 'FAULTY'
export type TicketStatus = 'OPEN' | 'CLOSE'

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
): DeliveryUploadStatus =>
  record.deliveryEvidenceFileName ||
  record.evidenceFileName ||
  record.deliveryStatus === 'DELIVERED'
    ? 'DELIVERED'
    : 'OPEN'

export const getPickupUploadStatus = (
  record: SpmsRecord,
): PickupUploadStatus => {
  if (!record.pickupEvidenceFileName) {
    return getDeliveryUploadStatus(record) === 'DELIVERED' ||
      record.baStatusReturn === 'UNRETURN'
      ? 'UNRETURN'
      : 'OPEN'
  }

  if (
    record.baStatusReturn === 'Faulty' ||
    record.baStatusReturn === 'FAULTY' ||
    record.serialNumberFaultyUnit
  ) {
    return 'FAULTY'
  }

  return 'ROK'
}

export const isDeliveryApprovalComplete = (record: SpmsRecord) =>
  record.approval1Status === 'APPROVED' &&
  record.approval2Status === 'APPROVED' &&
  record.closedStatus === 'CLOSED'

export const isPickupApprovalComplete = (record: SpmsRecord) =>
  record.pickupApproval1Status === 'APPROVED' &&
  record.pickupApproval2Status === 'APPROVED' &&
  record.pickupClosedStatus === 'CLOSED'

export const getTicketStatus = (record: SpmsRecord): TicketStatus =>
  isDeliveryApprovalComplete(record) && isPickupApprovalComplete(record)
    ? 'CLOSE'
    : 'OPEN'
