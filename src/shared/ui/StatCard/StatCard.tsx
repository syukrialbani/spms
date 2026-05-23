import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { LiquidPanel } from '@shared/ui/LiquidPanel'

type StatCardProps = {
  icon: ReactNode
  label: string
  value: string
  helper?: string
}

export function StatCard({ icon, label, value, helper }: StatCardProps) {
  return (
    <LiquidPanel
      sx={{
        p: 2.5,
      }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            alignItems: 'center',
            background:
              'linear-gradient(135deg, rgba(82,197,242,0.85), rgba(29,112,183,0.82))',
            borderRadius: 1,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.38)',
            color: 'common.white',
            display: 'flex',
            height: 44,
            justifyContent: 'center',
            width: 44,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography color="text.secondary" variant="body2">
            {label}
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.25 }}>
            {value}
          </Typography>
          {helper ? (
            <Typography color="text.secondary" variant="caption">
              {helper}
            </Typography>
          ) : null}
        </Box>
      </Stack>
    </LiquidPanel>
  )
}
