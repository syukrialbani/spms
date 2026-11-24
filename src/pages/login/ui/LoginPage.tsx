import { LoginForm, useAuth } from '@features/auth'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { AviatBrand } from '@shared/ui/AviatBrand'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

type LoginLocationState = {
  from?: {
    pathname?: string
  }
}

export function LoginPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LoginLocationState | null
  const targetPath = state?.from?.pathname ?? '/dashboard'

  if (isAuthenticated) {
    return <Navigate to={targetPath} replace />
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: '#f5f7f6',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100svh',
        overflowX: 'clip',
        px: { xs: 1.5, sm: 3 },
        py: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          bgcolor: '#ffffff',
          border: '1px solid #dce5e0',
          borderRadius: '14px',
          boxShadow: '0 12px 32px rgba(15, 25, 21, 0.08)',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          maxWidth: 880,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <Box
          sx={{
            bgcolor: '#0e1614',
            color: '#eef4f0',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 4.5,
          }}
        >
          <AviatBrand size="large" />
          <Stack spacing={1.5}>
            <Box
              sx={{
                bgcolor: '#8dc63f',
                borderRadius: '99px',
                height: 4,
                width: 44,
              }}
            />
            <Typography
              component="h1"
              sx={{
                color: '#ffffff',
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
              }}
            >
              SPMS control for Aviat operations.
            </Typography>
            <Typography sx={{ color: '#9eb0a7', fontSize: 13.5, lineHeight: 1.55 }}>
              Kelola permintaan spare part, delivery order, stock MS, dan return
              material dalam satu platform operasional modern.
            </Typography>
          </Stack>
          <Box sx={{ borderTop: '1px solid #1b2824', pt: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#7a8f85',
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              }}
            >
              SPMS · Delivery Order · Stock MS
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: '#ffffff',
            p: { xs: 3, sm: 4.5 },
          }}
        >
          <Stack spacing={2.5}>
            <Box
              sx={{
                bgcolor: '#0e1614',
                borderRadius: '8px',
                display: { xs: 'inline-flex', md: 'none' },
                p: 1.25,
                width: 'fit-content',
              }}
            >
              <AviatBrand />
            </Box>
            <Box>
              <Typography
                component="h2"
                sx={{
                  color: '#0f1915',
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                Sign in
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 0.4 }}>
                Masuk menggunakan akun SPMS Anda.
              </Typography>
            </Box>
            <LoginForm onSuccess={() => navigate(targetPath, { replace: true })} />
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
