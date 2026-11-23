import {
  getDeliveryUploadStatus,
  getPickupUploadStatus,
  getReturnStatusColor,
  getSpmsRecordMaterials,
  getSeverityColor,
  getSpmsStatusColor,
  getTicketStatus,
  type DeliveryUploadStatus,
  type PickupUploadStatus,
  type SpmsRecord,
} from '@entities/spms'
import { SpmsTableToolbar, useSpmsList } from '@features/spms-list'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
    noWrap
    sx={{ fontSize: 'inherit', lineHeight: 1.25 }}
  >
    {value || '-'}
  </Typography>
)

const firstMaterial = (record: SpmsRecord) => getSpmsRecordMaterials(record)[0]

const getDeliveryStatusColor = (status: DeliveryUploadStatus) =>
  getSpmsStatusColor(status)

const getPickupStatusColor = (status: PickupUploadStatus) =>
  getReturnStatusColor(status)

const renderMaterialCell = (
  record: SpmsRecord,
  onMore: (event: MouseEvent<HTMLButtonElement>, record: SpmsRecord) => void,
) => {
  const materials = getSpmsRecordMaterials(record)
  const first = firstMaterial(record)

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ alignItems: 'center', minWidth: 0 }}
    >
      <Typography
        title={`${first.description} (${first.partNumber})`}
        noWrap
        sx={{
          flex: 1,
          fontSize: 'inherit',
          fontWeight: 600,
          minWidth: 0,
        }}
      >
        {first.description}
      </Typography>
      <Button
        onClick={(event) => onMore(event, record)}
        size="small"
        type="button"
        variant="outlined"
        sx={{
          borderColor: '#adb6c2',
          flexShrink: 0,
          fontSize: '0.64rem',
          minHeight: 18,
          minWidth: 0,
          px: 0.6,
          py: 0,
        }}
      >
        {materials.length > 1 ? `+${materials.length}` : 'Info'}
      </Button>
    </Stack>
  )
}

export function SpmsListPage() {
  const navigate = useNavigate()
  const {
    isLoading,
    isFetching,
    rows,
    totalMatched,
    search,
    setSearch,
    status,
    setStatus,
    statusCounts,
    statusOptions,
  } = useSpmsList()

  const handleExportCsv = useCallback(() => {
    const header = [
      'Order Number',
      'Customer',
      'Ticket Customer',
      'Request Date',
      'Area',
      'DOP',
      'Site Name',
      'Description',
      'Part Number',
      'Severity',
      'Status SPMS',
      'Status Return',
    ]
    const escapeCsv = (val: unknown) =>
      `"${String(val ?? '').replace(/"/g, '""')}"`
    const csvLines = [
      header.join(','),
      ...rows.map((r) =>
        [
          r.orderNumber,
          r.customer,
          r.customerOrderNumber,
          r.requestDate,
          r.area,
          r.dop,
          r.siteName,
          r.description,
          r.partNumber,
          r.severity,
          getTicketStatus(r),
          getPickupUploadStatus(r),
        ]
          .map(escapeCsv)
          .join(','),
      ),
    ]
    const blob = new Blob([csvLines.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `spms-export-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }, [rows])

  const [materialAnchorEl, setMaterialAnchorEl] =
    useState<HTMLButtonElement | null>(null)
  const [materialRecord, setMaterialRecord] = useState<SpmsRecord | null>(null)

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
        header: 'Order No',
        width: 118,
        render: (record) => (
          <Typography
            title={record.orderNumber}
            noWrap
            sx={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 'inherit',
              fontWeight: 600,
            }}
          >
            {record.orderNumber}
          </Typography>
        ),
      },
      {
        key: 'customer',
        header: 'Customer',
        width: 78,
        render: (record) => textCell(record.customer),
      },
      {
        key: 'customerOrderNumber',
        header: 'Ticket',
        width: 118,
        render: (record) => (
          <Typography
            title={record.customerOrderNumber}
            noWrap
            sx={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 'inherit',
            }}
          >
            {record.customerOrderNumber}
          </Typography>
        ),
      },
      {
        key: 'requestDate',
        header: 'Req Date',
        width: 82,
        render: (record) => (
          <Typography
            color="text.secondary"
            noWrap
            sx={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 'inherit',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatDate(record.requestDate)}
          </Typography>
        ),
      },
      {
        key: 'dop',
        header: 'DOP / Area',
        width: 105,
        render: (record) => textCell(record.dop || record.area),
      },
      {
        key: 'siteName',
        header: 'Site Name',
        width: 145,
        render: (record) => textCell(record.siteName),
      },
      {
        key: 'materials',
        header: 'Material',
        width: 195,
        render: (record) => renderMaterialCell(record, handleOpenMaterials),
      },
      {
        key: 'severity',
        header: 'Severity',
        width: 74,
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
        key: 'statusSpms',
        header: 'Delivery',
        width: 105,
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
        header: 'Return',
        width: 96,
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
        header: 'Ticket Status',
        width: 104,
        render: (record) => {
          const ticketStatus = getTicketStatus(record)

          return (
            <Chip
              color={getSpmsStatusColor(ticketStatus)}
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
        width: 64,
        render: (record) => (
          <Stack
            direction="row"
            spacing={0.25}
            sx={{ justifyContent: 'center' }}
          >
            <Tooltip title="View">
              <IconButton
                aria-label={`View ${record.orderNumber}`}
                onClick={(event) => {
                  event.stopPropagation()
                  navigate(`/spms/${record.id}`)
                }}
                size="small"
                sx={{ p: 0.35 }}
              >
                <VisibilityRoundedIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                aria-label={`Edit ${record.orderNumber}`}
                onClick={(event) => {
                  event.stopPropagation()
                  navigate(`/spms/${record.id}/edit`)
                }}
                size="small"
                sx={{ p: 0.35 }}
              >
                <EditRoundedIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [handleOpenMaterials, navigate],
  )

  return (
    <>
      <PageHeader
        title="SPMS List"
        subtitle="Monitoring order material, return status, dan severity."
        actions={
          <AppButton
            onClick={() => navigate('/spms/add')}
            startIcon={<AddRoundedIcon fontSize="small" />}
            sx={{ minWidth: 112 }}
          >
            Add SPMS
          </AppButton>
        }
      />
      <SpmsTableToolbar
        search={search}
        status={status}
        statusCounts={statusCounts}
        statusOptions={statusOptions}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onExport={handleExportCsv}
      />
      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(record) => record.id}
        emptyLabel="SPMS tidak ditemukan"
        loading={isLoading || isFetching}
        pagination
        initialRowsPerPage={25}
        minWidth={1120}
        onRowClick={(record) => navigate(`/spms/${record.id}`)}
        totalCountLabel={
          totalMatched > rows.length
            ? `Menampilkan ${rows.length.toLocaleString('id-ID')} dari ${totalMatched.toLocaleString('id-ID')} SPMS (gunakan search untuk menyaring)`
            : `${totalMatched.toLocaleString('id-ID')} SPMS records`
        }
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
              bgcolor: '#ffffff',
              border: '1px solid #3c4654',
              borderRadius: '2px',
              boxShadow: '0 8px 20px rgba(24, 32, 44, 0.14)',
              maxHeight: 'min(520px, calc(100svh - 120px))',
              maxWidth: 'min(820px, calc(100vw - 32px))',
              overflow: 'auto',
              p: 0,
              width: 760,
            },
          },
        }}
      >
        <Box sx={{ p: 1.5 }}>
          <Stack spacing={1.25}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700 }} variant="subtitle2">
                  Material Request
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {materialRecord?.orderNumber} — {materialRecord?.siteName}
                </Typography>
              </Box>
              <Chip
                color="primary"
                label={`${materialRows.length} item`}
                size="small"
              />
            </Stack>
            <Divider />
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 640 }}>
                <Box
                  sx={{
                    bgcolor: '#dfe5ec',
                    borderBottom: '2px solid #3c4654',
                    display: 'grid',
                    gap: 0.75,
                    gridTemplateColumns:
                      '36px 0.9fr 0.7fr 1.6fr 1.1fr 42px 1fr 1fr',
                    px: 1,
                    py: 0.65,
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
                      sx={{ fontSize: '0.7rem', fontWeight: 700 }}
                    >
                      {label}
                    </Typography>
                  ))}
                </Box>
                {materialRows.map((material, index) => (
                  <Box
                    key={`${material.partNumber}-${index}`}
                    sx={{
                      bgcolor: index % 2 === 1 ? '#f6f8fa' : '#ffffff',
                      borderBottom: '1px solid #c5cdd6',
                      display: 'grid',
                      gap: 0.75,
                      gridTemplateColumns:
                        '36px 0.9fr 0.7fr 1.6fr 1.1fr 42px 1fr 1fr',
                      px: 1,
                      py: 0.6,
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
                        sx={{
                          fontSize: '0.72rem',
                          fontWeight: valueIndex === 0 ? 700 : 500,
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {value || '-'}
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
