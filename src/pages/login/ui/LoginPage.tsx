import { LoginForm, useAuth } from '@features/auth'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
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
        background:
          'linear-gradient(145deg, rgba(8, 28, 70, 0.98) 0%, rgba(20, 58, 120, 0.94) 42%, rgba(29, 112, 183, 0.9) 100%)',
        color: 'common.white',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100svh',
        overflow: 'hidden',
        px: { xs: 2, sm: 4 },
        py: 4,
        position: 'relative',
        '&::before': {
          background:
            'linear-gradient(160deg, rgba(255,255,255,0.2) 0 14%, transparent 14% 100%), linear-gradient(26deg, rgba(5,18,52,0.28) 0 32%, transparent 32% 100%)',
          content: '""',
          inset: 0,
          pointerEvents: 'none',
          position: 'absolute',
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 3, lg: 5 },
          gridTemplateColumns: { xs: '1fr', lg: '0.9fr 1.1fr' },
          maxWidth: 1120,
          position: 'relative',
          width: '100%',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            alignSelf: 'center',
            display: { xs: 'none', lg: 'block' },
          }}
        >
          <Stack spacing={3.5}>
            <AviatBrand size="large" />
            <Box>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontSize: { lg: 56, xl: 64 },
                  fontWeight: 900,
                  letterSpacing: 0,
                  lineHeight: 1.02,
                }}
              >
                SPMS control for Aviat operations.
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.74)', mt: 2, maxWidth: 520 }}>
                Monitor requests, materials, severity, and returns in a focused
                glass workspace.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.25}>
              {['SPMS', 'Material', 'Return'].map((label) => (
                <Chip
                  key={label}
                  label={label}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.14)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    color: 'common.white',
                    fontWeight: 700,
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Box>
        <LiquidPanel
          tone="dark"
          sx={{
            alignSelf: 'center',
            justifySelf: { xs: 'center', lg: 'end' },
            maxWidth: 470,
            p: { xs: 3, sm: 4.5 },
            width: '100%',
          }}
        >
          <Stack spacing={3}>
            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
              <VerifiedRoundedIcon sx={{ color: 'secondary.main' }} />
              <Typography sx={{ color: 'common.white', fontWeight: 800 }}>SPMS Secure Login</Typography>
            </Stack>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{ color: 'common.white', fontWeight: 900 }}
              >
                Login
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.68)' }}>
                Use your account to continue into SPMS.
              </Typography>
            </Box>
            <LoginForm onSuccess={() => navigate(targetPath, { replace: true })} />
          </Stack>
        </LiquidPanel>
      </Box>
    </Box>
  )
}
