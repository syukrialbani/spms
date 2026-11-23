import type { PropsWithChildren } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { AuthProvider } from '@features/auth/model/AuthProvider'
import { ApiErrorProvider } from '@shared/api/ApiErrorProvider'
import { ApiQueryProvider } from '@shared/api/ApiQueryProvider'
import { ConfirmationProvider } from '@shared/lib/confirmation'
import { appTheme } from '../styles/theme'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <ApiQueryProvider>
        <ApiErrorProvider>
          <AuthProvider>
            <ConfirmationProvider>{children}</ConfirmationProvider>
          </AuthProvider>
        </ApiErrorProvider>
      </ApiQueryProvider>
    </ThemeProvider>
  )
}
