import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha, type SxProps, type Theme } from '@mui/material/styles'
import type { Key, ReactNode } from 'react'

type FormMultiAutocompleteProps<Option> = {
  getOptionLabel: (option: Option) => string
  label: string
  name: string
  onChange: (value: Option[]) => void
  options: readonly Option[]
  value: readonly Option[]
  disabled?: boolean
  error?: boolean
  getOptionKey?: (option: Option) => Key
  getOptionSubtitle?: (option: Option) => ReactNode
  isOptionEqualToValue?: (option: Option, value: Option) => boolean
  placeholder?: string
  required?: boolean
  sx?: SxProps<Theme>
}

export function FormMultiAutocomplete<Option>({
  disabled = false,
  error = false,
  getOptionKey,
  getOptionLabel,
  getOptionSubtitle,
  isOptionEqualToValue,
  label,
  name,
  onChange,
  options,
  placeholder,
  required = false,
  sx,
  value,
}: FormMultiAutocompleteProps<Option>) {
  return (
    <Stack spacing={0.35} sx={sx}>
      <Typography
        component="label"
        variant="caption"
        sx={{
          color: error ? 'error.main' : 'text.secondary',
          fontSize: 11,
          fontWeight: 800,
          lineHeight: 1.2,
          px: 0.25,
        }}
      >
        {label}
        {required ? ' *' : ''}
      </Typography>
      <Autocomplete<Option, true, false, false>
        multiple
        disableCloseOnSelect
        disabled={disabled}
        filterSelectedOptions
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        onChange={(_, nextValue) => onChange(nextValue)}
        options={[...options]}
        popupIcon={<KeyboardArrowDownRoundedIcon fontSize="small" />}
        value={[...value]}
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
            required={required}
            size="small"
            error={error}
            slotProps={{
              ...params.slotProps,
              htmlInput: {
                ...params.slotProps.htmlInput,
                'aria-label': label,
                name,
              },
            }}
          />
        )}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props as typeof props & { key?: Key }

          return (
            <li
              key={key ?? getOptionKey?.(option) ?? getOptionLabel(option)}
              {...optionProps}
            >
              <Checkbox checked={selected} size="small" sx={{ mr: 1 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 900 }} variant="body2">
                  {getOptionLabel(option)}
                </Typography>
                {getOptionSubtitle ? (
                  <Typography color="text.secondary" noWrap variant="caption">
                    {getOptionSubtitle(option)}
                  </Typography>
                ) : null}
              </Box>
            </li>
          )
        }}
        sx={(theme) => ({
          '& .MuiOutlinedInput-root': {
            bgcolor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.black, 0.24)
                : alpha(theme.palette.common.white, 0.82),
            minHeight: 34,
            py: '2px !important',
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
            fontSize: 12.5,
            fontWeight: 700,
            py: '4px !important',
          },
          '& .MuiChip-root': {
            borderRadius: 1,
            fontSize: 11,
            fontWeight: 800,
            height: 23,
          },
        })}
      />
    </Stack>
  )
}
