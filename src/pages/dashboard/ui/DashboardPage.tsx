import {
  getMonthlySpmsAnalytics,
  getSeverityColor,
  getSpmsStatusColor,
  spmsRecords,
  spmsStatuses,
  type SpmsStatus,
} from '@entities/spms'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { formatDate } from '@shared/lib/format'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import { PageHeader } from '@shared/ui/PageHeader'
import { StatCard } from '@shared/ui/StatCard'
import { useNavigate } from 'react-router-dom'
import { AnalyticsChart } from './AnalyticsChart'
import { CustomerStatusTable } from './CustomerStatusTable'

const totalQty = spmsRecords.reduce((total, record) => total + record.qty, 0)
const approvedCount = spmsRecords.filter(
  (record) => record.statusSpms === 'Approved',
).length
const approvalQueueCount = spmsRecords.filter(
  (record) => record.statusSpms === 'Waiting Approval',
).length
const highSeverityCount = spmsRecords.filter(
  (record) => record.severity === 'High' || record.severity === 'Critical',
).length

const statusCount = (status: SpmsStatus) =>
  spmsRecords.filter((record) => record.statusSpms === status).length

export function DashboardPage() {
  const navigate = useNavigate()
  const recentRecords = spmsRecords.slice(0, 4)
  const analyticsData = getMonthlySpmsAnalytics(spmsRecords)

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Ringkasan order material, severity, dan status SPMS."
      />
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          mb: 3,
        }}
      >
        <StatCard
          icon={<ChecklistRoundedIcon />}
          label="Total Orders"
          value={String(spmsRecords.length)}
          helper="Across active request"
        />
        <StatCard
          icon={<AssignmentTurnedInRoundedIcon />}
          label="Approved"
          value={String(approvedCount)}
          helper="Ready for material flow"
        />
        <StatCard
          icon={<PendingActionsRoundedIcon />}
          label="Approval Queue"
          value={String(approvalQueueCount)}
          helper="Need decision"
        />
        <StatCard
          icon={<Inventory2RoundedIcon />}
          label="Total Qty"
          value={String(totalQty)}
          helper={`${highSeverityCount} high severity`}
        />
      </Box>
      <AnalyticsChart data={analyticsData} />
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '0.9fr 1.1fr' },
        }}
      >
        <Stack spacing={2}>
          <CustomerStatusTable />
          <LiquidPanel
            sx={{
              p: 2.5,
            }}
          >
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h6">Status Distribution</Typography>
                <Typography color="text.secondary" variant="body2">
                  SPMS movement by approval stage.
                </Typography>
              </Box>
              {spmsStatuses.map((status) => {
                const count = statusCount(status)
                const percentage = Math.round((count / spmsRecords.length) * 100)

                return (
                  <Box key={status}>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: 'space-between', mb: 1 }}
                    >
                      <Chip
                        color={getSpmsStatusColor(status)}
                        label={status}
                        size="small"
                      />
                      <Typography color="text.secondary" variant="body2">
                        {count} records
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{ borderRadius: 1, height: 8 }}
                    />
                  </Box>
                )
              })}
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                {(['Low', 'Medium', 'High', 'Critical'] as const).map((severity) => (
                  <Chip
                    key={severity}
                    color={getSeverityColor(severity)}
                    label={`${severity}: ${
                      spmsRecords.filter((record) => record.severity === severity)
                        .length
                    }`}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Stack>
          </LiquidPanel>
        </Stack>
        <LiquidPanel
          sx={{
            p: 2.5,
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6">Recent SPMS</Typography>
              <Typography color="text.secondary" variant="body2">
                Latest material requests in the workspace.
              </Typography>
            </Box>
            {recentRecords.map((record) => (
              <ButtonBase
                key={record.id}
                onClick={() => navigate(`/spms/${record.id}`)}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  display: 'block',
                  p: 2,
                  textAlign: 'left',
                  width: '100%',
                  '&:hover': {
                    bgcolor: 'rgba(47, 128, 237, 0.08)',
                  },
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  sx={{ justifyContent: 'space-between' }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700 }}>
                      {record.orderNumber}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {record.customer} - {record.siteName}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      Requested {formatDate(record.requestDate)}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Chip
                      color={getSpmsStatusColor(record.statusSpms)}
                      label={record.statusSpms}
                      size="small"
                    />
                    <Typography sx={{ fontWeight: 700 }}>{record.qty} pcs</Typography>
                  </Stack>
                </Stack>
              </ButtonBase>
            ))}
          </Stack>
        </LiquidPanel>
      </Box>
    </>
  )
}
