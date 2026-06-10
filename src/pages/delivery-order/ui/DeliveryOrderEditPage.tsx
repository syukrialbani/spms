import {
  deliveryOrderStorage,
  type DeliveryOrderMaterialItem,
  type DeliveryOrderRecord,
  type DeliveryOrderStatus,
} from '@entities/delivery-order'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { AppButton } from '@shared/ui/AppButton'
import { FormAutocomplete } from '@shared/ui/FormAutocomplete'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import { PageHeader } from '@shared/ui/PageHeader'
import { useState, type ReactNode } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

type EditFormState = {
  area: string
  awbTransfer: string
  batch: string
  customer: string
  datePickup: string
  dop: string
  expedition: string
  materials: DeliveryOrderMaterialItem[]
  orderNumber: string
  packaging: string
  qtyBox: string
  receiveDate: string
  requestDate: string
  reviewTime: string
  service: string
  severity: string
  siteName: string
  statusCheck: string
  statusDo: DeliveryOrderStatus
  ticketNumber: string
  uploadDoFileName: string
  weight: string
}

const statusOptions: DeliveryOrderStatus[] = [
  'WAITING_UPLOAD_DO',
  'WAITING_APPROVAL_DO',
  'PICKUP_GENERATED',
  'CLOSED',
]

const createEmptyMaterial = (): DeliveryOrderMaterialItem => ({
  description: '',
  partNumber: '',
  qty: 1,
  serialNumber: '',
})

const createFormState = (order: DeliveryOrderRecord): EditFormState => ({
  area: order.area ?? '',
  awbTransfer: order.awbTransfer ?? '',
  batch: order.batch ?? '',
  customer: order.customer ?? '',
  datePickup: order.datePickup ?? '',
  dop: order.dop ?? '',
  expedition: order.expedition,
  materials: order.materials?.length
    ? order.materials
    : order.materialSerialNumbers?.length
      ? order.materialSerialNumbers.map((serialNumber, index) => ({
          description: `Material ${index + 1}`,
          partNumber: '-',
          qty: 1,
          serialNumber,
        }))
      : [createEmptyMaterial()],
  orderNumber: order.orderNumber ?? order.sourceSpmsOrderNumber ?? '',
  packaging: order.packaging ?? '',
  qtyBox: order.qtyBox ?? '',
  receiveDate: order.receiveDate ?? '',
  requestDate: order.requestDate ?? order.dateRequest,
  reviewTime: order.reviewTime ?? '',
  service: order.service,
  severity: order.severity ?? '',
  siteName: order.siteName ?? '',
  statusCheck: order.statusCheck ?? '',
  statusDo: order.statusDo,
  ticketNumber: order.ticketNumber ?? '',
  uploadDoFileName: order.uploadDoFileName ?? '',
  weight: order.weight ?? '',
})

function Section({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 1,
      }}
    >
      <Typography sx={{ fontWeight: 950, mb: 1 }} variant="subtitle2">
        {title}
      </Typography>
      {children}
    </Box>
  )
}

export function DeliveryOrderEditPage() {
  const navigate = useNavigate()
  const { deliveryOrder } = useParams()
  const order = deliveryOrder
    ? deliveryOrderStorage.getByDeliveryOrder(deliveryOrder)
    : null
  const [formState, setFormState] = useState<EditFormState | null>(() =>
    order ? createFormState(order) : null,
  )

  if (!order || !formState) {
    return <Navigate to="/delivery-order" replace />
  }

  const updateForm = <Key extends keyof EditFormState>(
    key: Key,
    value: EditFormState[Key],
  ) => {
    setFormState((current) =>
      current ? { ...current, [key]: value } : current,
    )
  }

  const updateMaterial = (
    index: number,
    key: keyof DeliveryOrderMaterialItem,
    value: string,
  ) => {
    setFormState((current) =>
      current
        ? {
            ...current,
            materials: current.materials.map((material, itemIndex) =>
              itemIndex === index
                ? {
                    ...material,
                    [key]: key === 'qty' ? Number(value) || 1 : value,
                  }
                : material,
            ),
          }
        : current,
    )
  }

  const addMaterial = () => {
    setFormState((current) =>
      current
        ? { ...current, materials: [...current.materials, createEmptyMaterial()] }
        : current,
    )
  }

  const removeMaterial = (index: number) => {
    setFormState((current) =>
      current
        ? {
            ...current,
            materials:
              current.materials.length === 1
                ? [createEmptyMaterial()]
                : current.materials.filter((_, itemIndex) => itemIndex !== index),
          }
        : current,
    )
  }

  const handleSave = () => {
    const nextStatus =
      formState.uploadDoFileName && formState.statusDo === 'WAITING_UPLOAD_DO'
        ? 'WAITING_APPROVAL_DO'
        : formState.statusDo

    deliveryOrderStorage.update(order.deliveryOrder, {
      area: formState.area,
      awbTransfer: formState.awbTransfer,
      batch: formState.batch,
      customer: formState.customer,
      datePickup: formState.datePickup,
      dop: formState.dop,
      expedition: formState.expedition,
      materialSerialNumbers: formState.materials.map(
        (material) => material.serialNumber ?? '',
      ),
      materials: formState.materials,
      orderNumber: formState.orderNumber,
      packaging: formState.packaging,
      qtyBox: formState.qtyBox,
      receiveDate: formState.receiveDate,
      requestDate: formState.requestDate,
      reviewTime: formState.reviewTime,
      service: formState.service,
      severity: formState.severity,
      siteName: formState.siteName,
      statusCheck: formState.statusCheck,
      statusDo: nextStatus,
      ticketNumber: formState.ticketNumber,
      uploadDoFileName: formState.uploadDoFileName,
      weight: formState.weight,
    })

    navigate(`/delivery-order/${order.deliveryOrder}`)
  }

  return (
    <>
      <PageHeader
        title="Edit Delivery Order"
        subtitle={`${order.deliveryOrder} - ${order.kind === 'PICKUP' ? 'DO Pickup' : 'DO Delivery'}`}
        actions={
          <Button
            onClick={() => navigate(`/delivery-order/${order.deliveryOrder}`)}
            startIcon={<ArrowBackRoundedIcon />}
            variant="outlined"
            sx={{ background: 'transparent', boxShadow: 'none' }}
          >
            Back
          </Button>
        }
      />

      <LiquidPanel sx={{ p: { xs: 1.5, md: 2 } }}>
        <Stack spacing={1.25}>
          <Section title="Detail Request">
            <Box
              sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, minmax(0, 1fr))',
                  xl: 'repeat(4, minmax(0, 1fr))',
                },
              }}
            >
              <TextField
                label="Order Number"
                size="small"
                value={formState.orderNumber}
                onChange={(event) => updateForm('orderNumber', event.target.value)}
              />
              <TextField
                label="Customer"
                size="small"
                value={formState.customer}
                onChange={(event) => updateForm('customer', event.target.value)}
              />
              <TextField
                label="Ticket Number"
                size="small"
                value={formState.ticketNumber}
                onChange={(event) =>
                  updateForm('ticketNumber', event.target.value)
                }
              />
              <TextField
                label="Request Date"
                size="small"
                type="date"
                value={formState.requestDate}
                onChange={(event) => updateForm('requestDate', event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Area"
                size="small"
                value={formState.area}
                onChange={(event) => updateForm('area', event.target.value)}
              />
              <TextField
                label="DOP"
                size="small"
                value={formState.dop}
                onChange={(event) => updateForm('dop', event.target.value)}
              />
              <TextField
                label="Site Name"
                size="small"
                value={formState.siteName}
                onChange={(event) => updateForm('siteName', event.target.value)}
              />
              <TextField
                label="Severity"
                size="small"
                value={formState.severity}
                onChange={(event) => updateForm('severity', event.target.value)}
              />
            </Box>
          </Section>

          <Section title="Detail Support">
            <Box
              sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, minmax(0, 1fr))',
                  xl: 'repeat(4, minmax(0, 1fr))',
                },
              }}
            >
              <TextField
                label="Ekspedisi"
                size="small"
                value={formState.expedition}
                onChange={(event) => updateForm('expedition', event.target.value)}
              />
              <TextField
                label="Service"
                size="small"
                value={formState.service}
                onChange={(event) => updateForm('service', event.target.value)}
              />
              <TextField
                label="AWB/SMU"
                size="small"
                value={formState.awbTransfer}
                onChange={(event) => updateForm('awbTransfer', event.target.value)}
              />
              <TextField
                label="Batch"
                size="small"
                value={formState.batch}
                onChange={(event) => updateForm('batch', event.target.value)}
              />
            </Box>
          </Section>

          <Section title="Upload DO & Pickup Information">
            <Box
              sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, minmax(0, 1fr))',
                  xl: 'repeat(4, minmax(0, 1fr))',
                },
              }}
            >
              <TextField
                label="Upload DO File"
                size="small"
                value={formState.uploadDoFileName}
                onChange={(event) =>
                  updateForm('uploadDoFileName', event.target.value)
                }
              />
              <TextField
                label="Receive Date"
                size="small"
                type="datetime-local"
                value={formState.receiveDate}
                onChange={(event) => updateForm('receiveDate', event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Review Time"
                size="small"
                type="datetime-local"
                value={formState.reviewTime}
                onChange={(event) => updateForm('reviewTime', event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Status Check"
                size="small"
                value={formState.statusCheck}
                onChange={(event) => updateForm('statusCheck', event.target.value)}
              />
              <TextField
                label="Date Pickup"
                size="small"
                type="datetime-local"
                value={formState.datePickup}
                onChange={(event) => updateForm('datePickup', event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Qty Box"
                size="small"
                value={formState.qtyBox}
                onChange={(event) => updateForm('qtyBox', event.target.value)}
              />
              <TextField
                label="Weight"
                size="small"
                value={formState.weight}
                onChange={(event) => updateForm('weight', event.target.value)}
              />
              <TextField
                label="Packaging"
                size="small"
                value={formState.packaging}
                onChange={(event) => updateForm('packaging', event.target.value)}
              />
              <FormAutocomplete
                label="Status DO"
                name="statusDo"
                options={statusOptions}
                onChange={(value) =>
                  updateForm(
                    'statusDo',
                    statusOptions.includes(value as DeliveryOrderStatus)
                      ? (value as DeliveryOrderStatus)
                      : 'WAITING_UPLOAD_DO',
                  )
                }
                value={formState.statusDo}
              />
            </Box>
          </Section>

          <Section title="Material Serial Number">
            <Stack spacing={1}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Typography color="text.secondary" variant="body2">
                  SN di sini menjadi referensi untuk proses upload BA.
                </Typography>
                <Button
                  onClick={addMaterial}
                  startIcon={<AddRoundedIcon />}
                  type="button"
                  variant="outlined"
                  sx={{ background: 'transparent', boxShadow: 'none' }}
                >
                  Add Material
                </Button>
              </Stack>
              <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    minWidth: 820,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gap: 0.75,
                      gridTemplateColumns: '48px 1.7fr 1fr 0.7fr 1.1fr 48px',
                      px: 1,
                      py: 0.75,
                    }}
                  >
                    {['No', 'Material', 'Part Number', 'Qty', 'SN', ''].map(
                      (label, index) => (
                        <Typography
                          key={`${label}-${index}`}
                          color="text.secondary"
                          sx={{ fontWeight: 900 }}
                          variant="caption"
                        >
                          {label}
                        </Typography>
                      ),
                    )}
                  </Box>
                  {formState.materials.map((material, index) => (
                    <Box
                      key={index}
                      sx={{
                        alignItems: 'center',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        display: 'grid',
                        gap: 0.75,
                        gridTemplateColumns: '48px 1.7fr 1fr 0.7fr 1.1fr 48px',
                        px: 1,
                        py: 0.75,
                      }}
                    >
                      <Typography sx={{ fontWeight: 900 }} variant="body2">
                        {index + 1}
                      </Typography>
                      <TextField
                        placeholder="Material"
                        size="small"
                        value={material.description}
                        onChange={(event) =>
                          updateMaterial(index, 'description', event.target.value)
                        }
                      />
                      <TextField
                        placeholder="Part Number"
                        size="small"
                        value={material.partNumber}
                        onChange={(event) =>
                          updateMaterial(index, 'partNumber', event.target.value)
                        }
                      />
                      <TextField
                        placeholder="Qty"
                        size="small"
                        type="number"
                        value={material.qty}
                        onChange={(event) =>
                          updateMaterial(index, 'qty', event.target.value)
                        }
                      />
                      <TextField
                        placeholder="SN"
                        size="small"
                        value={material.serialNumber ?? ''}
                        onChange={(event) =>
                          updateMaterial(index, 'serialNumber', event.target.value)
                        }
                      />
                      <Tooltip title="Remove material">
                        <IconButton
                          aria-label="Remove material"
                          onClick={() => removeMaterial(index)}
                          size="small"
                        >
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Stack>
          </Section>

          <Divider />

          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            spacing={1}
            sx={{ justifyContent: 'flex-end' }}
          >
            <Button
              onClick={() => navigate(`/delivery-order/${order.deliveryOrder}`)}
              type="button"
              variant="outlined"
              sx={{ background: 'transparent', boxShadow: 'none' }}
            >
              Cancel
            </Button>
            <AppButton
              onClick={handleSave}
              startIcon={<SaveRoundedIcon />}
              type="button"
            >
              Save Delivery Order
            </AppButton>
          </Stack>
        </Stack>
      </LiquidPanel>
    </>
  )
}
