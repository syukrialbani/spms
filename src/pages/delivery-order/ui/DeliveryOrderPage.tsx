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
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { formatDate } from '@shared/lib/format'
import { AppButton } from '@shared/ui/AppButton'
import { DataTable, type DataTableColumn } from '@shared/ui/DataTable'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import { PageHeader } from '@shared/ui/PageHeader'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type DeliveryOrderListRow = DeliveryOrderRecord & {
  displayStatus: DeliveryOrderStatus
  sourceSpms?: SpmsRecord
}

type DeliveryOrderStatusFilter = 'All' | DeliveryOrderStatus

const statusLabels: Record<DeliveryOrderStatus, string> = {
  CLOSED: 'Closed',
  PICKUP_GENERATED: 'Pickup Generated',
  WAITING_APPROVAL_DO: 'Waiting Approval DO',
  WAITING_UPLOAD_DO: 'Waiting Upload DO',
}

const statusFilterOptions: DeliveryOrderStatusFilter[] = [
  'All',
  'WAITING_UPLOAD_DO',
  'WAITING_APPROVAL_DO',
  'CLOSED',
  'PICKUP_GENERATED',
]

const getStatusLabel = (status: DeliveryOrderStatusFilter) =>
  status === 'All' ? 'All' : statusLabels[status]

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

const getDerivedDeliveryOrderStatus = (
  order: DeliveryOrderRecord,
  sourceSpms: SpmsRecord | undefined,
): DeliveryOrderStatus => {
  if (order.kind === 'PICKUP') {
    return sourceSpms && getPickupUploadStatus(sourceSpms) === 'Closed'
      ? 'CLOSED'
      : 'PICKUP_GENERATED'
  }

  if (!sourceSpms) {
    return order.statusDo
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
  const [orders] = useState<DeliveryOrderRecord[]>(() =>
    deliveryOrderStorage.getAll(),
  )
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<DeliveryOrderStatusFilter>('All')
  const spmsRecords = useMemo(() => spmsStorage.getAll(), [])
  const spmsById = useMemo(
    () => new Map(spmsRecords.map((record) => [record.id, record])),
    [spmsRecords],
  )
  const spmsByOrderNumber = useMemo(
    () => new Map(spmsRecords.map((record) => [record.orderNumber, record])),
    [spmsRecords],
  )
  const allRows = useMemo<DeliveryOrderListRow[]>(
    () =>
      orders.map((order) => {
        const sourceSpms =
          (order.sourceSpmsId ? spmsById.get(order.sourceSpmsId) : undefined) ??
          (order.sourceSpmsOrderNumber
            ? spmsByOrderNumber.get(order.sourceSpmsOrderNumber)
            : undefined)

        return {
          ...order,
          displayStatus: getDerivedDeliveryOrderStatus(order, sourceSpms),
          sourceSpms,
        }
      }),
    [orders, spmsById, spmsByOrderNumber],
  )
  const rows = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return allRows.filter((row) => {
      const matchesStatus =
        statusFilter === 'All' || row.displayStatus === statusFilter
      const matchesSearch =
        !keyword ||
        row.deliveryOrder.toLowerCase().includes(keyword) ||
        row.expedition.toLowerCase().includes(keyword) ||
        row.service.toLowerCase().includes(keyword) ||
        row.origin.toLowerCase().includes(keyword) ||
        row.destination.toLowerCase().includes(keyword) ||
        (row.sourceSpmsOrderNumber ?? '').toLowerCase().includes(keyword) ||
        getStatusLabel(row.displayStatus).toLowerCase().includes(keyword)

      return matchesStatus && matchesSearch
    })
  }, [allRows, search, statusFilter])
  const statusCounts = useMemo(
    () =>
      statusFilterOptions.reduce(
        (result, status) => ({
          ...result,
          [status]:
            status === 'All'
              ? allRows.length
              : allRows.filter((row) => row.displayStatus === status).length,
        }),
        {} as Record<DeliveryOrderStatusFilter, number>,
      ),
    [allRows],
  )

  const generatedPickupSources = useMemo(
    () =>
      new Set(
        allRows
          .filter((row) => row.kind === 'PICKUP' && row.sourceDeliveryOrder)
          .map((row) => row.sourceDeliveryOrder),
      ),
    [allRows],
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

  const columns = useMemo<DataTableColumn<DeliveryOrderListRow>[]>(
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
        key: 'sourceSpmsOrderNumber',
        header: 'SPMS',
        width: 180,
        render: (record) => textCell(record.sourceSpmsOrderNumber ?? '-'),
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
        header: 'Status Delivery',
        width: 170,
        render: (record) => (
          <Chip
            color={getStatusColor(record.displayStatus)}
            label={getStatusLabel(record.displayStatus)}
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
            generatedPickupSources.has(record.deliveryOrder) ||
            record.displayStatus !== 'CLOSED'

          return (
            <Stack spacing={0.75} sx={{ alignItems: 'center' }}>
              <AppButton
                disabled={!record.sourceSpms}
                onClick={() => {
                  if (record.sourceSpms) {
                    navigate(`/spms/${record.sourceSpms.id}/edit`)
                  }
                }}
                size="small"
                type="button"
                sx={{ minWidth: 128 }}
              >
                Review
              </AppButton>
              <Tooltip
                title={
                  disabled
                    ? 'DO pickup tersedia setelah delivery closed'
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
                    variant="outlined"
                    sx={{
                      background: 'transparent',
                      boxShadow: 'none',
                      minWidth: 128,
                    }}
                  >
                    DO Pickup
                  </AppButton>
                </span>
              </Tooltip>
            </Stack>
          )
        },
      },
    ],
    [generatedPickupSources, navigate, openPickupGenerator],
  )

  return (
    <>
      <PageHeader
        title="Delivery Order"
        subtitle="Monitoring delivery order dari SPMS dan pickup return."
        actions={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Chip
              icon={<LocalShippingRoundedIcon />}
              label={`${allRows.length} DO`}
              variant="outlined"
            />
            <AppButton
              onClick={() => navigate('/delivery-order/create')}
              startIcon={<AddRoundedIcon />}
              type="button"
            >
              Create Delivery Order
            </AppButton>
          </Stack>
        }
      />
      <LiquidPanel sx={{ mb: 2, p: { xs: 1.5, sm: 2 } }}>
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: 'wrap', rowGap: 1 }}
          >
            {statusFilterOptions.map((option) => {
              const selected = statusFilter === option
              const color =
                option === 'All'
                  ? 'default'
                  : getStatusColor(option as DeliveryOrderStatus)

              return (
                <Chip
                  key={option}
                  color={color}
                  label={`${getStatusLabel(option)} (${statusCounts[option]})`}
                  onClick={() => setStatusFilter(option)}
                  size="small"
                  variant={selected ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: selected ? 900 : 750,
                    minWidth: 132,
                  }}
                />
              )
            })}
          </Stack>
          <TextField
            fullWidth
            placeholder="Search delivery order, SPMS, expedition, origin..."
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </LiquidPanel>
      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(record) => record.id}
        emptyLabel="Delivery order belum tersedia"
        minWidth={2860}
      />
    </>
  )
}
