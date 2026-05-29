import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  ConfirmationContext,
  type ConfirmationOptions,
  type ConfirmationContextValue,
} from './ConfirmationContext'

type ActiveConfirmation = Required<
  Pick<ConfirmationOptions, 'cancelLabel' | 'confirmLabel' | 'tone'>
> &
  Pick<ConfirmationOptions, 'description' | 'title'>

const defaultOptions: ActiveConfirmation = {
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm',
  description: '',
  title: 'Confirm action',
  tone: 'primary',
}

export function ConfirmationProvider({ children }: PropsWithChildren) {
  const [activeConfirmation, setActiveConfirmation] =
    useState<ActiveConfirmation | null>(null)
  const resolverRef = useRef<((confirmed: boolean) => void) | null>(null)

  const closeConfirmation = useCallback((confirmed: boolean) => {
    resolverRef.current?.(confirmed)
    resolverRef.current = null
    setActiveConfirmation(null)
  }, [])

  const confirm = useCallback((options: ConfirmationOptions) => {
    setActiveConfirmation({
      ...defaultOptions,
      ...options,
    })

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  const value = useMemo<ConfirmationContextValue>(
    () => ({ confirm }),
    [confirm],
  )

  const isDanger = activeConfirmation?.tone === 'danger'

  return (
    <ConfirmationContext.Provider value={value}>
      {children}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={Boolean(activeConfirmation)}
        onClose={() => closeConfirmation(false)}
        slotProps={{
          paper: {
            sx: {
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(145deg, rgba(7, 19, 35, 0.96), rgba(10, 42, 94, 0.9))'
                  : 'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(237,247,255,0.92))',
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(128, 205, 255, 0.2)'
                  : 'rgba(255,255,255,0.74)',
              borderRadius: 1,
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 24px 70px rgba(0, 8, 20, 0.62)'
                  : '0 24px 70px rgba(12, 67, 122, 0.22)',
            },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1.25 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                alignItems: 'center',
                bgcolor: (theme) =>
                  alpha(
                    isDanger
                      ? theme.palette.error.main
                      : theme.palette.primary.main,
                    theme.palette.mode === 'dark' ? 0.18 : 0.1,
                  ),
                borderRadius: 1,
                color: isDanger ? 'error.main' : 'primary.main',
                display: 'flex',
                height: 42,
                justifyContent: 'center',
                width: 42,
              }}
            >
              {isDanger ? (
                <WarningAmberRoundedIcon />
              ) : activeConfirmation ? (
                <CheckCircleRoundedIcon />
              ) : (
                <InfoOutlinedIcon />
              )}
            </Box>
            <Typography sx={{ fontWeight: 900 }} variant="h6">
              {activeConfirmation?.title ?? defaultOptions.title}
            </Typography>
          </Stack>
        </DialogTitle>
        {activeConfirmation?.description ? (
          <DialogContent sx={{ pt: 0 }}>
            <Typography color="text.secondary" variant="body2">
              {activeConfirmation.description}
            </Typography>
          </DialogContent>
        ) : null}
        <DialogActions sx={{ gap: 1, px: 3, pb: 3, pt: 1 }}>
          <Button
            onClick={() => closeConfirmation(false)}
            type="button"
            variant="outlined"
            sx={{ background: 'transparent', minWidth: 96 }}
          >
            {activeConfirmation?.cancelLabel ?? defaultOptions.cancelLabel}
          </Button>
          <Button
            color={isDanger ? 'error' : 'primary'}
            onClick={() => closeConfirmation(true)}
            type="button"
            variant="contained"
            sx={{ minWidth: 112 }}
          >
            {activeConfirmation?.confirmLabel ?? defaultOptions.confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmationContext.Provider>
  )
}
