import {
  deliveryWorkflowStatuses,
  getDeliveryWorkflowStatus,
  getSeverityColor,
  getSpmsStatusColor,
  spmsStatuses,
  useSpmsListQuery,
  type DeliveryWorkflowStatus,
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
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomerStatusTable } from './CustomerStatusTable'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data } = useSpmsListQuery()
  const records = useMemo(() => data?.data ?? [], [data])
  const totalOrders = data?.meta.total ?? records.length
  const recentRecords = records.slice(0, 4)
  const totalQty = records.reduce((total, record) => total + record.qty, 0)
  const closedCount =
    data?.statusCounts?.Closed ??
    records.filter((record) => record.statusSpms === 'Closed').length
  const approvalQueueCount = data?.statusCounts
    ? (data.statusCounts['Waiting Approval Delivery'] ?? 0) +
      (data.statusCounts['Waiting Review Delivery'] ?? 0) +
      (data.statusCounts['Waiting Approval Pickup'] ?? 0) +
      (data.statusCounts['Waiting Review Pickup'] ?? 0)
    : records.filter(
        (record) =>
          record.statusSpms === 'Waiting Approval Delivery' ||
          record.statusSpms === 'Waiting Review Delivery' ||
          record.statusSpms === 'Waiting Approval Pickup' ||
          record.statusSpms === 'Waiting Review Pickup',
      ).length
  const highSeverityCount = records.filter(
    (record) => record.severity === 'High' || record.severity === 'Critical',
  ).length
  const statusCount = (status: SpmsStatus) =>
    data?.statusCounts?.[status] ??
    records.filter((record) => record.statusSpms === status).length
  const deliveryStatusCount = (status: DeliveryWorkflowStatus) =>
    records.filter((record) => getDeliveryWorkflowStatus(record) === status)
      .length
  // const analyticsData = getMonthlySpmsAnalytics(records)

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Ringkasan order material, severity, dan status SPMS."
      />
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1.5, md: 2 },
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          mb: { xs: 2, md: 3 },
        }}
      >
        <StatCard
          icon={<ChecklistRoundedIcon fontSize="small" />}
          label="Total Orders"
          value={totalOrders.toLocaleString('id-ID')}
          helper="Total SPMS records"
        />
        <StatCard
          icon={<AssignmentTurnedInRoundedIcon fontSize="small" />}
          label="Closed"
          value={closedCount.toLocaleString('id-ID')}
          helper="Completed tickets"
        />
        <StatCard
          icon={<PendingActionsRoundedIcon fontSize="small" />}
          label="Approval Queue"
          value={approvalQueueCount.toLocaleString('id-ID')}
          helper="Need decision"
        />
        <StatCard
          icon={<Inventory2RoundedIcon fontSize="small" />}
          label="Recent Sample Qty"
          value={totalQty.toLocaleString('id-ID')}
          helper={`${highSeverityCount} critical/high in recent 200`}
        />
      </Box>
      {/* <AnalyticsChart data={analyticsData} /> */}
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1.5, md: 2 },
          gridTemplateColumns: { xs: '1fr', lg: '0.9fr 1.1fr' },
          minWidth: 0,
          '& > *': {
            minWidth: 0,
          },
        }}
      >
        <LiquidPanel sx={{ mb: 3, p: { xs: 2, md: 3 } }}>
          <Stack spacing={2.5} sx={{ minWidth: 0 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6">Status Distribution</Typography>
              <Typography color="text.secondary" variant="body2">
                SPMS movement by approval stage.
              </Typography>
            </Box>
            {spmsStatuses.map((status) => {
              const count = statusCount(status)
              const percentage = records.length
                ? Math.round((count / records.length) * 100)
                : 0

              return (
                <Box key={status} sx={{ minWidth: 0 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      mb: 1,
                      minWidth: 0,
                      rowGap: 0.75,
                    }}
                  >
                    <Chip
                      color={getSpmsStatusColor(status)}
                      label={status}
                      size="small"
                      sx={{ maxWidth: '100%' }}
                    />
                    <Typography color="text.secondary" variant="body2">
                      {count} records
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      borderRadius: 1,
                      height: 8,
                      maxWidth: '100%',
                      overflow: 'hidden',
                    }}
                  />
                </Box>
              )
            })}
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: 'wrap', minWidth: 0, rowGap: 1 }}
            >
              {(['Low', 'Medium', 'High', 'Critical'] as const).map((severity) => (
                <Chip
                  key={severity}
                  color={getSeverityColor(severity)}
                  label={`${severity}: ${
                    records.filter((record) => record.severity === severity)
                      .length
                  }`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Stack>
        </LiquidPanel>

        <LiquidPanel sx={{ mb: 3, p: { xs: 2, md: 3 } }}>
          <Stack spacing={2.5} sx={{ minWidth: 0 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6">Status Delivery</Typography>
              <Typography color="text.secondary" variant="body2">
                SPMS movement by delivery stage.
              </Typography>
            </Box>
            {deliveryWorkflowStatuses.map((status) => {
              const count = deliveryStatusCount(status)
              const percentage = records.length
                ? Math.round((count / records.length) * 100)
                : 0

              return (
                <Box key={status} sx={{ minWidth: 0 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      mb: 1,
                      minWidth: 0,
                      rowGap: 0.75,
                    }}
                  >
                    <Chip
                      color={getSpmsStatusColor(status)}
                      label={status}
                      size="small"
                      sx={{ maxWidth: '100%' }}
                    />
                    <Typography color="text.secondary" variant="body2">
                      {count} records
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      borderRadius: 1,
                      height: 8,
                      maxWidth: '100%',
                      overflow: 'hidden',
                    }}
                  />
                </Box>
              )
            })}
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: 'wrap', minWidth: 0, rowGap: 1 }}
            >
              {(['Low', 'Medium', 'High', 'Critical'] as const).map((severity) => (
                <Chip
                  key={severity}
                  color={getSeverityColor(severity)}
                  label={`${severity}: ${
                    records.filter((record) => record.severity === severity)
                      .length
                  }`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Stack>
        </LiquidPanel>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1.5, md: 2 },
          gridTemplateColumns: { xs: '1fr', lg: '0.9fr 1.1fr' },
          minWidth: 0,
          '& > *': {
            minWidth: 0,
          },
        }}
      >
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <CustomerStatusTable />
        </Stack>
        <LiquidPanel
          sx={{
            minWidth: 0,
            p: { xs: 2, md: 2.5 },
          }}
        >
          <Stack spacing={2} sx={{ minWidth: 0 }}>
            <Box sx={{ minWidth: 0 }}>
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
                  minWidth: 0,
                  p: { xs: 1.5, md: 2 },
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
                  sx={{
                    alignItems: { sm: 'center' },
                    justifyContent: 'space-between',
                    minWidth: 0,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>
                      {record.orderNumber}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ overflowWrap: 'anywhere' }}
                      variant="body2"
                    >
                      {record.customer} - {record.siteName}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      Requested {formatDate(record.requestDate)}
                    </Typography>
                  </Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      minWidth: 0,
                      rowGap: 1,
                    }}
                  >
                    <Chip
                      color={getSpmsStatusColor(record.statusSpms)}
                      label={record.statusSpms}
                      size="small"
                      sx={{ maxWidth: '100%' }}
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
