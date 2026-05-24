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
      spacing={2}
      sx={{
        alignItems: { sm: 'flex-end' },
        justifyContent: 'space-between',
        mb: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: 28, sm: 32, md: 34 },
            lineHeight: 1.12,
            overflowWrap: 'anywhere',
          }}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            color="text.secondary"
            sx={{ mt: 0.75, maxWidth: 680 }}
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
