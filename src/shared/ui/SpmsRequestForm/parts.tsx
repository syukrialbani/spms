import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import { alpha, type SxProps, type Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import type { ChangeEvent, ReactNode } from 'react'

import { approvalStatusOptions, closedStatusOptions } from './model'
import type {
  ApprovalChainItem,
  FieldName,
  TimelineItem,
  TimelineState,
} from './types'
import { approvalStatusLabels, formatTimelineDate } from './workflow'

type ApprovalRadioGroupProps = {
  disabled?: boolean
  error?: boolean
  helperText?: ReactNode
  isClosedStatus?: boolean
  label: string
  name: FieldName
  onBlur: () => void
  onChange: (value: string) => void
  required?: boolean
  sx?: SxProps<Theme>
  value: string
}

export function FieldGrid({
  children,
  columns = 2,
}: {
  children: ReactNode
  columns?: 1 | 2 | 3
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1,
        gridTemplateColumns: {
          xs: '1fr',
          md:
            columns === 1
              ? '1fr'
              : columns === 3
                ? 'repeat(3, minmax(0, 1fr))'
                : 'repeat(2, minmax(0, 1fr))',
        },
        minWidth: 0,
      }}
    >
      {children}
    </Box>
  )
}

export function FormSection({
  children,
  icon,
  subtitle,
  title,
}: {
  children: ReactNode
  icon: ReactNode
  subtitle?: string
  title: string
}) {
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.045)
            : alpha(theme.palette.common.white, 0.55),
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.primary.light, 0.18)
            : alpha(theme.palette.primary.main, 0.12),
        borderRadius: 1,
        height: '100%',
        minWidth: 0,
        p: { xs: 1, sm: 1.25 },
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={0.8} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              alignItems: 'center',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.primary.light, 0.14)
                  : alpha(theme.palette.primary.main, 0.08),
              borderRadius: 1,
              color: 'primary.main',
              display: 'flex',
              height: 30,
              justifyContent: 'center',
              width: 30,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{ fontSize: 13, fontWeight: 900 }}
              variant="subtitle1"
            >
              {title}
            </Typography>
            {subtitle ? (
              <Typography
                color="text.secondary"
                sx={{ fontSize: 11 }}
                variant="body2"
              >
                {subtitle}
              </Typography>
            ) : null}
          </Box>
        </Stack>
        {children}
      </Stack>
    </Box>
  )
}

export function ProcessTimeline({ items }: { items: TimelineItem[] }) {
  const getColor = (state: TimelineState, theme: Theme) => {
    if (state === 'done') {
      return theme.palette.success.main
    }

    if (state === 'active') {
      return theme.palette.warning.main
    }

    return theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.34)
      : alpha(theme.palette.text.primary, 0.26)
  }

  return (
    <Box sx={{ maxWidth: '100%', overflowX: 'auto', pb: 0.5 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${items.length}, minmax(170px, 1fr))`,
          minWidth: { xs: 1020, xl: '100%' },
          position: 'relative',
          pt: 0.25,
        }}
      >
        <Box
          sx={{
            bgcolor: (theme) => alpha(theme.palette.success.main, 0.82),
            height: 3,
            left: 64,
            position: 'absolute',
            right: 64,
            top: 17,
            zIndex: 0,
          }}
        />
        {items.map((item, index) => (
          <Stack
            key={item.label}
            spacing={0.25}
            sx={{
              alignItems: 'center',
              minWidth: 0,
              px: 0.75,
              position: 'relative',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                bgcolor: 'background.paper',
                border: '2px solid',
                borderColor: (theme) => getColor(item.state, theme),
                borderRadius: 1,
                color: (theme) => getColor(item.state, theme),
                display: 'flex',
                fontSize: 11,
                fontWeight: 900,
                height: 32,
                justifyContent: 'center',
                lineHeight: 1,
                width: 32,
              }}
            >
              {index + 1}
            </Box>
            <Typography
              sx={{
                color: (theme) => getColor(item.state, theme),
                fontSize: 12,
                fontWeight: 900,
                lineHeight: 1.25,
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                color: (theme) => getColor(item.state, theme),
                fontSize: 11,
                fontWeight: 900,
                lineHeight: 1.2,
              }}
            >
              {item.meta || 'Waiting'}
            </Typography>
            {item.timestamp ? (
              <Typography
                color="text.secondary"
                sx={{ fontSize: 11, lineHeight: 1.2 }}
              >
                {formatTimelineDate(item.timestamp)}
              </Typography>
            ) : null}
            {typeof item.description === 'string' ? (
              <Typography
                color="text.primary"
                sx={{
                  fontSize: 11,
                  lineHeight: 1.2,
                  overflowWrap: 'anywhere',
                  width: '100%',
                }}
              >
                {item.description}
              </Typography>
            ) : (
              item.description
            )}
            {item.actor ? (
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 900,
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%',
                }}
                title={item.actor}
              >
                {item.actor}
              </Typography>
            ) : null}
          </Stack>
        ))}
      </Box>
    </Box>
  )
}

export function ApprovalChain({ items }: { items: ApprovalChainItem[] }) {
  const getColor = (state: TimelineState, theme: Theme) => {
    if (state === 'done') {
      return theme.palette.success.main
    }

    if (state === 'active') {
      return theme.palette.warning.main
    }

    return theme.palette.text.disabled
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1px 5px',
        justifyContent: 'center',
        lineHeight: 1.15,
        mt: 0.1,
        width: '100%',
      }}
    >
      {items.map((item, index) => (
        <Box
          key={`${item.label}-${index}`}
          sx={{
            alignItems: 'center',
            display: 'inline-flex',
            gap: 0.5,
            minWidth: 0,
          }}
        >
          {index > 0 ? (
            <Typography
              color="text.disabled"
              sx={{ fontSize: 11, fontWeight: 800, lineHeight: 1 }}
            >
              &gt;
            </Typography>
          ) : null}
          <Typography
            title={`${item.label} - ${item.detail}`}
            sx={{
              color: (theme) => getColor(item.state, theme),
              fontSize: 11,
              fontWeight: 900,
              lineHeight: 1.15,
            }}
          >
            {item.label}
          </Typography>
          <Typography
            title={item.detail}
            sx={{
              color: (theme) => getColor(item.state, theme),
              fontSize: 11,
              fontWeight: item.state === 'active' ? 800 : 650,
              lineHeight: 1.15,
              opacity: item.state === 'pending' ? 0.68 : 1,
            }}
          >
            ({item.detail})
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export function EvidenceUpload({
  fileName,
  helper,
  onFileChange,
  title,
}: {
  fileName: string
  helper: string
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  title: string
}) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.black, 0.22)
            : alpha(theme.palette.common.white, 0.58),
        border: '1px dashed',
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.primary.light, 0.32)
            : alpha(theme.palette.primary.main, 0.26),
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        justifyContent: 'center',
        minHeight: 220,
        p: 1.25,
        textAlign: 'center',
      }}
    >
      <CloudUploadRoundedIcon sx={{ color: 'primary.main', fontSize: 42 }} />
      <Box sx={{ maxWidth: 320 }}>
        <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
        <Typography color="text.secondary" variant="body2">
          {helper}
        </Typography>
      </Box>
      <Chip
        color={fileName ? 'success' : 'default'}
        icon={fileName ? <CheckCircleRoundedIcon /> : <CloudUploadRoundedIcon />}
        label={fileName || 'No file selected'}
        sx={{ maxWidth: '100%' }}
      />
      <Button
        component="label"
        startIcon={<CloudUploadRoundedIcon />}
        type="button"
        variant="contained"
      >
        Select File
        <input hidden accept="image/*,.pdf" type="file" onChange={onFileChange} />
      </Button>
    </Box>
  )
}

export function ApprovalRadioGroup({
  disabled = false,
  error = false,
  helperText,
  isClosedStatus = false,
  label,
  name,
  onBlur,
  onChange,
  required = false,
  sx,
  value,
}: ApprovalRadioGroupProps) {
  const options = isClosedStatus ? closedStatusOptions : approvalStatusOptions

  return (
    <FormControl
      component="fieldset"
      disabled={disabled}
      error={error}
      sx={sx}
    >
      <Typography
        component="legend"
        variant="caption"
        sx={{
          color: error ? 'error.main' : 'text.secondary',
          fontSize: 11,
          fontWeight: 800,
          lineHeight: 1.2,
          mb: 0.75,
          px: 0.25,
        }}
      >
        {label}
        {required ? ' *' : ''}
      </Typography>
      <RadioGroup
        name={name}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        value={value}
        sx={{
          display: 'grid',
          gap: 0.6,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        {options.map((option) => {
          const selected = value === option

          return (
            <FormControlLabel
              key={option}
              control={<Radio size="small" />}
              label={approvalStatusLabels[option] ?? option}
              value={option}
              sx={{
                bgcolor: (theme) =>
                  selected
                    ? theme.palette.mode === 'dark'
                      ? alpha(theme.palette.primary.light, 0.15)
                      : alpha(theme.palette.primary.main, 0.09)
                    : theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.04)
                      : alpha(theme.palette.common.white, 0.62),
                border: '1px solid',
                borderColor: (theme) =>
                  selected
                    ? theme.palette.primary.main
                    : theme.palette.mode === 'dark'
                      ? alpha(theme.palette.primary.light, 0.16)
                      : alpha(theme.palette.primary.main, 0.1),
                borderRadius: 1,
                m: 0,
                minHeight: 34,
                px: 0.75,
                transition:
                  'border-color 160ms ease, background-color 160ms ease',
                '& .MuiFormControlLabel-label': {
                  fontSize: 11.5,
                  fontWeight: selected ? 900 : 750,
                },
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            />
          )
        })}
      </RadioGroup>
      {helperText ? (
        <FormHelperText sx={{ mx: 0 }}>{helperText}</FormHelperText>
      ) : null}
    </FormControl>
  )
}
