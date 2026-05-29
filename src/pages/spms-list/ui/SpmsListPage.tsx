import {
  getReturnStatusColor,
  getSeverityColor,
  getSpmsStatusColor,
  type SpmsRecord,
} from '@entities/spms'
import { SpmsTableToolbar, useSpmsList } from '@features/spms-list'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { formatDate } from '@shared/lib/format'
import { AppButton } from '@shared/ui/AppButton'
import { DataTable, type DataTableColumn } from '@shared/ui/DataTable'
import { PageHeader } from '@shared/ui/PageHeader'
import { useCallback, useMemo, useState } from 'react'
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

export function SpmsListPage() {
  const navigate = useNavigate()
  const { rows, search, setSearch, status, setStatus, statusOptions } =
    useSpmsList()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

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
        key: 'categoryMaterial',
        header: 'Category Material',
        width: 180,
        render: (record) => textCell(record.categoryMaterial),
      },
      {
        key: 'typeMaterial',
        header: 'Type Material',
        width: 180,
        render: (record) => textCell(record.typeMaterial),
      },
      {
        key: 'description',
        header: 'Description',
        width: 310,
        render: (record) => textCell(record.description),
      },
      {
        key: 'partNumber',
        header: 'Part Number',
        width: 160,
        render: (record) => textCell(record.partNumber),
      },
      {
        key: 'qty',
        header: 'Qty',
        align: 'right',
        width: 84,
        render: (record) => (
          <Typography variant="body2" sx={{ fontWeight: 800 }}>
            {record.qty}
          </Typography>
        ),
      },
      {
        key: 'supportOriginMaterial',
        header: 'Support Origin Material',
        width: 220,
        render: (record) => textCell(record.supportOriginMaterial),
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
        render: (record) => (
          <Chip
            color={getSpmsStatusColor(record.statusSpms)}
            label={record.statusSpms}
            size="small"
          />
        ),
      },
      {
        key: 'statusReturn',
        header: 'Status Return',
        width: 160,
        render: (record) => (
          <Chip
            color={getReturnStatusColor(record.statusReturn)}
            label={record.statusReturn}
            size="small"
            variant="outlined"
          />
        ),
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
        minWidth={3160}
      />
    </>
  )
}
