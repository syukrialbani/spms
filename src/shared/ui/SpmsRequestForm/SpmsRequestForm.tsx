import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import { alpha, type SxProps, type Theme } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import type { TextFieldProps } from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useConfirmation } from '@shared/lib/confirmation'
import { AppButton } from '@shared/ui/AppButton'
import { FormAutocomplete } from '@shared/ui/FormAutocomplete'
import { FormDateTimeField } from '@shared/ui/FormDateTimeField'
import { FormTextField } from '@shared/ui/FormTextField'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import { useFormik } from 'formik'
import { useState, type ChangeEvent, type ReactNode } from 'react'
import {
  approvalStatusOptions,
  areaOptions,
  categoryMaterialOptions,
  closedStatusOptions,
  createDefaultMaterialValues,
  createDefaultSpmsRequestValues,
  customerOptions,
  defaultBaType,
  descriptionOptions,
  dopOptions,
  getSlaHoursForSeverity,
  partNumberOptions,
  picKancabContactMap,
  picKancabOptions,
  pickupStatusOptions,
  regionalOptions,
  requestorContactMap,
  requestorOptions,
  severityOptions,
  slaHourOptions,
  spmsRequestValidationSchema,
  statusTransactionOptions,
  typeMaterialOptions,
  type SpmsMaterialFormValues,
  type SpmsRequestFormValues,
} from './model'

type SpmsRequestFormProps = {
  currentRole?: SpmsApprovalRole
  currentUserName?: string
  initialValues?: SpmsRequestFormValues
  mode?: 'create' | 'edit'
  onCancel?: () => void
  onSave: (values: SpmsRequestFormValues) => void | Promise<void>
}

type FieldName = Exclude<keyof SpmsRequestFormValues, 'materials'>
type DetailFieldName = FieldName | 'materials'
type MaterialFieldName = keyof SpmsMaterialFormValues
type EvidenceFieldName = 'deliveryEvidenceFileName' | 'pickupEvidenceFileName'
export type SpmsApprovalRole = 'ADMIN_1' | 'ADMIN_2' | 'ADMIN_3' | 'REQUESTOR'
type TimelineState = 'done' | 'active' | 'pending'
type TimelineItem = {
  actor: string
  description: ReactNode
  label: string
  meta: string
  state: TimelineState
  timestamp?: string
}

type ApprovalChainItem = {
  detail: string
  label: string
  state: TimelineState
}

type SpmsTextInputProps = {
  disabled?: boolean
  error?: boolean
  helperText?: ReactNode
  id?: string
  label: string
  multiline?: boolean
  name: string
  onBlur: TextFieldProps['onBlur']
  onChange: TextFieldProps['onChange']
  readOnly?: boolean
  required?: boolean
  sx?: SxProps<Theme>
  type?: TextFieldProps['type']
  value: string
}

type ApprovalRadioGroupProps = {
  disabled?: boolean
  error?: boolean
  helperText?: ReactNode
  label: string
  name: FieldName
  onBlur: () => void
  onChange: (value: string) => void
  required?: boolean
  sx?: SxProps<Theme>
  value: string
  isClosedStatus?: boolean
}

const approvalStatusLabels: Record<string, string> = {
  APPROVED: 'Approve',
  CLOSED: 'Closed',
  DRAFT: 'Draft',
  'PENDING CUSTOMER': 'Pending',
  'PENDING APPROVAL': 'Pending',
  REJECTED: 'Revisi',
}

const formatTimelineDate = (value: string | undefined) => {
  if (!value) {
    return ''
  }

  return value.replace('T', ' ').slice(0, 16)
}

const detailRequestFields: DetailFieldName[] = [
  'customer',
  'customerOrderNumber',
  'createdBy',
  'customerRequestor',
  'requestDate',
  'areal',
  'dop',
  'feId',
  'neId',
  'regional',
  'siteName',
  'requestorEmail',
  'requestorPhone',
  'picKancabEmail',
  'picKancabName',
  'picKancabPhone',
  'statusTransaction',
  'materials',
  'severity',
  'slaHours',
  'pmArea',
]

const formSteps = [
  {
    title: 'Detail Request',
    subtitle: 'Request, site, material',
  },
  {
    title: 'Upload BA Delivery',
    subtitle: 'Evidence delivery',
  },
  {
    title: 'Approval BA Delivery',
    subtitle: 'Approval 1 & 2',
  },
  {
    title: 'Upload BA Pickup',
    subtitle: 'Evidence pickup',
  },
  {
    title: 'Approval BA Pickup',
    subtitle: 'Approval 1 & 2',
  },
] as const

const stepFields: DetailFieldName[][] = [
  detailRequestFields,
  [
    'baType',
    'sendBy',
    'deliveryDateGoodUnit',
    'serialNumberGoodUnit',
    'descriptionMaterial',
  ],
  [
    'approval1By',
    'approval1Status',
    'approval2By',
    'approval2Status',
    'closedBy',
    'closedStatus',
  ],
  ['statusReturn'],
  [
    'pickupApproval1By',
    'pickupApproval1Status',
    'pickupApproval2By',
    'pickupApproval2Status',
    'pickupClosedBy',
    'pickupClosedStatus',
  ],
]

const materialFieldNames: MaterialFieldName[] = [
  'categoryMaterial',
  'typeMaterial',
  'description',
  'partNumber',
  'quantity',
]

const normalizeFormMaterials = (values: SpmsRequestFormValues) => {
  const materials =
    values.materials.length > 0
      ? values.materials
      : [createDefaultMaterialValues()]

  return materials.map((material) => ({
    ...material,
    quantity: '1',
  }))
}

const getAutoPickupStatus = (
  values: SpmsRequestFormValues,
  deliveryStatus = values.deliveryStatus,
) => {
  const selectedPickupStatus =
    values.statusReturn === 'FAULTY' || values.statusReturn === 'Faulty'
      ? 'FAULTY'
      : values.statusReturn === 'ROK'
        ? 'ROK'
        : ''

  if (values.pickupEvidenceFileName) {
    return selectedPickupStatus || 'UNRETURN'
  }

  if (deliveryStatus === 'DELIVERED') {
    return 'UNRETURN'
  }

  return 'OPEN'
}

function FieldGrid({
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

function FormSection({
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
            <Typography sx={{ fontSize: 13, fontWeight: 900 }} variant="subtitle1">
              {title}
            </Typography>
            {subtitle ? (
              <Typography color="text.secondary" sx={{ fontSize: 11 }} variant="body2">
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

function ProcessTimeline({
  items,
}: {
  items: TimelineItem[]
}) {
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

function ApprovalChain({ items }: { items: ApprovalChainItem[] }) {
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

function EvidenceUpload({
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

function ApprovalRadioGroup({
  disabled = false,
  error = false,
  helperText,
  label,
  name,
  onBlur,
  onChange,
  required = false,
  sx,
  value,
  isClosedStatus = false,
}: ApprovalRadioGroupProps) {

  const options = isClosedStatus ? closedStatusOptions : approvalStatusOptions;
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
              value={option}
              control={<Radio size="small" />}
              label={approvalStatusLabels[option] ?? option}
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

function SpmsTextInput({
  disabled = false,
  error = false,
  helperText,
  id,
  label,
  multiline = false,
  name,
  onBlur,
  onChange,
  readOnly = false,
  required = false,
  sx,
  type = 'text',
  value,
}: SpmsTextInputProps) {
  const inputId = id ?? `spms-${name}`

  return (
    <Stack spacing={0.35} sx={sx}>
      <Typography
        component="label"
        htmlFor={inputId}
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
      <FormTextField
        disabled={disabled}
        error={error}
        helperText={helperText}
        id={inputId}
        multiline={multiline}
        minRows={multiline ? 3 : undefined}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={label}
        type={type}
        value={value}
        slotProps={{
          htmlInput: {
            'aria-label': label,
            min: type === 'number' ? 1 : undefined,
            readOnly,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: (theme) =>
              readOnly
                ? theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.08)
                  : alpha(theme.palette.text.primary, 0.06)
                : theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.black, 0.24)
                  : alpha(theme.palette.common.white, 0.82),
            minHeight: multiline ? undefined : 34,
            '& fieldset': {
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(128, 205, 255, 0.22)'
                  : 'rgba(18, 73, 126, 0.16)',
            },
            '&:hover fieldset': {
              borderColor: readOnly ? undefined : 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: readOnly ? undefined : 'primary.main',
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
        }}
      />
    </Stack>
  )
}

export function SpmsRequestForm({
  currentRole = 'ADMIN_1',
  currentUserName = 'SPMS User',
  initialValues = createDefaultSpmsRequestValues(),
  mode = 'edit',
  onCancel,
  onSave,
}: SpmsRequestFormProps) {
  const [activeStep, setActiveStep] = useState(0)
  const confirm = useConfirmation()
  const isCreateMode = mode === 'create'
  const canApprove1 = currentRole === 'ADMIN_1'
  const canApprove2 = currentRole === 'ADMIN_2'
  const canCloseCustomer = currentRole === 'ADMIN_3'

  const formik = useFormik<SpmsRequestFormValues>({
    initialValues,
    validationSchema: spmsRequestValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, helpers) => {
      try {
        await onSave(withNormalizedValues(values))
      } finally {
        helpers.setSubmitting(false)
      }
    },
  })

  const getHelperText = (name: FieldName) =>
    formik.touched[name] ? formik.errors[name] : undefined

  const hasError = (name: FieldName) =>
    Boolean(formik.touched[name] && formik.errors[name])

  const textProps = (name: FieldName) => ({
    disabled: formik.isSubmitting,
    error: hasError(name),
    helperText: getHelperText(name),
    onBlur: formik.handleBlur,
    onChange: formik.handleChange,
    value: formik.values[name],
  })

  const autocompleteProps = (name: FieldName) => ({
    disabled: formik.isSubmitting,
    error: hasError(name),
    helperText: getHelperText(name),
    onBlur: () => {
      void formik.setFieldTouched(name, true)
    },
    onChange: (value: string) => {
      void formik.setFieldValue(name, value)
    },
    value: formik.values[name],
  })

  const materialRows =
    formik.values.materials.length > 0
      ? formik.values.materials
      : [createDefaultMaterialValues()]

  const getMaterialPath = (index: number, name: MaterialFieldName) =>
    `materials.${index}.${name}`

  const getMaterialError = (
    index: number,
    name: MaterialFieldName,
  ): string | undefined => {
    const materialErrors = formik.errors.materials

    if (!Array.isArray(materialErrors)) {
      return undefined
    }

    const rowError = materialErrors[index]

    if (!rowError || typeof rowError === 'string') {
      return undefined
    }

    return rowError[name]
  }

  const isMaterialTouched = (index: number, name: MaterialFieldName) => {
    const materialTouched = formik.touched.materials

    if (!Array.isArray(materialTouched)) {
      return false
    }

    const rowTouched = materialTouched[index]

    return Boolean(rowTouched && rowTouched[name])
  }

  const getMaterialHelperText = (
    index: number,
    name: MaterialFieldName,
  ) => (isMaterialTouched(index, name) ? getMaterialError(index, name) : undefined)

  const hasMaterialError = (index: number, name: MaterialFieldName) =>
    Boolean(isMaterialTouched(index, name) && getMaterialError(index, name))

  const materialAutocompleteProps = (
    index: number,
    name: MaterialFieldName,
  ) => ({
    disabled: formik.isSubmitting,
    error: hasMaterialError(index, name),
    helperText: getMaterialHelperText(index, name),
    onBlur: () => {
      void formik.setFieldTouched(getMaterialPath(index, name), true)
    },
    onChange: (value: string) => {
      void formik.setFieldValue(getMaterialPath(index, name), value)
    },
    value: materialRows[index]?.[name] ?? '',
  })

  const materialTextProps = (index: number, name: MaterialFieldName) => ({
    disabled: formik.isSubmitting || name === 'quantity',
    error: hasMaterialError(index, name),
    helperText: getMaterialHelperText(index, name),
    onBlur: () => {
      void formik.setFieldTouched(getMaterialPath(index, name), true)
    },
    onChange: formik.handleChange,
    value: name === 'quantity' ? '1' : materialRows[index]?.[name] ?? '',
  })

  const getMaterialsError = () => {
    const materialErrors = formik.errors.materials

    return typeof materialErrors === 'string' && formik.touched.materials
      ? materialErrors
      : undefined
  }

  const touchFields = async (fields: DetailFieldName[]) => {
    await Promise.all(
      fields.map((field) => formik.setFieldTouched(field, true, false)),
    )

    if (fields.includes('materials')) {
      await Promise.all(
        materialRows.flatMap((_, index) =>
          materialFieldNames.map((name) =>
            formik.setFieldTouched(getMaterialPath(index, name), true, false),
          ),
        ),
      )
    }
  }

  function withNormalizedValues(values: SpmsRequestFormValues) {
    const materials = normalizeFormMaterials(values)
    const firstMaterial = materials[0] ?? createDefaultMaterialValues()
    const slaHours = values.slaHours || getSlaHoursForSeverity(values.severity)
    const hasDeliveryEvidence = Boolean(
      values.deliveryEvidenceFileName || values.evidenceFileName,
    )
    const deliveryStatus = hasDeliveryEvidence
      ? 'DELIVERED'
      : values.deliveryStatus === 'DRAFT BA'
        ? 'OPEN'
        : values.deliveryStatus || 'OPEN'

    return {
      ...values,
      categoryMaterial: firstMaterial.categoryMaterial,
      typeMaterial: firstMaterial.typeMaterial,
      description: firstMaterial.description,
      partNumber: firstMaterial.partNumber,
      quantity: '1',
      materialSerialNumber:
        values.materialSerialNumber ||
        materials
          .map((material) => material.serialNumber)
          .filter(Boolean)
          .join(', '),
      supportOriginMaterial: firstMaterial.supportOriginMaterial,
      supportDestinationMaterial: firstMaterial.supportDestinationMaterial,
      materials,
      baType: defaultBaType,
      deliveryStatus,
      statusReturn: getAutoPickupStatus(values, deliveryStatus),
      slaHours,
      destinationLsp:
        values.destinationLsp || firstMaterial.supportDestinationMaterial,
      originLsp: values.originLsp || firstMaterial.supportOriginMaterial,
    }
  }

  const saveValues = async (
    values: SpmsRequestFormValues,
    fieldScope: DetailFieldName[],
  ) => {
    const normalizedValues = withNormalizedValues(values)
    const errors = await formik.validateForm(normalizedValues)
    const errorFields = fieldScope.filter((field) => Boolean(errors[field]))

    if (errorFields.length > 0) {
      await touchFields(errorFields)

      const firstStepWithError = stepFields.findIndex((fields) =>
        fields.some((field) => errorFields.includes(field)),
      )

      if (firstStepWithError >= 0) {
        setActiveStep(firstStepWithError)
      }

      return
    }

    formik.setSubmitting(true)

    try {
      await onSave(normalizedValues)
      void formik.setValues(normalizedValues, false)
    } finally {
      formik.setSubmitting(false)
    }
  }

  const handleSave = async () => {
    const fieldScope = isCreateMode
      ? detailRequestFields
      : (stepFields[activeStep] ?? detailRequestFields)
    const normalizedValues = withNormalizedValues(formik.values)
    const errors = await formik.validateForm(normalizedValues)
    const errorFields = fieldScope.filter((field) => Boolean(errors[field]))

    if (errorFields.length > 0) {
      await touchFields(errorFields)

      const firstStepWithError = stepFields.findIndex((fields) =>
        fields.some((field) => errorFields.includes(field)),
      )

      if (firstStepWithError >= 0) {
        setActiveStep(firstStepWithError)
      }

      return
    }

    const confirmed = await confirm({
      confirmLabel: isCreateMode ? 'Create SPMS' : 'Save',
      description: isCreateMode
        ? 'SPMS baru akan dibuat dengan status New. Delivery Order dibuat manual dari menu Delivery Order.'
        : `Perubahan pada tab ${formSteps[activeStep].title} akan disimpan.`,
      title: isCreateMode
        ? 'Create new SPMS?'
        : `Save ${formSteps[activeStep].title}?`,
    })

    if (!confirmed) {
      return
    }

    await saveValues(normalizedValues, fieldScope)
  }

  const getActionTimestamp = () => {
    const now = new Date()
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)

    return localDate.toISOString().slice(0, 16)
  }

  const saveWorkflowAction = async (
    allowed: boolean,
    fields: {
      by: FieldName
      date: FieldName
      notes: FieldName
      status: FieldName
      statusValue: string
    },
  ) => {
    if (!allowed) {
      return
    }

    const confirmed = await confirm({
      confirmLabel: 'Save',
      description:
        'Pastikan status, actor, dan notes sudah sesuai sebelum menyimpan perubahan workflow ini.',
      title: `Save ${fields.statusValue === 'CLOSED' ? 'closed status' : 'approval'}?`,
    })

    if (!confirmed) {
      return
    }

    const currentStatus = formik.values[fields.status]
    const shouldUseDefaultStatus =
      currentStatus === 'PENDING APPROVAL' ||
      currentStatus === 'PENDING CUSTOMER' ||
      currentStatus === 'DRAFT'
    const nextValues: SpmsRequestFormValues = {
      ...formik.values,
      [fields.by]: formik.values[fields.by] || currentUserName,
      [fields.date]: formik.values[fields.date] || getActionTimestamp(),
      [fields.status]: shouldUseDefaultStatus
        ? fields.statusValue
        : currentStatus,
    }

    await saveValues(nextValues, [
      fields.by,
      fields.status,
      fields.date,
      fields.notes,
    ])
  }

  const handleFileChange =
    (field: EvidenceFieldName) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]

      if (file) {
        void formik.setFieldValue(field, file.name)

        if (field === 'deliveryEvidenceFileName') {
          void formik.setFieldValue('evidenceFileName', file.name)
          void formik.setFieldValue('deliveryStatus', 'DELIVERED')
        }

        if (field === 'pickupEvidenceFileName') {
          const currentPickupStatus = formik.values.statusReturn

          void formik.setFieldValue(
            'statusReturn',
            currentPickupStatus === 'ROK' || currentPickupStatus === 'FAULTY'
              ? currentPickupStatus
              : '',
          )
        }
      }
    }

  const handleAddMaterial = () => {
    void formik.setFieldValue('materials', [
      ...materialRows,
      createDefaultMaterialValues(),
    ])
  }

  const handleRemoveMaterial = (index: number) => {
    if (materialRows.length <= 1) {
      return
    }

    void formik.setFieldValue(
      'materials',
      materialRows.filter((_, materialIndex) => materialIndex !== index),
    )
  }

  const handleSeverityChange = (value: string) => {
    void formik.setFieldValue('severity', value)
    void formik.setFieldValue(
      'slaHours',
      formik.values.slaHours || getSlaHoursForSeverity(value),
    )
  }

  const handleRequestorChange = (value: string) => {
    const contact = requestorContactMap[value]

    void formik.setFieldValue('customerRequestor', value)

    if (contact) {
      void formik.setFieldValue('requestorEmail', contact.email)
      void formik.setFieldValue('requestorPhone', contact.phone)
    }
  }

  const handlePicKancabChange = (value: string) => {
    const contact = picKancabContactMap[value]

    void formik.setFieldValue('picKancabName', value)

    if (contact) {
      void formik.setFieldValue('picKancabEmail', contact.email)
      void formik.setFieldValue('picKancabPhone', contact.phone)
    }
  }

  const deliveryEvidenceName =
    formik.values.deliveryEvidenceFileName || formik.values.evidenceFileName

  const hasDeliveryOrder = Boolean(formik.values.deliveryOrderNumber)
  const hasPickupDeliveryOrder = Boolean(formik.values.pickupDeliveryOrderNumber)
  const isArfTransaction = formik.values.statusTransaction === 'ARF'
  const isDeliveryDelivered =
    Boolean(deliveryEvidenceName) || formik.values.deliveryStatus === 'DELIVERED'
  const isDeliveryApproval1Approved = formik.values.approval1Status === 'APPROVED'
  const isDeliveryApproval2Approved = formik.values.approval2Status === 'APPROVED'
  const isDeliveryCustomerClosed = formik.values.closedStatus === 'CLOSED'
  const isDeliveryApproved =
    isDeliveryApproval1Approved && isDeliveryApproval2Approved
  const isDeliveryApprovalComplete =
    isDeliveryApproved && isDeliveryCustomerClosed
  const isPickupAvailable =
    isDeliveryApprovalComplete && hasPickupDeliveryOrder && !isArfTransaction
  const isPickupUploaded = Boolean(formik.values.pickupEvidenceFileName)
  const pickupUploadStatus = getAutoPickupStatus(formik.values)
  const isPickupApproval1Approved =
    formik.values.pickupApproval1Status === 'APPROVED'
  const isPickupApproval2Approved =
    formik.values.pickupApproval2Status === 'APPROVED'
  const isPickupCustomerClosed = formik.values.pickupClosedStatus === 'CLOSED'
  const isPickupApproved =
    isPickupApproval1Approved && isPickupApproval2Approved
  const isPickupApprovalComplete =
    isArfTransaction || (isPickupApproved && isPickupCustomerClosed)
  const isTicketClosed =
    isDeliveryApprovalComplete && isPickupApprovalComplete
  const isTransactionClosed = isTicketClosed
  const getApprovalStepState = (
    isDone: boolean,
    isActive: boolean,
  ): TimelineState => {
    if (isDone) {
      return 'done'
    }

    return isActive ? 'active' : 'pending'
  }
  const getDeliveryApprovalMeta = () => {
    if (isDeliveryApprovalComplete) {
      return 'Closed'
    }

    if (isDeliveryApproval2Approved) {
      return 'Waiting Customer'
    }

    if (isDeliveryApproval1Approved) {
      return 'Waiting Admin 2'
    }

    return isDeliveryDelivered ? 'Waiting Admin 1' : 'Waiting Delivery'
  }
  const getPickupApprovalMeta = () => {
    if (isPickupApprovalComplete) {
      return 'Closed'
    }

    if (isPickupApproval2Approved) {
      return 'Waiting Customer'
    }

    if (isPickupApproval1Approved) {
      return 'Waiting Admin 2'
    }

    return isPickupUploaded ? 'Waiting Admin 1' : 'Waiting Pickup'
  }
  const deliveryApprovalChain: ApprovalChainItem[] = [
    {
      detail: isDeliveryApproval1Approved
        ? formatTimelineDate(formik.values.approval1Date)
        : isDeliveryDelivered
          ? 'Waiting Admin 1'
          : 'Waiting Delivery',
      label: isDeliveryApproval1Approved
        ? formik.values.approval1By || 'Admin 1'
        : 'Admin 1',
      state: getApprovalStepState(
        isDeliveryApproval1Approved,
        isDeliveryDelivered,
      ),
    },
    {
      detail: isDeliveryApproval2Approved
        ? formatTimelineDate(formik.values.approval2Date)
        : isDeliveryApproval1Approved
          ? 'Waiting Admin 2'
          : 'Waiting Admin 1',
      label: isDeliveryApproval2Approved
        ? formik.values.approval2By || 'Admin 2'
        : 'Admin 2',
      state: getApprovalStepState(
        isDeliveryApproval2Approved,
        isDeliveryApproval1Approved,
      ),
    },
    {
      detail: isDeliveryCustomerClosed
        ? formatTimelineDate(formik.values.closedDate)
        : isDeliveryApproval2Approved
          ? 'Waiting Customer'
          : 'Waiting Admin 2',
      label: isDeliveryCustomerClosed
        ? formik.values.closedBy || 'Closed in Customer'
        : 'Closed in Customer',
      state: getApprovalStepState(
        isDeliveryCustomerClosed,
        isDeliveryApproval2Approved,
      ),
    },
  ]
  const pickupApprovalChain: ApprovalChainItem[] = [
    {
      detail: isPickupApproval1Approved
        ? formatTimelineDate(formik.values.pickupApproval1Date)
        : isPickupUploaded
          ? 'Waiting Admin 1'
          : 'Waiting Pickup',
      label: isPickupApproval1Approved
        ? formik.values.pickupApproval1By || 'Admin 1'
        : 'Admin 1',
      state: getApprovalStepState(isPickupApproval1Approved, isPickupUploaded),
    },
    {
      detail: isPickupApproval2Approved
        ? formatTimelineDate(formik.values.pickupApproval2Date)
        : isPickupApproval1Approved
          ? 'Waiting Admin 2'
          : 'Waiting Admin 1',
      label: isPickupApproval2Approved
        ? formik.values.pickupApproval2By || 'Admin 2'
        : 'Admin 2',
      state: getApprovalStepState(
        isPickupApproval2Approved,
        isPickupApproval1Approved,
      ),
    },
    {
      detail: isPickupCustomerClosed
        ? formatTimelineDate(formik.values.pickupClosedDate)
        : isPickupApproval2Approved
          ? 'Waiting Customer'
          : 'Waiting Admin 2',
      label: isPickupCustomerClosed
        ? formik.values.pickupClosedBy || 'Closed in Customer'
        : 'Closed in Customer',
      state: getApprovalStepState(
        isPickupCustomerClosed,
        isPickupApproval2Approved,
      ),
    },
  ]

  const transactionTimelineItems: TimelineItem[] = [
    {
      actor: formik.values.createdBy,
      description: 'Request transaksi SPMS dibuat',
      label: 'New Ticket',
      meta: 'Open',
      state: 'done' as TimelineState,
      timestamp: formik.values.requestDate,
    },
    {
      actor: hasDeliveryOrder ? formik.values.createdBy : '',
      description: hasDeliveryOrder
        ? `Delivery Order ${formik.values.deliveryOrderNumber} sudah dibuat`
        : 'Menunggu create Delivery Order',
      label: 'Create DO',
      meta: hasDeliveryOrder ? 'Created' : 'New',
      state: hasDeliveryOrder ? 'done' : 'active',
      timestamp: '',
    },
    {
      actor: isDeliveryDelivered ? formik.values.sendBy : '',
      description: isDeliveryDelivered && deliveryEvidenceName
        ? 'BA delivery sudah diupload oleh'
        : hasDeliveryOrder
          ? 'Menunggu upload BA delivery'
          : 'Create DO terlebih dahulu',
      label: 'Upload BA Delivery',
      meta: isDeliveryDelivered ? 'Delivered' : 'Open',
      state: isDeliveryDelivered ? 'done' : hasDeliveryOrder ? 'active' : 'pending',
      timestamp: isDeliveryDelivered ? formik.values.deliveryDateGoodUnit : '',
    },
    {
      actor: '',
      description: <ApprovalChain items={deliveryApprovalChain} />,
      label: 'Approval BA Delivery',
      meta: getDeliveryApprovalMeta(),
      state: isDeliveryApprovalComplete
        ? 'done'
        : isDeliveryDelivered
          ? 'active'
          : 'pending',
      timestamp: isDeliveryApprovalComplete ? formik.values.closedDate : '',
    },
    {
      actor: formik.values.createdBy,
      description: isArfTransaction
        ? 'Pickup dilewati karena status transaksi ARF'
        : hasPickupDeliveryOrder
          ? `DO Pickup ${formik.values.pickupDeliveryOrderNumber} sudah dibuat`
          : 'Menunggu create DO Pickup',
      label: 'Create DO Pickup',
      meta: isArfTransaction
        ? 'Skipped'
        : hasPickupDeliveryOrder
          ? 'Created'
          : 'Waiting',
      state: isArfTransaction || hasPickupDeliveryOrder
        ? 'done'
        : isDeliveryApprovalComplete
          ? 'active'
          : 'pending',
      timestamp: '',
    },
    {
      actor: isPickupUploaded ? formik.values.pickupBy : '',
      description: formik.values.pickupEvidenceFileName
        ? 'BA pickup sudah diupload oleh'
        : isPickupAvailable
          ? 'Menunggu upload BA pickup'
          : isArfTransaction
            ? 'Pickup tidak dibutuhkan untuk ARF'
            : 'Menunggu create DO pickup',
      label: 'Upload BA Pickup',
      meta: isArfTransaction ? 'Skipped' : pickupUploadStatus,
      state: isArfTransaction
        ? 'done'
        : isPickupUploaded
        ? 'done'
        : isPickupAvailable
          ? 'active'
        : 'pending',
      timestamp: isPickupUploaded ? formik.values.pickupDate : '',
    },
    {
      actor: '',
      description: <ApprovalChain items={pickupApprovalChain} />,
      label: 'Approval BA Pickup',
      meta: isArfTransaction ? 'Skipped' : getPickupApprovalMeta(),
      state: isArfTransaction || isPickupApprovalComplete
        ? 'done'
        : isPickupUploaded
          ? 'active'
          : 'pending',
      timestamp: isPickupApprovalComplete ? formik.values.pickupClosedDate : '',
    },
    {
      actor: formik.values.pickupClosedBy || formik.values.closedBy,
      description: 'Semua approval delivery dan pickup',
      label: 'Ticket',
      meta: isTicketClosed ? 'CLOSE' : 'OPEN',
      state: isTicketClosed ? 'done' : 'active',
      timestamp: isTicketClosed
        ? formik.values.pickupClosedDate || formik.values.closedDate
        : '',
    },
  ]

  const renderDetailRequestForm = () => (
    <Stack spacing={1.25}>
      <FormSection
        icon={<AssignmentRoundedIcon fontSize="small" />}
        subtitle="Order, site, dan identitas network"
        title={isCreateMode ? 'Create SPMS Request' : 'Detail Request'}
      >
        <FieldGrid columns={3}>
          <SpmsTextInput
            label="Order Number"
            name="orderNumber"
            readOnly
            {...textProps('orderNumber')}
          />
          <FormAutocomplete
            accent
            label="Area"
            name="areal"
            options={areaOptions}
            required
            {...autocompleteProps('areal')}
          />
          <SpmsTextInput
            label="NE ID"
            name="neId"
            required
            {...textProps('neId')}
          />
          <FormAutocomplete
            accent
            label="Customer"
            name="customer"
            options={customerOptions}
            required
            {...autocompleteProps('customer')}
          />
          <FormAutocomplete
            accent
            label="DOP"
            name="dop"
            options={dopOptions}
            required
            {...autocompleteProps('dop')}
          />
          <SpmsTextInput
            label="FE ID"
            name="feId"
            required
            {...textProps('feId')}
          />
          <SpmsTextInput
            label="Ticket Customer"
            name="customerOrderNumber"
            required
            {...textProps('customerOrderNumber')}
          />
          <FormAutocomplete
            accent
            label="Regional"
            name="regional"
            options={regionalOptions}
            required
            {...autocompleteProps('regional')}
          />
          <SpmsTextInput
            label="Create By"
            name="createdBy"
            readOnly
            required
            {...textProps('createdBy')}
          />
          <FormDateTimeField
            label="Req Date"
            name="requestDate"
            required
            disabled={formik.isSubmitting}
            error={hasError('requestDate')}
            helperText={getHelperText('requestDate')}
            onBlur={() => {
              void formik.setFieldTouched('requestDate', true)
            }}
            onChange={(value) => {
              void formik.setFieldValue('requestDate', value)
            }}
            value={formik.values.requestDate}
          />
          <SpmsTextInput
            label="Site Name"
            name="siteName"
            required
            {...textProps('siteName')}
          />
          {!isCreateMode ? (
            <SpmsTextInput
              label="Delivery Order"
              name="deliveryOrderNumber"
              readOnly
              {...textProps('deliveryOrderNumber')}
            />
          ) : null}
        </FieldGrid>
      </FormSection>

      <FormSection
        icon={<FactCheckRoundedIcon fontSize="small" />}
        subtitle="Requestor customer"
        title="PIC Requestor"
      >
        <FieldGrid columns={3}>
          <FormAutocomplete
            accent
            label="Requestor Name"
            name="customerRequestor"
            options={requestorOptions}
            required
            error={hasError('customerRequestor')}
            helperText={getHelperText('customerRequestor')}
            onBlur={() => {
              void formik.setFieldTouched('customerRequestor', true)
            }}
            onChange={handleRequestorChange}
            value={formik.values.customerRequestor}
          />
          <SpmsTextInput
            label="Email"
            name="requestorEmail"
            required
            {...textProps('requestorEmail')}
          />
          <SpmsTextInput
            label="No.Hp"
            name="requestorPhone"
            required
            {...textProps('requestorPhone')}
          />
        </FieldGrid>
      </FormSection>

      <FormSection
        icon={<LocalShippingRoundedIcon fontSize="small" />}
        subtitle="PIC kancab / LSP"
        title="PIC Kancab"
      >
        <FieldGrid columns={3}>
          <FormAutocomplete
            accent
            label="PIC/LSP Name"
            name="picKancabName"
            options={picKancabOptions}
            required
            error={hasError('picKancabName')}
            helperText={getHelperText('picKancabName')}
            onBlur={() => {
              void formik.setFieldTouched('picKancabName', true)
            }}
            onChange={handlePicKancabChange}
            value={formik.values.picKancabName}
          />
          <SpmsTextInput
            label="Email"
            name="picKancabEmail"
            {...textProps('picKancabEmail')}
          />
          <SpmsTextInput
            label="No.Hp"
            name="picKancabPhone"
            {...textProps('picKancabPhone')}
          />
        </FieldGrid>
      </FormSection>

      <FormSection
        icon={<FactCheckRoundedIcon fontSize="small" />}
        subtitle="Status transaksi dan PIC area"
        title="Detail"
      >
        <FieldGrid columns={3}>
          <FormAutocomplete
            accent
            label="Status Transaction"
            name="statusTransaction"
            options={statusTransactionOptions}
            required
            {...autocompleteProps('statusTransaction')}
          />
          <SpmsTextInput
            label="PM Area"
            name="pmArea"
            required
            {...textProps('pmArea')}
          />
          {!isCreateMode ? (
            <SpmsTextInput
              label="DO Pickup"
              name="pickupDeliveryOrderNumber"
              readOnly
              {...textProps('pickupDeliveryOrderNumber')}
            />
          ) : null}
        </FieldGrid>
      </FormSection>

      <FormSection
        icon={<AssignmentTurnedInRoundedIcon fontSize="small" />}
        subtitle="Daftar material request"
        title="Material"
      >
        <Stack spacing={1}>
          {materialRows.map((_, index) => (
            <Box
              key={`material-${index}`}
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.black, 0.2)
                    : alpha(theme.palette.common.white, 0.62),
                border: '1px solid',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.light, 0.18)
                    : alpha(theme.palette.primary.main, 0.12),
                borderRadius: 1,
                p: { xs: 1, md: 1 },
              }}
            >
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Chip
                    color="primary"
                    label={`Material ${index + 1}`}
                    size="small"
                    variant="outlined"
                  />
                  <Tooltip title="Remove material">
                    <span>
                      <IconButton
                        aria-label={`Remove material ${index + 1}`}
                        disabled={formik.isSubmitting || materialRows.length <= 1}
                        onClick={() => handleRemoveMaterial(index)}
                        size="small"
                      >
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>

                <Box
                  sx={{
                    display: 'grid',
                    gap: 1,
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: 'repeat(2, minmax(0, 1fr))',
                      xl: '1.4fr 1fr 92px 1.2fr 1fr 1fr 1.2fr',
                    },
                  }}
                >
                  <FormAutocomplete
                    accent
                    label="Spare Part Name"
                    name={getMaterialPath(index, 'description')}
                    options={descriptionOptions}
                    required
                    {...materialAutocompleteProps(index, 'description')}
                  />
                  <FormAutocomplete
                    accent
                    label="Type"
                    name={getMaterialPath(index, 'typeMaterial')}
                    options={typeMaterialOptions}
                    required
                    {...materialAutocompleteProps(index, 'typeMaterial')}
                  />
                  <SpmsTextInput
                    label="Qty"
                    name={getMaterialPath(index, 'quantity')}
                    required
                    type="number"
                    {...materialTextProps(index, 'quantity')}
                  />
                  <FormAutocomplete
                    accent
                    label="Detail Equipment"
                    name={getMaterialPath(index, 'categoryMaterial')}
                    options={categoryMaterialOptions}
                    required
                    {...materialAutocompleteProps(index, 'categoryMaterial')}
                  />
                  <FormAutocomplete
                    accent
                    label="Severity"
                    name="severity"
                    options={severityOptions}
                    required
                    {...autocompleteProps('severity')}
                    onChange={handleSeverityChange}
                  />
                  <FormAutocomplete
                    accent
                    label="Product Number"
                    name={getMaterialPath(index, 'partNumber')}
                    options={partNumberOptions}
                    required
                    {...materialAutocompleteProps(index, 'partNumber')}
                  />
                  <FormAutocomplete
                    accent
                    label="SLA"
                    name="slaHours"
                    options={slaHourOptions}
                    required
                    {...autocompleteProps('slaHours')}
                  />
                  <SpmsTextInput
                    label="Serial Number"
                    name={getMaterialPath(index, 'serialNumber')}
                    readOnly
                    {...materialTextProps(index, 'serialNumber')}
                  />
                </Box>
              </Stack>
            </Box>
          ))}

          {getMaterialsError() ? (
            <FormHelperText error sx={{ mx: 0 }}>
              {getMaterialsError()}
            </FormHelperText>
          ) : null}

          <Button
            disabled={formik.isSubmitting}
            onClick={handleAddMaterial}
            startIcon={<AddRoundedIcon />}
            type="button"
            variant="outlined"
            sx={{
              alignSelf: 'flex-start',
              background: 'transparent',
              boxShadow: 'none',
              color: 'primary.main',
            }}
          >
            Add Material
          </Button>
        </Stack>
      </FormSection>
    </Stack>
  )

  const renderApprovalCards = (scope: 'delivery' | 'pickup') => {
    const isDelivery = scope === 'delivery'
    const scopeLabel = isDelivery ? 'Delivery' : 'Pickup'
    const fields = isDelivery
      ? {
          approval1By: 'approval1By' as FieldName,
          approval1Date: 'approval1Date' as FieldName,
          approval1Notes: 'approval1Notes' as FieldName,
          approval1Status: 'approval1Status' as FieldName,
          approval2By: 'approval2By' as FieldName,
          approval2Date: 'approval2Date' as FieldName,
          approval2Notes: 'approval2Notes' as FieldName,
          approval2Status: 'approval2Status' as FieldName,
          closedBy: 'closedBy' as FieldName,
          closedDate: 'closedDate' as FieldName,
          closedNotes: 'closedNotes' as FieldName,
          closedStatus: 'closedStatus' as FieldName,
        }
      : {
          approval1By: 'pickupApproval1By' as FieldName,
          approval1Date: 'pickupApproval1Date' as FieldName,
          approval1Notes: 'pickupApproval1Notes' as FieldName,
          approval1Status: 'pickupApproval1Status' as FieldName,
          approval2By: 'pickupApproval2By' as FieldName,
          approval2Date: 'pickupApproval2Date' as FieldName,
          approval2Notes: 'pickupApproval2Notes' as FieldName,
          approval2Status: 'pickupApproval2Status' as FieldName,
          closedBy: 'pickupClosedBy' as FieldName,
          closedDate: 'pickupClosedDate' as FieldName,
          closedNotes: 'pickupClosedNotes' as FieldName,
          closedStatus: 'pickupClosedStatus' as FieldName,
        }

    return (
    <Stack spacing={1.25}>
      <Stack
        direction="row"
        spacing={0.75}
        sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}
      >
        <Chip
          color="primary"
          label={`Current role: ${currentRole.replace('_', ' ')}`}
          size="small"
          variant="outlined"
        />
        <Typography color="text.secondary" variant="body2">
          Hanya role yang sesuai yang bisa mengubah approval {scopeLabel.toLowerCase()}.
        </Typography>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        <FormSection
          icon={<FactCheckRoundedIcon fontSize="small" />}
          subtitle={`Approval pertama ${scopeLabel.toLowerCase()} dari admin 1`}
          title={`${scopeLabel} Approval 1`}
        >
          <FieldGrid columns={1}>
            <SpmsTextInput
              label="Approval 1 By"
              name={fields.approval1By}
              required
              {...textProps(fields.approval1By)}
              disabled={formik.isSubmitting || !canApprove1}
            />
            <ApprovalRadioGroup
              label="Approval 1 Status"
              name={fields.approval1Status}
              required
              disabled={formik.isSubmitting || !canApprove1}
              error={hasError(fields.approval1Status)}
              helperText={getHelperText(fields.approval1Status)}
              onBlur={() => {
                void formik.setFieldTouched(fields.approval1Status, true)
              }}
              onChange={(value) => {
                void formik.setFieldValue(fields.approval1Status, value)
              }}
              sx={{ gridColumn: { md: '1 / -1' } }}
              value={formik.values[fields.approval1Status]}
            />
            <SpmsTextInput
              label="Approval 1 Notes"
              name={fields.approval1Notes}
              multiline
              sx={{ gridColumn: { md: '1 / -1' } }}
              {...textProps(fields.approval1Notes)}
              disabled={formik.isSubmitting || !canApprove1}
            />
            <AppButton
              disabled={formik.isSubmitting || !canApprove1}
              onClick={() => {
                void saveWorkflowAction(canApprove1, {
                  by: fields.approval1By,
                  date: fields.approval1Date,
                  notes: fields.approval1Notes,
                  status: fields.approval1Status,
                  statusValue: 'APPROVED',
                })
              }}
              startIcon={<CheckCircleRoundedIcon />}
              type="button"
              sx={{ width: '100%' }}
            >
              Save {scopeLabel} Approval 1
            </AppButton>
          </FieldGrid>
        </FormSection>

        <FormSection
          icon={<AssignmentTurnedInRoundedIcon fontSize="small" />}
          subtitle={`Approval kedua ${scopeLabel.toLowerCase()} dari admin 2 / PIC BA region`}
          title={`${scopeLabel} Approval 2`}
        >
          <FieldGrid columns={1}>
            <SpmsTextInput
              label="Approval 2 By"
              name={fields.approval2By}
              required
              {...textProps(fields.approval2By)}
              disabled={formik.isSubmitting || !canApprove2}
            />
            <ApprovalRadioGroup
              label="Approval 2 Status"
              name={fields.approval2Status}
              required
              disabled={formik.isSubmitting || !canApprove2}
              error={hasError(fields.approval2Status)}
              helperText={getHelperText(fields.approval2Status)}
              onBlur={() => {
                void formik.setFieldTouched(fields.approval2Status, true)
              }}
              onChange={(value) => {
                void formik.setFieldValue(fields.approval2Status, value)
              }}
              sx={{ gridColumn: { md: '1 / -1' } }}
              value={formik.values[fields.approval2Status]}
            />
            <SpmsTextInput
              label="Approval 2 Notes"
              name={fields.approval2Notes}
              multiline
              sx={{ gridColumn: { md: '1 / -1' } }}
              {...textProps(fields.approval2Notes)}
              disabled={formik.isSubmitting || !canApprove2}
            />
            <AppButton
              disabled={formik.isSubmitting || !canApprove2}
              onClick={() => {
                void saveWorkflowAction(canApprove2, {
                  by: fields.approval2By,
                  date: fields.approval2Date,
                  notes: fields.approval2Notes,
                  status: fields.approval2Status,
                  statusValue: 'APPROVED',
                })
              }}
              startIcon={<CheckCircleRoundedIcon />}
              type="button"
              sx={{ width: '100%' }}
            >
              Save {scopeLabel} Approval 2
            </AppButton>
          </FieldGrid>
        </FormSection>

        <FormSection
          icon={<AssignmentTurnedInRoundedIcon fontSize="small" />}
          subtitle={`${scopeLabel} closing customer oleh admin 3`}
          title={`${scopeLabel} Closed in Customer`}
        >
          <FieldGrid columns={1}>
            <SpmsTextInput
              label="Closed By"
              name={fields.closedBy}
              required
              {...textProps(fields.closedBy)}
              disabled={formik.isSubmitting || !canCloseCustomer}
            />
            <ApprovalRadioGroup
              label="Closed Status"
              name={fields.closedStatus}
              required
              disabled={formik.isSubmitting || !canCloseCustomer}
              error={hasError(fields.closedStatus)}
              helperText={getHelperText(fields.closedStatus)}
              onBlur={() => {
                void formik.setFieldTouched(fields.closedStatus, true)
              }}
              onChange={(value) => {
                void formik.setFieldValue(fields.closedStatus, value)
              }}
              sx={{ gridColumn: { md: '1 / -1' } }}
              value={formik.values[fields.closedStatus]}
              isClosedStatus
            />
            <SpmsTextInput
              label="Closed Notes"
              name={fields.closedNotes}
              multiline
              sx={{ gridColumn: { md: '1 / -1' } }}
              {...textProps(fields.closedNotes)}
              disabled={formik.isSubmitting || !canCloseCustomer}
            />
            <AppButton
              disabled={formik.isSubmitting || !canCloseCustomer}
              onClick={() => {
                void saveWorkflowAction(canCloseCustomer, {
                  by: fields.closedBy,
                  date: fields.closedDate,
                  notes: fields.closedNotes,
                  status: fields.closedStatus,
                  statusValue: 'CLOSED',
                })
              }}
              startIcon={<CheckCircleRoundedIcon />}
              type="button"
              sx={{ width: '100%' }}
            >
              Save {scopeLabel} Closed Customer
            </AppButton>
          </FieldGrid>
        </FormSection>
      </Box>
    </Stack>
    )
  }

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={(event) => event.preventDefault()}
    >
      <LiquidPanel sx={{ p: { xs: 1.25, md: 1.5 } }}>
        <Stack spacing={1.25}>
          {!isCreateMode ? (
            <>
              <Box
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.035)
                      : alpha(theme.palette.common.white, 0.48),
                  border: '1px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.primary.light, 0.16)
                      : alpha(theme.palette.primary.main, 0.1),
                  borderRadius: 1,
                  p: { xs: 1.25, md: 1.5 },
                }}
              >
                <Stack spacing={0.75}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={0.5}
                    sx={{
                      alignItems: { sm: 'center' },
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{ fontSize: 16, fontWeight: 900, lineHeight: 1.2 }}
                      >
                        Transaction Track
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: 12, lineHeight: 1.3 }}
                      >
                        Posisi transaksi SPMS dari open sampai closed.
                      </Typography>
                    </Box>
                    <Chip
                      color={isTransactionClosed ? 'success' : 'warning'}
                      label={
                        isTransactionClosed
                          ? 'Closed'
                          : transactionTimelineItems.find(
                              (item) => item.state === 'active',
                            )?.label ?? 'In Progress'
                      }
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                  <ProcessTimeline items={transactionTimelineItems} />
                </Stack>
              </Box>

              <Tabs
                value={activeStep}
                onChange={(_, nextStep: number) => {
                  if (!hasDeliveryOrder && nextStep > 0) {
                    return
                  }

                  if (
                    nextStep > 2 &&
                    (isArfTransaction || !hasPickupDeliveryOrder)
                  ) {
                    return
                  }

                  setActiveStep(nextStep)
                }}
                variant="scrollable"
                allowScrollButtonsMobile
                sx={{
                  borderBottom: '1px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(128, 205, 255, 0.14)'
                      : 'rgba(18, 73, 126, 0.12)',
                  minHeight: 68,
                  '& .MuiTabs-indicator': {
                    height: 3,
                  },
                  '& .MuiTab-root': {
                    alignItems: 'flex-start',
                    borderRadius: 1,
                    minHeight: 64,
                    minWidth: { xs: 178, sm: 210 },
                    px: 1.5,
                    textAlign: 'left',
                  },
                }}
              >
                {formSteps.map((step, index) => (
                  <Tab
                    key={step.title}
                    disabled={
                      (!hasDeliveryOrder && index > 0) ||
                      (index > 2 &&
                        (isArfTransaction || !hasPickupDeliveryOrder))
                    }
                    type="button"
                    value={index}
                    label={
                      <Stack spacing={0.25}>
                        <Typography sx={{ fontWeight: 900 }} variant="body2">
                          {step.title}
                        </Typography>
                        <Typography color="text.secondary" variant="caption">
                          {step.subtitle}
                        </Typography>
                      </Stack>
                    }
                  />
                ))}
              </Tabs>

            </>
          ) : null}

          {isCreateMode || activeStep === 0 ? renderDetailRequestForm() : null}

          {activeStep === 1 ? (
            <Box
              sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(300px, 0.9fr) 1.4fr' },
              }}
            >
              <EvidenceUpload
                fileName={deliveryEvidenceName}
                helper="Upload BA delivery, foto material diterima, atau PDF evidence."
                onFileChange={handleFileChange('deliveryEvidenceFileName')}
                title="Delivery Evidence"
              />

              <Stack spacing={1}>
                <FormSection
                  icon={<AssignmentTurnedInRoundedIcon fontSize="small" />}
                  subtitle="SN hasil input saat create DO"
                  title="Serial Number Reference"
                >
                  <Stack spacing={0.75}>
                    {materialRows.map((material, index) => (
                      <Box
                        key={`${material.partNumber}-${index}`}
                        sx={{
                          alignItems: 'center',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          display: 'grid',
                          gap: 0.75,
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1.4fr 1fr 1fr',
                          },
                          p: 1.25,
                        }}
                      >
                        <Typography sx={{ fontWeight: 850 }} variant="body2">
                          {material.description || `Material ${index + 1}`}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {material.partNumber || '-'}
                        </Typography>
                        <Chip
                          label={material.serialNumber || 'SN belum tersedia'}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    ))}
                  </Stack>
                </FormSection>

                <FormSection
                  icon={<CloudUploadRoundedIcon fontSize="small" />}
                  subtitle="Data pengiriman good unit ke lokasi tujuan"
                  title="BA Delivery"
                >
                  <FieldGrid>
                    <SpmsTextInput
                      label="BA Type"
                      name="baType"
                      disabled
                      readOnly
                      required
                      error={hasError('baType')}
                      helperText={getHelperText('baType')}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={defaultBaType}
                    />
                    <SpmsTextInput
                      label="Send By"
                      name="sendBy"
                      required
                      {...textProps('sendBy')}
                    />
                    <FormDateTimeField
                      label="Delivery Date Good Unit"
                      name="deliveryDateGoodUnit"
                      required
                      disabled={formik.isSubmitting}
                      error={hasError('deliveryDateGoodUnit')}
                      helperText={getHelperText('deliveryDateGoodUnit')}
                      onBlur={() => {
                        void formik.setFieldTouched('deliveryDateGoodUnit', true)
                      }}
                      onChange={(value) => {
                        void formik.setFieldValue('deliveryDateGoodUnit', value)
                      }}
                      value={formik.values.deliveryDateGoodUnit}
                    />
                    <SpmsTextInput
                      label="Serial Number Good Unit"
                      name="serialNumberGoodUnit"
                      required
                      {...textProps('serialNumberGoodUnit')}
                    />
                    <FormAutocomplete
                      accent
                      label="Description Material"
                      name="descriptionMaterial"
                      options={descriptionOptions}
                      required
                      sx={{ gridColumn: { md: '1 / -1' } }}
                      {...autocompleteProps('descriptionMaterial')}
                    />
                  </FieldGrid>
                </FormSection>
              </Stack>
            </Box>
          ) : null}

          {activeStep === 2 ? renderApprovalCards('delivery') : null}

          {activeStep === 3 ? (
            <Box
              sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(300px, 0.9fr) 1.4fr' },
              }}
            >
              <EvidenceUpload
                fileName={formik.values.pickupEvidenceFileName}
                helper="Upload BA pickup, foto faulty unit, atau bukti return material."
                onFileChange={handleFileChange('pickupEvidenceFileName')}
                title="Pickup Evidence"
              />

              <Stack spacing={1}>
                <FormSection
                  icon={<ReplayRoundedIcon fontSize="small" />}
                  subtitle="Data pickup faulty unit atau material return"
                  title="BA Pickup / Return"
                >
                  <FieldGrid>
                    {isPickupUploaded ? (
                      <FormAutocomplete
                        accent
                        label="BA Pickup Status"
                        name="statusReturn"
                        options={pickupStatusOptions}
                        required
                        error={hasError('statusReturn')}
                        helperText={getHelperText('statusReturn')}
                        onBlur={() => {
                          void formik.setFieldTouched('statusReturn', true)
                        }}
                        onChange={(value) => {
                          void formik.setFieldValue('statusReturn', value)
                        }}
                        value={
                          formik.values.statusReturn === 'Faulty'
                            ? 'FAULTY'
                            : formik.values.statusReturn
                        }
                      />
                    ) : (
                      <SpmsTextInput
                        label="BA Pickup Status"
                        name="statusReturn"
                        disabled
                        readOnly
                        required
                        error={hasError('statusReturn')}
                        helperText={getHelperText('statusReturn')}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={
                          pickupUploadStatus === 'OPEN'
                            ? 'UNRETURN'
                            : pickupUploadStatus
                        }
                      />
                    )}
                    <SpmsTextInput
                      label="Serial Number Faulty Unit"
                      name="serialNumberFaultyUnit"
                      {...textProps('serialNumberFaultyUnit')}
                    />
                    <SpmsTextInput
                      label="Pickup By"
                      name="pickupBy"
                      {...textProps('pickupBy')}
                    />
                    <FormDateTimeField
                      label="Pickup Date"
                      name="pickupDate"
                      disabled={formik.isSubmitting}
                      error={hasError('pickupDate')}
                      helperText={getHelperText('pickupDate')}
                      onBlur={() => {
                        void formik.setFieldTouched('pickupDate', true)
                      }}
                      onChange={(value) => {
                        void formik.setFieldValue('pickupDate', value)
                      }}
                      value={formik.values.pickupDate}
                    />
                  </FieldGrid>
                </FormSection>

                <FormSection
                  icon={<AssignmentTurnedInRoundedIcon fontSize="small" />}
                  subtitle="Catatan akhir untuk BA pickup dan closing"
                  title="Pickup Notes"
                >
                  <FieldGrid>
                    <SpmsTextInput
                      label="Evidence Notes"
                      name="evidenceNotes"
                      multiline
                      sx={{ gridColumn: { md: '1 / -1' } }}
                      {...textProps('evidenceNotes')}
                    />
                  </FieldGrid>
                </FormSection>
              </Stack>
            </Box>
          ) : null}

          {activeStep === 4 ? renderApprovalCards('pickup') : null}
        </Stack>
      </LiquidPanel>

      <Stack
        direction={{ xs: 'column-reverse', sm: 'row' }}
        spacing={1}
        sx={{
          justifyContent: 'flex-end',
          mt: 2,
          position: { md: 'sticky' },
          bottom: { md: 16 },
          zIndex: 1,
        }}
      >
        {onCancel ? (
          <Button
            disabled={formik.isSubmitting}
            onClick={onCancel}
            type="button"
            variant="outlined"
            sx={{
              background: 'transparent',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(128, 205, 255, 0.2)'
                  : 'rgba(18, 73, 126, 0.18)',
              boxShadow: 'none',
              color: 'text.secondary',
              minWidth: 104,
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(128, 205, 255, 0.08)'
                    : 'rgba(29, 112, 183, 0.06)',
                boxShadow: 'none',
              },
            }}
          >
            Cancel
          </Button>
        ) : null}
        <AppButton
          disabled={formik.isSubmitting}
          onClick={() => {
            void handleSave()
          }}
          startIcon={<SaveRoundedIcon />}
          type="button"
          sx={{
            minWidth: 132,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {isCreateMode ? 'Add SPMS' : `Save ${formSteps[activeStep].title}`}
        </AppButton>
      </Stack>
    </Box>
  )
}
