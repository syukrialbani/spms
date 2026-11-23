import Paper, { type PaperProps } from '@mui/material/Paper'

type LiquidPanelProps = PaperProps & {
  tone?: 'light' | 'dark'
}

// Flat Almanac printed-sheet surface (keeps export name for compatibility,
// zero liquid glass, zero gradients, zero heavy shadows).
export function LiquidPanel({ tone = 'light', sx, ...props }: LiquidPanelProps) {
  const isInk = tone === 'dark'

  return (
    <Paper
      elevation={0}
      sx={[
        {
          bgcolor: isInk ? '#18202c' : '#eef1f4',
          border: '1px solid',
          borderColor: isInk ? '#2b3646' : '#adb6c2',
          borderTop: '2px solid',
          borderTopColor: isInk ? '#9e1c4d' : '#3c4654',
          borderRadius: 0,
          boxShadow: 'none',
          color: isInk ? '#eef1f4' : 'text.primary',
          overflow: 'hidden',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  )
}
