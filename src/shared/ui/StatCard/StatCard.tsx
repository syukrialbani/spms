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
      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            {label}
          </Typography>
          {icon ? (
            <Box sx={{ color: 'text.secondary', display: 'flex', opacity: 0.7 }}>
              {icon}
            </Box>
          ) : null}
        </Stack>
        <Typography
          sx={{
            color: 'text.primary',
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: { xs: 22, md: 26 },
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 500,
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
