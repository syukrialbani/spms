import {
  deliveryOrderStorage,
  type DeliveryOrderMaterialItem,
} from '@entities/delivery-order'
import {
  getDeliveryUploadStatus,
  getSpmsRecordMaterials,
  getTicketStatus,
  spmsStorage,
  type SpmsRecord,
} from '@entities/spms'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useConfirmation } from '@shared/lib/confirmation'
import { formatDate } from '@shared/lib/format'
import { AppButton } from '@shared/ui/AppButton'
import { FormAutocomplete } from '@shared/ui/FormAutocomplete'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import { PageHeader } from '@shared/ui/PageHeader'
import {
  supportDestinationMaterialOptions,
  supportOriginMaterialOptions,
} from '@shared/ui/SpmsRequestForm'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type DeliveryOrderSourceMode = 'SPMS' | 'NON_SPMS'

type ManualMaterialDraft = {
  description: string
  partNumber: string
  qty: string
  serialNumber: string
}

type DeliveryOrderFormState = {
  awbTransfer: string
  datePickup: string
  doKind: 'DELIVERY' | 'PICKUP'
  expedition: string
  manualArea: string
  manualCustomer: string
  manualDop: string
  manualMaterials: ManualMaterialDraft[]
  manualOrderNumber: string
  manualRequestDate: string
  manualSeverity: string
  manualSiteName: string
  manualTicketNumber: string
  materialSerialNumbers: string[]
  packaging: string
  qtyBox: string
  service: string
  sourceMode: DeliveryOrderSourceMode
  spmsOrderNumber: string
  supportDestinationMaterial: string
  supportOriginMaterial: string
  weight: string
}

const expeditionOptions = [
  'ESATEL',
  'FIN LOGISTICS',
  'INDAH CARGO',
  'DHL',
  'JNE',
  'DLL',
] as const

const serviceOptions = [
  'LAUT',
  'UDARA',
  'HANDCARRY',
  'DARAT',
  'PORT TO PORT',
  'PICKUP RETURN',
] as const

const severityOptions = ['Low', 'Medium', 'High', 'Critical'] as const

const createEmptyMaterial = (): ManualMaterialDraft => ({
  description: '',
  partNumber: '',
  qty: '1',
  serialNumber: '',
})

const createDefaultFormState = (
  sourceMode: DeliveryOrderSourceMode = 'SPMS',
  doKind: 'DELIVERY' | 'PICKUP' = 'DELIVERY',
): DeliveryOrderFormState => ({
  awbTransfer: '',
  datePickup: '',
  doKind,
  expedition: '',
  manualArea: '',
  manualCustomer: '',
  manualDop: '',
  manualMaterials: [createEmptyMaterial()],
  manualOrderNumber: '',
  manualRequestDate: '',
  manualSeverity: '',
  manualSiteName: '',
  manualTicketNumber: '',
  materialSerialNumbers: [],
  packaging: '',
  qtyBox: '',
  service: doKind === 'PICKUP' ? 'PICKUP RETURN' : '',
  sourceMode,
  spmsOrderNumber: '',
  supportDestinationMaterial: '',
  supportOriginMaterial: '',
  weight: '',
})

function ReadOnlyField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(128, 205, 255, 0.18)'
            : 'rgba(18, 73, 126, 0.12)',
        borderRadius: 1,
        minWidth: 0,
        p: 0.85,
      }}
    >
      <Typography
        color="text.secondary"
        sx={{ fontWeight: 800 }}
        variant="caption"
      >
        {label}
      </Typography>
      <Typography
        sx={{ fontWeight: 850, mt: 0.35, overflowWrap: 'anywhere' }}
        variant="body2"
      >
        {value || '-'}
      </Typography>
    </Box>
  )
}

const getDefaultService = (record: SpmsRecord) =>
  record.severity === 'Critical' ? 'HANDCARRY' : 'PORT TO PORT'

const getDefaultPickupService = () => 'PICKUP RETURN'

const toDeliveryOrderMaterials = (
  materials: ManualMaterialDraft[],
): DeliveryOrderMaterialItem[] =>
  materials.map((material) => ({
    description: material.description,
    partNumber: material.partNumber,
    qty: Number(material.qty) > 0 ? Number(material.qty) : 1,
    serialNumber: material.serialNumber,
  }))

export function DeliveryOrderCreatePage() {
  const navigate = useNavigate()
  const confirm = useConfirmation()
  const [formState, setFormState] = useState<DeliveryOrderFormState>(
    createDefaultFormState,
  )
  const availableSpms = useMemo(
    () =>
      spmsStorage
        .getAll()
        .filter((record) =>
          formState.doKind === 'DELIVERY'
            ? getTicketStatus(record) === 'New'
            : getDeliveryUploadStatus(record) === 'Closed Delivery' &&
              record.closedStatus === 'CLOSED' &&
              record.statusTransaction !== 'ARF' &&
              !record.pickupDeliveryOrderNumber,
        ),
    [formState.doKind],
  )
  const selectedRecord = useMemo(
    () =>
      formState.sourceMode === 'SPMS'
        ? availableSpms.find(
            (record) => record.orderNumber === formState.spmsOrderNumber,
          ) ?? null
        : null,
    [availableSpms, formState.sourceMode, formState.spmsOrderNumber],
  )
  const materialRows = selectedRecord
    ? getSpmsRecordMaterials(selectedRecord)
    : []
  const hasManualMaterial = formState.manualMaterials.some(
    (material) =>
      material.description || material.partNumber || material.serialNumber,
  )
  const hasCommonSupport = Boolean(
    formState.expedition &&
      formState.service &&
      formState.supportOriginMaterial &&
      formState.supportDestinationMaterial &&
      formState.awbTransfer,
  )
  const canSave =
    formState.sourceMode === 'SPMS'
      ? Boolean(selectedRecord && hasCommonSupport)
      : Boolean(
          hasCommonSupport &&
            formState.manualCustomer &&
            formState.manualOrderNumber &&
            formState.manualArea &&
            formState.manualDop &&
            formState.manualSiteName &&
            hasManualMaterial,
        )

  const updateForm = <Key extends keyof DeliveryOrderFormState>(
    key: Key,
    value: DeliveryOrderFormState[Key],
  ) => {
    setFormState((current) => ({ ...current, [key]: value }))
  }

  const handleSelectSourceMode = (value: string) => {
    const sourceMode = value === 'NON_SPMS' ? 'NON_SPMS' : 'SPMS'

    setFormState(createDefaultFormState(sourceMode, formState.doKind))
  }

  const handleSelectKind = (value: string) => {
    setFormState(
      createDefaultFormState(
        formState.sourceMode,
        value === 'PICKUP' ? 'PICKUP' : 'DELIVERY',
      ),
    )
  }

  const handleSelectSpms = (orderNumber: string) => {
    const record = availableSpms.find((item) => item.orderNumber === orderNumber)
    const materials = record ? getSpmsRecordMaterials(record) : []
    const isPickup = formState.doKind === 'PICKUP'

    setFormState({
      ...createDefaultFormState(formState.sourceMode, formState.doKind),
      materialSerialNumbers: materials.map(
        (material) => material.serialNumber ?? '',
      ),
      service: record
        ? isPickup
          ? getDefaultPickupService()
          : getDefaultService(record)
        : '',
      spmsOrderNumber: orderNumber,
      supportDestinationMaterial:
        record && isPickup
          ? record.supportOriginMaterial
          : record?.area.toUpperCase() ?? '',
      supportOriginMaterial:
        record && isPickup
          ? record.supportDestinationMaterial ?? record.area.toUpperCase()
          : '',
    })
  }

  const handleSerialNumberChange = (index: number, value: string) => {
    setFormState((current) => {
      const materialSerialNumbers = [...current.materialSerialNumbers]

      materialSerialNumbers[index] = value

      return { ...current, materialSerialNumbers }
    })
  }

  const handleManualMaterialChange = (
    index: number,
    key: keyof ManualMaterialDraft,
    value: string,
  ) => {
    setFormState((current) => ({
      ...current,
      manualMaterials: current.manualMaterials.map((material, itemIndex) =>
        itemIndex === index ? { ...material, [key]: value } : material,
      ),
    }))
  }

  const handleAddManualMaterial = () => {
    setFormState((current) => ({
      ...current,
      manualMaterials: [...current.manualMaterials, createEmptyMaterial()],
    }))
  }

  const handleRemoveManualMaterial = (index: number) => {
    setFormState((current) => ({
      ...current,
      manualMaterials:
        current.manualMaterials.length === 1
          ? [createEmptyMaterial()]
          : current.manualMaterials.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const handleCreateDeliveryOrder = async () => {
    if (!canSave) {
      return
    }

    if (formState.sourceMode === 'SPMS') {
      if (!selectedRecord) {
        return
      }

      const confirmed = await confirm({
        confirmLabel: 'Create DO',
        description:
          formState.doKind === 'DELIVERY'
            ? `${selectedRecord.orderNumber} akan berubah ke Need Upload Delivery.`
            : `${selectedRecord.orderNumber} akan berubah ke Need Upload Pickup.`,
        title:
          formState.doKind === 'DELIVERY'
            ? 'Create DO Delivery?'
            : 'Create DO Pickup?',
      })

      if (!confirmed) {
        return
      }

      const deliveryOrder =
        formState.doKind === 'DELIVERY'
          ? deliveryOrderStorage.createFromSpms(selectedRecord, {
              awbTransfer: formState.awbTransfer,
              expedition: formState.expedition,
              materialSerialNumbers: formState.materialSerialNumbers,
              service: formState.service,
              supportDestinationMaterial: formState.supportDestinationMaterial,
              supportOriginMaterial: formState.supportOriginMaterial,
            })
          : deliveryOrderStorage.createPickupFromSpms(selectedRecord, {
              awbTransfer: formState.awbTransfer,
              expedition: formState.expedition,
              materialSerialNumbers: formState.materialSerialNumbers,
              service: formState.service,
              supportDestinationMaterial: formState.supportDestinationMaterial,
              supportOriginMaterial: formState.supportOriginMaterial,
            })

      if (formState.doKind === 'DELIVERY') {
        spmsStorage.attachDeliveryOrder(selectedRecord.id, {
          awbTransfer: formState.awbTransfer,
          deliveryOrderNumber: deliveryOrder.deliveryOrder,
          materialSerialNumbers: formState.materialSerialNumbers,
          supportDestinationMaterial: formState.supportDestinationMaterial,
          supportOriginMaterial: formState.supportOriginMaterial,
        })
      } else {
        spmsStorage.attachPickupDeliveryOrder(selectedRecord.id, {
          pickupDeliveryOrderNumber: deliveryOrder.deliveryOrder,
        })
      }

      navigate('/delivery-order')
      return
    }

    const confirmed = await confirm({
      confirmLabel: 'Create DO',
      description: 'Delivery Order non-SPMS akan dibuat dari input manual.',
      title: 'Create DO Non-SPMS?',
    })

    if (!confirmed) {
      return
    }

    deliveryOrderStorage.createStandalone({
      area: formState.manualArea,
      awbTransfer: formState.awbTransfer,
      customer: formState.manualCustomer,
      datePickup: formState.datePickup,
      dop: formState.manualDop,
      expedition: formState.expedition,
      kind: formState.doKind,
      materialSerialNumbers: formState.manualMaterials.map(
        (material) => material.serialNumber,
      ),
      materials: toDeliveryOrderMaterials(formState.manualMaterials),
      orderNumber: formState.manualOrderNumber,
      packaging: formState.packaging,
      qtyBox: formState.qtyBox,
      requestDate: formState.manualRequestDate,
      service: formState.service,
      severity: formState.manualSeverity,
      siteName: formState.manualSiteName,
      supportDestinationMaterial: formState.supportDestinationMaterial,
      supportOriginMaterial: formState.supportOriginMaterial,
      ticketNumber: formState.manualTicketNumber,
      weight: formState.weight,
    })

    navigate('/delivery-order')
  }

  const supportFields = (
    <Box
      sx={{
        display: 'grid',
        gap: 1,
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(2, minmax(0, 1fr))',
          xl: 'repeat(3, minmax(0, 1fr))',
        },
      }}
    >
      <FormAutocomplete
        accent
        label="Ekspedisi"
        name="expedition"
        options={expeditionOptions}
        required
        onChange={(value) => updateForm('expedition', value)}
        value={formState.expedition}
      />
      <FormAutocomplete
        accent
        label="Service"
        name="service"
        options={serviceOptions}
        required
        onChange={(value) => updateForm('service', value)}
        value={formState.service}
      />
      <FormAutocomplete
        accent
        label="Support Origin"
        name="supportOriginMaterial"
        options={supportOriginMaterialOptions}
        required
        onChange={(value) => updateForm('supportOriginMaterial', value)}
        value={formState.supportOriginMaterial}
      />
      <FormAutocomplete
        accent
        label="Support Destination"
        name="supportDestinationMaterial"
        options={supportDestinationMaterialOptions}
        required
        onChange={(value) => updateForm('supportDestinationMaterial', value)}
        value={formState.supportDestinationMaterial}
      />
      <TextField
        label="AWB/SMU"
        name="awbTransfer"
        required
        size="small"
        value={formState.awbTransfer}
        onChange={(event) => updateForm('awbTransfer', event.target.value)}
      />
    </Box>
  )

  return (
    <>
      <PageHeader
        title="Create Delivery Order"
        subtitle="DO bisa dibuat dari SPMS atau input manual non-SPMS."
        actions={
          <AppButton
            onClick={() => navigate('/delivery-order')}
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

      <LiquidPanel sx={{ p: { xs: 1.5, md: 2 } }}>
        <Stack spacing={1.25}>
          <Box
            sx={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1.2fr' },
            }}
          >
            <FormAutocomplete
              accent
              label="DO Source"
              name="sourceMode"
              options={['SPMS', 'NON_SPMS']}
              required
              onChange={handleSelectSourceMode}
              value={formState.sourceMode}
            />
            <FormAutocomplete
              accent
              label="DO Type"
              name="doKind"
              options={['DELIVERY', 'PICKUP']}
              required
              onChange={handleSelectKind}
              value={formState.doKind}
            />
            {formState.sourceMode === 'SPMS' ? (
              <FormAutocomplete
                accent
                label={
                  formState.doKind === 'DELIVERY'
                    ? 'Need Delivery'
                    : 'Need Pickup'
                }
                name="spmsOrderNumber"
                options={availableSpms.map((record) => record.orderNumber)}
                required
                onChange={handleSelectSpms}
                value={formState.spmsOrderNumber}
              />
            ) : (
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.75 }}
              >
                <Chip label="DO Number: Will Generate by System" variant="outlined" />
                <Chip label="Date Request: Will Generate by System" variant="outlined" />
              </Stack>
            )}
          </Box>

          {formState.sourceMode === 'SPMS' && selectedRecord ? (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    lg: 'repeat(4, minmax(0, 1fr))',
                  },
                }}
              >
                <ReadOnlyField label="Order Number" value={selectedRecord.orderNumber} />
                <ReadOnlyField label="Customer" value={selectedRecord.customer} />
                <ReadOnlyField
                  label="Ticket Number"
                  value={selectedRecord.customerOrderNumber}
                />
                <ReadOnlyField
                  label="Request Date"
                  value={formatDate(selectedRecord.requestDate)}
                />
                <ReadOnlyField label="Area" value={selectedRecord.area} />
                <ReadOnlyField label="DOP" value={selectedRecord.dop} />
                <ReadOnlyField label="Site Name" value={selectedRecord.siteName} />
                <ReadOnlyField label="Severity" value={selectedRecord.severity} />
              </Box>

              <Divider />
              {supportFields}
              <Divider />

              <Stack spacing={1}>
                <Typography sx={{ fontWeight: 900 }} variant="subtitle2">
                  Material Serial Number
                </Typography>
                <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                  <Box
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      minWidth: 760,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(10, 42, 94, 0.92)'
                            : 'rgba(231, 247, 255, 0.92)',
                        display: 'grid',
                        gap: 0.75,
                        gridTemplateColumns: '48px 1.6fr 1fr 0.7fr 1.2fr',
                        px: 1,
                        py: 0.75,
                      }}
                    >
                      {['No', 'Material', 'Part Number', 'Qty', 'Input SN'].map(
                        (label) => (
                          <Typography
                            key={label}
                            color="text.secondary"
                            sx={{ fontWeight: 900 }}
                            variant="caption"
                          >
                            {label}
                          </Typography>
                        ),
                      )}
                    </Box>
                    {materialRows.map((material, index) => (
                      <Box
                        key={`${material.partNumber}-${index}`}
                        sx={{
                          alignItems: 'center',
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          display: 'grid',
                          gap: 0.75,
                          gridTemplateColumns: '48px 1.6fr 1fr 0.7fr 1.2fr',
                          px: 1,
                          py: 0.75,
                        }}
                      >
                        <Typography sx={{ fontWeight: 900 }} variant="body2">
                          {index + 1}
                        </Typography>
                        <Typography
                          title={material.description}
                          sx={{ fontWeight: 800 }}
                          variant="body2"
                          noWrap
                        >
                          {material.description}
                        </Typography>
                        <Typography variant="body2" noWrap>
                          {material.partNumber}
                        </Typography>
                        <Typography variant="body2">{material.qty}</Typography>
                        <TextField
                          size="small"
                          value={formState.materialSerialNumbers[index] ?? ''}
                          onChange={(event) =>
                            handleSerialNumberChange(index, event.target.value)
                          }
                          placeholder="SN"
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Stack>
            </>
          ) : null}

          {formState.sourceMode === 'NON_SPMS' ? (
            <>
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
                  required
                  size="small"
                  value={formState.manualOrderNumber}
                  onChange={(event) =>
                    updateForm('manualOrderNumber', event.target.value)
                  }
                />
                <TextField
                  label="Customer"
                  required
                  size="small"
                  value={formState.manualCustomer}
                  onChange={(event) =>
                    updateForm('manualCustomer', event.target.value)
                  }
                />
                <TextField
                  label="Ticket Number"
                  size="small"
                  value={formState.manualTicketNumber}
                  onChange={(event) =>
                    updateForm('manualTicketNumber', event.target.value)
                  }
                />
                <TextField
                  label="Request Date"
                  size="small"
                  type="date"
                  value={formState.manualRequestDate}
                  onChange={(event) =>
                    updateForm('manualRequestDate', event.target.value)
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  label="Area"
                  required
                  size="small"
                  value={formState.manualArea}
                  onChange={(event) =>
                    updateForm('manualArea', event.target.value)
                  }
                />
                <TextField
                  label="DOP"
                  required
                  size="small"
                  value={formState.manualDop}
                  onChange={(event) => updateForm('manualDop', event.target.value)}
                />
                <TextField
                  label="Site Name"
                  required
                  size="small"
                  value={formState.manualSiteName}
                  onChange={(event) =>
                    updateForm('manualSiteName', event.target.value)
                  }
                />
                <FormAutocomplete
                  label="Severity"
                  name="manualSeverity"
                  options={severityOptions}
                  onChange={(value) => updateForm('manualSeverity', value)}
                  value={formState.manualSeverity}
                />
              </Box>

              <Divider />
              {supportFields}

              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(4, minmax(0, 1fr))',
                  },
                }}
              >
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
              </Box>

              <Divider />

              <Stack spacing={1}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Typography sx={{ fontWeight: 900 }} variant="subtitle2">
                    Material Serial Number
                  </Typography>
                  <Button
                    onClick={handleAddManualMaterial}
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
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(10, 42, 94, 0.92)'
                            : 'rgba(231, 247, 255, 0.92)',
                        display: 'grid',
                        gap: 0.75,
                        gridTemplateColumns: '48px 1.7fr 1fr 0.7fr 1.1fr 48px',
                        px: 1,
                        py: 0.75,
                      }}
                    >
                      {[
                        'No',
                        'Material',
                        'Part Number',
                        'Qty',
                        'Input SN',
                        '',
                      ].map((label, index) => (
                        <Typography
                          key={`${label}-${index}`}
                          color="text.secondary"
                          sx={{ fontWeight: 900 }}
                          variant="caption"
                        >
                          {label}
                        </Typography>
                      ))}
                    </Box>
                    {formState.manualMaterials.map((material, index) => (
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
                            handleManualMaterialChange(
                              index,
                              'description',
                              event.target.value,
                            )
                          }
                        />
                        <TextField
                          placeholder="Part Number"
                          size="small"
                          value={material.partNumber}
                          onChange={(event) =>
                            handleManualMaterialChange(
                              index,
                              'partNumber',
                              event.target.value,
                            )
                          }
                        />
                        <TextField
                          placeholder="Qty"
                          size="small"
                          type="number"
                          value={material.qty}
                          onChange={(event) =>
                            handleManualMaterialChange(
                              index,
                              'qty',
                              event.target.value,
                            )
                          }
                        />
                        <TextField
                          placeholder="SN"
                          size="small"
                          value={material.serialNumber}
                          onChange={(event) =>
                            handleManualMaterialChange(
                              index,
                              'serialNumber',
                              event.target.value,
                            )
                          }
                        />
                        <Tooltip title="Remove material">
                          <IconButton
                            aria-label="Remove material"
                            onClick={() => handleRemoveManualMaterial(index)}
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
            </>
          ) : null}

          {formState.sourceMode === 'SPMS' && !selectedRecord ? (
            <Box
              sx={{
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2.5,
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontWeight: 900 }}>
                Tidak ada SPMS status{' '}
                {formState.doKind === 'DELIVERY'
                  ? 'New'
                  : 'Closed Delivery yang siap pickup'}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Pilih SPMS yang sesuai flow atau gunakan sumber Non-SPMS.
              </Typography>
            </Box>
          ) : null}

          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            spacing={1}
            sx={{ justifyContent: 'flex-end' }}
          >
            <Button
              onClick={() => navigate('/delivery-order')}
              type="button"
              variant="outlined"
              sx={{ background: 'transparent', boxShadow: 'none' }}
            >
              Cancel
            </Button>
            <AppButton
              disabled={!canSave}
              onClick={() => {
                void handleCreateDeliveryOrder()
              }}
              startIcon={<SaveRoundedIcon />}
              type="button"
            >
              Create DO
            </AppButton>
          </Stack>
        </Stack>
      </LiquidPanel>
    </>
  )
}
