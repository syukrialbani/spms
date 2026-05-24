import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts'
import type {
  MonthlySpmsAnalytics,
  SpmsAnalyticsMetric,
} from '@entities/spms'
import { LiquidPanel } from '@shared/ui/LiquidPanel'

type AnalyticsChartProps = {
  data: MonthlySpmsAnalytics[]
}

const metricLabels: Record<SpmsAnalyticsMetric, string> = {
  orders: 'SPMS Orders',
  qty: 'Material Qty',
}

type ChartTooltipProps = TooltipContentProps & {
  metric: SpmsAnalyticsMetric
}

function ChartTooltip({ active, label, metric, payload }: ChartTooltipProps) {
  const value = payload?.[0]?.value
  const displayValue = Array.isArray(value) ? value[0] : value

  if (!active || displayValue === undefined || displayValue === null) {
    return null
  }

  return (
    <Box
      sx={{
        bgcolor: '#1f2026',
        borderRadius: 1,
        boxShadow: '0 18px 42px rgba(12, 20, 40, 0.26)',
        color: 'common.white',
        minWidth: 160,
        p: 1.5,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            bgcolor: '#2f80ed',
            border: '2px solid #ffffff',
            borderRadius: '50%',
            height: 12,
            width: 12,
          }}
        />
        <Typography sx={{ color: '#b7bfcb' }} variant="body2">
          {metricLabels[metric]} - {label}
        </Typography>
      </Stack>
      <Typography sx={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1, mt: 0.75 }}>
        {Number(displayValue).toLocaleString('id-ID')}
      </Typography>
    </Box>
  )
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const [metric, setMetric] = useState<SpmsAnalyticsMetric>('orders')
  const [period, setPeriod] = useState('monthly')

  const highlightedMonth = useMemo(() => {
    if (!data.length) {
      return null
    }

    return data.reduce((highest, point) =>
      point[metric] > highest[metric] ? point : highest,
    )
  }, [data, metric])

  const maxValue = Math.max(...data.map((point) => point[metric]), 0)

  return (
    <LiquidPanel sx={{ mb: 3, p: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1.5, md: 2 }}
        sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 2 }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontSize: { xs: 22, md: 24 }, lineHeight: 1.2 }}
          >
            Analytics
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Monthly order trend from SPMS request data.
          </Typography>
        </Box>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.25}
          sx={{ width: { xs: '100%', md: 'auto' } }}
        >
          <TextField
            select
            size="small"
            value={metric}
            onChange={(event) =>
              setMetric(event.target.value as SpmsAnalyticsMetric)
            }
            sx={{ minWidth: { sm: 160 }, width: { xs: '100%', sm: 'auto' } }}
            slotProps={{
              input: {
                startAdornment: (
                  <Box
                    sx={{
                      bgcolor: '#2f80ed',
                      borderRadius: '50%',
                      height: 10,
                      mr: 1,
                      width: 10,
                    }}
                  />
                ),
              },
            }}
          >
            <MenuItem value="orders">SPMS Orders</MenuItem>
            <MenuItem value="qty">Material Qty</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            sx={{ minWidth: { sm: 126 }, width: { xs: '100%', sm: 'auto' } }}
          >
            <MenuItem value="monthly">Monthly</MenuItem>
          </TextField>
        </Stack>
      </Stack>
      <Box sx={{ height: { xs: 240, sm: 280, md: 330 }, minWidth: 0, overflow: 'hidden' }}>
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart
            data={data}
            margin={{ bottom: 0, left: 0, right: 18, top: 18 }}
          >
            <defs>
              <linearGradient id="spmsAnalyticsArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2f80ed" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#2f80ed" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="rgba(29, 112, 183, 0.1)"
              strokeDasharray="4 8"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="month"
              interval="preserveStartEnd"
              tickLine={false}
              tick={{ fill: '#9aa7b8', fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              domain={[0, Math.max(maxValue, 5)]}
              tickLine={false}
              tick={{ fill: '#9aa7b8', fontSize: 12 }}
              width={36}
            />
            <Tooltip
              content={(props) => <ChartTooltip {...props} metric={metric} />}
              cursor={{
                stroke: '#2f80ed',
                strokeDasharray: '5 8',
                strokeWidth: 2,
              }}
            />
            {highlightedMonth ? (
              <ReferenceLine
                ifOverflow="extendDomain"
                stroke="#2f80ed"
                strokeDasharray="5 8"
                strokeWidth={2}
                x={highlightedMonth.month}
              />
            ) : null}
            <Area
              activeDot={{
                fill: '#2f80ed',
                r: 8,
                stroke: '#ffffff',
                strokeWidth: 4,
              }}
              dataKey={metric}
              dot={{
                fill: '#2f80ed',
                r: 4,
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
              fill="url(#spmsAnalyticsArea)"
              name={metricLabels[metric]}
              stroke="#2f80ed"
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </LiquidPanel>
  )
}
