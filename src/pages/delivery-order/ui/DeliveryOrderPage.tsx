import {
  deliveryOrderStorage,
  deliveryOrderStatuses,
  getDeliveryOrderStatusColor,
  getDeliveryOrderStatusLabel,
  type DeliveryOrderRecord,
  type DeliveryOrderStatus,
} from '@entities/delivery-order'
import {
  spmsStorage,
  type SpmsRecord,
} from '@entities/spms'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useConfirmation } from '@shared/lib/confirmation'
import { formatDate } from '@shared/lib/format'
import { AppButton } from '@shared/ui/AppButton'
import { DataTable, type DataTableColumn } from '@shared/ui/DataTable'
import { FormTextField } from '@shared/ui/FormTextField'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import { PageHeader } from '@shared/ui/PageHeader'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type DeliveryOrderListRow = DeliveryOrderRecord & {
  displayStatus: DeliveryOrderStatus
  sourceSpms?: SpmsRecord
}

type DeliveryOrderStatusFilter = 'All' | DeliveryOrderStatus

const statusFilterOptions: DeliveryOrderStatusFilter[] = [
  'All',
  ...deliveryOrderStatuses,
]

const getStatusLabel = (status: DeliveryOrderStatusFilter) =>
  status === 'All' ? 'All' : getDeliveryOrderStatusLabel(status)

const getDerivedDeliveryOrderStatus = (
  order: DeliveryOrderRecord,
): DeliveryOrderStatus => {
  return order.statusDo
}

type ProcessFormState = {
  datePickup: string
  onDeliveryDate: string
  packaging: string
  qtyBox: string
  weight: string
}

const createProcessForm = (
  order?: DeliveryOrderRecord | null,
): ProcessFormState => ({
  datePickup: order?.datePickup ?? '',
  onDeliveryDate:
    order?.onDeliveryDate ?? new Date().toISOString().slice(0, 16),
  packaging: order?.packaging ?? '',
  qtyBox: order?.qtyBox ?? '',
  weight: order?.weight ?? '',
})

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
  const confirm = useConfirmation()
  const [orders, setOrders] = useState<DeliveryOrderRecord[]>(() =>
    deliveryOrderStorage.getAll(),
  )
  const [processTarget, setProcessTarget] =
    useState<DeliveryOrderRecord | null>(null)
  const [processForm, setProcessForm] = useState<ProcessFormState>(() =>
    createProcessForm(),
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
          order.sourceSpmsIds
            ?.map((id) => spmsById.get(id))
            .find(Boolean) ??
          (order.sourceSpmsId ? spmsById.get(order.sourceSpmsId) : undefined) ??
          order.sourceSpmsOrderNumbers
            ?.map((orderNumber) => spmsByOrderNumber.get(orderNumber))
            .find(Boolean) ??
          (order.sourceSpmsOrderNumber
            ? spmsByOrderNumber.get(order.sourceSpmsOrderNumber)
            : undefined)

        return {
          ...order,
          displayStatus: getDerivedDeliveryOrderStatus(order),
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
        (row.sourceSpmsOrderNumbers ?? [])
          .join(' ')
          .toLowerCase()
          .includes(keyword) ||
        (row.ticketNumbers ?? []).join(' ').toLowerCase().includes(keyword) ||
        (row.ticketNumber ?? '').toLowerCase().includes(keyword) ||
        (row.customer ?? '').toLowerCase().includes(keyword) ||
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
  const updateProcessForm = <Key extends keyof ProcessFormState>(
    key: Key,
    value: ProcessFormState[Key],
  ) => setProcessForm((current) => ({ ...current, [key]: value }))

  const openProcessDialog = useCallback((record: DeliveryOrderRecord) => {
    setProcessTarget(record)
    setProcessForm(createProcessForm(record))
  }, [])

  const closeProcessDialog = () => {
    setProcessTarget(null)
    setProcessForm(createProcessForm())
  }

  const handleSubmitProcess = () => {
    if (!processTarget) {
      return
    }

    const nextOrder = deliveryOrderStorage.update(processTarget.deliveryOrder, {
      datePickup: processForm.datePickup,
      onDeliveryDate: processForm.onDeliveryDate,
      packaging: processForm.packaging,
      qtyBox: processForm.qtyBox,
      statusDo: 'ON_PROGRESS',
      weight: processForm.weight,
    })

    if (nextOrder) {
      setOrders((current) =>
        current.map((order) =>
          order.deliveryOrder === nextOrder.deliveryOrder ? nextOrder : order,
        ),
      )
    }

    closeProcessDialog()
  }

  const handleReject = useCallback(async (record: DeliveryOrderRecord) => {
    const confirmed = await confirm({
      confirmLabel: 'Reject',
      description: `${record.deliveryOrder} akan ditandai Rejected tanpa masuk ke halaman detail.`,
      title: 'Reject Delivery Order?',
      tone: 'danger',
    })

    if (!confirmed) {
      return
    }

    const rejectedOrder = deliveryOrderStorage.update(record.deliveryOrder, {
      reviewTime: new Date().toISOString().slice(0, 16),
      statusCheck: 'Rejected',
      statusDo: 'REJECTED',
    })

    if (rejectedOrder) {
      setOrders((current) =>
        current.map((order) =>
          order.deliveryOrder === rejectedOrder.deliveryOrder
            ? rejectedOrder
            : order,
        ),
      )
    }
  }, [confirm])

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
        header: 'Source',
        width: 180,
        render: (record) => (
          <Box>
            {textCell(
              record.sourceSpmsOrderNumbers?.join(', ') ??
                record.sourceSpmsOrderNumber ??
                record.orderNumber ??
                (record.sourceType === 'NON_SPMS' ? 'Non-SPMS' : '-'),
            )}
            <Typography color="text.secondary" variant="caption">
              {record.sourceType === 'NON_SPMS'
                ? 'Non-SPMS'
                : record.ticketNumbers?.join(', ') || record.ticketNumber || 'SPMS'}
            </Typography>
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
        header: 'Status Delivery',
        width: 170,
        render: (record) => (
          <Chip
            color={getDeliveryOrderStatusColor(record.displayStatus)}
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
        width: 190,
        render: (record) => {
          const processDisabled = record.displayStatus !== 'OPEN'
          const rejectDisabled =
            record.displayStatus === 'CLOSED' ||
            record.displayStatus === 'REJECTED'

          return (
            <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
              <Tooltip title="View">
                <IconButton
                  aria-label={`View ${record.orderNumber}`}
                  onClick={() => navigate(`/delivery-order/${record.deliveryOrder}`)}
                  size="small"
                >
                  <VisibilityRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  processDisabled ? 'Hanya DO Open yang bisa diproses' : 'Process'
                }
              >
                <span>
                  <IconButton
                    aria-label={`Process ${record.orderNumber}`}
                    disabled={processDisabled}
                    onClick={() => openProcessDialog(record)}
                    size="small"
                  >
                    <PlayArrowRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  aria-label={`Edit ${record.orderNumber}`}
                  onClick={() =>
                    navigate(`/delivery-order/${record.deliveryOrder}/edit`)
                  }
                  size="small"
                >
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={rejectDisabled ? 'DO sudah final' : 'Reject dari list'}
              >
                <span>
                  <IconButton
                    aria-label={`Reject ${record.orderNumber}`}
                    color="error"
                    disabled={rejectDisabled}
                    onClick={() => {
                      void handleReject(record)
                    }}
                    size="small"
                  >
                    <BlockRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              {/* <Tooltip title="More">
              <IconButton aria-label={`More ${record.orderNumber}`} size="small">
                <MoreVertRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip> */}
            </Stack>
          )
        },
      },
      // {
      //   key: 'action2',
      //   header: 'Action 2',
      //   align: 'center',
      //   sticky: 'right',
      //   stickyOffset: 48,
      //   width: 190,
      //    render: (record) => {
      //     const disabled =
      //       record.kind === 'PICKUP' ||
      //       generatedPickupSources.has(record.deliveryOrder) ||
      //       record.displayStatus !== 'CLOSED'

      //     return (
      //       <Stack spacing={0.75} sx={{ alignItems: 'center' }}>
      //         <AppButton
      //           disabled={!record.sourceSpms}
      //           onClick={() => {
      //             if (record.sourceSpms) {
      //               navigate(`/spms/${record.sourceSpms.id}/edit`)
      //             }
      //           }}
      //           size="small"
      //           type="button"
      //           sx={{ minWidth: 136 }}
      //         >
      //           Review
      //         </AppButton>
      //         <Tooltip
      //           title={
      //             disabled
      //               ? 'DO pickup tersedia setelah delivery closed'
      //               : 'Generate DO pickup dari baris ini'
      //           }
      //         >
      //           <span>
      //             <AppButton
      //               disabled={disabled}
      //               onClick={() => navigate('/delivery-order/create')}
      //               size="small"
      //               startIcon={<AddTaskRoundedIcon />}
      //               type="button"
      //               variant="outlined"
      //               sx={{
      //                 background: 'transparent',
      //                 boxShadow: 'none',
      //                 minWidth: 136,
      //               }}
      //             >
      //               DO Pickup
      //             </AppButton>
      //           </span>
      //         </Tooltip>
      //       </Stack>
      //     )
      //   },
      // }
    ],
    [handleReject, navigate, openProcessDialog],
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
                  : getDeliveryOrderStatusColor(option as DeliveryOrderStatus)

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
          <FormTextField
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
      <Dialog
        fullWidth
        maxWidth="sm"
        open={Boolean(processTarget)}
        onClose={closeProcessDialog}
      >
        <DialogTitle sx={{ fontWeight: 950 }}>
          Process Delivery Order
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.25} sx={{ pt: 1 }}>
            <Typography color="text.secondary" variant="body2">
              Isi data pickup/on delivery sebelum DO masuk status On Progress.
            </Typography>
            <FormTextField
              label="On Progress Date"
              size="small"
              type="datetime-local"
              value={processForm.onDeliveryDate}
              onChange={(event) =>
                updateProcessForm('onDeliveryDate', event.target.value)
              }
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <FormTextField
              label="Date Pickup"
              size="small"
              type="datetime-local"
              value={processForm.datePickup}
              onChange={(event) =>
                updateProcessForm('datePickup', event.target.value)
              }
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Box
              sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
              }}
            >
              <FormTextField
                label="Qty Box"
                size="small"
                value={processForm.qtyBox}
                onChange={(event) =>
                  updateProcessForm('qtyBox', event.target.value)
                }
              />
              <FormTextField
                label="Weight"
                size="small"
                value={processForm.weight}
                onChange={(event) =>
                  updateProcessForm('weight', event.target.value)
                }
              />
              <FormTextField
                label="Packaging"
                size="small"
                value={processForm.packaging}
                onChange={(event) =>
                  updateProcessForm('packaging', event.target.value)
                }
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={closeProcessDialog}
            type="button"
            variant="outlined"
            sx={{ background: 'transparent', boxShadow: 'none' }}
          >
            Cancel
          </Button>
          <AppButton onClick={handleSubmitProcess} type="button">
            Submit
          </AppButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
