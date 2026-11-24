import Paper, { type PaperProps } from '@mui/material/Paper'

type LiquidPanelProps = PaperProps & {
  tone?: 'light' | 'dark'
}

// Modern crisp white card surface (keeps export name for compatibility,
// zero liquid glass, zero heavy shadows).
export function LiquidPanel({ tone = 'light', sx, ...props }: LiquidPanelProps) {
  const isInk = tone === 'dark'

  return (
    <Paper
      elevation={0}
      sx={[
        {
          bgcolor: isInk ? '#0e1614' : '#ffffff',
          border: '1px solid',
          borderColor: isInk ? '#1b2824' : '#e2e8e5',
          borderRadius: '10px',
          boxShadow: isInk ? 'none' : '0 1px 2px rgba(15, 25, 21, 0.04)',
          color: isInk ? '#eef4f0' : 'text.primary',
          overflow: 'hidden',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  )
}
