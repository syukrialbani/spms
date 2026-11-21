import {
  approvalStatusOptions,
  baTypeOptions,
  closedStatusOptions,
  defaultBaType,
  deliveryStatusOptions,
  reservationStatusOptions,
  returnStatusOptions,
  stockStatusOptions,
  systemLabelOptions,
} from '@entities/spms'
import * as Yup from 'yup'

export type SpmsMaterialFormValues = {
  categoryMaterial: string
  typeMaterial: string
  description: string
  partNumber: string
  quantity: string
  serialNumber: string
  supportOriginMaterial: string
  supportDestinationMaterial: string
}

export type SpmsRequestFormValues = {
  orderNumber: string
  customer: string
  customerOrderNumber: string
  createdBy: string
  customerRequestor: string
  requestDate: string
  areal: string
  dop: string
  feId: string
  neId: string
  regional: string
  siteName: string
  categoryMaterial: string
  typeMaterial: string
  description: string
  partNumber: string
  quantity: string
  supportOriginMaterial: string
  supportDestinationMaterial: string
  materials: SpmsMaterialFormValues[]
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
  deliveryStatus: string
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
  deliveryEvidenceFileId: string
  pickupEvidenceFileName: string
  pickupEvidenceFileId: string
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
  deliveryOrderNumber: string
  pickupDeliveryOrderNumber: string
  picKancabEmail: string
  picKancabName: string
  picKancabPhone: string
  requestorEmail: string
  requestorPhone: string
  statusTransaction: string
}

export const createDefaultMaterialValues = (): SpmsMaterialFormValues => ({
  categoryMaterial: '',
  typeMaterial: '',
  description: '',
  partNumber: '',
  quantity: '1',
  serialNumber: '',
  supportOriginMaterial: '',
  supportDestinationMaterial: '',
})

export const createDefaultSpmsRequestValues = (
  createdBy = 'SPMS_USER',
): SpmsRequestFormValues => ({
  orderNumber: 'Will Generate by System',
  customer: '',
  customerOrderNumber: '',
  createdBy,
  customerRequestor: '',
  requestDate: '',
  areal: '',
  dop: '',
  feId: '',
  neId: '',
  regional: '',
  siteName: '',
  categoryMaterial: '',
  typeMaterial: '',
  description: '',
  partNumber: '',
  quantity: '',
  supportOriginMaterial: '',
  supportDestinationMaterial: '',
  materials: [createDefaultMaterialValues()],
  originLsp: '',
  destinationLsp: '',
  materialSerialNumber: '',
  stockStatus: 'READY',
  systemLabel: 'NOT COMPLETE',
  stockRemark: 'A-STOCK TAKE',
  reservationStatus: 'DRAFT',
  severity: '',
  slaHours: '',
  awbTransfer: '',
  pmArea: '',
  baNumber: 'Will Generate by System',
  deliveryStatus: 'OPEN',
  baType: defaultBaType,
  sendBy: '',
  deliveryDateGoodUnit: '',
  serialNumberGoodUnit: '',
  descriptionMaterial: '',
  statusReturn: 'OPEN',
  serialNumberFaultyUnit: '',
  pickupBy: '',
  pickupDate: '',
  evidenceFileName: '',
  deliveryEvidenceFileName: '',
  deliveryEvidenceFileId: '',
  pickupEvidenceFileName: '',
  pickupEvidenceFileId: '',
  evidenceNotes: '',
  approval1By: '',
  approval1Status: 'PENDING APPROVAL',
  approval1Date: '',
  approval1Notes: '',
  approval2By: '',
  approval2Status: 'PENDING APPROVAL',
  approval2Date: '',
  approval2Notes: '',
  closedBy: '',
  closedStatus: 'PENDING CUSTOMER',
  closedDate: '',
  closedNotes: '',
  pickupApproval1By: '',
  pickupApproval1Status: 'PENDING APPROVAL',
  pickupApproval1Date: '',
  pickupApproval1Notes: '',
  pickupApproval2By: '',
  pickupApproval2Status: 'PENDING APPROVAL',
  pickupApproval2Date: '',
  pickupApproval2Notes: '',
  pickupClosedBy: '',
  pickupClosedStatus: 'PENDING CUSTOMER',
  pickupClosedDate: '',
  pickupClosedNotes: '',
  deliveryOrderNumber: '',
  pickupDeliveryOrderNumber: '',
  picKancabEmail: '',
  picKancabName: '',
  picKancabPhone: '',
  requestorEmail: '',
  requestorPhone: '',
  statusTransaction: '',
})

const materialValidationSchema = Yup.object({
  categoryMaterial: Yup.string()
    .trim()
    .required('Category material wajib diisi'),
  typeMaterial: Yup.string().trim().required('Type material wajib diisi'),
  description: Yup.string().trim().required('Description wajib diisi'),
  partNumber: Yup.string().trim().required('Part number wajib diisi'),
  quantity: Yup.string()
    .oneOf(['1'], 'Quantity material harus 1')
    .required('Quantity wajib diisi'),
  serialNumber: Yup.string().trim(),
  supportOriginMaterial: Yup.string().trim(),
  supportDestinationMaterial: Yup.string().trim(),
})

export const spmsRequestValidationSchema = Yup.object({
  customer: Yup.string().trim().required('Customer wajib diisi'),
  customerOrderNumber: Yup.string()
    .trim()
    .required('Customer order number wajib diisi'),
  createdBy: Yup.string().trim().required('Create by wajib diisi'),
  customerRequestor: Yup.string()
    .trim()
    .required('Customer requestor wajib diisi'),
  requestDate: Yup.string()
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
      excludeEmptyString: true,
      message: 'Request date harus berisi tanggal dan jam',
    })
    .required('Request date wajib diisi'),
  areal: Yup.string().trim().required('Area wajib diisi'),
  dop: Yup.string().trim().required('DOP wajib diisi'),
  feId: Yup.string()
    .trim()
    .test(
      'telkom-fe-id',
      'FE ID wajib diisi untuk customer Telkom',
      (value, context) =>
        context.parent.customer !== 'Telkom' || Boolean(value?.trim()),
    ),
  neId: Yup.string()
    .trim()
    .test(
      'telkom-ne-id',
      'NE ID wajib diisi untuk customer Telkom',
      (value, context) =>
        context.parent.customer !== 'Telkom' || Boolean(value?.trim()),
    ),
  regional: Yup.string().trim().required('Regional wajib diisi'),
  siteName: Yup.string().trim().required('Site name wajib diisi'),
  categoryMaterial: Yup.string()
    .trim()
    .required('Category material wajib diisi'),
  typeMaterial: Yup.string().trim().required('Type material wajib diisi'),
  description: Yup.string().trim().required('Description wajib diisi'),
  partNumber: Yup.string().trim().required('Part number wajib diisi'),
  quantity: Yup.string()
    .trim()
    .matches(/^[1-9]\d*$/, 'Quantity harus lebih dari 0')
    .required('Quantity wajib diisi'),
  supportOriginMaterial: Yup.string().trim(),
  supportDestinationMaterial: Yup.string().trim(),
  materials: Yup.array()
    .of(materialValidationSchema)
    .min(1, 'Minimal 1 material wajib ditambahkan')
    .required('Material wajib diisi'),
  originLsp: Yup.string().trim(),
  destinationLsp: Yup.string().trim(),
  materialSerialNumber: Yup.string().trim(),
  stockStatus: Yup.string()
    .oneOf([...stockStatusOptions], 'Stock status tidak valid')
    .required('Stock status wajib diisi'),
  systemLabel: Yup.string()
    .oneOf([...systemLabelOptions], 'System label tidak valid')
    .required('System label wajib diisi'),
  stockRemark: Yup.string().trim(),
  reservationStatus: Yup.string()
    .oneOf([...reservationStatusOptions], 'Reservation status tidak valid')
    .required('Reservation status wajib diisi'),
  severity: Yup.string().trim().required('Severity wajib diisi'),
  slaHours: Yup.string().trim().required('SLA wajib diisi'),
  awbTransfer: Yup.string().trim(),
  pmArea: Yup.string().trim().required('PM area wajib diisi'),
  baNumber: Yup.string().trim().required('BA number wajib diisi'),
  deliveryStatus: Yup.string()
    .oneOf([...deliveryStatusOptions], 'Delivery status tidak valid')
    .required('Delivery status wajib diisi'),
  baType: Yup.string()
    .oneOf([...baTypeOptions], 'BA type tidak valid')
    .required('BA type wajib diisi'),
  sendBy: Yup.string().trim().required('Send by wajib diisi'),
  deliveryDateGoodUnit: Yup.string().trim().required('Delivery date wajib diisi'),
  serialNumberGoodUnit: Yup.string()
    .trim()
    .required('Serial number good unit wajib diisi'),
  descriptionMaterial: Yup.string()
    .trim()
    .required('Description material wajib diisi'),
  statusReturn: Yup.string()
    .test(
      'status-return-valid',
      'Status return tidak valid',
      (value) => !value || (returnStatusOptions as readonly string[]).includes(value),
    )
    .test(
      'pickup-status-after-upload',
      'BA Pickup Status wajib ROK atau FAULTY setelah BA pickup diupload',
      function validatePickupStatus(value) {
        const pickupEvidenceFileName = this.parent
          .pickupEvidenceFileName as string

        if (!pickupEvidenceFileName) {
          return true
        }

        return value === 'ROK' || value === 'FAULTY' || value === 'Faulty'
      },
    )
    .required('Status return wajib diisi'),
  serialNumberFaultyUnit: Yup.string().trim(),
  pickupBy: Yup.string().trim(),
  pickupDate: Yup.string().trim(),
  evidenceFileName: Yup.string().trim(),
  deliveryEvidenceFileName: Yup.string().trim(),
  pickupEvidenceFileName: Yup.string().trim(),
  evidenceNotes: Yup.string().trim(),
  approval1By: Yup.string().trim(),
  approval1Status: Yup.string()
    .oneOf([...approvalStatusOptions], 'Approval 1 status tidak valid')
    .required('Approval 1 status wajib diisi'),
  approval1Date: Yup.string().trim(),
  approval1Notes: Yup.string().trim(),
  approval2By: Yup.string().trim(),
  approval2Status: Yup.string()
    .oneOf([...approvalStatusOptions], 'Approval 2 status tidak valid')
    .required('Approval 2 status wajib diisi'),
  approval2Date: Yup.string().trim(),
  approval2Notes: Yup.string().trim(),
  closedBy: Yup.string().trim(),
  closedStatus: Yup.string()
    .oneOf([...closedStatusOptions], 'Closed status tidak valid')
    .required('Closed status wajib diisi'),
  closedDate: Yup.string().trim(),
  closedNotes: Yup.string().trim(),
  pickupApproval1By: Yup.string().trim(),
  pickupApproval1Status: Yup.string()
    .oneOf([...approvalStatusOptions], 'Pickup approval 1 status tidak valid')
    .required('Pickup approval 1 status wajib diisi'),
  pickupApproval1Date: Yup.string().trim(),
  pickupApproval1Notes: Yup.string().trim(),
  pickupApproval2By: Yup.string().trim(),
  pickupApproval2Status: Yup.string()
    .oneOf([...approvalStatusOptions], 'Pickup approval 2 status tidak valid')
    .required('Pickup approval 2 status wajib diisi'),
  pickupApproval2Date: Yup.string().trim(),
  pickupApproval2Notes: Yup.string().trim(),
  pickupClosedBy: Yup.string().trim(),
  pickupClosedStatus: Yup.string()
    .oneOf([...closedStatusOptions], 'Pickup closed status tidak valid')
    .required('Pickup closed status wajib diisi'),
  pickupClosedDate: Yup.string().trim(),
  pickupClosedNotes: Yup.string().trim(),
  deliveryOrderNumber: Yup.string().trim(),
  pickupDeliveryOrderNumber: Yup.string().trim(),
  picKancabEmail: Yup.string().trim().email('Email PIC Kancab tidak valid'),
  picKancabName: Yup.string().trim().required('PIC/LSP name wajib diisi'),
  picKancabPhone: Yup.string().trim(),
  requestorEmail: Yup.string()
    .trim()
    .email('Email requestor tidak valid')
    .required('Email requestor wajib diisi'),
  requestorPhone: Yup.string().trim().required('No HP requestor wajib diisi'),
  statusTransaction: Yup.string()
    .trim()
    .required('Status transaction wajib diisi'),
})
