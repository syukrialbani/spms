import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import logoMark from '@assets/aviat-logo-round.png'

type AviatBrandProps = {
  size?: 'small' | 'large'
}

export function AviatBrand({ size = 'small' }: AviatBrandProps) {
  const isLarge = size === 'large'

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'inline-flex',
        gap: isLarge ? 1.4 : 1,
      }}
    >
      <Box
        sx={{
          height: isLarge ? 54 : 38,
          overflow: 'hidden',
          position: 'relative',
          width: isLarge ? 78 : 54,
        }}
      >
        <Box
          component="img"
          src={logoMark}
          alt=""
          aria-hidden="true"
          sx={{
            display: 'block',
            left: 0,
            position: 'absolute',
            top: isLarge ? -1 : -0.5,
            width: isLarge ? 78 : 54,
          }}
        />
      </Box>
      <Box sx={{ lineHeight: 1 }}>
        <Typography
          component="span"
          sx={{
            color: 'common.white',
            display: 'block',
            fontSize: isLarge ? 40 : 24,
            fontWeight: 900,
            letterSpacing: 0,
            lineHeight: 0.86,
          }}
        >
          Aviat
        </Typography>
        <Typography
          component="span"
          sx={{
            color: 'rgba(255,255,255,0.66)',
            display: 'block',
            fontSize: isLarge ? 11 : 7,
            fontWeight: 800,
            letterSpacing: isLarge ? 4.8 : 3,
            lineHeight: 1,
            mt: 0.6,
            textTransform: 'uppercase',
          }}
        >
          Networks
        </Typography>
      </Box>
    </Box>
  )
}
