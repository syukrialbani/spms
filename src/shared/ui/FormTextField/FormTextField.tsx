import Stack from '@mui/material/Stack'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { getIn, type FormikProps } from 'formik'
import type { ReactNode } from 'react'

type FormTextFieldProps<FormValues extends object = Record<string, unknown>> =
  TextFieldProps & {
    formik?: FormikProps<FormValues>
    readOnly?: boolean
  }

const getHelperText = (value: unknown): ReactNode =>
  typeof value === 'string' ? value : undefined

export function FormTextField<FormValues extends object = Record<string, unknown>>(
  props: FormTextFieldProps<FormValues>,
) {
  const {
    formik,
    label,
    name,
    readOnly = false,
    required,
    sx,
    ...textFieldProps
  } = props
  const fieldTouched = formik && name ? getIn(formik.touched, name) : undefined
  const fieldError = formik && name ? getIn(formik.errors, name) : undefined
  const formikValue = formik && name ? getIn(formik.values, name) : undefined
  const hasFormikError = Boolean(fieldTouched && fieldError)
  const inputId = props.id ?? (typeof name === 'string' ? name : undefined)
  const labelText = typeof label === 'string' ? label : undefined
  const isDisabled = props.disabled ?? formik?.isSubmitting ?? false
  const resolvedError = props.error ?? hasFormikError
  const resolvedHelperText =
    props.helperText ?? (hasFormikError ? getHelperText(fieldError) : undefined)
  const field = (
    <TextField
      fullWidth
      size="small"
      {...textFieldProps}
      disabled={isDisabled}
      error={resolvedError}
      helperText={resolvedHelperText}
      id={inputId}
      label={undefined}
      name={name}
      onBlur={props.onBlur ?? formik?.handleBlur}
      onChange={props.onChange ?? formik?.handleChange}
      placeholder={props.placeholder ?? labelText}
      required={required}
      value={props.value ?? formikValue ?? ''}
      slotProps={{
        ...textFieldProps.slotProps,
        htmlInput: {
          ...textFieldProps.slotProps?.htmlInput,
          'aria-label': labelText,
          min: props.type === 'number' ? 1 : undefined,
          readOnly,
        },
      }}
      sx={
        [
          {
            '& .MuiOutlinedInput-root': {
              bgcolor: (theme) =>
                isDisabled || readOnly
                  ? theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.white, 0.08)
                    : alpha(theme.palette.text.primary, 0.06)
                  : theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.black, 0.24)
                    : alpha(theme.palette.common.white, 0.82),
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.52)',
              minHeight: props.multiline ? undefined : 34,
              '& fieldset': {
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(128, 205, 255, 0.22)'
                    : 'rgba(18, 73, 126, 0.16)',
              },
              '&:hover fieldset': {
                borderColor: isDisabled || readOnly ? undefined : 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: isDisabled || readOnly ? undefined : 'primary.main',
                borderWidth: 1,
              },
            },
            '& .MuiInputBase-input': {
              fontSize: 12.5,
              fontWeight: 700,
              py: 0.65,
            },
            '& .MuiFormHelperText-root': {
              mx: 0,
            },
          },
          ...(!label && sx ? (Array.isArray(sx) ? sx : [sx]) : []),
        ]
      }
    />
  )

  if (!label) {
    return field
  }

  return (
    <Stack spacing={0.35} sx={sx}>
      <Typography
        component="label"
        htmlFor={inputId}
        variant="caption"
        sx={{
          color: resolvedError ? 'error.main' : 'text.secondary',
          fontSize: 11,
          fontWeight: 800,
          lineHeight: 1.2,
          px: 0.25,
        }}
      >
        {label}
        {required ? ' *' : ''}
      </Typography>
      {field}
    </Stack>
  )
}
