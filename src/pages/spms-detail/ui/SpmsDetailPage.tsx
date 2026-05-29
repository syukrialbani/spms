import {
  getReturnStatusColor,
  getSeverityColor,
  getSpmsRecordById,
  getSpmsStatusColor,
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
  ['Category Material', 'categoryMaterial'],
  ['Type Material', 'typeMaterial'],
  ['Description', 'description'],
  ['Part Number', 'partNumber'],
  ['Qty', 'qty'],
  ['Support Origin Material', 'supportOriginMaterial'],
  ['Site', 'site'],
] as const

export function SpmsDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const record = getSpmsRecordById(id)

  if (!record) {
    return <Navigate to="/spms" replace />
  }

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
                  : String(rawValue)

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
        </Stack>
      </LiquidPanel>
    </>
  )
}
