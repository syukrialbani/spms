import * as Yup from 'yup'

export type SpmsRequestFormValues = {
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

export const customerOptions = [
  'TELKOMSEL',
  'TELKOM INDONESIA',
  'INDOSAT OOREDOO HUTCHISON',
  'XL AXIATA',
  'SMARTFREN',
  'BIZNET',
  'ICON PLUS',
  'MORATELINDO',
] as const

export const areaOptions = [
  'MUARABUNGO',
  'MUA RARUNGO',
  'PALEMBANG',
  'JAKARTA',
  'BANDUNG',
  'SURABAYA',
  'MEDAN',
  'MAKASSAR',
  'SEMARANG',
  'BALI',
  'BALIKPAPAN',
] as const

export const dopOptions = [
  'JAMBI',
  'JAKARTA',
  'JAWA BARAT',
  'JAWA TIMUR',
  'KALIMANTAN',
  'DOP JKT-01',
  'DOP SBY-03',
  'DOP BDG-02',
  'DOP MDN-01',
  'DOP MKS-04',
  'DOP SMG-02',
  'DOP DPS-01',
  'DOP BPN-05',
] as const

export const categoryMaterialOptions = [
  'PDH',
  'RADIO',
  'ANTENNA',
  'POWER',
  'CABLE',
  'CONNECTOR',
  'MOUNTING',
  'OUTDOOR UNIT',
  'INDOOR UNIT',
] as const

export const typeMaterialOptions = [
  'PASOLINK NEO CPV',
  'MICROWAVE LINK',
  'PARABOLIC ANTENNA',
  'RECTIFIER MODULE',
  'IF CABLE',
  'ODU',
  'IDU',
  'RF CONNECTOR',
  'POLE MOUNT',
] as const

export const descriptionOptions = [
  'MDP-1200MB-1BB',
  'MDP-1200MB-1BB, CHASSIS ONLY',
  'BRACKET FOR ODU 7G',
  'BRACKET MOUNTING ODU',
  '5D-FB COAXIAL CABLE',
  '8D-FB COAXIAL CABLE',
  'LOW LOSS CABLE 1M',
  'LOW LOSS CABLE 2M',
  'POWER CABLE',
  'CONNECTOR POWER IPASOLINK 1000',
  'TRP-8G-3B SB D High, N Type',
  'Replacement radio unit for capacity recovery',
  'Antenna alignment kit for corrective maintenance',
  'Power rectifier module for BTS continuity',
  'IF cable replacement for unstable link',
  'Outdoor unit spare for preventive replacement',
  'Indoor unit swap for service restoration',
  'Connector kit for urgent field repair',
  'Pole mounting kit for new hop activation',
] as const

export const partNumberOptions = [
  'NWA-042282',
  'AVI-CTR-9200',
  'ANT-060-HPX',
  'PWR-RCT-48V',
  'CBL-IF-30M',
  'ODU-11G-PLUS',
  'IDU-CTR-500',
  'RF-CON-NM',
  'MNT-POLE-2M',
] as const

export const supportOriginMaterialOptions = [
  'Palembang',
  'Jakarta',
  'Surabaya',
  'MS AVIAT MARUNDA',
  'MS AVIAT PALEMBANG',
  'MS AVIAT JAKARTA',
  'Warehouse Jakarta',
  'Warehouse Surabaya',
  'Warehouse Makassar',
  'Regional Stock',
  'Vendor Direct',
] as const

export const supportDestinationMaterialOptions = [
  'BELITUNG',
  'JAMBI',
  'JAKARTA',
  'PALEMBANG',
  'BANDUNG',
  'SURABAYA',
  'MEDAN',
  'MAKASSAR',
  'SEMARANG',
  'BALI',
  'BALIKPAPAN',
] as const

export const severityOptions = ['NON CRITICAL', 'CRITICAL'] as const

export const lspOptions = [
  'MS AVIAT MARUNDA',
  'WAREHOUSE JAKARTA',
  'WAREHOUSE SURABAYA',
  'WAREHOUSE MAKASSAR',
  'REGIONAL STOCK',
  'VENDOR DIRECT',
  'JAKARTA',
  'BANDUNG',
  'SURABAYA',
  'MEDAN',
  'MAKASSAR',
  'SEMARANG',
  'BALI',
  'BALIKPAPAN',
  'PALEMBANG',
  'AMBON',
  'BATURAJA',
  'SAMARINDA',
  'SORONG',
  'BELITUNG',
  'BENGKULU',
  'GORONTALO',
  'JAMBI',
  'KUPANG',
  'LUBUK LINGGAU',
  'MUARA BUNGO',
  'BANDAR LAMPUNG',
  'BANGKA',
  'BANJARMASIN',
  'DENPASAR',
  'JAYAPURA',
  'KENDARI',
  'MATARAM',
  'MAUMERE',
  'PALANGKARAYA',
] as const

export const stockStatusOptions = [
  'READY',
  'WAITING APPROVAL',
  'IN USE',
  'DELIVERED',
  'RETURNED',
  'FAULTY',
] as const

export const systemLabelOptions = ['COMPLETE', 'NOT COMPLETE'] as const

export const reservationStatusOptions = [
  'DRAFT',
  'WAITING APPROVAL',
  'RESERVED',
  'ALLOCATED',
  'RELEASED',
] as const

export const approvalStatusOptions = [
  'DRAFT',
  'PENDING APPROVAL',
  'APPROVED',
  'REJECTED',
] as const

export const closedStatusOptions = ['PENDING CUSTOMER', 'CLOSED'] as const

export const deliveryStatusOptions = [
  'OPEN',
  'WAITING ADMIN APPROVAL',
  'WAITING PIC BA REGION',
  'READY FOR DELIVERY',
  'DELIVERY PROCESS',
  'DELIVERED',
  'FAULTY',
  'CLOSED',
] as const

export const baTypeOptions = [
  'MATERIAL DELIVERY NC',
  'MATERIAL DELIVERY RETURN',
  'MATERIAL SWAP',
  'MATERIAL BORROWING',
] as const

export const returnStatusOptions = [
  'GOOD',
  'FAULTY',
  'PARTIAL',
  'NOT RETURNED',
] as const

export const slaHourOptions = [
  '04:00:00',
  '08:00:00',
  '12:00:00',
  '24:00:00',
  '48:00:00',
] as const

export const createDefaultSpmsRequestValues = (): SpmsRequestFormValues => ({
  orderNumber: 'Will Generate by System',
  customer: '',
  customerOrderNumber: '',
  createdBy: 'FACHRIZAL_ALDAMARA',
  customerRequestor: '',
  requestDate: '',
  areal: '',
  dop: '',
  siteName: '',
  categoryMaterial: '',
  typeMaterial: '',
  description: '',
  partNumber: '',
  quantity: '',
  supportOriginMaterial: '',
  supportDestinationMaterial: '',
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
  deliveryStatus: 'DRAFT BA',
  baType: 'MATERIAL DELIVERY NC',
  sendBy: '',
  deliveryDateGoodUnit: '',
  serialNumberGoodUnit: '',
  descriptionMaterial: '',
  statusReturn: '',
  serialNumberFaultyUnit: '',
  pickupBy: '',
  pickupDate: '',
  evidenceFileName: '',
  deliveryEvidenceFileName: '',
  pickupEvidenceFileName: '',
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
    .matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
      {
        excludeEmptyString: true,
        message: 'Request date harus berisi tanggal dan jam',
      },
    )
    .required('Request date wajib diisi'),
  areal: Yup.string().trim().required('Area wajib diisi'),
  dop: Yup.string().trim().required('DOP wajib diisi'),
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
  supportOriginMaterial: Yup.string()
    .trim()
    .required('Support origin material wajib diisi'),
  supportDestinationMaterial: Yup.string()
    .trim()
    .required('Support destination material wajib diisi'),
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
  severity: Yup.string()
    .oneOf([...severityOptions], 'Severity tidak valid')
    .required('Severity wajib diisi'),
  slaHours: Yup.string()
    .trim()
    .matches(/^\d{2}:\d{2}:\d{2}$/, 'SLA harus HH:MM:SS')
    .required('SLA wajib diisi'),
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
    .oneOf([...returnStatusOptions], 'Status return tidak valid')
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
})
