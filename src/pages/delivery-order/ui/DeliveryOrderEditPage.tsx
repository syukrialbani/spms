import {
  deliveryOrderStorage,
  getDeliveryOrderStatusColor,
  getDeliveryOrderStatusLabel,
  type DeliveryOrderMaterialItem,
  type DeliveryOrderRecord,
  type DeliveryOrderStatus,
} from '@entities/delivery-order'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { AppButton } from '@shared/ui/AppButton'
import { FormTextField } from '@shared/ui/FormTextField'
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
  onDeliveryDate: string
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
  onDeliveryDate: order.onDeliveryDate ?? '',
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

function FieldGrid({ children }: { children: ReactNode }) {
  return (
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
      {children}
    </Box>
  )
}

const canMoveToNeedUpload = (formState: EditFormState) =>
  Boolean(
    formState.datePickup &&
      formState.qtyBox &&
      formState.weight &&
      formState.packaging,
  )

const canUploadDo = (status: DeliveryOrderStatus) =>
  status === 'ON_PROGRESS' ||
  status === 'NEED_UPLOAD_DO' ||
  status === 'NEED_REVIEW_DO'

export function DeliveryOrderEditPage() {
  const navigate = useNavigate()
  const { deliveryOrder } = useParams()
  const order = deliveryOrder
    ? deliveryOrderStorage.getByDeliveryOrder(deliveryOrder)
    : null
  const [activeTab, setActiveTab] = useState(0)
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

  const getNextStatus = (): DeliveryOrderStatus => {
    if (activeTab === 2 && formState.statusCheck) {
      const normalizedCheck = formState.statusCheck.toUpperCase()

      if (
        normalizedCheck.includes('REVISI') ||
        normalizedCheck.includes('REJECT')
      ) {
        return 'REJECTED'
      }

      return 'CLOSED'
    }

    if (activeTab === 1 && formState.uploadDoFileName) {
      return 'NEED_REVIEW_DO'
    }

    if (
      activeTab === 0 &&
      formState.statusDo === 'ON_PROGRESS' &&
      canMoveToNeedUpload(formState)
    ) {
      return 'NEED_UPLOAD_DO'
    }

    return formState.statusDo
  }

  const handleSave = () => {
    const nextStatus = getNextStatus()

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
      onDeliveryDate: formState.onDeliveryDate,
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

  const tabLabel = ['Detail Request DO', 'Upload DO', 'Approval'][activeTab]
  const uploadDisabled = !canUploadDo(formState.statusDo)

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
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}
          >
            <Box>
              <Typography sx={{ fontWeight: 950 }} variant="h5">
                {order.deliveryOrder}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {order.origin} - {order.destination}
              </Typography>
            </Box>
            <Chip
              color={getDeliveryOrderStatusColor(formState.statusDo)}
              label={getDeliveryOrderStatusLabel(formState.statusDo)}
              variant="outlined"
            />
          </Stack>

          <Tabs
            value={activeTab}
            onChange={(_, nextTab: number) => setActiveTab(nextTab)}
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              minHeight: 46,
            }}
          >
            <Tab label="Detail Request DO" value={0} />
            <Tab label="Upload DO" value={1} />
            <Tab label="Approval" value={2} />
          </Tabs>

          {activeTab === 0 ? (
            <Stack spacing={1.25}>
              <Section title="Detail Request">
                <FieldGrid>
                  <FormTextField
                    label="Order Number"
                    size="small"
                    value={formState.orderNumber}
                    onChange={(event) =>
                      updateForm('orderNumber', event.target.value)
                    }
                  />
                  <FormTextField
                    label="Customer"
                    size="small"
                    value={formState.customer}
                    onChange={(event) =>
                      updateForm('customer', event.target.value)
                    }
                  />
                  <FormTextField
                    label="Ticket Number"
                    size="small"
                    value={formState.ticketNumber}
                    onChange={(event) =>
                      updateForm('ticketNumber', event.target.value)
                    }
                  />
                  <FormTextField
                    label="Request Date"
                    size="small"
                    type="date"
                    value={formState.requestDate}
                    onChange={(event) =>
                      updateForm('requestDate', event.target.value)
                    }
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <FormTextField
                    label="Area"
                    size="small"
                    value={formState.area}
                    onChange={(event) => updateForm('area', event.target.value)}
                  />
                  <FormTextField
                    label="DOP"
                    size="small"
                    value={formState.dop}
                    onChange={(event) => updateForm('dop', event.target.value)}
                  />
                  <FormTextField
                    label="Site Name"
                    size="small"
                    value={formState.siteName}
                    onChange={(event) =>
                      updateForm('siteName', event.target.value)
                    }
                  />
                  <FormTextField
                    label="Severity"
                    size="small"
                    value={formState.severity}
                    onChange={(event) =>
                      updateForm('severity', event.target.value)
                    }
                  />
                </FieldGrid>
              </Section>

              <Section title="Detail Support">
                <FieldGrid>
                  <FormTextField
                    label="Ekspedisi"
                    size="small"
                    value={formState.expedition}
                    onChange={(event) =>
                      updateForm('expedition', event.target.value)
                    }
                  />
                  <FormTextField
                    label="Service"
                    size="small"
                    value={formState.service}
                    onChange={(event) =>
                      updateForm('service', event.target.value)
                    }
                  />
                  <FormTextField
                    label="Support Origin"
                    size="small"
                    value={order.origin}
                    disabled
                  />
                  <FormTextField
                    label="Destination Origin"
                    size="small"
                    value={order.destination}
                    disabled
                  />
                </FieldGrid>
              </Section>

              <Section title="Process Data">
                <FieldGrid>
                  <FormTextField
                    label="On Progress Date"
                    size="small"
                    type="datetime-local"
                    value={formState.onDeliveryDate}
                    onChange={(event) =>
                      updateForm('onDeliveryDate', event.target.value)
                    }
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <FormTextField
                    label="Date Pickup"
                    size="small"
                    type="datetime-local"
                    value={formState.datePickup}
                    onChange={(event) =>
                      updateForm('datePickup', event.target.value)
                    }
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <FormTextField
                    label="Qty Box"
                    size="small"
                    value={formState.qtyBox}
                    onChange={(event) => updateForm('qtyBox', event.target.value)}
                  />
                  <FormTextField
                    label="Weight"
                    size="small"
                    value={formState.weight}
                    onChange={(event) => updateForm('weight', event.target.value)}
                  />
                  <FormTextField
                    label="Packaging"
                    size="small"
                    value={formState.packaging}
                    onChange={(event) =>
                      updateForm('packaging', event.target.value)
                    }
                  />
                </FieldGrid>
              </Section>

              <Section title="Material Serial Number">
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Typography color="text.secondary" variant="body2">
                      SN di sini menjadi referensi untuk upload BA dan DO.
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
                          gridTemplateColumns:
                            '48px 1.7fr 1fr 0.7fr 1.1fr 48px',
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
                          key={`${material.partNumber}-${index}`}
                          sx={{
                            alignItems: 'center',
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            display: 'grid',
                            gap: 0.75,
                            gridTemplateColumns:
                              '48px 1.7fr 1fr 0.7fr 1.1fr 48px',
                            px: 1,
                            py: 0.75,
                          }}
                        >
                          <Typography sx={{ fontWeight: 900 }} variant="body2">
                            {index + 1}
                          </Typography>
                          <FormTextField
                            placeholder="Material"
                            size="small"
                            value={material.description}
                            onChange={(event) =>
                              updateMaterial(
                                index,
                                'description',
                                event.target.value,
                              )
                            }
                          />
                          <FormTextField
                            placeholder="Part Number"
                            size="small"
                            value={material.partNumber}
                            onChange={(event) =>
                              updateMaterial(
                                index,
                                'partNumber',
                                event.target.value,
                              )
                            }
                          />
                          <FormTextField
                            placeholder="Qty"
                            size="small"
                            type="number"
                            value={material.qty}
                            onChange={(event) =>
                              updateMaterial(index, 'qty', event.target.value)
                            }
                          />
                          <FormTextField
                            placeholder="SN"
                            size="small"
                            value={material.serialNumber ?? ''}
                            onChange={(event) =>
                              updateMaterial(
                                index,
                                'serialNumber',
                                event.target.value,
                              )
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
            </Stack>
          ) : null}

          {activeTab === 1 ? (
            <Stack spacing={1.25}>
              <Section title="Upload DO">
                <Stack spacing={1.25}>
                  <FieldGrid>
                    <FormTextField
                      label="AWB/SMU"
                      size="small"
                      value={formState.awbTransfer}
                      onChange={(event) =>
                        updateForm('awbTransfer', event.target.value)
                      }
                    />
                    <FormTextField
                      label="Batch"
                      size="small"
                      value={formState.batch}
                      onChange={(event) =>
                        updateForm('batch', event.target.value)
                      }
                    />
                  </FieldGrid>
                  <Box
                    sx={{
                      alignItems: 'center',
                      border: '1px dashed',
                      borderColor: uploadDisabled ? 'divider' : 'primary.main',
                      borderRadius: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      minHeight: 220,
                      p: 2,
                      textAlign: 'center',
                    }}
                  >
                    <CloudUploadRoundedIcon
                      sx={{
                        color: uploadDisabled ? 'text.disabled' : 'primary.main',
                        fontSize: 46,
                      }}
                    />
                    <Typography sx={{ fontWeight: 950 }}>
                      Upload DO Delivery
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {uploadDisabled
                        ? 'Klik action Process dari list terlebih dahulu.'
                        : 'Upload file Delivery Order untuk masuk ke Need Review DO.'}
                    </Typography>
                    <Chip
                      color={formState.uploadDoFileName ? 'success' : 'default'}
                      label={formState.uploadDoFileName || 'No file selected'}
                      variant="outlined"
                    />
                    <Button
                      component="label"
                      disabled={uploadDisabled}
                      startIcon={<CloudUploadRoundedIcon />}
                      type="button"
                      variant="contained"
                    >
                      Select File
                      <input
                        hidden
                        accept="image/*,.pdf"
                        type="file"
                        onChange={(event) => {
                          const file = event.target.files?.[0]

                          if (file) {
                            updateForm('uploadDoFileName', file.name)
                          }
                        }}
                      />
                    </Button>
                  </Box>
                </Stack>
              </Section>
            </Stack>
          ) : null}

          {activeTab === 2 ? (
            <Section title="Approval / Review DO">
              <Stack spacing={1.25}>
                <FieldGrid>
                  <FormTextField
                    label="Receive Date"
                    size="small"
                    type="datetime-local"
                    value={formState.receiveDate}
                    onChange={(event) =>
                      updateForm('receiveDate', event.target.value)
                    }
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <FormTextField
                    label="Review Time"
                    size="small"
                    type="datetime-local"
                    value={formState.reviewTime}
                    onChange={(event) =>
                      updateForm('reviewTime', event.target.value)
                    }
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <FormTextField
                    select
                    label="Status Check"
                    size="small"
                    value={formState.statusCheck}
                    onChange={(event) =>
                      updateForm('statusCheck', event.target.value)
                    }
                  >
                    <MenuItem value="Done">Done</MenuItem>
                    <MenuItem value="Revisi">Revisi</MenuItem>
                  </FormTextField>
                  <FormTextField
                    label="Current Status DO"
                    size="small"
                    value={getDeliveryOrderStatusLabel(formState.statusDo)}
                    disabled
                  />
                </FieldGrid>
                <Typography color="text.secondary" variant="body2">
                  Simpan tab ini akan mengubah DO menjadi Closed jika status check
                  Done, atau Rejected jika Revisi.
                </Typography>
              </Stack>
            </Section>
          ) : null}

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
              disabled={activeTab === 1 && uploadDisabled}
              onClick={handleSave}
              startIcon={<SaveRoundedIcon />}
              type="button"
            >
              Save {tabLabel}
            </AppButton>
          </Stack>
        </Stack>
      </LiquidPanel>
    </>
  )
}
