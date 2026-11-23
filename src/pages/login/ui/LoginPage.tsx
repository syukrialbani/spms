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
        bgcolor: '#cdd4dc',
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
          border: '1px solid #3c4654',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          maxWidth: 880,
          width: '100%',
        }}
      >
        <Box
          sx={{
            bgcolor: '#18202c',
            color: '#eef1f4',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 4.5,
          }}
        >
          <AviatBrand size="large" />
          <Stack spacing={1.5}>
            <Typography
              component="h1"
              sx={{
                color: '#ffffff',
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
              }}
            >
              SPMS control for Aviat operations.
            </Typography>
            <Typography sx={{ color: '#b7c2d0', fontSize: 14, lineHeight: 1.5 }}>
              Kelola permintaan spare part, delivery order, stock MS, dan return
              material dalam satu sistem operasional.
            </Typography>
          </Stack>
          <Box sx={{ borderTop: '1px solid #2b3646', pt: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#9aa7b8',
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              }}
            >
              SPMS · Delivery Order · Stock MS
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: '#f5f7f9',
            borderTop: { xs: '3px solid #9e1c4d', md: 0 },
            p: { xs: 3, sm: 4.5 },
          }}
        >
          <Stack spacing={2.5}>
            <Box
              sx={{
                bgcolor: '#18202c',
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
                  color: '#18202c',
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                }}
              >
                Sign in
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
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
