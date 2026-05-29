import { useMemo, type PropsWithChildren } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { AuthProvider } from '@features/auth/model/AuthProvider'
import { ApiErrorProvider } from '@shared/api/ApiErrorProvider'
import { ApiQueryProvider } from '@shared/api/ApiQueryProvider'
import { ColorModeProvider, useColorMode } from '@shared/lib/color-mode'
import { ConfirmationProvider } from '@shared/lib/confirmation'
import { getAppTheme } from '../styles/theme'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ColorModeProvider>
      <ThemedProviders>{children}</ThemedProviders>
    </ColorModeProvider>
  )
}

function ThemedProviders({ children }: PropsWithChildren) {
  const { mode } = useColorMode()
  const theme = useMemo(() => getAppTheme(mode), [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
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
