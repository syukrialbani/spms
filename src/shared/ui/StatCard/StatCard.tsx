import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { LiquidPanel } from '@shared/ui/LiquidPanel'

type StatCardProps = {
  icon?: ReactNode
  label: string
  value: string
  helper?: string
}

export function StatCard({ icon, label, value, helper }: StatCardProps) {
  return (
    <LiquidPanel sx={{ px: 2, py: 1.75 }}>
      <Stack spacing={0.75} sx={{ minWidth: 0 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{ fontSize: '0.78rem', fontWeight: 600 }}
          >
            {label}
          </Typography>
          {icon ? (
            <Box
              sx={{
                alignItems: 'center',
                bgcolor: '#eaf6ee',
                borderRadius: '8px',
                color: '#1f8a3b',
                display: 'flex',
                height: 30,
                justifyContent: 'center',
                width: 30,
              }}
            >
              {icon}
            </Box>
          ) : null}
        </Stack>
        <Typography
          sx={{
            color: 'text.primary',
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: { xs: 22, md: 25 },
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
          }}
        >
          {value}
        </Typography>
        {helper ? (
          <Typography color="text.secondary" variant="caption">
            {helper}
          </Typography>
        ) : null}
      </Stack>
    </LiquidPanel>
  )
}
