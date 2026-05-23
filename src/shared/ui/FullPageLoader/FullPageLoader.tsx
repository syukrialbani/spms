import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export function FullPageLoader() {
  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100svh',
      }}
    >
      <CircularProgress />
    </Box>
  )
}
