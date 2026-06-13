import {
  createDefaultMaterialValues,
  type SpmsRequestFormValues,
} from './model'
import type { DetailFieldName, MaterialFieldName } from './types'

export const approvalStatusLabels: Record<string, string> = {
  APPROVED: 'Approve',
  CLOSED: 'Closed',
  DRAFT: 'Draft',
  'PENDING CUSTOMER': 'Pending',
  'PENDING APPROVAL': 'Pending',
  REJECTED: 'Revisi',
}

export const formatTimelineDate = (value: string | undefined) => {
  if (!value) {
    return ''
  }

  return value.replace('T', ' ').slice(0, 16)
}

export const detailRequestFields: DetailFieldName[] = [
  'customer',
  'customerOrderNumber',
  'createdBy',
  'customerRequestor',
  'requestDate',
  'areal',
  'dop',
  'feId',
  'neId',
  'regional',
  'siteName',
  'requestorEmail',
  'requestorPhone',
  'picKancabEmail',
  'picKancabName',
  'picKancabPhone',
  'statusTransaction',
  'materials',
  'severity',
  'slaHours',
  'pmArea',
]

export const formSteps = [
  {
    title: 'Detail Request',
    subtitle: 'Request, site, material',
  },
  {
    title: 'Upload BA Delivery',
    subtitle: 'Evidence delivery',
  },
  {
    title: 'Approval BA Delivery',
    subtitle: 'Approval 1 & 2',
  },
  {
    title: 'Upload BA Pickup',
    subtitle: 'Evidence pickup',
  },
  {
    title: 'Approval BA Pickup',
    subtitle: 'Approval 1 & 2',
  },
] as const

export const stepFields: DetailFieldName[][] = [
  detailRequestFields,
  [
    'baType',
    'sendBy',
    'deliveryDateGoodUnit',
    'serialNumberGoodUnit',
    'descriptionMaterial',
  ],
  [
    'approval1By',
    'approval1Status',
    'approval2By',
    'approval2Status',
    'closedBy',
    'closedStatus',
  ],
  ['statusReturn'],
  [
    'pickupApproval1By',
    'pickupApproval1Status',
    'pickupApproval2By',
    'pickupApproval2Status',
    'pickupClosedBy',
    'pickupClosedStatus',
  ],
]

export const materialFieldNames: MaterialFieldName[] = [
  'categoryMaterial',
  'typeMaterial',
  'description',
  'partNumber',
  'quantity',
]

export const normalizeFormMaterials = (values: SpmsRequestFormValues) => {
  const materials =
    values.materials.length > 0
      ? values.materials
      : [createDefaultMaterialValues()]

  return materials.map((material) => ({
    ...material,
    quantity: '1',
  }))
}

export const getAutoPickupStatus = (
  values: SpmsRequestFormValues,
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
