import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import Autocomplete from '@mui/material/Autocomplete'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha, type SxProps, type Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

type FormAutocompleteProps = {
  label: string
  name: string
  options: readonly string[]
  value: string
  accent?: boolean
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

export function FormAutocomplete({
  label,
  name,
  options,
  value,
  accent = false,
  disabled = false,
  error = false,
  helperText,
  id = name,
  onBlur,
  onChange,
  placeholder,
  required = false,
  sx,
}: FormAutocompleteProps) {
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
      <Autocomplete<string, false, false, false>
        disabled={disabled}
        getOptionLabel={(option) => option}
        onBlur={() => onBlur?.()}
        onChange={(_, nextValue) => onChange(nextValue ?? '')}
        options={[...options]}
        popupIcon={<KeyboardArrowDownRoundedIcon fontSize="small" />}
        value={value || null}
        slotProps={{
          paper: {
            sx: (theme) => ({
              backdropFilter: 'none',
              backgroundImage: 'none',
              bgcolor:
                theme.palette.mode === 'dark'
                  ? theme.palette.background.default
                  : theme.palette.common.white,
              border: '1px solid',
              borderColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(128, 205, 255, 0.24)'
                  : 'rgba(18, 73, 126, 0.14)',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 12px 28px rgba(0, 8, 20, 0.38)'
                  : '0 12px 28px rgba(12, 67, 122, 0.14)',
              mt: 0.75,
            }),
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            name={name}
            placeholder={placeholder ?? label}
            size="small"
            error={error}
            helperText={helperText}
            slotProps={{
              ...params.slotProps,
              htmlInput: {
                ...params.slotProps.htmlInput,
                'aria-label': label,
                id,
                name,
              },
            }}
          />
        )}
        sx={(theme) => ({
          '& .MuiOutlinedInput-root': {
            bgcolor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.black, 0.24)
                : alpha(theme.palette.common.white, 0.82),
            minHeight: 46,
            pr: accent ? '50px !important' : undefined,
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
          '& .MuiAutocomplete-input': {
            fontSize: 15,
            fontWeight: 700,
            py: '8px !important',
          },
          ...(accent
            ? {
                '& .MuiAutocomplete-popupIndicator': {
                  bgcolor: 'primary.main',
                  borderRadius: 1,
                  boxShadow: `0 10px 24px ${alpha(
                    theme.palette.primary.main,
                    0.28,
                  )}`,
                  color: 'primary.contrastText',
                  height: 32,
                  mr: 0.25,
                  width: 32,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
              }
            : {}),
          '& .MuiFormHelperText-root': {
            mx: 0,
          },
        })}
      />
    </Stack>
  )
}
