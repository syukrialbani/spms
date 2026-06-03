import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha, type SxProps, type Theme } from '@mui/material/styles'
import dayjs, { type Dayjs } from 'dayjs'
import 'dayjs/locale/id'
import type { ReactNode } from 'react'

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

const parseDateTimeValue = (value: string) => {
  if (!value) {
    return null
  }

  const parsedValue = dayjs(value)

  return parsedValue.isValid() ? parsedValue : null
}

const formatFormValue = (value: Dayjs | null) =>
  value?.isValid() ? value.format('YYYY-MM-DDTHH:mm') : ''

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
  required = false,
  sx,
}: FormDateTimeFieldProps) {
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
      <LocalizationProvider
        adapterLocale="id"
        dateAdapter={AdapterDayjs}
        localeText={{
          cancelButtonLabel: 'Batal',
          clearButtonLabel: 'Kosongkan',
          okButtonLabel: 'Pilih',
          todayButtonLabel: 'Hari ini',
        }}
      >
        <DateTimePicker
          ampm={false}
          closeOnSelect
          disabled={disabled}
          format="YYYY-MM-DD HH:mm"
          minutesStep={5}
          onAccept={(nextValue) => {
            onChange(formatFormValue(nextValue))
          }}
          onChange={(nextValue) => {
            onChange(formatFormValue(nextValue))
          }}
          onClose={onBlur}
          timeSteps={{ hours: 1, minutes: 5 }}
          value={parseDateTimeValue(value)}
          slotProps={{
            actionBar: {
              actions: [],
            },
            desktopPaper: {
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
                    ? 'rgba(128, 205, 255, 0.22)'
                    : 'rgba(18, 73, 126, 0.16)',
                borderRadius: 1,
                boxShadow:
                  theme.palette.mode === 'dark'
                    ? '0 18px 42px rgba(0, 8, 20, 0.46)'
                    : '0 18px 42px rgba(12, 67, 122, 0.18)',
                color: 'text.primary',
                overflow: 'hidden',
                '& .MuiPickersLayout-root, & .MuiDateCalendar-root, & .MuiMultiSectionDigitalClock-root, & .MuiDigitalClock-root, & .MuiPickersCalendarHeader-root, & .MuiPickersActionBar-root':
                  {
                    backdropFilter: 'none',
                    backgroundImage: 'none',
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? theme.palette.background.default
                        : theme.palette.common.white,
                  },
                '& .MuiPickersActionBar-root': {
                  display: 'none',
                },
                '& .MuiMultiSectionDigitalClock-root, & .MuiDigitalClock-root':
                  {
                    borderColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(128, 205, 255, 0.14)'
                        : 'rgba(18, 73, 126, 0.1)',
                  },
              }),
            },
            dialog: {
              slotProps: {
                backdrop: {
                  sx: {
                    backdropFilter: 'none',
                    bgcolor: 'rgba(9, 27, 52, 0.28)',
                  },
                },
              },
            },
            mobilePaper: {
              sx: (theme) => ({
                backdropFilter: 'none',
                backgroundImage: 'none',
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? theme.palette.background.default
                    : theme.palette.common.white,
                borderRadius: 1,
              }),
            },
            textField: {
              error,
              fullWidth: true,
              helperText,
              id,
              name,
              onBlur,
              required,
              size: 'small',
              sx: (theme) => ({
                '& .MuiPickersInputBase-root, & .MuiPickersOutlinedInput-root':
                  {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.black, 0.24)
                        : alpha(theme.palette.common.white, 0.82),
                    backgroundImage: 'none',
                    borderRadius: 1,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.52)',
                    minHeight: 46,
                  },
                '& .MuiPickersOutlinedInput-notchedOutline': {
                  borderColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(128, 205, 255, 0.22)'
                      : 'rgba(18, 73, 126, 0.16)',
                },
                '& .MuiPickersOutlinedInput-root:hover .MuiPickersOutlinedInput-notchedOutline':
                  {
                    borderColor: 'primary.main',
                  },
                '& .MuiPickersOutlinedInput-root.MuiPickersInputBase-focused .MuiPickersOutlinedInput-notchedOutline, & .MuiPickersOutlinedInput-root.MuiPickersOutlinedInput-focused .MuiPickersOutlinedInput-notchedOutline':
                  {
                    borderColor: 'primary.main',
                    borderWidth: 1,
                  },
                '& .MuiPickersInputBase-sectionContent, & .MuiPickersInputBase-sectionBefore, & .MuiPickersInputBase-sectionAfter':
                  {
                    fontSize: 15,
                    fontWeight: 700,
                    lineHeight: 1.4375,
                  },
                '& .MuiPickersOutlinedInput-input': {
                  padding: '8.5px 0',
                },
                '& .MuiOutlinedInput-root': {
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.black, 0.24)
                      : alpha(theme.palette.common.white, 0.82),
                  backgroundImage: 'none',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.52)',
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
                '& .MuiInputAdornment-root .MuiButtonBase-root': {
                  borderRadius: 1,
                  color: 'primary.main',
                  height: 32,
                  width: 32,
                },
                '& .MuiInputBase-input': {
                  fontSize: 15,
                  fontWeight: 700,
                  py: 1.25,
                },
                '& .MuiFormHelperText-root': {
                  mx: 0,
                },
              }),
            },
          }}
        />
      </LocalizationProvider>
    </Stack>
  )
}
