import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

type PageHeaderProps = {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.25}
      sx={{
        alignItems: { sm: 'flex-end' },
        justifyContent: 'space-between',
        mb: { xs: 1.25, md: 1.75 },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: 20, sm: 22, md: 24 },
            lineHeight: 1.12,
            overflowWrap: 'anywhere',
          }}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            color="text.secondary"
            sx={{ fontSize: 12, mt: 0.35, maxWidth: 680 }}
            variant="body2"
          >
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {actions ? (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            width: { xs: '100%', sm: 'auto' },
            '& > *': {
              width: { xs: '100%', sm: 'auto' },
            },
          }}
        >
          {actions}
        </Box>
      ) : null}
    </Stack>
  )
}
