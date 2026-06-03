import {
  getDeliveryUploadStatus,
  getPickupUploadStatus,
  getSpmsRecordMaterials,
  getSeverityColor,
  getTicketStatus,
  type DeliveryUploadStatus,
  type PickupUploadStatus,
  type SpmsRecord,
  type TicketStatus,
} from '@entities/spms'
import { SpmsTableToolbar, useSpmsList } from '@features/spms-list'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { formatDate } from '@shared/lib/format'
import { AppButton } from '@shared/ui/AppButton'
import { DataTable, type DataTableColumn } from '@shared/ui/DataTable'
import { PageHeader } from '@shared/ui/PageHeader'
import { useCallback, useMemo, useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

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

const firstMaterial = (record: SpmsRecord) => getSpmsRecordMaterials(record)[0]

const getDeliveryStatusColor = (status: DeliveryUploadStatus) =>
  status === 'DELIVERED' ? 'success' : 'info'

const getPickupStatusColor = (status: PickupUploadStatus) => {
  if (status === 'ROK') {
    return 'success'
  }

  if (status === 'FAULTY') {
    return 'error'
  }

  return 'info'
}

const getTicketStatusColor = (status: TicketStatus) =>
  status === 'CLOSE' ? 'success' : 'warning'

const renderMaterialCell = (
  record: SpmsRecord,
  onMore: (event: MouseEvent<HTMLButtonElement>, record: SpmsRecord) => void,
) => {
  const materials = getSpmsRecordMaterials(record)
  const first = firstMaterial(record)

  return (
    <Stack spacing={0.6} sx={{ minWidth: 0 }}>
      <Stack
        direction="row"
        spacing={0.75}
        sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5 }}
      >
        <Chip
          color="primary"
          label={materials.length}
          size="small"
          sx={{ fontWeight: 900, minWidth: 34 }}
        />
        <Button
          onClick={(event) => onMore(event, record)}
          size="small"
          type="button"
          variant="outlined"
          sx={{
            background: 'transparent',
            boxShadow: 'none',
            minHeight: 28,
            px: 1.25,
          }}
        >
          More
        </Button>
      </Stack>
      <Typography title={first.description} variant="body2" noWrap sx={{ fontWeight: 800 }}>
        {first.description}
      </Typography>
      <Typography
        color="text.secondary"
        title={`${first.typeMaterial} - ${first.partNumber}`}
        variant="caption"
        noWrap
      >
        {first.typeMaterial} - {first.partNumber}
      </Typography>
    </Stack>
  )
}

export function SpmsListPage() {
  const navigate = useNavigate()
  const { rows, search, setSearch, status, setStatus, statusOptions } =
    useSpmsList()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [materialAnchorEl, setMaterialAnchorEl] =
    useState<HTMLButtonElement | null>(null)
  const [materialRecord, setMaterialRecord] = useState<SpmsRecord | null>(null)

  const toggleSelected = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }, [])

  const toggleRows = useCallback((ids: string[]) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      const allSelected = ids.length > 0 && ids.every((id) => next.has(id))

      if (allSelected) {
        ids.forEach((id) => next.delete(id))
      } else {
        ids.forEach((id) => next.add(id))
      }

      return next
    })
  }, [])

  const handleOpenMaterials = useCallback(
    (event: MouseEvent<HTMLButtonElement>, record: SpmsRecord) => {
      event.stopPropagation()
      setMaterialAnchorEl(event.currentTarget)
      setMaterialRecord(record)
    },
    [],
  )

  const handleCloseMaterials = useCallback(() => {
    setMaterialAnchorEl(null)
    setMaterialRecord(null)
  }, [])

  const materialRows = materialRecord
    ? getSpmsRecordMaterials(materialRecord)
    : []

  const columns = useMemo<DataTableColumn<SpmsRecord>[]>(
    () => [
      {
        key: 'orderNumber',
        header: 'Order Number',
        sticky: 'left',
        stickyOffset: 0,
        width: 178,
        render: (record) => (
          <Box>
            <Typography title={record.orderNumber} noWrap sx={{ fontWeight: 800 }}>
              {record.orderNumber}
            </Typography>
            {textCell(formatDate(record.requestDate), 'secondary')}
          </Box>
        ),
      },
      {
        key: 'customer',
        header: 'Customer',
        width: 210,
        render: (record) => textCell(record.customer),
      },
      {
        key: 'customerOrderNumber',
        header: 'Customer Order Number',
        width: 200,
        render: (record) => textCell(record.customerOrderNumber),
      },
      {
        key: 'requestDate',
        header: 'Request Date',
        width: 140,
        render: (record) => textCell(formatDate(record.requestDate)),
      },
      {
        key: 'area',
        header: 'Area',
        width: 130,
        render: (record) => textCell(record.area),
      },
      {
        key: 'dop',
        header: 'Dop',
        width: 140,
        render: (record) => textCell(record.dop),
      },
      {
        key: 'siteName',
        header: 'Site Name',
        width: 180,
        render: (record) => textCell(record.siteName),
      },
      {
        key: 'materials',
        header: 'Material',
        width: 380,
        nowrap: false,
        cellSx: { verticalAlign: 'top' },
        render: (record) => renderMaterialCell(record, handleOpenMaterials),
      },
      {
        key: 'severity',
        header: 'Severity',
        width: 130,
        render: (record) => (
          <Chip
            color={getSeverityColor(record.severity)}
            label={record.severity}
            size="small"
            variant="outlined"
          />
        ),
      },
      {
        key: 'site',
        header: 'Site',
        width: 130,
        render: (record) => textCell(record.site),
      },
      {
        key: 'statusSpms',
        header: 'Status Spms',
        width: 170,
        render: (record) => {
          const deliveryStatus = getDeliveryUploadStatus(record)

          return (
            <Chip
              color={getDeliveryStatusColor(deliveryStatus)}
              label={deliveryStatus}
              size="small"
            />
          )
        },
      },
      {
        key: 'statusReturn',
        header: 'Status Return',
        width: 160,
        render: (record) => {
          const pickupStatus = getPickupUploadStatus(record)

          return (
            <Chip
              color={getPickupStatusColor(pickupStatus)}
              label={pickupStatus}
              size="small"
              variant="outlined"
            />
          )
        },
      },
      {
        key: 'statusTicket',
        header: 'Status Ticket',
        width: 150,
        render: (record) => {
          const ticketStatus = getTicketStatus(record)

          return (
            <Chip
              color={getTicketStatusColor(ticketStatus)}
              label={ticketStatus}
              size="small"
              variant="outlined"
            />
          )
        },
      },
      {
        key: 'action',
        header: 'Action',
        align: 'center',
        sticky: 'right',
        stickyOffset: 72,
        width: 100,
        render: (record) => (
          <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
            <Tooltip title="View">
              <IconButton
                aria-label={`View ${record.orderNumber}`}
                onClick={() => navigate(`/spms/${record.id}`)}
                size="small"
              >
                <VisibilityRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                aria-label={`Edit ${record.orderNumber}`}
                onClick={() => navigate(`/spms/${record.id}/edit`)}
                size="small"
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="More">
              <IconButton aria-label={`More ${record.orderNumber}`} size="small">
                <MoreVertRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip> */}
          </Stack>
        ),
      },
      {
        key: 'checkbox',
        header: ({ visibleRows }) => {
          const pageRowIds = visibleRows.map((record) => record.id)
          const allPageSelected =
            pageRowIds.length > 0 &&
            pageRowIds.every((id) => selectedIds.has(id))
          const somePageSelected = pageRowIds.some((id) => selectedIds.has(id))

          return (
            <Checkbox
              checked={allPageSelected}
              disabled={!pageRowIds.length}
              indeterminate={!allPageSelected && somePageSelected}
              onChange={() => toggleRows(pageRowIds)}
              size="small"
              slotProps={{
                input: { 'aria-label': 'Select all visible SPMS rows' },
              }}
            />
          )
        },
        align: 'center',
        sticky: 'right',
        stickyOffset: 0,
        width: 72,
        render: (record) => (
          <Checkbox
            checked={selectedIds.has(record.id)}
            onChange={() => toggleSelected(record.id)}
            size="small"
            slotProps={{
              input: { 'aria-label': `Select ${record.orderNumber}` },
            }}
          />
        ),
      },
    ],
    [
      handleOpenMaterials,
      navigate,
      selectedIds,
      toggleSelected,
      toggleRows,
    ],
  )

  return (
    <>
      <PageHeader
        title="SPMS List"
        subtitle="Monitoring order material, return status, dan severity."
        actions={
          <AppButton
            onClick={() => navigate('/spms/add')}
            startIcon={<AddRoundedIcon />}
            sx={{ minWidth: 128 }}
          >
            Add SPMS
          </AppButton>
        }
      />
      <SpmsTableToolbar
        search={search}
        status={status}
        statusOptions={statusOptions}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />
      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(record) => record.id}
        emptyLabel="SPMS tidak ditemukan"
        pagination
        initialRowsPerPage={10}
        minWidth={2550}
      />
      <Popover
        anchorEl={materialAnchorEl}
        open={Boolean(materialAnchorEl && materialRecord)}
        onClose={handleCloseMaterials}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        slotProps={{
          paper: {
            sx: {
              backdropFilter: 'none',
              backgroundImage: 'none',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? theme.palette.background.paper
                  : theme.palette.common.white,
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(128, 205, 255, 0.22)'
                  : 'rgba(18, 73, 126, 0.14)',
              borderRadius: 1,
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 18px 44px rgba(0, 8, 20, 0.58)'
                  : '0 18px 44px rgba(12, 67, 122, 0.18)',
              maxHeight: 'min(620px, calc(100svh - 120px))',
              maxWidth: 'min(920px, calc(100vw - 32px))',
              overflow: 'auto',
              p: 0,
              width: 820,
            },
          },
        }}
      >
        <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Stack spacing={1.5}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                rowGap: 1,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 900 }} variant="subtitle1">
                  Material Request
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {materialRecord?.orderNumber ?? '-'}
                </Typography>
              </Box>
              <Chip
                color="primary"
                label={`${materialRows.length} material`}
                variant="outlined"
              />
            </Stack>
            <Divider />
            <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(128, 205, 255, 0.16)'
                      : 'rgba(18, 73, 126, 0.12)',
                  borderRadius: 1,
                  minWidth: 920,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(10, 42, 94, 0.96)'
                        : 'rgba(231, 247, 255, 1)',
                    display: 'grid',
                    gap: 1,
                    gridTemplateColumns:
                      '52px 1.15fr 1fr 1.45fr 1fr 60px 1.2fr 1.2fr',
                    px: 1.25,
                    py: 1,
                  }}
                >
                  {[
                    'No',
                    'Category',
                    'Type',
                    'Description',
                    'Part Number',
                    'Qty',
                    'Origin',
                    'Destination',
                  ].map((label) => (
                    <Typography
                      key={label}
                      color="text.secondary"
                      sx={{ fontWeight: 900 }}
                      variant="caption"
                    >
                      {label}
                    </Typography>
                  ))}
                </Box>
                {materialRows.map((material, index) => (
                  <Box
                    key={`${material.partNumber}-${index}`}
                    sx={{
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? theme.palette.background.default
                          : theme.palette.common.white,
                      borderTop: '1px solid',
                      borderTopColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(128, 205, 255, 0.12)'
                          : 'rgba(18, 73, 126, 0.08)',
                      display: 'grid',
                      gap: 1,
                      gridTemplateColumns:
                        '52px 1.15fr 1fr 1.45fr 1fr 60px 1.2fr 1.2fr',
                      px: 1.25,
                      py: 1,
                    }}
                  >
                    {[
                      String(index + 1),
                      material.categoryMaterial,
                      material.typeMaterial,
                      material.description,
                      material.partNumber,
                      String(material.qty),
                      material.supportOriginMaterial,
                      material.supportDestinationMaterial ??
                        materialRecord?.area ??
                        '-',
                    ].map((value, valueIndex) => (
                      <Typography
                        key={`${value}-${valueIndex}`}
                        title={value}
                        variant="body2"
                        sx={{
                          fontWeight: valueIndex === 0 ? 900 : 700,
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {value}
                      </Typography>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Stack>
        </Box>
      </Popover>
    </>
  )
}
