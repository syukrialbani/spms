import LockRoundedIcon from '@mui/icons-material/LockRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import { ApiError } from '@shared/api'
import { AppButton } from '@shared/ui/AppButton'
import { FormTextField } from '@shared/ui/FormTextField'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { LoginCredentials } from '../model/types'
import { useAuth } from '../model/useAuth'

type LoginFormProps = {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth()

  const [values, setValues] = useState<LoginCredentials>({
    username: '',
    password: '',
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const updateField =
    (field: keyof LoginCredentials) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({
        ...current,
        [field]: event.target.value,
      }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await login(values)
      onSuccess()
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Login gagal. Silakan coba lagi.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} autoComplete="off">
      <Stack spacing={2.25}>
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <FormTextField
          placeholder="Username"
          name="username"
          autoComplete="off"
          value={values.username}
          onChange={updateField('username')}
          required
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonRoundedIcon sx={{ color: 'secondary.main' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <FormTextField
          placeholder="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={values.password}
          onChange={updateField('password')}
          required
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockRoundedIcon sx={{ color: 'secondary.main' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((current) => !current)}
                    onMouseDown={(event) => event.preventDefault()}
                    edge="end"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(237, 247, 255, 0.78)'
                          : 'rgba(9, 27, 52, 0.78)',
                      '&:hover': {
                        color: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'primary.main'
                            : 'primary.dark',
                      },
                    }}
                  >
                    {showPassword ? (
                      <VisibilityOffRoundedIcon />
                    ) : (
                      <VisibilityRoundedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                size="small"
              />
            }
            label="Remember me"
            sx={{ color: 'rgba(255,255,255,0.78)' }}
          />
        </Stack>

        <AppButton
          type="submit"
          size="large"
          startIcon={
            isSubmitting ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <LoginRoundedIcon />
            )
          }
          disabled={isSubmitting}
          fullWidth
          sx={{ minHeight: 52 }}
        >
          {isSubmitting ? 'Signing in' : 'Login'}
        </AppButton>
      </Stack>
    </Box>
  )
}
