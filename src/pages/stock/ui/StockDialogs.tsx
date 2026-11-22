import {
  useStockDetailQuery,
  useStockMutations,
  useStockOptionsQuery,
  type StockAvailability,
  type StockSystemLabel,
  type StockUnitCategory,
} from '@entities/stock'
import LinkOffRoundedIcon from '@mui/icons-material/LinkOffRounded'
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { AppButton } from '@shared/ui/AppButton'
import { FormTextField } from '@shared/ui/FormTextField'
import { useState } from 'react'

type CreateStockDialogProps = {
  open: boolean
  lspOptions: string[]
  onClose: () => void
  onSuccess: (message: string) => void
}

export function CreateStockDialog({
  open,
  lspOptions,
  onClose,
  onSuccess,
}: CreateStockDialogProps) {
  const { create } = useStockMutations()
  const [description, setDescription] = useState('')
  const [partNumber, setPartNumber] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [unitCategory, setUnitCategory] =
    useState<StockUnitCategory>('SINGLE_UNIT')
  const [lsp, setLsp] = useState('')
  const [systemLabel, setSystemLabel] = useState<StockSystemLabel>('COMPLETE')
  const [stockStatus, setStockStatus] = useState<StockAvailability>('AVAILABLE')
  const [remark, setRemark] = useState('')
  const [parentSerialNumber, setParentSerialNumber] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    try {
      await create.mutateAsync({
        description: description.trim(),
        partNumber: partNumber.trim() || undefined,
        serialNumber: serialNumber.trim(),
        unitCategory,
        lsp: lsp.trim(),
        systemLabel,
        stockStatus,
        remark: remark.trim() || undefined,
        parentSerialNumber: parentSerialNumber.trim() || undefined,
      })
      setDescription('')
      setPartNumber('')
      setSerialNumber('')
      setRemark('')
      setParentSerialNumber('')
      onSuccess(`Stock SN "${serialNumber.trim()}" berhasil ditambahkan.`)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambah stock.')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 900 }}>Input Stock MS Baru</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          {error ? (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          ) : null}
          <FormTextField
            label="Material Description"
            required
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Box
            sx={{
              display: 'grid',
              gap: 1.25,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            }}
          >
            <FormTextField
              label="Serial Number (SN)"
              required
              size="small"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
            <FormTextField
              label="Part Number (Opsional)"
              size="small"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
            />
          </Box>
          <Box
            sx={{
              display: 'grid',
              gap: 1.25,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            }}
          >
            <FormTextField
              select
              label="Kategori Unit"
              size="small"
              value={unitCategory}
              onChange={(e) =>
                setUnitCategory(e.target.value as StockUnitCategory)
              }
            >
              <MenuItem value="MODULE">Module (Chassis Utama)</MenuItem>
              <MenuItem value="MODULAR">Modular (Sub-Module / Loose Part)</MenuItem>
              <MenuItem value="SINGLE_UNIT">Single Unit</MenuItem>
            </FormTextField>
            <Autocomplete
              freeSolo
              options={lspOptions}
              value={lsp}
              onInputChange={(_, val) => setLsp(val)}
              renderInput={(params) => (
                <TextField {...params} label="Current LSP" required size="small" />
              )}
            />
          </Box>
          <Box
            sx={{
              display: 'grid',
              gap: 1.25,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            }}
          >
            <FormTextField
              select
              label="System Label"
              size="small"
              value={systemLabel}
              onChange={(e) =>
                setSystemLabel(e.target.value as StockSystemLabel)
              }
            >
              <MenuItem value="COMPLETE">COMPLETE</MenuItem>
              <MenuItem value="NOT_COMPLETE">NOT COMPLETE</MenuItem>
              <MenuItem value="LOOSE_PART">LOOSE PART</MenuItem>
            </FormTextField>
            <FormTextField
              select
              label="Stock Status"
              size="small"
              value={stockStatus}
              onChange={(e) =>
                setStockStatus(e.target.value as StockAvailability)
              }
            >
              <MenuItem value="AVAILABLE">Available</MenuItem>
              <MenuItem value="ALLOCATED">Allocated</MenuItem>
              <MenuItem value="USED">Used</MenuItem>
              <MenuItem value="FAULTY">Faulty</MenuItem>
            </FormTextField>
          </Box>
          {unitCategory === 'MODULAR' ? (
            <FormTextField
              label="Parent Module SN (Opsional jika langsung terpasang)"
              size="small"
              value={parentSerialNumber}
              onChange={(e) => setParentSerialNumber(e.target.value)}
            />
          ) : null}
          <FormTextField
            label="Remark"
            size="small"
            multiline
            rows={2}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Batal</Button>
        <AppButton
          disabled={
            !description.trim() ||
            !serialNumber.trim() ||
            !lsp.trim() ||
            create.isPending
          }
          onClick={() => {
            void handleSubmit()
          }}
        >
          Simpan Stock
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

type AllocateSubModuleDialogProps = {
  open: boolean
  initialSubModuleSn?: string
  initialTargetModuleSn?: string
  onClose: () => void
  onSuccess: (message: string) => void
}

export function AllocateSubModuleDialog({
  open,
  initialSubModuleSn = '',
  initialTargetModuleSn = '',
  onClose,
  onSuccess,
}: AllocateSubModuleDialogProps) {
  const { allocate } = useStockMutations()
  const [subSearch, setSubSearch] = useState(initialSubModuleSn)
  const [subSn, setSubSn] = useState(initialSubModuleSn)
  const [modSearch, setModSearch] = useState(initialTargetModuleSn)
  const [modSn, setModSn] = useState(initialTargetModuleSn)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const { data: subOptions = [] } = useStockOptionsQuery(
    { search: subSearch || undefined, unitCategory: 'MODULAR', limit: 30 },
    open,
  )
  const { data: modOptions = [] } = useStockOptionsQuery(
    { search: modSearch || undefined, unitCategory: 'MODULE', limit: 30 },
    open,
  )

  const handleAllocate = async () => {
    setError('')
    try {
      await allocate.mutateAsync({
        subModuleSn: subSn.trim(),
        targetModuleSn: modSn.trim(),
        notes: notes.trim() || undefined,
      })
      onSuccess(
        `Sub-Module SN ${subSn.trim()} berhasil dipasang/dipindahkan ke Module SN ${modSn.trim()}.`,
      )
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal alokasi sub-module.')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 900 }}>
        Alokasi / Pindah Sub-Module ke Module (by SN)
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <Typography color="text.secondary" variant="body2">
            Mendukung <strong>Modular → Module</strong> (pasang eceran ke
            chassis) maupun <strong>Module → Module</strong> (pindahkan
            sub-module dari satu chassis ke chassis lain).
          </Typography>
          {error ? (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          ) : null}
          <Autocomplete
            freeSolo
            options={subOptions}
            getOptionLabel={(opt) =>
              typeof opt === 'string'
                ? opt
                : `${opt.serialNumber} — ${opt.description} (${opt.lsp}${opt.parent ? `, di SN ${opt.parent.serialNumber}` : ''})`
            }
            inputValue={subSearch}
            onInputChange={(_, value) => {
              setSubSearch(value)
              const snPart = value.split(' — ')[0]?.trim() ?? ''
              setSubSn(snPart)
            }}
            onChange={(_, value) => {
              if (typeof value === 'string') {
                setSubSn(value)
              } else if (value) {
                setSubSn(value.serialNumber)
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="SN Sub-Module / Modular"
                placeholder="Ketik SN sub-module (contoh: 99821)..."
                required
                size="small"
              />
            )}
          />
          <Autocomplete
            freeSolo
            options={modOptions}
            getOptionLabel={(opt) =>
              typeof opt === 'string'
                ? opt
                : `${opt.serialNumber} — ${opt.description} (${opt.lsp})`
            }
            inputValue={modSearch}
            onInputChange={(_, value) => {
              setModSearch(value)
              const snPart = value.split(' — ')[0]?.trim() ?? ''
              setModSn(snPart)
            }}
            onChange={(_, value) => {
              if (typeof value === 'string') {
                setModSn(value)
              } else if (value) {
                setModSn(value.serialNumber)
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="SN Target Module (Chassis Utama)"
                placeholder="Ketik SN chassis tujuan (contoh: 26452)..."
                required
                size="small"
              />
            )}
          />
          <FormTextField
            label="Catatan Alokasi (Opsional)"
            size="small"
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Batal</Button>
        <AppButton
          startIcon={<SwapHorizRoundedIcon />}
          disabled={!subSn.trim() || !modSn.trim() || allocate.isPending}
          onClick={() => {
            void handleAllocate()
          }}
        >
          Alokasikan
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

type StockDetailDialogProps = {
  stockId: string | null
  isAdmin: boolean
  onClose: () => void
  onSuccess: (message: string) => void
}

export function StockDetailDialog({
  stockId,
  isAdmin,
  onClose,
  onSuccess,
}: StockDetailDialogProps) {
  const { data: detail, isLoading } = useStockDetailQuery(stockId ?? undefined)
  const { detach } = useStockMutations()

  const handleDetach = async (sn: string) => {
    await detach.mutateAsync({ subModuleSn: sn })
    onSuccess(`Sub-Module SN ${sn} dilepas menjadi Loose Part (Available).`)
  }

  return (
    <Dialog open={Boolean(stockId)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 900 }}>
        Detail Stock MS {detail ? `— SN ${detail.serialNumber}` : ''}
      </DialogTitle>
      <DialogContent>
        {isLoading || !detail ? (
          <Typography color="text.secondary" variant="body2">
            Memuat detail...
          </Typography>
        ) : (
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <Box
              sx={{
                display: 'grid',
                gap: 1.25,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              }}
            >
              <Box>
                <Typography color="text.secondary" variant="caption">
                  Material Description
                </Typography>
                <Typography sx={{ fontWeight: 800 }} variant="body2">
                  {detail.description}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="caption">
                  Serial Number
                </Typography>
                <Typography sx={{ fontWeight: 800 }} variant="body2">
                  {detail.serialNumber}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="caption">
                  Current LSP
                </Typography>
                <Typography sx={{ fontWeight: 800 }} variant="body2">
                  {detail.lsp}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="caption">
                  Kategori Unit
                </Typography>
                <Typography sx={{ fontWeight: 700 }} variant="body2">
                  {detail.unitCategory}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="caption">
                  System Label / Status
                </Typography>
                <Stack direction="row" spacing={0.75} sx={{ mt: 0.25 }}>
                  <Chip label={detail.systemLabel} size="small" />
                  <Chip
                    label={detail.stockStatus}
                    size="small"
                    color={
                      detail.stockStatus === 'AVAILABLE'
                        ? 'success'
                        : detail.stockStatus === 'ALLOCATED'
                          ? 'info'
                          : 'warning'
                    }
                  />
                </Stack>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="caption">
                  Delivery Order Ref
                </Typography>
                <Typography sx={{ fontWeight: 700 }} variant="body2">
                  {detail.deliveryOrderNumber || '-'}
                </Typography>
              </Box>
            </Box>

            {detail.parent ? (
              <Box sx={{ p: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography color="text.secondary" variant="caption">
                  Terpasang di Parent Module (Chassis Utama)
                </Typography>
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}
                >
                  <Typography sx={{ fontWeight: 800 }} variant="body2">
                    {detail.parent.description} — SN: {detail.parent.serialNumber}
                  </Typography>
                  {isAdmin ? (
                    <Button
                      size="small"
                      color="warning"
                      variant="outlined"
                      startIcon={<LinkOffRoundedIcon />}
                      disabled={detach.isPending}
                      onClick={() => {
                        void handleDetach(detail.serialNumber)
                      }}
                    >
                      Detach (Jadi Eceran)
                    </Button>
                  ) : null}
                </Stack>
              </Box>
            ) : null}

            {detail.unitCategory === 'MODULE' ? (
              <>
                <Divider />
                <Typography sx={{ fontWeight: 900 }} variant="subtitle2">
                  Sub-Module Terpasang ({detail.children?.length ?? 0})
                </Typography>
                {detail.children && detail.children.length > 0 ? (
                  <Stack spacing={0.75}>
                    {detail.children.map((child) => (
                      <Box
                        key={child.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                        }}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 800 }} variant="body2">
                            {child.description} — SN: {child.serialNumber}
                          </Typography>
                          <Typography color="text.secondary" variant="caption">
                            {child.systemLabel} • {child.stockStatus}
                          </Typography>
                        </Box>
                        {isAdmin ? (
                          <Button
                            size="small"
                            color="warning"
                            variant="outlined"
                            startIcon={<LinkOffRoundedIcon />}
                            disabled={detach.isPending}
                            onClick={() => {
                              void handleDetach(child.serialNumber)
                            }}
                          >
                            Lepas
                          </Button>
                        ) : null}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary" variant="body2">
                    Belum ada sub-module yang terpasang pada chassis ini.
                  </Typography>
                )}
              </>
            ) : null}

            <Divider />
            <Typography sx={{ fontWeight: 900 }} variant="subtitle2">
              Riwayat Pergerakan Stock ({detail.movements?.length ?? 0})
            </Typography>
            {detail.movements && detail.movements.length > 0 ? (
              <Stack spacing={0.75}>
                {detail.movements.map((m) => (
                  <Box
                    key={m.id}
                    sx={{
                      p: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <Chip label={m.action} size="small" variant="outlined" />
                      <Typography color="text.secondary" variant="caption">
                        {new Date(m.createdAt).toLocaleString('id-ID')}
                        {m.performedBy ? ` • ${m.performedBy}` : ''}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {m.notes || '-'}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary" variant="body2">
                Belum ada riwayat pergerakan.
              </Typography>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Tutup</Button>
      </DialogActions>
    </Dialog>
  )
}
