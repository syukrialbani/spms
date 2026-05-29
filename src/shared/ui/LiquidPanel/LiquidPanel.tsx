import Paper, { type PaperProps } from '@mui/material/Paper'

type LiquidPanelProps = PaperProps & {
  tone?: 'light' | 'dark'
}

export function LiquidPanel({ tone = 'light', sx, ...props }: LiquidPanelProps) {
  const isDark = tone === 'dark'

  return (
    <Paper
      elevation={0}
      sx={[
        (theme) => {
          const activeDark = isDark || theme.palette.mode === 'dark'

          return {
            background: activeDark
              ? 'linear-gradient(145deg, rgba(7, 19, 35, 0.84), rgba(10, 42, 94, 0.66))'
              : 'linear-gradient(145deg, rgba(255, 255, 255, 0.88), rgba(247, 252, 255, 0.7))',
            border: '1px solid',
            borderColor: activeDark
              ? 'rgba(128, 205, 255, 0.18)'
              : 'rgba(255, 255, 255, 0.58)',
            borderRadius: 1,
            boxShadow: activeDark
              ? '0 16px 38px rgba(0, 8, 20, 0.28), inset 0 1px 0 rgba(128,205,255,0.12)'
              : '0 14px 34px rgba(12, 67, 122, 0.12), inset 0 1px 0 rgba(255,255,255,0.62)',
            overflow: 'hidden',
            position: 'relative',
          }
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  )
}
