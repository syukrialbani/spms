import { getSpmsRecordById, type SpmsRecord } from '@entities/spms'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { AppButton } from '@shared/ui/AppButton'
import { PageHeader } from '@shared/ui/PageHeader'
import {
  createDefaultSpmsRequestValues,
  SpmsRequestForm,
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

const getInitialValues = (record: SpmsRecord): SpmsRequestFormValues => ({
  ...createDefaultSpmsRequestValues(),
  orderNumber: record.orderNumber,
  customer: record.customer.toUpperCase(),
  customerOrderNumber: record.customerOrderNumber,
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
  supportDestinationMaterial: record.area.toUpperCase(),
  originLsp: record.supportOriginMaterial.toUpperCase(),
  destinationLsp: record.area.toUpperCase(),
  stockStatus:
    record.statusSpms === 'Approved'
      ? 'RESERVED'
      : record.statusSpms === 'In Progress'
        ? 'IN USE'
        : 'WAITING APPROVAL',
  systemLabel: 'NOT COMPLETE',
  stockRemark: 'A-STOCK TAKE',
  reservationStatus:
    record.statusSpms === 'Approved'
      ? 'RESERVED'
      : record.statusSpms === 'In Progress'
        ? 'ALLOCATED'
        : 'WAITING APPROVAL',
  severity: getFormSeverity(record),
  slaHours: '24:00:00',
  pmArea: record.area.toUpperCase(),
  adminApprover: 'ADMIN SPMS',
  adminApprovalStatus:
    record.statusSpms === 'Approved' ? 'APPROVED' : 'PENDING APPROVAL',
  picBaRegion: record.area.toUpperCase(),
  picBaApprovalStatus:
    record.statusSpms === 'Approved' ? 'APPROVED' : 'PENDING APPROVAL',
  deliveryStatus:
    record.statusSpms === 'Approved'
      ? 'READY FOR DELIVERY'
      : record.statusSpms === 'In Progress'
        ? 'DELIVERY PROCESS'
        : 'WAITING ADMIN APPROVAL',
  sendBy: 'FIELD USER',
  deliveryDateGoodUnit: toDateTimeLocalValue(record.requestDate),
  serialNumberGoodUnit: record.partNumber,
  descriptionMaterial: record.description,
  statusReturn:
    record.statusReturn === 'Returned'
      ? 'GOOD'
      : record.statusReturn === 'Partial Return'
        ? 'PARTIAL'
        : 'NOT RETURNED',
})

export function SpmsEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const record = getSpmsRecordById(id)

  const goBackToList = useCallback(() => {
    navigate('/spms')
  }, [navigate])

  const initialValues = useMemo(
    () => (record ? getInitialValues(record) : createDefaultSpmsRequestValues()),
    [record],
  )

  const handleSaveSpms = useCallback(
    (values: SpmsRequestFormValues) => {
      console.info('SPMS updated', { id, values })
      navigate('/spms')
    },
    [id, navigate],
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
        initialValues={initialValues}
        onCancel={goBackToList}
        onSave={handleSaveSpms}
      />
    </>
  )
}
