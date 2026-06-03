import { spmsRecords } from './mock'
import type {
  ReturnStatus,
  Severity,
  SpmsMaterialItem,
  SpmsRecord,
  SpmsStatus,
  WorkflowApprovalStatus,
  WorkflowClosedStatus,
} from './types'

type SpmsMaterialFormInput = {
  categoryMaterial: string
  typeMaterial: string
  description: string
  partNumber: string
  quantity: string
  supportOriginMaterial: string
  supportDestinationMaterial: string
}

type SpmsFormInput = {
  orderNumber: string
  customer: string
  customerOrderNumber: string
  createdBy: string
  customerRequestor: string
  requestDate: string
  areal: string
  dop: string
  siteName: string
  categoryMaterial: string
  typeMaterial: string
  description: string
  partNumber: string
  quantity: string
  supportOriginMaterial: string
  supportDestinationMaterial: string
  materials: SpmsMaterialFormInput[]
  originLsp: string
  destinationLsp: string
  materialSerialNumber: string
  stockStatus: string
  systemLabel: string
  stockRemark: string
  reservationStatus: string
  severity: string
  slaHours: string
  awbTransfer: string
  pmArea: string
  baNumber: string
  baType: string
  sendBy: string
  deliveryDateGoodUnit: string
  serialNumberGoodUnit: string
  descriptionMaterial: string
  statusReturn: string
  serialNumberFaultyUnit: string
  pickupBy: string
  pickupDate: string
  evidenceFileName: string
  deliveryEvidenceFileName: string
  pickupEvidenceFileName: string
  evidenceNotes: string
  approval1By: string
  approval1Status: string
  approval1Date: string
  approval1Notes: string
  approval2By: string
  approval2Status: string
  approval2Date: string
  approval2Notes: string
  closedBy: string
  closedStatus: string
  closedDate: string
  closedNotes: string
  deliveryStatus: string
  pickupApproval1By: string
  pickupApproval1Status: string
  pickupApproval1Date: string
  pickupApproval1Notes: string
  pickupApproval2By: string
  pickupApproval2Status: string
  pickupApproval2Date: string
  pickupApproval2Notes: string
  pickupClosedBy: string
  pickupClosedStatus: string
  pickupClosedDate: string
  pickupClosedNotes: string
}

const storageKey = 'spms.records'

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

const readPersistedRecords = () => {
  const raw = getStorage()?.getItem(storageKey)

  if (!raw) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(raw)

    if (Array.isArray(parsed)) {
      return parsed as SpmsRecord[]
    }
  } catch {
    getStorage()?.removeItem(storageKey)
  }

  return null
}

const saveRecords = (records: SpmsRecord[]) => {
  getStorage()?.setItem(storageKey, JSON.stringify(records))
}

const toTitleCase = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const toDatePart = (value: string) => {
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10)
  }

  return new Date().toISOString().slice(0, 10)
}

const toSeverity = (value: string): Severity =>
  value === 'CRITICAL' ? 'Critical' : 'Medium'

const getSlaHoursForSeverity = (value: string) =>
  value === 'CRITICAL' ? '04:00:00' : '24:00:00'

const hasMaterialValue = (material: SpmsMaterialFormInput) =>
  Boolean(
    material.categoryMaterial ||
      material.typeMaterial ||
      material.description ||
      material.partNumber ||
      material.supportOriginMaterial ||
      material.supportDestinationMaterial,
  )

const normalizeMaterials = (
  values: SpmsFormInput,
): SpmsMaterialItem[] => {
  const sourceMaterials =
    values.materials?.length > 0
      ? values.materials
      : [
          {
            categoryMaterial: values.categoryMaterial,
            typeMaterial: values.typeMaterial,
            description: values.description,
            partNumber: values.partNumber,
            quantity: values.quantity,
            supportOriginMaterial: values.supportOriginMaterial,
            supportDestinationMaterial: values.supportDestinationMaterial,
          },
        ]

  const materials = sourceMaterials
    .filter(hasMaterialValue)
    .map((material) => ({
      categoryMaterial: toTitleCase(material.categoryMaterial),
      typeMaterial: toTitleCase(material.typeMaterial),
      description: material.description,
      partNumber: material.partNumber,
      qty: 1,
      supportOriginMaterial: material.supportOriginMaterial,
      supportDestinationMaterial: material.supportDestinationMaterial,
    }))

  if (materials.length > 0) {
    return materials
  }

  return [
    {
      categoryMaterial: toTitleCase(values.categoryMaterial),
      typeMaterial: toTitleCase(values.typeMaterial),
      description: values.description,
      partNumber: values.partNumber,
      qty: 1,
      supportOriginMaterial: values.supportOriginMaterial,
      supportDestinationMaterial: values.supportDestinationMaterial,
    },
  ]
}

const normalizeApprovalStatus = (value: string): WorkflowApprovalStatus => {
  if (
    value === 'DRAFT' ||
    value === 'PENDING APPROVAL' ||
    value === 'APPROVED' ||
    value === 'REJECTED'
  ) {
    return value
  }

  return 'PENDING APPROVAL'
}

const normalizeClosedStatus = (value: string): WorkflowClosedStatus =>
  value === 'CLOSED' ? 'CLOSED' : 'PENDING CUSTOMER'

const getStatusSpms = (values: SpmsFormInput): SpmsStatus => {
  if (values.closedStatus === 'CLOSED') {
    return 'Approved'
  }

  if (
    values.approval1Status === 'REJECTED' ||
    values.approval2Status === 'REJECTED'
  ) {
    return 'Rejected'
  }

  if (
    values.approval1Status === 'APPROVED' &&
    values.approval2Status === 'APPROVED'
  ) {
    return values.deliveryEvidenceFileName || values.evidenceFileName
      ? 'In Progress'
      : 'Approved'
  }

  if (values.approval1Status === 'APPROVED') {
    return 'Waiting Approval'
  }

  if (values.deliveryEvidenceFileName || values.deliveryStatus === 'DELIVERY PROCESS') {
    return 'In Progress'
  }

  return 'New'
}

const getReturnStatus = (values: SpmsFormInput): ReturnStatus => {
  if (values.closedStatus === 'CLOSED') {
    return 'Closed'
  }

  if (values.statusReturn === 'PARTIAL') {
    return 'Partial Return'
  }

  if (
    values.statusReturn === 'ROK' ||
    values.statusReturn === 'Faulty' ||
    values.statusReturn === 'RETURN' ||
    values.statusReturn === 'GOOD' ||
    values.statusReturn === 'FAULTY' ||
    values.pickupEvidenceFileName
  ) {
    return 'Returned'
  }

  return 'Not Returned'
}

const getAutoPickupStatus = (
  values: SpmsFormInput,
  deliveryStatus = values.deliveryStatus,
) => {
  const selectedPickupStatus =
    values.statusReturn === 'FAULTY' || values.statusReturn === 'Faulty'
      ? 'FAULTY'
      : values.statusReturn === 'ROK'
        ? 'ROK'
        : ''

  if (values.pickupEvidenceFileName) {
    return selectedPickupStatus || 'UNRETURN'
  }

  if (deliveryStatus === 'DELIVERED') {
    return 'UNRETURN'
  }

  return 'OPEN'
}

const getNextSequence = (records: SpmsRecord[]) => {
  const numbers = records
    .map((record) => record.orderNumber.match(/(\d+)$/)?.[1])
    .filter(Boolean)
    .map((value) => Number(value))

  return Math.max(0, ...numbers) + 1
}

const createSpmsOrderNumber = (records: SpmsRecord[]) =>
  `AVIAT-2026-${String(getNextSequence(records)).padStart(4, '0')}`

const shouldGenerateOrderNumber = (value: string) =>
  !value || /^will generate/i.test(value)

const buildRecordFromForm = (
  values: SpmsFormInput,
  records: SpmsRecord[],
  existing?: SpmsRecord,
): SpmsRecord => {
  const orderNumber = shouldGenerateOrderNumber(values.orderNumber)
    ? createSpmsOrderNumber(records)
    : values.orderNumber
  const materials = normalizeMaterials(values)
  const firstMaterial = materials[0]
  const deliveryStatus =
    values.deliveryEvidenceFileName || values.evidenceFileName
      ? 'DELIVERED'
      : values.deliveryStatus === 'DRAFT BA'
        ? 'OPEN'
        : values.deliveryStatus || 'OPEN'
  const baStatusReturn = getAutoPickupStatus(values, deliveryStatus)

  return {
    id: existing?.id ?? `spms-${crypto.randomUUID()}`,
    orderNumber,
    customer: toTitleCase(values.customer),
    customerOrderNumber: values.customerOrderNumber,
    requestDate: toDatePart(values.requestDate),
    area: toTitleCase(values.areal),
    dop: values.dop,
    siteName: values.siteName,
    categoryMaterial: firstMaterial.categoryMaterial,
    typeMaterial: firstMaterial.typeMaterial,
    description: firstMaterial.description,
    partNumber: firstMaterial.partNumber,
    qty: materials.reduce((total, material) => total + material.qty, 0),
    supportOriginMaterial: firstMaterial.supportOriginMaterial,
    materials,
    severity: toSeverity(values.severity),
    site: existing?.site ?? 'On Site',
    statusSpms: getStatusSpms(values),
    statusReturn: getReturnStatus({
      ...values,
      statusReturn: baStatusReturn,
    }),
    createdBy: values.createdBy,
    customerRequestor: values.customerRequestor,
    supportDestinationMaterial:
      firstMaterial.supportDestinationMaterial ?? values.supportDestinationMaterial,
    originLsp: values.originLsp,
    destinationLsp: values.destinationLsp,
    materialSerialNumber: values.materialSerialNumber,
    stockStatus: values.stockStatus,
    systemLabel: values.systemLabel,
    stockRemark: values.stockRemark,
    reservationStatus: values.reservationStatus,
    slaHours: getSlaHoursForSeverity(values.severity),
    awbTransfer: values.awbTransfer,
    pmArea: values.pmArea,
    baNumber: shouldGenerateOrderNumber(values.baNumber)
      ? `BA-${orderNumber}`
      : values.baNumber,
    baType: 'Material Delivery Note',
    deliveryStatus,
    sendBy: values.sendBy,
    deliveryDateGoodUnit: values.deliveryDateGoodUnit,
    serialNumberGoodUnit: values.serialNumberGoodUnit,
    descriptionMaterial: values.descriptionMaterial,
    baStatusReturn,
    serialNumberFaultyUnit: values.serialNumberFaultyUnit,
    pickupBy: values.pickupBy,
    pickupDate: values.pickupDate,
    evidenceFileName: values.evidenceFileName,
    deliveryEvidenceFileName: values.deliveryEvidenceFileName,
    pickupEvidenceFileName: values.pickupEvidenceFileName,
    evidenceNotes: values.evidenceNotes,
    approval1By: values.approval1By,
    approval1Status: normalizeApprovalStatus(values.approval1Status),
    approval1Date: values.approval1Date,
    approval1Notes: values.approval1Notes,
    approval2By: values.approval2By,
    approval2Status: normalizeApprovalStatus(values.approval2Status),
    approval2Date: values.approval2Date,
    approval2Notes: values.approval2Notes,
    closedBy: values.closedBy,
    closedStatus: normalizeClosedStatus(values.closedStatus),
    closedDate: values.closedDate,
    closedNotes: values.closedNotes,
    pickupApproval1By: values.pickupApproval1By,
    pickupApproval1Status: normalizeApprovalStatus(values.pickupApproval1Status),
    pickupApproval1Date: values.pickupApproval1Date,
    pickupApproval1Notes: values.pickupApproval1Notes,
    pickupApproval2By: values.pickupApproval2By,
    pickupApproval2Status: normalizeApprovalStatus(values.pickupApproval2Status),
    pickupApproval2Date: values.pickupApproval2Date,
    pickupApproval2Notes: values.pickupApproval2Notes,
    pickupClosedBy: values.pickupClosedBy,
    pickupClosedStatus: normalizeClosedStatus(values.pickupClosedStatus),
    pickupClosedDate: values.pickupClosedDate,
    pickupClosedNotes: values.pickupClosedNotes,
  }
}

export const spmsStorage = {
  getAll(): SpmsRecord[] {
    const persistedRecords = readPersistedRecords()

    if (persistedRecords) {
      return persistedRecords
    }

    saveRecords(spmsRecords)
    return spmsRecords
  },
  getById(id: string | undefined): SpmsRecord | null {
    if (!id) {
      return null
    }

    return this.getAll().find((record) => record.id === id) ?? null
  },
  createFromForm(values: SpmsFormInput): SpmsRecord {
    const records = this.getAll()
    const nextRecord = buildRecordFromForm(values, records)

    saveRecords([nextRecord, ...records])
    return nextRecord
  },
  updateFromForm(id: string, values: SpmsFormInput): SpmsRecord | null {
    const records = this.getAll()
    const existing = records.find((record) => record.id === id)

    if (!existing) {
      return null
    }

    const nextRecord = buildRecordFromForm(values, records, existing)
    saveRecords(
      records.map((record) => (record.id === id ? nextRecord : record)),
    )

    return nextRecord
  },
}
