import {
  getReturnStatusColor,
  getSeverityColor,
  getSpmsRecordById,
  getSpmsRecordMaterials,
  getSpmsStatusColor,
} from '@entities/spms'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { formatDate } from '@shared/lib/format'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import { PageHeader } from '@shared/ui/PageHeader'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

type DetailItem = {
  label: string
  value: string
}

function DetailSection({
  columns = 2,
  items,
  title,
}: {
  columns?: 1 | 2 | 3
  items: DetailItem[]
  title: string
}) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(10, 42, 94, 0.92)'
              : 'rgba(231, 247, 255, 0.92)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 1,
          py: 0.65,
        }}
      >
        <Typography sx={{ fontWeight: 950 }} variant="subtitle2">
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gap: 0,
          gridTemplateColumns: {
            xs: '1fr',
            sm:
              columns === 1
                ? '1fr'
                : columns === 3
                  ? 'repeat(3, minmax(0, 1fr))'
                  : 'repeat(2, minmax(0, 1fr))',
          },
        }}
      >
        {items.map((item) => (
          <Box
            key={item.label}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              minWidth: 0,
              p: 0.85,
            }}
          >
            <Typography color="text.secondary" sx={{ fontWeight: 850 }} variant="caption">
              {item.label}
            </Typography>
            <Typography
              sx={{ fontWeight: 850, mt: 0.35, overflowWrap: 'anywhere' }}
              variant="body2"
            >
              {item.value || '-'}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function EvidencePanel({
  fileName,
  title,
}: {
  fileName?: string
  title: string
}) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        minHeight: 260,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(10, 42, 94, 0.92)'
              : 'rgba(231, 247, 255, 0.92)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 1,
          py: 0.65,
        }}
      >
        <Typography sx={{ fontWeight: 950 }} variant="subtitle2">
          {title}
        </Typography>
      </Box>
      <Stack
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 220,
          p: 1.25,
          textAlign: 'center',
        }}
      >
        <Typography sx={{ fontWeight: 900 }} variant="body2">
          {fileName ? 'Evidence Uploaded' : 'Belum upload'}
        </Typography>
        <Chip
          color={fileName ? 'success' : 'default'}
          label={fileName || 'No file'}
          size="small"
          variant="outlined"
          sx={{ maxWidth: '100%' }}
        />
      </Stack>
    </Box>
  )
}

export function SpmsDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const record = getSpmsRecordById(id)

  if (!record) {
    return <Navigate to="/spms" replace />
  }

  const materialRows = getSpmsRecordMaterials(record)
  const firstMaterial = materialRows[0]
  const totalQty = materialRows.reduce(
    (total, material) => total + material.qty,
    0,
  )
  const deliveryEvidence =
    record.deliveryEvidenceFileName || record.evidenceFileName

  return (
    <>
      <PageHeader
        title="SPMS Detail"
        subtitle={`${record.orderNumber} - ${record.statusSpms}`}
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate(-1)}
              sx={{
                background: 'transparent',
                boxShadow: 'none',
                color: 'primary.main',
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              startIcon={<EditRoundedIcon />}
              onClick={() => navigate(`/spms/${record.id}/edit`)}
            >
              Edit
            </Button>
          </Stack>
        }
      />

      <LiquidPanel sx={{ p: { xs: 1, md: 1.25 } }}>
        <Stack spacing={1.25}>
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
              <Chip
                color={getSpmsStatusColor(record.statusSpms)}
                label={record.statusSpms}
              />
              <Chip
                color={getReturnStatusColor(record.statusReturn)}
                label={record.statusReturn}
                variant="outlined"
              />
              <Chip
                color={getSeverityColor(record.severity)}
                label={`${record.severity} Severity`}
                variant="outlined"
              />
              <Chip label={`${materialRows.length} Material`} variant="outlined" />
              <Chip label={`Total Qty ${totalQty}`} variant="outlined" />
            </Stack>
            <Box>
              <Typography sx={{ fontWeight: 950 }} variant="h5">
                {record.orderNumber}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {record.customer} - {record.regional || 'Regional'}
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1fr) 320px' },
            }}
          >
            <Stack
              spacing={1}
              sx={{
                maxHeight: { xl: 'calc(100vh - 170px)' },
                minWidth: 0,
                overflow: { xl: 'auto' },
                pr: { xl: 0.5 },
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                }}
              >
                <DetailSection
                  title="Detail Request"
                  columns={1}
                  items={[
                    ['Ticket Number', record.customerOrderNumber],
                    ['Operator', record.customer],
                    ['Req Date', formatDate(record.requestDate)],
                    ['Region', record.regional ?? '-'],
                    ['Area', record.area],
                    ['DOP', record.dop],
                    ['Site Name', record.siteName],
                    ['NE ID', record.neId ?? '-'],
                    ['FE ID', record.feId ?? '-'],
                    ['Status Transaction', record.statusTransaction ?? '-'],
                  ].map(([label, value]) => ({ label, value }))}
                />
                <DetailSection
                  title="Detail Material"
                  columns={1}
                  items={[
                    ['Spare Part Name', firstMaterial?.description ?? '-'],
                    ['Product Number', firstMaterial?.partNumber ?? '-'],
                    ['Detail Equipment', firstMaterial?.categoryMaterial ?? '-'],
                    ['Type', firstMaterial?.typeMaterial ?? '-'],
                    ['Severity', record.severity],
                    ['SLA', record.slaHours ?? '-'],
                  ].map(([label, value]) => ({ label, value }))}
                />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                }}
              >
                <DetailSection
                  title="Detail Requestor"
                  columns={1}
                  items={[
                    ['Requestor Name', record.customerRequestor ?? '-'],
                    ['Email', record.requestorEmail ?? '-'],
                    ['No hp', record.requestorPhone ?? '-'],
                  ].map(([label, value]) => ({ label, value }))}
                />
                <DetailSection
                  title="Detail Support"
                  columns={1}
                  items={[
                    ['DO Number', record.deliveryOrderNumber ?? '-'],
                    ['Origin', record.supportOriginMaterial || '-'],
                    ['Destination', record.supportDestinationMaterial ?? '-'],
                    ['AWB', record.awbTransfer ?? '-'],
                    ['Serial Number', record.materialSerialNumber ?? '-'],
                  ].map(([label, value]) => ({ label, value }))}
                />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                }}
              >
                <DetailSection
                  title="PIC Kancab"
                  columns={1}
                  items={[
                    ['Name', record.picKancabName ?? '-'],
                    ['Email', record.picKancabEmail ?? '-'],
                    ['No hp', record.picKancabPhone ?? '-'],
                  ].map(([label, value]) => ({ label, value }))}
                />
                <DetailSection
                  title="Detail Pickup"
                  columns={1}
                  items={[
                    ['DO Number', record.pickupDeliveryOrderNumber ?? '-'],
                    ['From', record.supportDestinationMaterial ?? '-'],
                    ['Destination', record.supportOriginMaterial || '-'],
                    ['Serial Number', record.serialNumberFaultyUnit ?? '-'],
                  ].map(([label, value]) => ({ label, value }))}
                />
              </Box>

              <DetailSection
                title="Condition Material Pickup from Customer"
                columns={3}
                items={[
                  ['BA Pickup Status', record.baStatusReturn ?? '-'],
                  ['Faulty SN', record.serialNumberFaultyUnit ?? '-'],
                  ['Notes', record.evidenceNotes ?? '-'],
                ].map(([label, value]) => ({ label, value }))}
              />
            </Stack>

            <Stack
              spacing={1}
              sx={{
                alignSelf: 'start',
                position: { xl: 'sticky' },
                top: { xl: 16 },
              }}
            >
              <EvidencePanel
                title="Berita Acara Delivery"
                fileName={deliveryEvidence}
              />
              <EvidencePanel
                title="Berita Acara Pickup"
                fileName={record.pickupEvidenceFileName}
              />
            </Stack>
          </Box>
        </Stack>
      </LiquidPanel>
    </>
  )
}
