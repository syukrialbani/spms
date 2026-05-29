import {
  deliveryOrderStorage,
  type DeliveryOrderRecord,
  type DeliveryOrderStatus,
} from '@entities/delivery-order'
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { formatDate } from '@shared/lib/format'
import { AppButton } from '@shared/ui/AppButton'
import { DataTable, type DataTableColumn } from '@shared/ui/DataTable'
import { PageHeader } from '@shared/ui/PageHeader'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const getStatusColor = (status: DeliveryOrderStatus) => {
  if (status === 'CLOSED') {
    return 'success'
  }

  if (status === 'PICKUP GENERATED') {
    return 'warning'
  }

  if (status === 'DELIVERY PROCESS') {
    return 'info'
  }

  return 'default'
}

const textCell = (value: string, color: 'primary' | 'secondary' = 'primary') => (
  <Typography
    color={color === 'primary' ? 'text.primary' : 'text.secondary'}
    title={value}
    variant="body2"
    noWrap
  >
    {value}
  </Typography>
)

const multilineCell = (value: string) => (
  <Typography
    color="text.primary"
    title={value}
    variant="body2"
    sx={{
      display: '-webkit-box',
      lineHeight: 1.35,
      overflow: 'hidden',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 3,
    }}
  >
    {value}
  </Typography>
)

export function DeliveryOrderPage() {
  const navigate = useNavigate()
  const [rows] = useState<DeliveryOrderRecord[]>(() =>
    deliveryOrderStorage.getAll(),
  )

  const generatedPickupSources = useMemo(
    () =>
      new Set(
        rows
          .filter((row) => row.kind === 'PICKUP' && row.sourceDeliveryOrder)
          .map((row) => row.sourceDeliveryOrder),
      ),
    [rows],
  )

  const openPickupGenerator = useCallback(
    (record: DeliveryOrderRecord) => {
      navigate(
        `/delivery-order/generate-pickup/${encodeURIComponent(
          record.deliveryOrder,
        )}`,
      )
    },
    [navigate],
  )

  const columns = useMemo<DataTableColumn<DeliveryOrderRecord>[]>(
    () => [
      {
        key: 'deliveryOrder',
        header: 'Delivery Order',
        sticky: 'left',
        stickyOffset: 0,
        width: 190,
        render: (record) => (
          <Box>
            <Typography noWrap sx={{ fontWeight: 900 }} title={record.deliveryOrder}>
              {record.deliveryOrder}
            </Typography>
            <Chip
              label={record.kind === 'PICKUP' ? 'DO Pickup' : 'DO Delivery'}
              size="small"
              color={record.kind === 'PICKUP' ? 'warning' : 'primary'}
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Box>
        ),
      },
      {
        key: 'expedition',
        header: 'Ekspedisi',
        width: 150,
        render: (record) => textCell(record.expedition),
      },
      {
        key: 'dateRequest',
        header: 'Date Request',
        width: 142,
        render: (record) => (
          <Box>
            {textCell(formatDate(record.dateRequest))}
            {textCell(record.timeRequest, 'secondary')}
          </Box>
        ),
      },
      {
        key: 'statusDo',
        header: 'Status DO',
        width: 170,
        render: (record) => (
          <Chip
            color={getStatusColor(record.statusDo)}
            label={record.statusDo}
            size="small"
            variant="outlined"
          />
        ),
      },
      {
        key: 'service',
        header: 'Service',
        width: 150,
        render: (record) => textCell(record.service),
      },
      {
        key: 'origin',
        header: 'Origin',
        width: 190,
        render: (record) => textCell(record.origin),
      },
      {
        key: 'originAddress',
        header: 'Origin Address',
        width: 300,
        nowrap: false,
        render: (record) => multilineCell(record.originAddress),
      },
      {
        key: 'originPic',
        header: 'Origin PIC',
        width: 220,
        render: (record) => textCell(record.originPic),
      },
      {
        key: 'destination',
        header: 'Destination',
        width: 190,
        render: (record) => textCell(record.destination),
      },
      {
        key: 'destinationAddress',
        header: 'Destination Address',
        width: 330,
        nowrap: false,
        render: (record) => multilineCell(record.destinationAddress),
      },
      {
        key: 'destinationPic',
        header: 'Destination PIC',
        width: 220,
        render: (record) => textCell(record.destinationPic),
      },
      {
        key: 'action',
        header: 'Action',
        align: 'center',
        sticky: 'right',
        stickyOffset: 0,
        width: 176,
        render: (record) => {
          const disabled =
            record.kind === 'PICKUP' ||
            generatedPickupSources.has(record.deliveryOrder)

          return (
            <Tooltip
              title={
                disabled
                  ? 'DO pickup sudah tersedia'
                  : 'Generate DO pickup dari baris ini'
              }
            >
              <span>
                <AppButton
                  disabled={disabled}
                  onClick={() => openPickupGenerator(record)}
                  size="small"
                  startIcon={<AddTaskRoundedIcon />}
                  type="button"
                  sx={{ minWidth: 142 }}
                >
                  DO Pickup
                </AppButton>
              </span>
            </Tooltip>
          )
        },
      },
    ],
    [generatedPickupSources, openPickupGenerator],
  )

  return (
    <>
      <PageHeader
        title="Delivery Order"
        subtitle="List DO otomatis dari create SPMS dan generate DO pickup."
        actions={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Chip
              icon={<LocalShippingRoundedIcon />}
              label={`${rows.length} DO`}
              variant="outlined"
            />
          </Stack>
        }
      />
      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(record) => record.id}
        emptyLabel="Delivery order belum tersedia"
        minWidth={2728}
      />
    </>
  )
}
