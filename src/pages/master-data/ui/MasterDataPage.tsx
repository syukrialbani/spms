import {
  useMasterCustomersQuery,
  useMasterDataMutations,
  useMasterDopsQuery,
  useMasterExpeditionsQuery,
  useMasterLocationsQuery,
  useMasterMaterialsQuery,
  useMasterServicesQuery,
  useMasterSeveritySlasQuery,
  useMasterTransactionStatusesQuery,
  type MasterDop,
  type MasterLocation,
  type MasterMaterial,
  type MasterSeveritySla,
  type MasterTransactionStatus,
} from '@entities/master-data'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useConfirmation } from '@shared/lib/confirmation'
import { AppButton } from '@shared/ui/AppButton'
import { DataTable, type DataTableColumn } from '@shared/ui/DataTable'
import { FormTextField } from '@shared/ui/FormTextField'
import { FullPageLoader } from '@shared/ui/FullPageLoader'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import { PageHeader } from '@shared/ui/PageHeader'
import { useState } from 'react'

export function MasterDataPage() {
  const confirm = useConfirmation()
  const { data: customers = [], isLoading: loadingCustomers } =
    useMasterCustomersQuery()
  const { data: dops = [], isLoading: loadingDops } = useMasterDopsQuery()
  const { data: materials = [], isLoading: loadingMaterials } =
    useMasterMaterialsQuery()
  const { data: severitySlas = [], isLoading: loadingSeverity } =
    useMasterSeveritySlasQuery()
  const { data: transactionStatuses = [], isLoading: loadingTx } =
    useMasterTransactionStatusesQuery()
  const { data: locations = [], isLoading: loadingLocations } =
    useMasterLocationsQuery()
  const { data: expeditions = [], isLoading: loadingExpeditions } =
    useMasterExpeditionsQuery()
  const { data: services = [], isLoading: loadingServices } =
    useMasterServicesQuery()
  const mutations = useMasterDataMutations()
  const [tab, setTab] = useState(0)
  const [toast, setToast] = useState('')

  const isLoading =
    loadingCustomers ||
    loadingDops ||
    loadingMaterials ||
    loadingSeverity ||
    loadingTx ||
    loadingLocations ||
    loadingExpeditions ||
    loadingServices

  const data = {
    customers,
    dops,
    materials,
    severitySlas,
    transactionStatuses,
    locations,
    expeditions,
    services,
  }

  // Customer form
  const [customerName, setCustomerName] = useState('')
  const [requiresNeFe, setRequiresNeFe] = useState(false)

  // DOP form
  const [dopCustomerId, setDopCustomerId] = useState('')
  const [dopName, setDopName] = useState('')
  const [dopArea, setDopArea] = useState('')
  const [dopRegional, setDopRegional] = useState('')
  const [dopRemarks, setDopRemarks] = useState('Support DOP')

  // Material form
  const [matDesc, setMatDesc] = useState('')
  const [matPn, setMatPn] = useState('')
  const [matCat, setMatCat] = useState('')
  const [matType, setMatType] = useState('')

  // Severity & SLA form
  const [sevName, setSevName] = useState('')
  const [sevSla, setSevSla] = useState('')
  const [sevService, setSevService] = useState('PORT TO PORT')

  // Status Transaction form
  const [txCode, setTxCode] = useState('')
  const [txName, setTxName] = useState('')
  const [txSkipPickup, setTxSkipPickup] = useState(false)

  // Location / Expedition / Service forms
  const [locName, setLocName] = useState('')
  const [locAddress, setLocAddress] = useState('')
  const [locPic, setLocPic] = useState('')
  const [expName, setExpName] = useState('')
  const [svcName, setSvcName] = useState('')

  if (isLoading) {
    return <FullPageLoader />
  }

  const confirmDelete = async (label: string, action: () => Promise<unknown>) => {
    const ok = await confirm({
      title: 'Hapus Master Data?',
      description: `Data "${label}" akan dihapus dari database.`,
      confirmLabel: 'Hapus',
      tone: 'danger',
    })
    if (!ok) return
    await action()
    setToast(`"${label}" berhasil dihapus.`)
  }

  const dopColumns: DataTableColumn<MasterDop>[] = [
    { key: 'customerName', header: 'Customer', width: 140, render: (r) => r.customerName },
    { key: 'dop', header: 'DOP', width: 160, render: (r) => r.dop },
    { key: 'area', header: 'Area', width: 160, render: (r) => r.area },
    { key: 'regional', header: 'Regional', width: 180, render: (r) => r.regional },
    { key: 'remarks', header: 'Remarks', width: 140, render: (r) => r.remarks || '-' },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      width: 80,
      render: (r) => (
        <Tooltip title="Hapus">
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              void confirmDelete(`${r.customerName} - ${r.dop}`, () =>
                mutations.deleteDop.mutateAsync(r.id),
              )
            }}
          >
            <DeleteRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  const materialColumns: DataTableColumn<MasterMaterial>[] = [
    { key: 'description', header: 'Spare Part Name', width: 320, render: (r) => r.description },
    { key: 'partNumber', header: 'Product Number', width: 180, render: (r) => r.partNumber },
    { key: 'categoryMaterial', header: 'Detail Equipment', width: 150, render: (r) => r.categoryMaterial },
    { key: 'typeMaterial', header: 'Type', width: 110, render: (r) => r.typeMaterial },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      width: 80,
      render: (r) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => {
            void confirmDelete(r.partNumber, () =>
              mutations.deleteMaterial.mutateAsync(r.id),
            )
          }}
        >
          <DeleteRoundedIcon fontSize="small" />
        </IconButton>
      ),
    },
  ]

  const severityColumns: DataTableColumn<MasterSeveritySla>[] = [
    { key: 'severity', header: 'Severity', width: 180, render: (r) => r.severity },
    { key: 'slaHours', header: 'SLA Hours', width: 160, render: (r) => r.slaHours },
    { key: 'defaultService', header: 'Default Service', width: 180, render: (r) => r.defaultService },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      width: 80,
      render: (r) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => {
            void confirmDelete(r.severity, () =>
              mutations.deleteSeveritySla.mutateAsync(r.id),
            )
          }}
        >
          <DeleteRoundedIcon fontSize="small" />
        </IconButton>
      ),
    },
  ]

  const txColumns: DataTableColumn<MasterTransactionStatus>[] = [
    { key: 'code', header: 'Kode', width: 140, render: (r) => r.code },
    { key: 'name', header: 'Keterangan', width: 280, render: (r) => r.name },
    {
      key: 'skipPickup',
      header: 'Skip Pickup (ARF)',
      width: 150,
      render: (r) => (
        <Chip
          label={r.skipPickup ? 'Ya (Skip Pickup)' : 'Tidak'}
          size="small"
          color={r.skipPickup ? 'warning' : 'default'}
        />
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      width: 80,
      render: (r) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => {
            void confirmDelete(r.code, () =>
              mutations.deleteTransactionStatus.mutateAsync(r.id),
            )
          }}
        >
          <DeleteRoundedIcon fontSize="small" />
        </IconButton>
      ),
    },
  ]

  const locColumns: DataTableColumn<MasterLocation>[] = [
    { key: 'name', header: 'Lokasi', width: 180, render: (r) => r.name },
    { key: 'address', header: 'Alamat', width: 320, render: (r) => r.address || '-' },
    { key: 'pic', header: 'PIC', width: 220, render: (r) => r.pic || '-' },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      width: 80,
      render: (r) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => {
            void confirmDelete(r.name, () =>
              mutations.deleteLocation.mutateAsync(r.id),
            )
          }}
        >
          <DeleteRoundedIcon fontSize="small" />
        </IconButton>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Master Data"
        subtitle="Kelola data master relasional (Customer, DOP/Area/Regional, Material, Severity/SLA, Status Transaksi, Lokasi)."
      />

      <LiquidPanel sx={{ mb: 2, p: 1.5 }}>
        <Tabs
          value={tab}
          onChange={(_, v: number) => setTab(v)}
          variant="scrollable"
          allowScrollButtonsMobile
        >
          <Tab label={`Customer & DOP (${data.dops.length})`} />
          <Tab label={`Material (${data.materials.length})`} />
          <Tab label={`Severity & SLA (${data.severitySlas.length})`} />
          <Tab label={`Status Transaksi (${data.transactionStatuses.length})`} />
          <Tab label={`Lokasi & Ekspedisi (${data.locations.length})`} />
        </Tabs>
      </LiquidPanel>

      {tab === 0 ? (
        <Stack spacing={2}>
          <LiquidPanel sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.25 }}>
              Master Customer
            </Typography>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.25}
              sx={{ alignItems: { md: 'center' }, mb: 1.5 }}
            >
              <FormTextField
                label="Nama Customer"
                size="small"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={requiresNeFe}
                    onChange={(e) => setRequiresNeFe(e.target.checked)}
                  />
                }
                label="Wajib NE ID & FE ID"
              />
              <AppButton
                startIcon={<AddRoundedIcon />}
                disabled={!customerName.trim() || mutations.createCustomer.isPending}
                onClick={() => {
                  void (async () => {
                    await mutations.createCustomer.mutateAsync({
                      name: customerName.trim(),
                      requiresNeFe,
                    })
                    setCustomerName('')
                    setRequiresNeFe(false)
                    setToast('Customer berhasil ditambahkan.')
                  })()
                }}
              >
                Add Customer
              </AppButton>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
              {data.customers.map((c) => (
                <Chip
                  key={c.id}
                  label={`${c.name}${c.requiresNeFe ? ' (NE/FE)' : ''}`}
                  color="primary"
                  variant="outlined"
                  onDelete={() => {
                    void confirmDelete(c.name, () =>
                      mutations.deleteCustomer.mutateAsync(c.id),
                    )
                  }}
                />
              ))}
            </Stack>
          </LiquidPanel>

          <LiquidPanel sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.25 }}>
              Tambah Relasi Customer → DOP → Area → Regional
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 1.25,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(5, minmax(0, 1fr)) auto',
                },
                alignItems: 'end',
              }}
            >
              <FormTextField
                select
                label="Customer"
                size="small"
                value={dopCustomerId}
                onChange={(e) => setDopCustomerId(e.target.value)}
              >
                {data.customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </FormTextField>
              <FormTextField
                label="DOP"
                size="small"
                value={dopName}
                onChange={(e) => setDopName(e.target.value)}
              />
              <FormTextField
                label="Area"
                size="small"
                value={dopArea}
                onChange={(e) => setDopArea(e.target.value)}
              />
              <FormTextField
                label="Regional"
                size="small"
                value={dopRegional}
                onChange={(e) => setDopRegional(e.target.value)}
              />
              <FormTextField
                label="Remarks"
                size="small"
                value={dopRemarks}
                onChange={(e) => setDopRemarks(e.target.value)}
              />
              <AppButton
                startIcon={<AddRoundedIcon />}
                disabled={
                  !dopCustomerId ||
                  !dopName.trim() ||
                  !dopArea.trim() ||
                  !dopRegional.trim()
                }
                onClick={() => {
                  void (async () => {
                    await mutations.createDop.mutateAsync({
                      customerId: dopCustomerId,
                      dop: dopName.trim(),
                      area: dopArea.trim(),
                      regional: dopRegional.trim(),
                      remarks: dopRemarks.trim(),
                    })
                    setDopName('')
                    setDopArea('')
                    setDopRegional('')
                    setToast('Relasi DOP berhasil ditambahkan.')
                  })()
                }}
              >
                Add DOP
              </AppButton>
            </Box>
          </LiquidPanel>

          <DataTable
            loading={isLoading}
            rows={data.dops}
            columns={dopColumns}
            getRowId={(r) => r.id}
            pagination
            initialRowsPerPage={10}
            minWidth={860}
          />
        </Stack>
      ) : null}

      {tab === 1 ? (
        <Stack spacing={2}>
          <LiquidPanel sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.25 }}>
              Tambah Master Material (Spare Part ↔ Product Number ↔ Equipment ↔ Type)
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 1.25,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '1.6fr 1fr 1fr 0.8fr auto',
                },
                alignItems: 'end',
              }}
            >
              <FormTextField
                label="Spare Part Name"
                size="small"
                value={matDesc}
                onChange={(e) => setMatDesc(e.target.value)}
              />
              <FormTextField
                label="Product Number"
                size="small"
                value={matPn}
                onChange={(e) => setMatPn(e.target.value)}
              />
              <FormTextField
                label="Detail Equipment"
                size="small"
                placeholder="iPaso / IPASOLINK / Hybrid"
                value={matCat}
                onChange={(e) => setMatCat(e.target.value)}
              />
              <FormTextField
                label="Type"
                size="small"
                placeholder="PDH / MW"
                value={matType}
                onChange={(e) => setMatType(e.target.value)}
              />
              <AppButton
                startIcon={<AddRoundedIcon />}
                disabled={!matDesc.trim() || !matPn.trim() || !matCat.trim() || !matType.trim()}
                onClick={() => {
                  void (async () => {
                    await mutations.createMaterial.mutateAsync({
                      description: matDesc.trim(),
                      partNumber: matPn.trim(),
                      categoryMaterial: matCat.trim(),
                      typeMaterial: matType.trim(),
                    })
                    setMatDesc('')
                    setMatPn('')
                    setToast('Material berhasil ditambahkan.')
                  })()
                }}
              >
                Add Material
              </AppButton>
            </Box>
          </LiquidPanel>

          <DataTable
            loading={isLoading}
            rows={data.materials}
            columns={materialColumns}
            getRowId={(r) => r.id}
            pagination
            initialRowsPerPage={10}
            minWidth={860}
          />
        </Stack>
      ) : null}

      {tab === 2 ? (
        <Stack spacing={2}>
          <LiquidPanel sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.25 }}>
              Tambah Master Severity ↔ SLA
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 1.25,
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr auto' },
                alignItems: 'end',
              }}
            >
              <FormTextField
                label="Severity"
                size="small"
                placeholder="CRITICAL / NON CRITICAL"
                value={sevName}
                onChange={(e) => setSevName(e.target.value)}
              />
              <FormTextField
                label="SLA Hours"
                size="small"
                placeholder="04:00:00"
                value={sevSla}
                onChange={(e) => setSevSla(e.target.value)}
              />
              <FormTextField
                label="Default Service"
                size="small"
                value={sevService}
                onChange={(e) => setSevService(e.target.value)}
              />
              <AppButton
                startIcon={<AddRoundedIcon />}
                disabled={!sevName.trim() || !sevSla.trim()}
                onClick={() => {
                  void (async () => {
                    await mutations.createSeveritySla.mutateAsync({
                      severity: sevName.trim(),
                      slaHours: sevSla.trim(),
                      defaultService: sevService.trim(),
                    })
                    setSevName('')
                    setSevSla('')
                    setToast('Severity & SLA berhasil ditambahkan.')
                  })()
                }}
              >
                Add
              </AppButton>
            </Box>
          </LiquidPanel>

          <DataTable
            loading={isLoading}
            rows={data.severitySlas}
            columns={severityColumns}
            getRowId={(r) => r.id}
            minWidth={600}
          />
        </Stack>
      ) : null}

      {tab === 3 ? (
        <Stack spacing={2}>
          <LiquidPanel sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.25 }}>
              Tambah Master Status Transaksi
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 1.25,
                gridTemplateColumns: { xs: '1fr', md: '0.8fr 1.4fr auto auto' },
                alignItems: 'center',
              }}
            >
              <FormTextField
                label="Kode"
                size="small"
                placeholder="OOW / ARF / Warr"
                value={txCode}
                onChange={(e) => setTxCode(e.target.value)}
              />
              <FormTextField
                label="Keterangan"
                size="small"
                value={txName}
                onChange={(e) => setTxName(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={txSkipPickup}
                    onChange={(e) => setTxSkipPickup(e.target.checked)}
                  />
                }
                label="Skip Pickup"
              />
              <AppButton
                startIcon={<AddRoundedIcon />}
                disabled={!txCode.trim() || !txName.trim()}
                onClick={() => {
                  void (async () => {
                    await mutations.createTransactionStatus.mutateAsync({
                      code: txCode.trim(),
                      name: txName.trim(),
                      skipPickup: txSkipPickup,
                    })
                    setTxCode('')
                    setTxName('')
                    setTxSkipPickup(false)
                    setToast('Status transaksi berhasil ditambahkan.')
                  })()
                }}
              >
                Add
              </AppButton>
            </Box>
          </LiquidPanel>

          <DataTable
            loading={isLoading}
            rows={data.transactionStatuses}
            columns={txColumns}
            getRowId={(r) => r.id}
            minWidth={620}
          />
        </Stack>
      ) : null}

      {tab === 4 ? (
        <Stack spacing={2}>
          <LiquidPanel sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.25 }}>
              Tambah Lokasi / Address Book
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 1.25,
                gridTemplateColumns: { xs: '1fr', md: '1fr 1.6fr 1fr auto' },
                alignItems: 'end',
              }}
            >
              <FormTextField
                label="Nama Lokasi"
                size="small"
                value={locName}
                onChange={(e) => setLocName(e.target.value)}
              />
              <FormTextField
                label="Alamat"
                size="small"
                value={locAddress}
                onChange={(e) => setLocAddress(e.target.value)}
              />
              <FormTextField
                label="PIC & No HP"
                size="small"
                value={locPic}
                onChange={(e) => setLocPic(e.target.value)}
              />
              <AppButton
                startIcon={<AddRoundedIcon />}
                disabled={!locName.trim()}
                onClick={() => {
                  void (async () => {
                    await mutations.createLocation.mutateAsync({
                      name: locName.trim(),
                      address: locAddress.trim(),
                      pic: locPic.trim(),
                    })
                    setLocName('')
                    setLocAddress('')
                    setLocPic('')
                    setToast('Lokasi berhasil ditambahkan.')
                  })()
                }}
              >
                Add Lokasi
              </AppButton>
            </Box>
          </LiquidPanel>

          <DataTable
            loading={isLoading}
            rows={data.locations}
            columns={locColumns}
            getRowId={(r) => r.id}
            pagination
            initialRowsPerPage={10}
            minWidth={800}
          />

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            }}
          >
            <LiquidPanel sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>
                Ekspedisi
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                <FormTextField
                  fullWidth
                  size="small"
                  placeholder="Tambah ekspedisi..."
                  value={expName}
                  onChange={(e) => setExpName(e.target.value)}
                />
                <AppButton
                  disabled={!expName.trim()}
                  onClick={() => {
                    void (async () => {
                      await mutations.createExpedition.mutateAsync({
                        name: expName.trim(),
                      })
                      setExpName('')
                      setToast('Ekspedisi ditambahkan.')
                    })()
                  }}
                >
                  Add
                </AppButton>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                {data.expeditions.map((item) => (
                  <Chip
                    key={item.id}
                    label={item.name}
                    variant="outlined"
                    onDelete={() => {
                      void confirmDelete(item.name, () =>
                        mutations.deleteExpedition.mutateAsync(item.id),
                      )
                    }}
                  />
                ))}
              </Stack>
            </LiquidPanel>

            <LiquidPanel sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>
                Service Pengiriman
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                <FormTextField
                  fullWidth
                  size="small"
                  placeholder="Tambah service..."
                  value={svcName}
                  onChange={(e) => setSvcName(e.target.value)}
                />
                <AppButton
                  disabled={!svcName.trim()}
                  onClick={() => {
                    void (async () => {
                      await mutations.createService.mutateAsync({
                        name: svcName.trim(),
                      })
                      setSvcName('')
                      setToast('Service ditambahkan.')
                    })()
                  }}
                >
                  Add
                </AppButton>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                {data.services.map((item) => (
                  <Chip
                    key={item.id}
                    label={item.name}
                    variant="outlined"
                    onDelete={() => {
                      void confirmDelete(item.name, () =>
                        mutations.deleteService.mutateAsync(item.id),
                      )
                    }}
                  />
                ))}
              </Stack>
            </LiquidPanel>
          </Box>
        </Stack>
      ) : null}

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
