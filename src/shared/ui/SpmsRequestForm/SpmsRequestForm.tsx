import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import { alpha, type SxProps, type Theme } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import type { TextFieldProps } from '@mui/material/TextField'
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
  baTypeOptions,
  categoryMaterialOptions,
  closedStatusOptions,
  createDefaultSpmsRequestValues,
  customerOptions,
  deliveryStatusOptions,
  descriptionOptions,
  dopOptions,
  partNumberOptions,
  returnStatusOptions,
  severityOptions,
  slaHourOptions,
  spmsRequestValidationSchema,
  supportDestinationMaterialOptions,
  supportOriginMaterialOptions,
  typeMaterialOptions,
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

type FieldName = keyof SpmsRequestFormValues
type EvidenceFieldName = 'deliveryEvidenceFileName' | 'pickupEvidenceFileName'
export type SpmsApprovalRole = 'ADMIN_1' | 'ADMIN_2' | 'ADMIN_3' | 'REQUESTOR'
type TimelineState = 'done' | 'active' | 'pending'
type TimelineItem = {
  actor: string
  description: string
  label: string
  meta: string
  state: TimelineState
}

type SpmsTextInputProps = {
  disabled?: boolean
  error?: boolean
  helperText?: ReactNode
  id?: string
  label: string
  multiline?: boolean
  name: FieldName
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

const detailRequestFields: FieldName[] = [
  'customer',
  'customerOrderNumber',
  'createdBy',
  'customerRequestor',
  'requestDate',
  'areal',
  'dop',
  'siteName',
  'categoryMaterial',
  'typeMaterial',
  'description',
  'partNumber',
  'quantity',
  'supportOriginMaterial',
  'supportDestinationMaterial',
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

const stepFields: FieldName[][] = [
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
        gap: 2,
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
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
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
              height: 36,
              justifyContent: 'center',
              width: 36,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 900 }} variant="subtitle1">
              {title}
            </Typography>
            {subtitle ? (
              <Typography color="text.secondary" variant="body2">
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
          gridTemplateColumns: `repeat(${items.length}, minmax(168px, 1fr))`,
          minWidth: { xs: 760, lg: '100%' },
          position: 'relative',
          pt: 0.5,
        }}
      >
        <Box
          sx={{
            bgcolor: (theme) => alpha(theme.palette.success.main, 0.82),
            height: 4,
            left: 80,
            position: 'absolute',
            right: 80,
            top: 22,
            zIndex: 0,
          }}
        />
        {items.map((item, index) => (
          <Stack
            key={item.label}
            spacing={0.65}
            sx={{
              alignItems: 'center',
              minWidth: 0,
              px: 1,
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
                fontSize: 12,
                fontWeight: 900,
                height: 40,
                justifyContent: 'center',
                width: 40,
              }}
            >
              {index + 1}
            </Box>
            <Typography
              sx={{ color: (theme) => getColor(item.state, theme), fontWeight: 900 }}
              variant="body2"
            >
              {item.label}
            </Typography>
            <Typography color="warning.main" variant="caption">
              {item.meta || 'Waiting'}
            </Typography>
            <Typography color="text.primary" variant="caption">
              {item.description}
            </Typography>
            <Typography sx={{ fontWeight: 900 }} variant="caption">
              {item.actor || '-'}
            </Typography>
          </Stack>
        ))}
      </Box>
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
        gap: 1.5,
        justifyContent: 'center',
        minHeight: 280,
        p: 2,
        textAlign: 'center',
      }}
    >
      <CloudUploadRoundedIcon sx={{ color: 'primary.main', fontSize: 58 }} />
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
          gap: 1,
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
                minHeight: 44,
                px: 1,
                transition:
                  'border-color 160ms ease, background-color 160ms ease',
                '& .MuiFormControlLabel-label': {
                  fontSize: 13,
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
    <Stack spacing={0.75} sx={sx}>
      <Typography
        component="label"
        htmlFor={inputId}
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
            minHeight: multiline ? undefined : 46,
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
            fontSize: 15,
            fontWeight: 700,
            py: 1.25,
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
        await onSave(values)
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

  const touchFields = async (fields: FieldName[]) => {
    await Promise.all(
      fields.map((field) => formik.setFieldTouched(field, true, false)),
    )
  }

  const withNormalizedValues = (values: SpmsRequestFormValues) => ({
    ...values,
    destinationLsp:
      values.destinationLsp || values.supportDestinationMaterial,
    originLsp: values.originLsp || values.supportOriginMaterial,
  })

  const saveValues = async (
    values: SpmsRequestFormValues,
    fieldScope: FieldName[],
  ) => {
    const errors = await formik.validateForm(values)
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
      await onSave(withNormalizedValues(values))
      void formik.setValues(values, false)
    } finally {
      formik.setSubmitting(false)
    }
  }

  const handleSave = async () => {
    const fieldScope = isCreateMode
      ? detailRequestFields
      : (stepFields[activeStep] ?? detailRequestFields)
    const errors = await formik.validateForm(formik.values)
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
        ? 'SPMS baru akan dibuat dan Delivery Order delivery akan digenerate otomatis.'
        : `Perubahan pada tab ${formSteps[activeStep].title} akan disimpan.`,
      title: isCreateMode
        ? 'Create new SPMS?'
        : `Save ${formSteps[activeStep].title}?`,
    })

    if (!confirmed) {
      return
    }

    await saveValues(formik.values, fieldScope)
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
        }
      }
    }

  const getApprovalTimelineState = (
    status: string,
    pendingState: TimelineState = 'pending',
  ): TimelineState => {
    if (status === 'APPROVED') {
      return 'done'
    }

    if (status === 'REJECTED') {
      return 'active'
    }

    return pendingState
  }

  const deliveryEvidenceName =
    formik.values.deliveryEvidenceFileName || formik.values.evidenceFileName

  const isDeliveryUploaded = Boolean(deliveryEvidenceName)
  const isDeliveryApproved =
    formik.values.approval1Status === 'APPROVED' &&
    formik.values.approval2Status === 'APPROVED'
  const isPickupUploaded = Boolean(formik.values.pickupEvidenceFileName)
  const isPickupApproved =
    formik.values.pickupApproval1Status === 'APPROVED' &&
    formik.values.pickupApproval2Status === 'APPROVED'
  const isTransactionClosed =
    formik.values.pickupClosedStatus === 'CLOSED' ||
    formik.values.closedStatus === 'CLOSED'

  const transactionTimelineItems: TimelineItem[] = [
    {
      actor: formik.values.createdBy,
      description: 'Request transaksi SPMS dibuat',
      label: 'Open',
      meta: formik.values.requestDate,
      state: 'done' as TimelineState,
    },
    {
      actor: formik.values.sendBy,
      description: deliveryEvidenceName
        ? `Evidence: ${deliveryEvidenceName}`
        : 'Menunggu tim lapangan upload BA delivery',
      label: 'Upload BA Delivery',
      meta: formik.values.deliveryDateGoodUnit,
      state: isDeliveryUploaded ? 'done' : 'active',
    },
    {
      actor: formik.values.approval2By || formik.values.approval1By,
      description: 'Menunggu approval BA delivery',
      label: 'Approval BA Delivery',
      meta: formik.values.approval2Date || formik.values.approval1Date,
      state: isDeliveryApproved
        ? 'done'
        : isDeliveryUploaded
          ? getApprovalTimelineState(
              formik.values.approval2Status,
              'active',
            )
          : 'pending',
    },
    {
      actor: formik.values.pickupBy,
      description: formik.values.pickupEvidenceFileName
        ? `Evidence: ${formik.values.pickupEvidenceFileName}`
        : 'Menunggu upload BA pickup / return',
      label: 'Upload BA Pickup',
      meta: formik.values.pickupDate,
      state: isPickupUploaded
        ? 'done'
        : isDeliveryApproved
          ? 'active'
          : 'pending',
    },
    {
      actor:
        formik.values.pickupApproval2By || formik.values.pickupApproval1By,
      description: 'Menunggu approval BA pickup',
      label: 'Approval BA Pickup',
      meta:
        formik.values.pickupApproval2Date ||
        formik.values.pickupApproval1Date,
      state: isPickupApproved
        ? 'done'
        : isPickupUploaded
          ? getApprovalTimelineState(
              formik.values.pickupApproval2Status,
              'active',
            )
          : 'pending',
    },
    {
      actor: formik.values.pickupClosedBy || formik.values.closedBy,
      description: 'Transaksi selesai di customer',
      label: 'Closed In Customer',
      meta: formik.values.pickupClosedDate || formik.values.closedDate,
      state: isTransactionClosed ? 'done' : isPickupApproved ? 'active' : 'pending',
    },
  ]

  const workflowItems = [
    { label: 'BA', value: formik.values.deliveryStatus },
    { label: 'Delivery A1', value: formik.values.approval1Status },
    { label: 'Delivery A2', value: formik.values.approval2Status },
    { label: 'Pickup A1', value: formik.values.pickupApproval1Status },
    { label: 'Pickup A2', value: formik.values.pickupApproval2Status },
    { label: 'Stock', value: formik.values.reservationStatus },
  ]

  const renderDetailRequestForm = () => (
    <FormSection
      icon={<AssignmentRoundedIcon fontSize="small" />}
      subtitle="Input utama request SPMS"
      title={isCreateMode ? 'Create SPMS Request' : 'Detail Request'}
    >
      <FieldGrid>
        <SpmsTextInput
          label="Order Number"
          name="orderNumber"
          readOnly
          {...textProps('orderNumber')}
        />
        <FormAutocomplete
          accent
          label="Customer"
          name="customer"
          options={customerOptions}
          required
          {...autocompleteProps('customer')}
        />
        <SpmsTextInput
          label="Customer Order Number"
          name="customerOrderNumber"
          required
          {...textProps('customerOrderNumber')}
        />
        <SpmsTextInput
          label="Create By"
          name="createdBy"
          readOnly
          required
          {...textProps('createdBy')}
        />
        <SpmsTextInput
          label="Customer Requestor"
          name="customerRequestor"
          required
          {...textProps('customerRequestor')}
        />
        <FormDateTimeField
          label="Request Date"
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
        <FormAutocomplete
          accent
          label="Area"
          name="areal"
          options={areaOptions}
          required
          {...autocompleteProps('areal')}
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
          label="Site Name"
          name="siteName"
          required
          {...textProps('siteName')}
        />
        <FormAutocomplete
          accent
          label="Category Material"
          name="categoryMaterial"
          options={categoryMaterialOptions}
          required
          {...autocompleteProps('categoryMaterial')}
        />
        <FormAutocomplete
          accent
          label="Type Material"
          name="typeMaterial"
          options={typeMaterialOptions}
          required
          {...autocompleteProps('typeMaterial')}
        />
        <FormAutocomplete
          accent
          label="Description"
          name="description"
          options={descriptionOptions}
          required
          {...autocompleteProps('description')}
        />
        <FormAutocomplete
          accent
          label="Part Number"
          name="partNumber"
          options={partNumberOptions}
          required
          {...autocompleteProps('partNumber')}
        />
        <SpmsTextInput
          label="Quantity"
          name="quantity"
          required
          type="number"
          {...textProps('quantity')}
        />
        <FormAutocomplete
          accent
          label="Support Origin Material"
          name="supportOriginMaterial"
          options={supportOriginMaterialOptions}
          required
          {...autocompleteProps('supportOriginMaterial')}
        />
        <FormAutocomplete
          accent
          label="Support Destination Material"
          name="supportDestinationMaterial"
          options={supportDestinationMaterialOptions}
          required
          {...autocompleteProps('supportDestinationMaterial')}
        />
        <FormAutocomplete
          accent
          label="Severity"
          name="severity"
          options={severityOptions}
          required
          {...autocompleteProps('severity')}
        />
        <FormAutocomplete
          accent
          label="SLA (Hours)"
          name="slaHours"
          options={slaHourOptions}
          required
          {...autocompleteProps('slaHours')}
        />
        <SpmsTextInput
          label="AWB Transfer"
          name="awbTransfer"
          {...textProps('awbTransfer')}
        />
        <SpmsTextInput
          label="PM Area"
          name="pmArea"
          required
          {...textProps('pmArea')}
        />
      </FieldGrid>
    </FormSection>
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
    <Stack spacing={2.25}>
      <Stack
        direction="row"
        spacing={1}
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
          gap: 2,
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
      <LiquidPanel sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2.5}>
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
                  p: { xs: 1.5, md: 2 },
                }}
              >
                <Stack spacing={1.5}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    sx={{
                      alignItems: { sm: 'center' },
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 900 }} variant="subtitle1">
                        Transaction Track
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
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

              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: 'wrap', rowGap: 1 }}
              >
                {workflowItems.map((item) => (
                  <Chip
                    key={item.label}
                    icon={<AssignmentTurnedInRoundedIcon />}
                    label={`${item.label}: ${item.value || '-'}`}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>

              <Divider />
            </>
          ) : null}

          {isCreateMode || activeStep === 0 ? renderDetailRequestForm() : null}

          {activeStep === 1 ? (
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(300px, 0.9fr) 1.4fr' },
              }}
            >
              <EvidenceUpload
                fileName={deliveryEvidenceName}
                helper="Upload BA delivery, foto material diterima, atau PDF evidence."
                onFileChange={handleFileChange('deliveryEvidenceFileName')}
                title="Delivery Evidence"
              />

              <Stack spacing={2}>
                <FormSection
                  icon={<CloudUploadRoundedIcon fontSize="small" />}
                  subtitle="Data pengiriman good unit ke lokasi tujuan"
                  title="BA Delivery"
                >
                  <FieldGrid>
                    <FormAutocomplete
                      accent
                      label="BA Type"
                      name="baType"
                      options={baTypeOptions}
                      required
                      {...autocompleteProps('baType')}
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

                <FormSection
                  icon={<LocalShippingRoundedIcon fontSize="small" />}
                  subtitle="Status setelah evidence delivery diupload"
                  title="Status Return"
                >
                  <FieldGrid>
                    <FormAutocomplete
                      accent
                      label="Status Return"
                      name="deliveryStatus"
                      options={deliveryStatusOptions}
                      required
                      sx={{ gridColumn: { md: '1 / -1' } }}
                      {...autocompleteProps('deliveryStatus')}
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
                gap: 2,
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(300px, 0.9fr) 1.4fr' },
              }}
            >
              <EvidenceUpload
                fileName={formik.values.pickupEvidenceFileName}
                helper="Upload BA pickup, foto faulty unit, atau bukti return material."
                onFileChange={handleFileChange('pickupEvidenceFileName')}
                title="Pickup Evidence"
              />

              <Stack spacing={2}>
                <FormSection
                  icon={<ReplayRoundedIcon fontSize="small" />}
                  subtitle="Data pickup faulty unit atau material return"
                  title="BA Pickup / Return"
                >
                  <FieldGrid>
                    <FormAutocomplete
                      accent
                      label="Status Return"
                      name="statusReturn"
                      options={returnStatusOptions}
                      required
                      {...autocompleteProps('statusReturn')}
                    />
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
                    <FormAutocomplete
                      accent
                      label="Delivery Status"
                      name="deliveryStatus"
                      options={deliveryStatusOptions}
                      required
                      sx={{ gridColumn: { md: '1 / -1' } }}
                      {...autocompleteProps('deliveryStatus')}
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
