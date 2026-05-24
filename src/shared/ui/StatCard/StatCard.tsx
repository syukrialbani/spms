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
        p: { xs: 2, md: 2.5 },
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 1.5, md: 2 }}
        sx={{ alignItems: 'center', minWidth: 0 }}
      >
        <Box
          sx={{
            alignItems: 'center',
            background:
              'linear-gradient(135deg, rgba(82,197,242,0.85), rgba(29,112,183,0.82))',
            borderRadius: 1,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.38)',
            color: 'common.white',
            display: 'flex',
            flexShrink: 0,
            height: { xs: 40, md: 44 },
            justifyContent: 'center',
            width: { xs: 40, md: 44 },
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography color="text.secondary" variant="body2">
            {label}
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontSize: { xs: 22, md: 24 }, mt: 0.25 }}
          >
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
