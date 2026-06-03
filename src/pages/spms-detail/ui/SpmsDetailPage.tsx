import {
  getReturnStatusColor,
  getSeverityColor,
  getSpmsRecordById,
  getSpmsRecordMaterials,
  getSpmsStatusColor,
  type SpmsRecord,
} from '@entities/spms'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { formatDate } from '@shared/lib/format'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import { PageHeader } from '@shared/ui/PageHeader'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

const detailGroups = [
  ['Customer', 'customer'],
  ['Customer Order Number', 'customerOrderNumber'],
  ['Request Date', 'requestDate'],
  ['Area', 'area'],
  ['Dop', 'dop'],
  ['Site Name', 'siteName'],
  ['PM Area', 'pmArea'],
  ['SLA', 'slaHours'],
  ['Site', 'site'],
] as const satisfies ReadonlyArray<readonly [string, keyof SpmsRecord]>

export function SpmsDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const record = getSpmsRecordById(id)

  if (!record) {
    return <Navigate to="/spms" replace />
  }

  const materialRows = getSpmsRecordMaterials(record)
  const totalQty = materialRows.reduce(
    (total, material) => total + material.qty,
    0,
  )

  return (
    <>
      <PageHeader
        title={record.orderNumber}
        subtitle={`${record.customer} - ${record.siteName}`}
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
                '&:hover': {
                  backgroundColor: 'primary.light',
                  boxShadow: 'none',
                },
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
      <LiquidPanel sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
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
            <Chip
              label={`${materialRows.length} Material`}
              variant="outlined"
            />
            <Chip
              label={`Total Qty ${totalQty}`}
              variant="outlined"
            />
          </Stack>
          <Divider />
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
              },
            }}
          >
            {detailGroups.map(([label, key]) => {
              const rawValue = record[key]
              const value =
                key === 'requestDate'
                  ? formatDate(String(rawValue))
                  : String(rawValue ?? '-')

              return (
                <Box
                  key={key}
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(7,19,35,0.42)'
                        : 'rgba(255,255,255,0.42)',
                    border: '1px solid',
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(128, 205, 255, 0.16)'
                        : 'rgba(255,255,255,0.56)',
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <Typography color="text.secondary" variant="caption">
                    {label}
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 800, mt: 0.5, overflowWrap: 'anywhere' }}
                  >
                    {value}
                  </Typography>
                </Box>
              )
            })}
          </Box>

          <Divider />

          <Stack spacing={1.5}>
            <Typography sx={{ fontWeight: 900 }} variant="subtitle1">
              Materials
            </Typography>
            <Stack spacing={1.25}>
              {materialRows.map((material, index) => (
                <Box
                  key={`${material.partNumber}-${index}`}
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(7,19,35,0.42)'
                        : 'rgba(255,255,255,0.42)',
                    border: '1px solid',
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(128, 205, 255, 0.16)'
                        : 'rgba(255,255,255,0.56)',
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <Stack spacing={1.25}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                    >
                      <Chip
                        color="primary"
                        label={`Material ${index + 1}`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip label={`Qty ${material.qty}`} size="small" />
                    </Stack>
                    <Box
                      sx={{
                        display: 'grid',
                        gap: 1.5,
                        gridTemplateColumns: {
                          xs: '1fr',
                          sm: 'repeat(2, minmax(0, 1fr))',
                          lg: 'repeat(4, minmax(0, 1fr))',
                        },
                      }}
                    >
                      {[
                        ['Category', material.categoryMaterial],
                        ['Type', material.typeMaterial],
                        ['Description', material.description],
                        ['Part Number', material.partNumber],
                        ['Origin', material.supportOriginMaterial],
                        [
                          'Destination',
                          material.supportDestinationMaterial ?? '-',
                        ],
                      ].map(([label, value]) => (
                        <Box key={label} sx={{ minWidth: 0 }}>
                          <Typography color="text.secondary" variant="caption">
                            {label}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              mt: 0.35,
                              overflowWrap: 'anywhere',
                            }}
                          >
                            {value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </LiquidPanel>
    </>
  )
}
