import Stack from '@mui/material/Stack'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
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
      sx={[
        {
          '& .MuiOutlinedInput-root': {
            bgcolor: isDisabled || readOnly ? '#dfe5ec' : '#ffffff',
            minHeight: props.multiline ? undefined : 36,
          },
          '& .MuiInputBase-input': {
            fontSize: '0.8125rem',
            fontWeight: 500,
            py: 0.7,
          },
          '& .MuiFormHelperText-root': {
            mx: 0,
          },
        },
        ...(!label && sx ? (Array.isArray(sx) ? sx : [sx]) : []),
      ]}
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
          fontSize: '0.75rem',
          fontWeight: 600,
          lineHeight: 1.25,
        }}
      >
        {label}
        {required ? ' *' : ''}
      </Typography>
      {field}
    </Stack>
  )
}
