import { deliveryOrderStorage } from '@entities/delivery-order'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useConfirmation } from '@shared/lib/confirmation'
import { formatDate } from '@shared/lib/format'
import { AppButton } from '@shared/ui/AppButton'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import { PageHeader } from '@shared/ui/PageHeader'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

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
      <Typography
        color="text.secondary"
        sx={{ fontWeight: 800 }}
        variant="caption"
      >
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 800, mt: 0.5 }} variant="body2">
        {value || '-'}
      </Typography>
    </Box>
  )
}

export function DeliveryOrderPickupPage() {
  const navigate = useNavigate()
  const confirm = useConfirmation()
  const { deliveryOrder } = useParams()
  const sourceDeliveryOrder = deliveryOrder
    ? decodeURIComponent(deliveryOrder)
    : ''
  const draft = deliveryOrderStorage.createPickupDraft(sourceDeliveryOrder)

  if (!draft) {
    return <Navigate to="/delivery-order" replace />
  }

  const handleCreatePickup = async () => {
    const confirmed = await confirm({
      confirmLabel: 'Create DO Pickup',
      description:
        'DO pickup akan dibuat dari draft ini dan muncul di list Delivery Order.',
      title: 'Create DO Pickup?',
    })

    if (!confirmed) {
      return
    }

    deliveryOrderStorage.generatePickup(sourceDeliveryOrder)
    navigate('/delivery-order')
  }

  return (
    <>
      <PageHeader
        title="Generate DO Pickup"
        subtitle={`Data pickup diambil dari ${sourceDeliveryOrder}.`}
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
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
          >
            <Chip label="Draft DO Pickup" color="warning" variant="outlined" />
            <Chip label={draft.deliveryOrder} color="primary" />
            <Chip label={draft.statusDo} variant="outlined" />
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            }}
          >
            <ReadOnlyField label="Source DO" value={sourceDeliveryOrder} />
            <ReadOnlyField label="Delivery Order" value={draft.deliveryOrder} />
            <ReadOnlyField label="Date Request" value={formatDate(draft.dateRequest)} />
            <ReadOnlyField label="Ekspedisi" value={draft.expedition} />
            <ReadOnlyField label="Service" value={draft.service} />
            <ReadOnlyField label="Time Request" value={draft.timeRequest} />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            }}
          >
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 900 }} variant="subtitle1">
                Pickup Origin
              </Typography>
              <ReadOnlyField label="Origin" value={draft.origin} />
              <ReadOnlyField label="Origin Address" value={draft.originAddress} />
              <ReadOnlyField label="Origin PIC" value={draft.originPic} />
            </Stack>

            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 900 }} variant="subtitle1">
                Return Destination
              </Typography>
              <ReadOnlyField label="Destination" value={draft.destination} />
              <ReadOnlyField
                label="Destination Address"
                value={draft.destinationAddress}
              />
              <ReadOnlyField
                label="Destination PIC"
                value={draft.destinationPic}
              />
            </Stack>
          </Box>

          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            spacing={1}
            sx={{ justifyContent: 'flex-end' }}
          >
            <AppButton
              onClick={() => navigate('/delivery-order')}
              type="button"
              variant="outlined"
              sx={{
                background: 'transparent',
                boxShadow: 'none',
                color: 'text.secondary',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Cancel
            </AppButton>
            <AppButton
              onClick={() => {
                void handleCreatePickup()
              }}
              startIcon={<AddTaskRoundedIcon />}
              type="button"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Create DO Pickup
            </AppButton>
          </Stack>
        </Stack>
      </LiquidPanel>
    </>
  )
}
