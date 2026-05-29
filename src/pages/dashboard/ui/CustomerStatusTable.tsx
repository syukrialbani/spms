import { useMemo, useState, type MouseEvent } from 'react'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import {
  getSpmsStatusColor,
  spmsRecords,
  spmsStatuses,
  type SpmsRecord,
  type SpmsStatus,
} from '@entities/spms'
import { LiquidPanel } from '@shared/ui/LiquidPanel'

type CustomerStatusSummary = {
  customer: string
  total: number
  statuses: Record<SpmsStatus, SpmsRecord[]>
}

type ActivePopover = {
  customer: string
  status: SpmsStatus
  records: SpmsRecord[]
}

const createEmptyStatusMap = () =>
  spmsStatuses.reduce(
    (result, status) => ({
      ...result,
      [status]: [],
    }),
    {} as Record<SpmsStatus, SpmsRecord[]>,
  )

export function CustomerStatusTable() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [activePopover, setActivePopover] = useState<ActivePopover | null>(null)

  const summaries = useMemo(() => {
    const customerMap = new Map<string, CustomerStatusSummary>()

    spmsRecords.forEach((record) => {
      const summary =
        customerMap.get(record.customer) ??
        ({
          customer: record.customer,
          statuses: createEmptyStatusMap(),
          total: 0,
        } satisfies CustomerStatusSummary)

      summary.statuses[record.statusSpms].push(record)
      summary.total += 1
      customerMap.set(record.customer, summary)
    })

    return Array.from(customerMap.values()).sort((first, second) =>
      first.customer.localeCompare(second.customer),
    )
  }, [])

  const closePopover = () => {
    setAnchorEl(null)
    setActivePopover(null)
  }

  const openPopover = (
    event: MouseEvent<HTMLElement>,
    customer: string,
    status: SpmsStatus,
    records: SpmsRecord[],
  ) => {
    if (!records.length) {
      return
    }

    setAnchorEl(event.currentTarget)
    setActivePopover({ customer, records, status })
  }

  const goToDetail = (record: SpmsRecord) => {
    closePopover()
    navigate(`/spms/${record.id}`)
  }

  return (
    <LiquidPanel sx={{ minWidth: 0, p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{
            alignItems: { sm: 'flex-start' },
            justifyContent: 'space-between',
            minWidth: 0,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6">Customer Status Matrix</Typography>
            <Typography color="text.secondary" variant="body2">
              Customer order count by SPMS status.
            </Typography>
          </Box>
          <Chip
            color="primary"
            label={`${spmsRecords.length} total orders`}
            size="small"
            variant="outlined"
          />
        </Stack>
        <Box
          sx={{
            display: { xs: 'grid', md: 'none' },
            gap: 1.25,
            minWidth: 0,
          }}
        >
          {summaries.map((summary) => (
            <Box
              key={summary.customer}
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(7,19,35,0.36)'
                    : 'rgba(255,255,255,0.44)',
                border: '1px solid',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(128, 205, 255, 0.16)'
                    : 'rgba(29, 112, 183, 0.14)',
                borderRadius: 1,
                minWidth: 0,
                p: 1.25,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  mb: 1.25,
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 900, minWidth: 0, overflowWrap: 'anywhere' }}
                >
                  {summary.customer}
                </Typography>
                <Chip
                  label={summary.total}
                  size="small"
                  sx={{ flexShrink: 0, fontWeight: 900 }}
                />
              </Stack>
              <Box
                sx={{
                  display: 'grid',
                  gap: 0.75,
                  gridTemplateColumns: {
                    xs: 'repeat(2, minmax(0, 1fr))',
                    sm: 'repeat(3, minmax(0, 1fr))',
                  },
                  minWidth: 0,
                }}
              >
                {spmsStatuses.map((status) => {
                  const records = summary.statuses[status]
                  const count = records.length

                  return (
                    <ButtonBase
                      key={status}
                      disabled={!count}
                      onClick={(event) =>
                        openPopover(event, summary.customer, status, records)
                      }
                      sx={{
                        bgcolor: (theme) =>
                          count
                            ? theme.palette.mode === 'dark'
                              ? 'rgba(82, 197, 242, 0.12)'
                              : 'rgba(47, 128, 237, 0.1)'
                            : 'rgba(96, 112, 138, 0.08)',
                        border: '1px solid',
                        borderColor: (theme) =>
                          count
                            ? theme.palette.mode === 'dark'
                              ? 'rgba(82, 197, 242, 0.28)'
                              : 'rgba(47, 128, 237, 0.22)'
                            : 'rgba(96, 112, 138, 0.08)',
                        borderRadius: 1,
                        color: count ? 'primary.main' : 'text.secondary',
                        display: 'block',
                        minHeight: 58,
                        minWidth: 0,
                        p: 1,
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      <Typography
                        color="text.secondary"
                        sx={{
                          fontSize: 11,
                          fontWeight: 700,
                          lineHeight: 1.2,
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {status}
                      </Typography>
                      <Typography sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                        {count}
                      </Typography>
                    </ButtonBase>
                  )
                })}
              </Box>
            </Box>
          ))}
        </Box>
        <TableContainer
          sx={{
            display: { xs: 'none', md: 'block' },
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <Table size="small" sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 220 }}>Customer</TableCell>
                {spmsStatuses.map((status) => (
                  <TableCell key={status} align="center" sx={{ minWidth: 122 }}>
                    {status}
                  </TableCell>
                ))}
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summaries.map((summary) => (
                <TableRow key={summary.customer} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {summary.customer}
                    </Typography>
                  </TableCell>
                  {spmsStatuses.map((status) => {
                    const records = summary.statuses[status]
                    const count = records.length

                    return (
                      <TableCell key={status} align="center">
                        <ButtonBase
                          disabled={!count}
                          onClick={(event) =>
                            openPopover(event, summary.customer, status, records)
                          }
                          sx={{
                            bgcolor: (theme) =>
                              count
                                ? theme.palette.mode === 'dark'
                                  ? 'rgba(82, 197, 242, 0.14)'
                                  : 'rgba(47, 128, 237, 0.12)'
                                : 'rgba(96, 112, 138, 0.08)',
                            border: '1px solid',
                            borderColor: (theme) =>
                              count
                                ? theme.palette.mode === 'dark'
                                  ? 'rgba(82, 197, 242, 0.32)'
                                  : 'rgba(47, 128, 237, 0.28)'
                                : 'rgba(96, 112, 138, 0.08)',
                            borderRadius: 1,
                            color: count ? 'primary.main' : 'text.secondary',
                            fontWeight: 900,
                            height: 32,
                            minWidth: 42,
                          }}
                        >
                          {count}
                        </ButtonBase>
                      </TableCell>
                    )
                  })}
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 900 }}>
                      {summary.total}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <Popover
        open={Boolean(anchorEl && activePopover)}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        slotProps={{
          paper: {
            sx: {
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(145deg, rgba(7,19,35,0.94), rgba(10,42,94,0.82))'
                  : 'linear-gradient(145deg, rgba(255,255,255,0.92), rgba(232,247,255,0.82))',
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(128, 205, 255, 0.18)'
                  : 'rgba(255,255,255,0.72)',
              borderRadius: 1,
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 14px 34px rgba(0, 8, 20, 0.34)'
                  : '0 12px 30px rgba(12, 67, 122, 0.16)',
              maxWidth: 'calc(100vw - 24px)',
              minWidth: { xs: 0, sm: 320 },
              p: 2,
              width: { xs: 'calc(100vw - 32px)', sm: 360 },
            },
          },
        }}
      >
        {activePopover ? (
          <Stack spacing={1.25}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 900 }}>{activePopover.customer}</Typography>
              <Chip
                color={getSpmsStatusColor(activePopover.status)}
                label={activePopover.status}
                size="small"
              />
            </Stack>
            {activePopover.records.map((record) => (
              <ButtonBase
                key={record.id}
                onClick={() => goToDetail(record)}
                sx={{
                  border: '1px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(128, 205, 255, 0.16)'
                      : 'rgba(29, 112, 183, 0.16)',
                  borderRadius: 1,
                  display: 'block',
                  p: 1.25,
                  textAlign: 'left',
                  width: '100%',
                  '&:hover': {
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(82, 197, 242, 0.1)'
                        : 'rgba(47, 128, 237, 0.1)',
                  },
                }}
              >
                <Link component="span" underline="none" sx={{ fontWeight: 900 }}>
                  {record.orderNumber}
                </Link>
                <Typography color="text.secondary" variant="body2">
                  {record.siteName} - {record.area}
                </Typography>
              </ButtonBase>
            ))}
          </Stack>
        ) : null}
      </Popover>
    </LiquidPanel>
  )
}
