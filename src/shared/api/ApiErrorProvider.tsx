import { useEffect, useState, type PropsWithChildren } from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { API_ERROR_EVENT, type ApiErrorEventDetail } from './events'

const fallbackMessage = 'Request gagal diproses. Silakan coba lagi.'

export function ApiErrorProvider({ children }: PropsWithChildren) {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleApiError = (event: Event) => {
      const detail = (event as CustomEvent<ApiErrorEventDetail>).detail

      setMessage(detail?.message || fallbackMessage)
    }

    window.addEventListener(API_ERROR_EVENT, handleApiError)

    return () => window.removeEventListener(API_ERROR_EVENT, handleApiError)
  }, [])

  return (
    <>
      {children}
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={4200}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setMessage('')}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}
