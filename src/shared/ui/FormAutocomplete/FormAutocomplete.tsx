import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import Autocomplete from '@mui/material/Autocomplete'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import { getIn, type FormikProps } from 'formik'
import type { ReactNode } from 'react'

type FormAutocompleteProps<FormValues extends object = Record<string, unknown>> = {
  label: string
  name: string
  options: readonly string[]
  accent?: boolean
  disabled?: boolean
  error?: boolean
  formik?: FormikProps<FormValues>
  freeSolo?: boolean
  helperText?: ReactNode
  id?: string
  onBlur?: () => void
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  sx?: SxProps<Theme>
  value?: string
}

const getHelperText = (value: unknown): ReactNode =>
  typeof value === 'string' ? value : undefined

export function FormAutocomplete<FormValues extends object = Record<string, unknown>>({
  label,
  name,
  options,
  value,
  accent = false,
  disabled = false,
  error = false,
  formik,
  freeSolo = false,
  helperText,
  id = name,
  onBlur,
  onChange,
  placeholder,
  required = false,
  sx,
}: FormAutocompleteProps<FormValues>) {
  const fieldTouched = formik ? getIn(formik.touched, name) : undefined
  const fieldError = formik ? getIn(formik.errors, name) : undefined
  const formikValue = formik ? getIn(formik.values, name) : undefined
  const hasFormikError = Boolean(fieldTouched && fieldError)
  const resolvedError = error || hasFormikError
  const resolvedValue = value ?? formikValue ?? ''
  const resolvedHelperText =
    helperText ?? (hasFormikError ? getHelperText(fieldError) : undefined)

  return (
    <Stack spacing={0.25} sx={sx}>
      <Typography
        component="label"
        htmlFor={id}
        variant="caption"
        sx={{
          color: resolvedError ? 'error.main' : 'text.secondary',
          fontSize: '0.69rem',
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        {label}
        {required ? ' *' : ''}
      </Typography>
      <Autocomplete<string, false, false, boolean>
        disabled={disabled || formik?.isSubmitting}
        freeSolo={freeSolo}
        getOptionLabel={(option) => option}
        onBlur={() => {
          onBlur?.()
          if (!onBlur && formik) {
            void formik.setFieldTouched(name, true)
          }
        }}
        onChange={(_, nextValue) => {
          const nextText = typeof nextValue === 'string' ? nextValue : ''

          if (onChange) {
            onChange(nextText)
            return
          }

          if (formik) {
            void formik.setFieldValue(name, nextText)
          }
        }}
        onInputChange={(_, nextInputValue, reason) => {
          if (!freeSolo || reason !== 'input') {
            return
          }

          if (onChange) {
            onChange(nextInputValue)
            return
          }

          if (formik) {
            void formik.setFieldValue(name, nextInputValue)
          }
        }}
        options={[...options]}
        popupIcon={<KeyboardArrowDownRoundedIcon fontSize="small" />}
        value={resolvedValue || null}
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#ffffff',
              border: '1px solid #8d99a8',
              borderRadius: '2px',
              boxShadow: '0 6px 16px rgba(24, 32, 44, 0.12)',
              mt: 0.5,
            },
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            name={name}
            placeholder={placeholder ?? label}
            size="small"
            error={resolvedError}
            helperText={resolvedHelperText}
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
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: disabled ? '#dfe5ec' : '#ffffff',
            minHeight: 30,
            py: '1px !important',
            pr: accent ? '38px !important' : undefined,
          },
          '& .MuiAutocomplete-input': {
            fontSize: '0.75rem',
            fontWeight: 500,
            py: '2.5px !important',
          },
          ...(accent
            ? {
                '& .MuiAutocomplete-popupIndicator': {
                  bgcolor: '#eef1f4',
                  border: '1px solid #adb6c2',
                  borderRadius: '2px',
                  color: '#18202c',
                  height: 20,
                  width: 20,
                  '&:hover': {
                    bgcolor: '#dfe5ec',
                  },
                },
              }
            : {}),
          '& .MuiFormHelperText-root': {
            fontSize: '0.68rem',
            mx: 0,
            mt: 0.2,
          },
        }}
      />
    </Stack>
  )
}
