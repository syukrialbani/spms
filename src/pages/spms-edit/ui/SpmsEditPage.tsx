import { getSpmsRecordById, spmsStorage, type SpmsRecord } from '@entities/spms'
import { useAuth } from '@features/auth'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { AppButton } from '@shared/ui/AppButton'
import { useDevRole } from '@shared/lib/dev-role'
import { PageHeader } from '@shared/ui/PageHeader'
import {
  createDefaultSpmsRequestValues,
  SpmsRequestForm,
  type SpmsApprovalRole,
  type SpmsRequestFormValues,
} from '@shared/ui/SpmsRequestForm'
import { useCallback, useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

const toDateTimeLocalValue = (value: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00`
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return createDefaultSpmsRequestValues().requestDate
  }

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)

  return offsetDate.toISOString().slice(0, 16)
}

const getFormSeverity = (record: SpmsRecord) =>
  record.severity === 'Critical' || record.severity === 'High'
    ? 'CRITICAL'
    : 'NON CRITICAL'

const getCurrentRole = (
  role: string | undefined,
  username: string | undefined,
): SpmsApprovalRole => {
  const identity = `${role ?? ''} ${username ?? ''}`.toLowerCase()
  const compactIdentity = identity.replace(/[\s_-]/g, '')

  if (
    compactIdentity.includes('admin3') ||
    identity.includes('customer')
  ) {
    return 'ADMIN_3'
  }

  if (
    compactIdentity.includes('admin2') ||
    identity.includes('region')
  ) {
    return 'ADMIN_2'
  }

  if (identity.includes('field') || identity.includes('user')) {
    return 'REQUESTOR'
  }

  return 'ADMIN_1'
}

const getInitialValues = (record: SpmsRecord): SpmsRequestFormValues => ({
  ...createDefaultSpmsRequestValues(),
  orderNumber: record.orderNumber,
  customer: record.customer.toUpperCase(),
  customerOrderNumber: record.customerOrderNumber,
  createdBy: record.createdBy ?? 'FACHRIZAL_ALDAMARA',
  customerRequestor: record.customerRequestor ?? '',
  requestDate: toDateTimeLocalValue(record.requestDate),
  areal: record.area.toUpperCase(),
  dop: record.dop,
  siteName: record.siteName,
  categoryMaterial: record.categoryMaterial.toUpperCase(),
  typeMaterial: record.typeMaterial.toUpperCase(),
  description: record.description,
  partNumber: record.partNumber,
  quantity: String(record.qty),
  supportOriginMaterial: record.supportOriginMaterial,
  supportDestinationMaterial:
    record.supportDestinationMaterial ?? record.area.toUpperCase(),
  originLsp: record.originLsp ?? record.supportOriginMaterial.toUpperCase(),
  destinationLsp: record.destinationLsp ?? record.area.toUpperCase(),
  materialSerialNumber: record.materialSerialNumber ?? '',
  stockStatus: record.stockStatus ?? (
    record.statusSpms === 'Approved'
      ? 'RESERVED'
      : record.statusSpms === 'In Progress'
        ? 'IN USE'
        : 'WAITING APPROVAL'
  ),
  systemLabel: record.systemLabel ?? 'NOT COMPLETE',
  stockRemark: record.stockRemark ?? 'A-STOCK TAKE',
  reservationStatus: record.reservationStatus ?? (
    record.statusSpms === 'Approved'
      ? 'RESERVED'
      : record.statusSpms === 'In Progress'
        ? 'ALLOCATED'
        : 'WAITING APPROVAL'
  ),
  severity: getFormSeverity(record),
  slaHours: record.slaHours ?? '24:00:00',
  awbTransfer: record.awbTransfer ?? '',
  pmArea: record.pmArea ?? record.area.toUpperCase(),
  baNumber: record.baNumber ?? `BA-${record.orderNumber}`,
  approval1By: record.approval1By ?? '',
  approval1Status:
    record.approval1Status ??
    (record.statusSpms === 'Approved' ? 'APPROVED' : 'PENDING APPROVAL'),
  approval1Date: record.approval1Date ?? '',
  approval1Notes: record.approval1Notes ?? '',
  approval2By: record.approval2By ?? '',
  approval2Status:
    record.approval2Status ??
    (record.statusSpms === 'Approved' ? 'APPROVED' : 'PENDING APPROVAL'),
  approval2Date: record.approval2Date ?? '',
  approval2Notes: record.approval2Notes ?? '',
  closedBy: record.closedBy ?? '',
  closedStatus: record.closedStatus ?? 'PENDING CUSTOMER',
  closedDate: record.closedDate ?? '',
  closedNotes: record.closedNotes ?? '',
  pickupApproval1By: record.pickupApproval1By ?? '',
  pickupApproval1Status:
    record.pickupApproval1Status ?? 'PENDING APPROVAL',
  pickupApproval1Date: record.pickupApproval1Date ?? '',
  pickupApproval1Notes: record.pickupApproval1Notes ?? '',
  pickupApproval2By: record.pickupApproval2By ?? '',
  pickupApproval2Status:
    record.pickupApproval2Status ?? 'PENDING APPROVAL',
  pickupApproval2Date: record.pickupApproval2Date ?? '',
  pickupApproval2Notes: record.pickupApproval2Notes ?? '',
  pickupClosedBy: record.pickupClosedBy ?? '',
  pickupClosedStatus: record.pickupClosedStatus ?? 'PENDING CUSTOMER',
  pickupClosedDate: record.pickupClosedDate ?? '',
  pickupClosedNotes: record.pickupClosedNotes ?? '',
  deliveryStatus:
    record.deliveryStatus ?? (
    record.statusSpms === 'Approved'
      ? 'READY FOR DELIVERY'
      : record.statusSpms === 'In Progress'
        ? 'DELIVERY PROCESS'
        : 'WAITING ADMIN APPROVAL'
    ),
  baType: record.baType ?? 'MATERIAL DELIVERY NC',
  sendBy: record.sendBy ?? 'FIELD USER',
  deliveryDateGoodUnit:
    record.deliveryDateGoodUnit ?? toDateTimeLocalValue(record.requestDate),
  serialNumberGoodUnit: record.serialNumberGoodUnit ?? record.partNumber,
  descriptionMaterial: record.descriptionMaterial ?? record.description,
  statusReturn:
    record.baStatusReturn ??
    (record.statusReturn === 'Returned'
      ? 'GOOD'
      : record.statusReturn === 'Partial Return'
        ? 'PARTIAL'
        : 'NOT RETURNED'),
  serialNumberFaultyUnit: record.serialNumberFaultyUnit ?? '',
  pickupBy: record.pickupBy ?? '',
  pickupDate: record.pickupDate ?? '',
  evidenceFileName: record.evidenceFileName ?? '',
  deliveryEvidenceFileName: record.deliveryEvidenceFileName ?? '',
  pickupEvidenceFileName: record.pickupEvidenceFileName ?? '',
  evidenceNotes: record.evidenceNotes ?? '',
})

export function SpmsEditPage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const { role: roleOverride } = useDevRole()
  const { id } = useParams()
  const record = getSpmsRecordById(id)
  const currentRole =
    roleOverride ?? getCurrentRole(session?.role, session?.username)
  const currentUserName =
    session?.username?.toUpperCase() ||
    `${session?.firstName ?? ''} ${session?.lastName ?? ''}`.trim() ||
    'SPMS USER'

  const goBackToList = useCallback(() => {
    navigate('/spms')
  }, [navigate])

  const initialValues = useMemo(
    () => (record ? getInitialValues(record) : createDefaultSpmsRequestValues()),
    [record],
  )

  const handleSaveSpms = useCallback(
    (values: SpmsRequestFormValues) => {
      if (id) {
        spmsStorage.updateFromForm(id, values)
      }
    },
    [id],
  )

  if (!record) {
    return <Navigate to="/spms" replace />
  }

  return (
    <>
      <PageHeader
        title="Edit SPMS"
        subtitle={`${record.orderNumber} - ${record.customer}`}
        actions={
          <AppButton
            onClick={goBackToList}
            startIcon={<ArrowBackRoundedIcon />}
            type="button"
            variant="outlined"
            sx={{
              background: 'transparent',
              boxShadow: 'none',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.light',
                boxShadow: 'none',
              },
            }}
          >
            Back
          </AppButton>
        }
      />
      <SpmsRequestForm
        currentRole={currentRole}
        currentUserName={currentUserName}
        initialValues={initialValues}
        onCancel={goBackToList}
        onSave={handleSaveSpms}
      />
    </>
  )
}
