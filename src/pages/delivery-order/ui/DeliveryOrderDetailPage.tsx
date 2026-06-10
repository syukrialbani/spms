import {
  deliveryOrderStorage,
  type DeliveryOrderRecord,
  type DeliveryOrderStatus,
} from '@entities/delivery-order'
import {
  getDeliveryUploadStatus,
  getPickupUploadStatus,
  spmsStorage,
  type SpmsRecord,
} from '@entities/spms'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { formatDate } from '@shared/lib/format'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import { PageHeader } from '@shared/ui/PageHeader'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

type DetailItem = {
  label: string
  value: string
}

const statusLabels: Record<DeliveryOrderStatus, string> = {
  CLOSED: 'Closed',
  PICKUP_GENERATED: 'Pickup Generated',
  WAITING_APPROVAL_DO: 'Waiting Approval DO',
  WAITING_UPLOAD_DO: 'Waiting Upload DO',
}

const getStatusColor = (status: DeliveryOrderStatus) => {
  if (status === 'CLOSED') {
    return 'success'
  }

  if (status === 'PICKUP_GENERATED') {
    return 'warning'
  }

  if (status === 'WAITING_APPROVAL_DO') {
    return 'info'
  }

  return 'secondary'
}

const getDerivedStatus = (
  order: DeliveryOrderRecord,
  sourceSpms?: SpmsRecord,
): DeliveryOrderStatus => {
  if (!sourceSpms) {
    return order.statusDo
  }

  if (order.kind === 'PICKUP') {
    const pickupStatus = getPickupUploadStatus(sourceSpms)

    if (pickupStatus === 'Closed' || pickupStatus === 'Closed Pickup') {
      return 'CLOSED'
    }

    if (
      pickupStatus === 'Waiting Approval Pickup' ||
      pickupStatus === 'Waiting Review Pickup'
    ) {
      return 'WAITING_APPROVAL_DO'
    }

    return 'WAITING_UPLOAD_DO'
  }

  const deliveryStatus = getDeliveryUploadStatus(sourceSpms)

  if (deliveryStatus === 'Closed Delivery') {
    return 'CLOSED'
  }

  if (
    deliveryStatus === 'Waiting Approval Delivery' ||
    deliveryStatus === 'Waiting Review Delivery'
  ) {
    return 'WAITING_APPROVAL_DO'
  }

  return 'WAITING_UPLOAD_DO'
}

const displayDate = (value?: string) => {
  if (!value) {
    return '-'
  }

  return formatDate(value)
}

const displayDateTime = (value?: string) => {
  if (!value) {
    return '-'
  }

  return value.replace('T', ' ')
}

function DetailSection({
  columns = 3,
  items,
  title,
}: {
  columns?: 2 | 3
  items: DetailItem[]
  title: string
}) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 0.5,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 0.75,
          py: 0.45,
        }}
      >
        <Typography sx={{ fontStyle: 'italic', fontWeight: 900 }} variant="body2">
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md:
              columns === 2
                ? 'repeat(2, minmax(0, 1fr))'
                : 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        {items.map((item) => (
          <Box
            key={item.label}
            sx={{
              minWidth: 0,
              px: 0.75,
              py: 0.55,
            }}
          >
            <Typography sx={{ fontWeight: 950 }} variant="subtitle2">
              {item.label}
            </Typography>
            <Typography
              sx={{ overflowWrap: 'anywhere' }}
              variant="body2"
            >
              {item.value || '-'}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function UploadPreview({ fileName }: { fileName?: string }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        minHeight: 360,
        p: 1,
      }}
    >
      <Stack spacing={0.75} sx={{ height: '100%' }}>
        <Typography sx={{ fontWeight: 950, textAlign: 'center' }} variant="h6">
          DELIVERY ORDER
        </Typography>
        <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="caption">
          {fileName || 'Belum upload file DO'}
        </Typography>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            display: 'grid',
            flex: 1,
            gridTemplateColumns: '0.5fr 1.6fr 0.6fr 1fr',
            mt: 1,
          }}
        >
          {Array.from({ length: 64 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                minHeight: 14,
                opacity: index < 4 ? 0.9 : 0.45,
              }}
            />
          ))}
        </Box>
      </Stack>
    </Box>
  )
}

export function DeliveryOrderDetailPage() {
  const navigate = useNavigate()
  const { deliveryOrder } = useParams()
  const order = deliveryOrder
    ? deliveryOrderStorage.getByDeliveryOrder(deliveryOrder)
    : null

  if (!order) {
    return <Navigate to="/delivery-order" replace />
  }

  const sourceSpms =
    spmsStorage
      .getAll()
      .find(
        (record) =>
          record.id === order.sourceSpmsId ||
          record.orderNumber === order.sourceSpmsOrderNumber,
      ) ?? undefined
  const displayStatus = getDerivedStatus(order, sourceSpms)
  const materials =
    order.materials?.length
      ? order.materials
      : (order.materialSerialNumbers ?? []).map((serialNumber, index) => ({
          description: `Material ${index + 1}`,
          partNumber: '-',
          qty: 1,
          serialNumber,
        }))
  const orderNumber =
    order.orderNumber || order.sourceSpmsOrderNumber || sourceSpms?.orderNumber || '-'

  return (
    <>
      <PageHeader
        title="Delivery Order Detail"
        subtitle={`${order.deliveryOrder} - ${statusLabels[displayStatus]}`}
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              onClick={() => navigate('/delivery-order')}
              startIcon={<ArrowBackRoundedIcon />}
              variant="outlined"
              sx={{ background: 'transparent', boxShadow: 'none' }}
            >
              Back
            </Button>
            <Button
              onClick={() => navigate(`/delivery-order/${order.deliveryOrder}/edit`)}
              startIcon={<EditRoundedIcon />}
              variant="contained"
            >
              Edit
            </Button>
          </Stack>
        }
      />

      <LiquidPanel sx={{ p: { xs: 1, md: 1.25 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1fr) 300px' },
          }}
        >
          <Stack
            spacing={1}
            sx={{
              maxHeight: { xl: 'calc(100vh - 150px)' },
              minWidth: 0,
              overflow: { xl: 'auto' },
              pr: { xl: 0.5 },
            }}
          >
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0.5,
                p: 1,
              }}
            >
              <Typography sx={{ fontWeight: 950 }} variant="h5">
                {order.deliveryOrder}
              </Typography>
              <Typography sx={{ fontStyle: 'italic', fontWeight: 850 }} variant="body2">
                {order.origin} - {order.destination}
              </Typography>
              <Chip
                color={getStatusColor(displayStatus)}
                label={statusLabels[displayStatus]}
                size="small"
                sx={{ mt: 1 }}
                variant="outlined"
              />
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 950 }} variant="subtitle1">
                  Order Number
                </Typography>
                <Typography variant="body2">{orderNumber}</Typography>
              </Box>
            </Box>

            <DetailSection
              title="Detail Request"
              items={[
                { label: 'Req Date', value: displayDate(order.requestDate || order.dateRequest) },
                { label: 'Area', value: order.area || sourceSpms?.area || '-' },
                { label: 'Site Name', value: order.siteName || sourceSpms?.siteName || '-' },
                { label: 'Operator', value: order.customer || sourceSpms?.customer || '-' },
                { label: 'DOP', value: order.dop || sourceSpms?.dop || '-' },
                { label: 'Region', value: sourceSpms?.regional || '-' },
              ]}
            />

            <DetailSection
              title="Detail Support"
              items={[
                { label: 'Ekspedisi', value: order.expedition },
                { label: 'Service', value: order.service },
                { label: 'Awb/SMU', value: order.awbTransfer ?? '-' },
                { label: 'Support Origin', value: order.origin },
                { label: 'Destination Origin', value: order.destination },
                { label: 'Batch', value: order.batch ?? '-' },
              ]}
            />

            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0.5,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gap: 0.75,
                  gridTemplateColumns: '48px 1.8fr 1fr 0.7fr 1fr',
                  px: 0.75,
                  py: 0.55,
                }}
              >
                {['No', 'Material', 'Part Number', 'Qty', 'Input SN'].map(
                  (label) => (
                    <Typography
                      key={label}
                      sx={{ fontWeight: 950 }}
                      variant="caption"
                    >
                      {label}
                    </Typography>
                  ),
                )}
              </Box>
              {materials.map((material, index) => (
                <Box
                  key={`${material.partNumber}-${index}`}
                  sx={{
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'grid',
                    gap: 0.75,
                    gridTemplateColumns: '48px 1.8fr 1fr 0.7fr 1fr',
                    px: 0.75,
                    py: 0.55,
                  }}
                >
                  <Typography variant="body2">{index + 1}</Typography>
                  <Typography variant="body2">{material.description}</Typography>
                  <Typography variant="body2">{material.partNumber}</Typography>
                  <Typography variant="body2">{material.qty}</Typography>
                  <Typography variant="body2">{material.serialNumber || '-'}</Typography>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0.5,
                display: 'grid',
                gap: 0.75,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '1.5fr repeat(3, minmax(0, 1fr))',
                },
                p: 1,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 950 }} variant="subtitle2">
                  DATE PICKUP
                </Typography>
                <Typography variant="body2">{displayDateTime(order.datePickup)}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 950 }} variant="subtitle2">
                  QTY BOX
                </Typography>
                <Typography variant="body2">{order.qtyBox || '-'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 950 }} variant="subtitle2">
                  WEIGHT
                </Typography>
                <Typography variant="body2">{order.weight || '-'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 950 }} variant="subtitle2">
                  Packaging
                </Typography>
                <Typography variant="body2">{order.packaging || '-'}</Typography>
              </Box>
            </Box>
          </Stack>

          <Stack
            spacing={1}
            sx={{
              alignSelf: 'start',
              position: { xl: 'sticky' },
              top: { xl: 16 },
            }}
          >
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0.5,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  py: 0.75,
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 950 }} variant="h6">
                  Upload DO
                </Typography>
              </Box>
              <UploadPreview fileName={order.uploadDoFileName} />
            </Box>

            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0.5,
                p: 1,
              }}
            >
              <Typography sx={{ fontWeight: 950 }} variant="subtitle2">
                Receive Date
              </Typography>
              <Typography sx={{ mb: 1 }} variant="body2">
                {displayDateTime(order.receiveDate)}
              </Typography>
              <Typography sx={{ fontWeight: 950 }} variant="subtitle2">
                Review Time
              </Typography>
              <Typography sx={{ mb: 1 }} variant="body2">
                {displayDateTime(order.reviewTime)}
              </Typography>
              <Typography sx={{ fontWeight: 950 }} variant="subtitle2">
                Status Check
              </Typography>
              <Typography variant="body2">
                {order.statusCheck || statusLabels[displayStatus]}
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(82, 197, 242, 0.12)'
                    : 'rgba(18, 73, 126, 0.12)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0.5,
                p: 2,
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontWeight: 950 }} variant="h6">
                {statusLabels[displayStatus]}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </LiquidPanel>
    </>
  )
}
