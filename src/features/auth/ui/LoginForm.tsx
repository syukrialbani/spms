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
import { authSessionStorage } from '../model/authSessionStorage'
import type { LoginCredentials } from '../model/types'
import { useAuth } from '../model/useAuth'

type LoginFormProps = {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth()

  const [values, setValues] = useState<LoginCredentials>({
    username: authSessionStorage.getRememberedUsername(),
    password: '',
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rememberMe, setRememberMe] = useState(() =>
    authSessionStorage.isRememberMeEnabled(),
  )
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
      await login(values, { rememberMe })
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
      <Stack spacing={2}>
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <FormTextField
          label="Username"
          placeholder="Masukkan username"
          name="username"
          autoComplete="off"
          value={values.username}
          onChange={updateField('username')}
          required
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonRoundedIcon
                    fontSize="small"
                    sx={{ color: 'text.secondary' }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        <FormTextField
          label="Password"
          placeholder="Masukkan password"
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
                  <LockRoundedIcon
                    fontSize="small"
                    sx={{ color: 'text.secondary' }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((current) => !current)}
                    onMouseDown={(event) => event.preventDefault()}
                    edge="end"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    {showPassword ? (
                      <VisibilityOffRoundedIcon fontSize="small" />
                    ) : (
                      <VisibilityRoundedIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              size="small"
            />
          }
          label="Remember me"
          sx={{ color: 'text.secondary' }}
        />

        <AppButton
          type="submit"
          size="large"
          startIcon={
            isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <LoginRoundedIcon fontSize="small" />
            )
          }
          disabled={isSubmitting}
          fullWidth
          sx={{ minHeight: 42 }}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </AppButton>
      </Stack>
    </Box>
  )
}
