import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUsersQuery,
  type User,
  type UserRole,
} from '@entities/user'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useConfirmation } from '@shared/lib/confirmation'
import { AppButton } from '@shared/ui/AppButton'
import { DataTable, type DataTableColumn } from '@shared/ui/DataTable'
import { FormTextField } from '@shared/ui/FormTextField'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import { PageHeader } from '@shared/ui/PageHeader'
import { useMemo, useState } from 'react'

const roleOptions: Array<{ value: UserRole; label: string; desc: string }> = [
  { value: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Akses penuh semua modul' },
  { value: 'ADMIN_1', label: 'Admin 1', desc: 'Approval 1 & Master Data' },
  { value: 'ADMIN_2', label: 'Admin 2', desc: 'Approval 2 & Master Data' },
  { value: 'ADMIN_3', label: 'Admin 3', desc: 'Closed Customer & Master Data' },
  { value: 'DRIVER', label: 'Driver (PIC Kancab)', desc: 'Login Android untuk upload BA' },
  { value: 'REQUESTOR', label: 'Requestor (PIC)', desc: 'PIC Requestor customer' },
]

const roleLabelMap: Record<string, string> = Object.fromEntries(
  roleOptions.map((r) => [r.value, r.label]),
)

type UserFormState = {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
  isActive: boolean
}

const emptyForm: UserFormState = {
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  role: 'DRIVER',
  isActive: true,
}

export function UsersPage() {
  const confirm = useConfirmation()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const { data, isLoading, isFetching } = useUsersQuery({
    search: search || undefined,
    role: roleFilter === 'ALL' ? undefined : roleFilter,
  })
  const createUser = useCreateUserMutation()
  const updateUser = useUpdateUserMutation()
  const deleteUser = useDeleteUserMutation()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form, setForm] = useState<UserFormState>(emptyForm)
  const [toast, setToast] = useState('')

  const users = useMemo(() => data?.data ?? [], [data])

  const openCreate = () => {
    setEditingUser(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (user: User) => {
    setEditingUser(user)
    setForm({
      username: user.username,
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName ?? '',
      phone: user.phone ?? '',
      role: (user.role as UserRole) || 'REQUESTOR',
      isActive: user.isActive ?? true,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.username || !form.email || !form.firstName) {
      return
    }

    if (!editingUser && form.password.length < 6) {
      return
    }

    if (editingUser) {
      await updateUser.mutateAsync({
        id: editingUser.id,
        payload: {
          username: form.username,
          email: form.email,
          ...(form.password ? { password: form.password } : {}),
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          role: form.role,
          isActive: form.isActive,
        },
      })
      setToast(`User ${form.username} berhasil diperbarui.`)
    } else {
      await createUser.mutateAsync(form)
      setToast(`User ${form.username} berhasil ditambahkan.`)
    }

    setDialogOpen(false)
  }

  const handleDelete = async (user: User) => {
    const ok = await confirm({
      title: 'Hapus User?',
      description: `User "${user.username}" akan dihapus permanen.`,
      confirmLabel: 'Hapus',
      tone: 'danger',
    })
    if (!ok) return

    await deleteUser.mutateAsync(user.id)
    setToast(`User ${user.username} dihapus.`)
  }

  const columns: DataTableColumn<User>[] = [
    {
      key: 'username',
      header: 'Username',
      width: 160,
      render: (u) => (
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          {u.username}
        </Typography>
      ),
    },
    {
      key: 'name',
      header: 'Nama Lengkap',
      width: 200,
      render: (u) => `${u.firstName} ${u.lastName ?? ''}`.trim(),
    },
    {
      key: 'email',
      header: 'Email',
      width: 220,
      render: (u) => u.email,
    },
    {
      key: 'phone',
      header: 'No. HP',
      width: 150,
      render: (u) => u.phone || '-',
    },
    {
      key: 'role',
      header: 'Role / Hak Akses',
      width: 170,
      render: (u) => (
        <Chip
          label={roleLabelMap[u.role ?? ''] ?? u.role ?? '-'}
          size="small"
          color={
            u.role === 'SUPER_ADMIN'
              ? 'error'
              : u.role === 'DRIVER'
                ? 'warning'
                : u.role === 'REQUESTOR'
                  ? 'info'
                  : 'primary'
          }
          variant="outlined"
        />
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      width: 110,
      render: (u) => (
        <Chip
          label={u.isActive ? 'Aktif' : 'Nonaktif'}
          size="small"
          color={u.isActive ? 'success' : 'default'}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      width: 110,
      render: (u) => (
        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
          <Tooltip title="Edit User">
            <IconButton size="small" onClick={() => openEdit(u)}>
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hapus User">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                void handleDelete(u)
              }}
            >
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Kelola akun user, hak akses role, PIC Kancab (Driver), dan PIC Requestor."
        actions={
          <AppButton
            startIcon={<AddRoundedIcon />}
            onClick={openCreate}
            type="button"
          >
            Add User
          </AppButton>
        }
      />

      <LiquidPanel sx={{ mb: 2, p: { xs: 1.5, sm: 2 } }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
            <Chip
              label="All"
              size="small"
              variant={roleFilter === 'ALL' ? 'filled' : 'outlined'}
              onClick={() => setRoleFilter('ALL')}
            />
            {roleOptions.map((r) => (
              <Chip
                key={r.value}
                label={r.label}
                size="small"
                color="primary"
                variant={roleFilter === r.value ? 'filled' : 'outlined'}
                onClick={() => setRoleFilter(r.value)}
              />
            ))}
          </Stack>
          <FormTextField
            fullWidth
            size="small"
            placeholder="Cari username, nama, email, no HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        rows={users}
        columns={columns}
        getRowId={(u) => u.id}
        emptyLabel="Belum ada data user"
        loading={isLoading || isFetching}
        pagination
        initialRowsPerPage={25}
        minWidth={760}
      />

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 900 }}>
          {editingUser ? `Edit User: ${editingUser.username}` : 'Tambah User Baru'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <Box
              sx={{
                display: 'grid',
                gap: 1.25,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              }}
            >
              <FormTextField
                label="Nama Depan"
                required
                size="small"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <FormTextField
                label="Nama Belakang"
                size="small"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
              <FormTextField
                label="Username"
                required
                size="small"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              <FormTextField
                label={
                  editingUser
                    ? 'Password Baru (kosongkan jika tidak ubah)'
                    : 'Password (min 6 karakter)'
                }
                required={!editingUser}
                type="password"
                size="small"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <FormTextField
                label="Email"
                required
                type="email"
                size="small"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <FormTextField
                label="No. HP"
                size="small"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Box>

            <FormTextField
              select
              label="Role / Hak Akses"
              required
              size="small"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as UserRole })
              }
            >
              {roleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label} — {option.desc}
                </MenuItem>
              ))}
            </FormTextField>

            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
              }
              label="User Aktif (dapat login)"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            variant="outlined"
            onClick={() => setDialogOpen(false)}
            sx={{ background: 'transparent', boxShadow: 'none' }}
          >
            Cancel
          </Button>
          <AppButton
            disabled={createUser.isPending || updateUser.isPending}
            onClick={() => {
              void handleSave()
            }}
            type="button"
          >
            {editingUser ? 'Simpan Perubahan' : 'Buat User'}
          </AppButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3200}
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
