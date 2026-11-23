import {
  useStockListQuery,
  useStockLspsQuery,
  useStockMutations,
  type StockItem,
} from '@entities/stock'
import { useAuth } from '@features/auth'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import TablePagination from '@mui/material/TablePagination'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useConfirmation } from '@shared/lib/confirmation'
import { AppButton } from '@shared/ui/AppButton'
import { DataTable, type DataTableColumn } from '@shared/ui/DataTable'
import { FormTextField } from '@shared/ui/FormTextField'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import { PageHeader } from '@shared/ui/PageHeader'
import { useState } from 'react'
import {
  AllocateSubModuleDialog,
  CreateStockDialog,
  StockDetailDialog,
} from './StockDialogs'

const adminRoles = new Set(['SUPER_ADMIN', 'ADMIN_1', 'ADMIN_2', 'ADMIN_3'])

const statusColor = (status: string) => {
  if (status === 'AVAILABLE') return 'success'
  if (status === 'ALLOCATED') return 'info'
  if (status === 'USED') return 'warning'
  return 'error'
}

const labelColor = (label: string) => {
  if (label === 'COMPLETE') return 'success'
  if (label === 'NOT_COMPLETE') return 'error'
  return 'default'
}

export function StockPage() {
  const { session } = useAuth()
  const confirm = useConfirmation()
  const isAdmin = Boolean(session?.role && adminRoles.has(session.role))

  const [categoryTab, setCategoryTab] = useState('ALL')
  const [search, setSearch] = useState('')
  const [lsp, setLsp] = useState('ALL')
  const [stockStatus, setStockStatus] = useState('ALL')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [toast, setToast] = useState('')

  const [openCreate, setOpenCreate] = useState(false)
  const [openAllocate, setOpenAllocate] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)

  const { data: lsps = [] } = useStockLspsQuery()
  const { data: stockResponse, isLoading, isFetching } = useStockListQuery({
    search: search.trim() || undefined,
    lsp: lsp !== 'ALL' ? lsp : undefined,
    unitCategory: categoryTab !== 'ALL' ? categoryTab : undefined,
    stockStatus: stockStatus !== 'ALL' ? stockStatus : undefined,
    page: page + 1,
    limit: rowsPerPage,
  })
  const { remove } = useStockMutations()

  const summary = stockResponse?.summary
  const rows = stockResponse?.data ?? []
  const total = stockResponse?.total ?? 0

  const handleDelete = async (item: StockItem) => {
    const ok = await confirm({
      title: 'Hapus Stock Item?',
      description: `SN "${item.serialNumber}" (${item.description}) akan dihapus dari Stock MS.`,
      confirmLabel: 'Hapus',
      tone: 'danger',
    })
    if (!ok) return
    await remove.mutateAsync(item.id)
    setToast(`SN "${item.serialNumber}" berhasil dihapus.`)
  }

  const columns: DataTableColumn<StockItem>[] = [
    {
      key: 'serialNumber',
      header: 'Serial Number',
      width: 145,
      render: (r) => (
        <Typography sx={{ fontWeight: 900 }} variant="body2">
          {r.serialNumber}
        </Typography>
      ),
    },
    {
      key: 'description',
      header: 'Material Description',
      width: 260,
      render: (r) => (
        <Box>
          <Typography sx={{ fontWeight: 700 }} variant="body2">
            {r.description}
          </Typography>
          {r.children && r.children.length > 0 ? (
            <Typography color="primary.main" variant="caption">
              {r.children.length} Sub-Module terpasang:{' '}
              {r.children.map((c) => `${c.description} (${c.serialNumber})`).join(', ')}
            </Typography>
          ) : null}
          {r.parent ? (
            <Typography color="text.secondary" variant="caption">
              Di dalam: {r.parent.description} (SN: {r.parent.serialNumber})
            </Typography>
          ) : null}
        </Box>
      ),
    },
    {
      key: 'unitCategory',
      header: 'Kategori',
      width: 120,
      render: (r) => (
        <Chip
          label={r.unitCategory.replace('_', ' ')}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      key: 'lsp',
      header: 'Current LSP',
      width: 145,
      render: (r) => r.lsp,
    },
    {
      key: 'systemLabel',
      header: 'System Label',
      width: 140,
      render: (r) => (
        <Chip
          label={r.systemLabel.replace('_', ' ')}
          size="small"
          color={labelColor(r.systemLabel)}
          variant="outlined"
        />
      ),
    },
    {
      key: 'stockStatus',
      header: 'Stock Status',
      width: 125,
      render: (r) => (
        <Chip
          label={r.stockStatus}
          size="small"
          color={statusColor(r.stockStatus)}
        />
      ),
    },
    {
      key: 'remark',
      header: 'Remark / Ref DO',
      width: 220,
      render: (r) => (
        <Typography color="text.secondary" variant="caption">
          {r.deliveryOrderNumber ? `[${r.deliveryOrderNumber}] ` : ''}
          {r.remark || '-'}
        </Typography>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      width: 100,
      render: (r) => (
        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
          <Tooltip title="Detail & Sub-Module">
            <IconButton
              size="small"
              color="primary"
              onClick={() => setDetailId(r.id)}
            >
              <VisibilityRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {isAdmin ? (
            <Tooltip title="Hapus">
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  void handleDelete(r)
                }}
              >
                <DeleteRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Stack>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Stock MS Inventory"
        subtitle="Monitoring Stock MS per Serial Number, Chassis Module ↔ Sub-Module, dan alokasi ke Delivery Order."
        actions={
          isAdmin ? (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<SwapHorizRoundedIcon />}
                onClick={() => setOpenAllocate(true)}
              >
                Alokasi Sub-Module
              </Button>
              <AppButton
                startIcon={<AddRoundedIcon />}
                onClick={() => setOpenCreate(true)}
              >
                Input Stock
              </AppButton>
            </Stack>
          ) : undefined
        }
      />

      {summary ? (
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            mb: 2,
          }}
        >
          {[
            { label: 'Total Stock MS', value: summary.total.toLocaleString('id-ID') },
            { label: 'Available', value: summary.available.toLocaleString('id-ID') },
            { label: 'Allocated (In Chassis)', value: summary.allocated.toLocaleString('id-ID') },
            { label: 'Used (In DO)', value: summary.used.toLocaleString('id-ID') },
          ].map((stat) => (
            <LiquidPanel key={stat.label} sx={{ p: 1.75 }}>
              <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700 }}>
                {stat.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, mt: 0.25 }}>
                {stat.value}
              </Typography>
            </LiquidPanel>
          ))}
        </Box>
      ) : null}

      <LiquidPanel sx={{ mb: 2, p: 1.5 }}>
        <Stack spacing={1.5}>
          <Tabs
            value={categoryTab}
            onChange={(_, v: string) => {
              setCategoryTab(v)
              setPage(0)
            }}
            variant="scrollable"
            allowScrollButtonsMobile
          >
            <Tab
              value="ALL"
              label={`Semua (${summary?.total.toLocaleString('id-ID') ?? 0})`}
            />
            <Tab
              value="MODULE"
              label={`Module / Chassis (${summary?.modules.toLocaleString('id-ID') ?? 0})`}
            />
            <Tab
              value="MODULAR"
              label={`Modular / Loose Part (${summary?.modulars.toLocaleString('id-ID') ?? 0})`}
            />
            <Tab
              value="SINGLE_UNIT"
              label={`Single Unit (${summary?.singleUnits.toLocaleString('id-ID') ?? 0})`}
            />
          </Tabs>

          <Box
            sx={{
              display: 'grid',
              gap: 1.25,
              gridTemplateColumns: { xs: '1fr', md: '1.6fr 1fr 1fr' },
            }}
          >
            <FormTextField
              size="small"
              placeholder="Cari Serial Number, Material, LSP, atau Remark..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
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
            <FormTextField
              select
              size="small"
              label="Filter LSP"
              value={lsp}
              onChange={(e) => {
                setLsp(e.target.value)
                setPage(0)
              }}
            >
              <MenuItem value="ALL">Semua LSP ({lsps.length})</MenuItem>
              {lsps.map((item) => (
                <MenuItem key={item.lsp} value={item.lsp}>
                  {item.lsp} ({item.count})
                </MenuItem>
              ))}
            </FormTextField>
            <FormTextField
              select
              size="small"
              label="Stock Status"
              value={stockStatus}
              onChange={(e) => {
                setStockStatus(e.target.value)
                setPage(0)
              }}
            >
              <MenuItem value="ALL">Semua Status</MenuItem>
              <MenuItem value="AVAILABLE">Available</MenuItem>
              <MenuItem value="ALLOCATED">Allocated</MenuItem>
              <MenuItem value="USED">Used</MenuItem>
              <MenuItem value="FAULTY">Faulty</MenuItem>
            </FormTextField>
          </Box>
        </Stack>
      </LiquidPanel>

      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        loading={isLoading || isFetching}
        minWidth={900}
        totalCountLabel={`${total.toLocaleString('id-ID')} stock items`}
        emptyLabel="Tidak ada data Stock MS yang cocok dengan filter."
      />

      <LiquidPanel sx={{ mt: 1 }}>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, nextPage) => setPage(nextPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10))
            setPage(0)
          }}
          rowsPerPageOptions={[15, 25, 50, 100]}
        />
      </LiquidPanel>

      <CreateStockDialog
        open={openCreate}
        lspOptions={lsps.map((l) => l.lsp)}
        onClose={() => setOpenCreate(false)}
        onSuccess={(msg) => setToast(msg)}
      />

      <AllocateSubModuleDialog
        open={openAllocate}
        onClose={() => setOpenAllocate(false)}
        onSuccess={(msg) => setToast(msg)}
      />

      <StockDetailDialog
        stockId={detailId}
        isAdmin={isAdmin}
        onClose={() => setDetailId(null)}
        onSuccess={(msg) => setToast(msg)}
      />

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3500}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setToast('')}>
          {toast}
        </Alert>
      </Snackbar>
    </>
  )
}
