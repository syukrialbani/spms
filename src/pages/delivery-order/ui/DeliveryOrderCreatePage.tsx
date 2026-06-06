import { deliveryOrderStorage } from '@entities/delivery-order'
import {
  getSpmsRecordMaterials,
  getTicketStatus,
  spmsStorage,
  type SpmsRecord,
} from '@entities/spms'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
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

type DeliveryOrderFormState = {
  awbTransfer: string
  expedition: string
  materialSerialNumbers: string[]
  service: string
  spmsOrderNumber: string
  supportDestinationMaterial: string
  supportOriginMaterial: string
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
] as const

const createDefaultFormState = (): DeliveryOrderFormState => ({
  awbTransfer: '',
  expedition: '',
  materialSerialNumbers: [],
  service: '',
  spmsOrderNumber: '',
  supportDestinationMaterial: '',
  supportOriginMaterial: '',
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
        p: 1.5,
      }}
    >
      <Typography color="text.secondary" sx={{ fontWeight: 800 }} variant="caption">
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 850, mt: 0.5, overflowWrap: 'anywhere' }}>
        {value || '-'}
      </Typography>
    </Box>
  )
}

const getDefaultService = (record: SpmsRecord) =>
  record.severity === 'Critical' ? 'HANDCARRY' : 'PORT TO PORT'

export function DeliveryOrderCreatePage() {
  const navigate = useNavigate()
  const confirm = useConfirmation()
  const [formState, setFormState] = useState<DeliveryOrderFormState>(
    createDefaultFormState,
  )
  const availableSpms = useMemo(
    () => spmsStorage.getAll().filter((record) => getTicketStatus(record) === 'New'),
    [],
  )
  const selectedRecord = useMemo(
    () =>
      availableSpms.find(
        (record) => record.orderNumber === formState.spmsOrderNumber,
      ) ?? null,
    [availableSpms, formState.spmsOrderNumber],
  )
  const materialRows = selectedRecord
    ? getSpmsRecordMaterials(selectedRecord)
    : []
  const canSave = Boolean(
    selectedRecord &&
      formState.expedition &&
      formState.service &&
      formState.supportOriginMaterial &&
      formState.supportDestinationMaterial &&
      formState.awbTransfer,
  )

  const updateForm = <Key extends keyof DeliveryOrderFormState>(
    key: Key,
    value: DeliveryOrderFormState[Key],
  ) => {
    setFormState((current) => ({ ...current, [key]: value }))
  }

  const handleSelectSpms = (orderNumber: string) => {
    const record = availableSpms.find((item) => item.orderNumber === orderNumber)
    const materials = record ? getSpmsRecordMaterials(record) : []

    setFormState({
      ...createDefaultFormState(),
      materialSerialNumbers: materials.map((material) => material.serialNumber ?? ''),
      service: record ? getDefaultService(record) : '',
      spmsOrderNumber: orderNumber,
      supportDestinationMaterial: record?.area.toUpperCase() ?? '',
    })
  }

  const handleSerialNumberChange = (index: number, value: string) => {
    setFormState((current) => {
      const materialSerialNumbers = [...current.materialSerialNumbers]

      materialSerialNumbers[index] = value

      return { ...current, materialSerialNumbers }
    })
  }

  const handleCreateDeliveryOrder = async () => {
    if (!selectedRecord || !canSave) {
      return
    }

    const confirmed = await confirm({
      confirmLabel: 'Create DO',
      description: `${selectedRecord.orderNumber} akan berubah ke Need Upload Delivery.`,
      title: 'Create Delivery Order?',
    })

    if (!confirmed) {
      return
    }

    const deliveryOrder = deliveryOrderStorage.createFromSpms(selectedRecord, {
      awbTransfer: formState.awbTransfer,
      expedition: formState.expedition,
      materialSerialNumbers: formState.materialSerialNumbers,
      service: formState.service,
      supportDestinationMaterial: formState.supportDestinationMaterial,
      supportOriginMaterial: formState.supportOriginMaterial,
    })

    spmsStorage.attachDeliveryOrder(selectedRecord.id, {
      awbTransfer: formState.awbTransfer,
      deliveryOrderNumber: deliveryOrder.deliveryOrder,
      materialSerialNumbers: formState.materialSerialNumbers,
      supportDestinationMaterial: formState.supportDestinationMaterial,
      supportOriginMaterial: formState.supportOriginMaterial,
    })

    navigate('/delivery-order')
  }

  return (
    <>
      <PageHeader
        title="Create Delivery Order"
        subtitle="Delivery Order dibuat dari SPMS berstatus New."
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

      <LiquidPanel sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2.5}>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
            }}
          >
            <FormAutocomplete
              accent
              label="Need Delivery"
              name="spmsOrderNumber"
              options={availableSpms.map((record) => record.orderNumber)}
              required
              onChange={handleSelectSpms}
              value={formState.spmsOrderNumber}
            />
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}
            >
              <Chip label="DO Number: Will Generate by System" variant="outlined" />
              <Chip label="Date Request: Will Generate by System" variant="outlined" />
            </Stack>
          </Box>

          {selectedRecord ? (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
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

              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
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
                  onChange={(value) =>
                    updateForm('supportDestinationMaterial', value)
                  }
                  value={formState.supportDestinationMaterial}
                />
                <TextField
                  label="AWB Transfer"
                  name="awbTransfer"
                  required
                  size="small"
                  value={formState.awbTransfer}
                  onChange={(event) =>
                    updateForm('awbTransfer', event.target.value)
                  }
                  sx={{ '& .MuiInputBase-input': { fontWeight: 750 } }}
                />
              </Box>

              <Divider />

              <Stack spacing={1.5}>
                <Typography sx={{ fontWeight: 900 }} variant="subtitle1">
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
                        gap: 1,
                        gridTemplateColumns: '56px 1.6fr 1fr 1fr 1.2fr',
                        px: 1.25,
                        py: 1,
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
                          gap: 1,
                          gridTemplateColumns: '56px 1.6fr 1fr 1fr 1.2fr',
                          px: 1.25,
                          py: 1,
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
          ) : (
            <Box
              sx={{
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontWeight: 900 }}>
                Tidak ada SPMS status New
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Buat SPMS baru atau pilih tiket yang belum memiliki Delivery Order.
              </Typography>
            </Box>
          )}

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
