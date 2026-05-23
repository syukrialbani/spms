import {
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import type { PaletteMode } from '@mui/material'
import { ColorModeContext, type ColorModeContextValue } from './ColorModeContext'

const storageKey = 'spms.colorMode'

const getInitialMode = (): PaletteMode => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedMode = window.localStorage.getItem(storageKey)

  if (storedMode === 'light' || storedMode === 'dark') {
    return storedMode
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ColorModeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<PaletteMode>(() => getInitialMode())

  useEffect(() => {
    document.documentElement.dataset.theme = mode
    window.localStorage.setItem(storageKey, mode)
  }, [mode])

  const value = useMemo<ColorModeContextValue>(
    () => ({
      mode,
      toggleMode: () =>
        setMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  )

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  )
}
