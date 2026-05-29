import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha, type SxProps, type Theme } from '@mui/material/styles'
import { useState, type ReactNode } from 'react'

type FormDateTimeFieldProps = {
  label: string
  name: string
  value: string
  disabled?: boolean
  error?: boolean
  helperText?: ReactNode
  id?: string
  onBlur?: () => void
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  sx?: SxProps<Theme>
}

export function FormDateTimeField({
  label,
  name,
  value,
  disabled = false,
  error = false,
  helperText,
  id = name,
  onBlur,
  onChange,
  placeholder = 'Pilih tanggal dan jam',
  required = false,
  sx,
}: FormDateTimeFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const showPlaceholder = !value && !isFocused

  return (
    <Stack spacing={0.75} sx={sx}>
      <Typography
        component="label"
        htmlFor={id}
        variant="caption"
        sx={{
          color: error ? 'error.main' : 'text.secondary',
          fontWeight: 800,
          lineHeight: 1.2,
          px: 0.25,
        }}
      >
        {label}
        {required ? ' *' : ''}
      </Typography>
      <Box sx={{ position: 'relative' }}>
        <TextField
          fullWidth
          disabled={disabled}
          error={error}
          helperText={helperText}
          id={id}
          name={name}
          onBlur={() => {
            setIsFocused(false)
            onBlur?.()
          }}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          size="small"
          type="datetime-local"
          value={value}
          slotProps={{
            htmlInput: {
              'aria-label': label,
              step: 60,
            },
          }}
          sx={(theme) => ({
            '& .MuiOutlinedInput-root': {
              bgcolor:
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.black, 0.24)
                  : alpha(theme.palette.common.white, 0.82),
              minHeight: 46,
              '& fieldset': {
                borderColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(128, 205, 255, 0.22)'
                    : 'rgba(18, 73, 126, 0.16)',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: 1,
              },
            },
            '& .MuiInputBase-input': {
              color: showPlaceholder ? 'transparent' : undefined,
              fontSize: 15,
              fontWeight: 700,
              py: 1.25,
            },
            '& input::-webkit-calendar-picker-indicator': {
              cursor: 'pointer',
            },
            '& .MuiFormHelperText-root': {
              mx: 0,
            },
          })}
        />
        {showPlaceholder ? (
          <Typography
            aria-hidden="true"
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: 15,
              fontWeight: 600,
              left: 14,
              lineHeight: '46px',
              maxWidth: 'calc(100% - 58px)',
              overflow: 'hidden',
              pointerEvents: 'none',
              position: 'absolute',
              right: 44,
              textOverflow: 'ellipsis',
              top: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {placeholder}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  )
}
