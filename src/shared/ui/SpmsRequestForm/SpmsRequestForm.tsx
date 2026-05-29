import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded'
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
  lspOptions,
  partNumberOptions,
  reservationStatusOptions,
  returnStatusOptions,
  severityOptions,
  slaHourOptions,
  spmsRequestValidationSchema,
  stockStatusOptions,
  supportDestinationMaterialOptions,
  supportOriginMaterialOptions,
  systemLabelOptions,
  typeMaterialOptions,
  type SpmsRequestFormValues,
} from './model'

type SpmsRequestFormProps = {
  initialValues?: SpmsRequestFormValues
  onCancel?: () => void
  onSave: (values: SpmsRequestFormValues) => void | Promise<void>
}

type FieldName = keyof SpmsRequestFormValues
type EvidenceFieldName = 'deliveryEvidenceFileName' | 'pickupEvidenceFileName'
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
  DRAFT: 'Draft',
  'PENDING APPROVAL': 'Pending',
  REJECTED: 'Revisi',
}

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
  [
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
    'originLsp',
    'destinationLsp',
    'stockStatus',
    'systemLabel',
    'reservationStatus',
    'baNumber',
    'severity',
    'slaHours',
    'pmArea',
  ],
  [
    'baType',
    'sendBy',
    'deliveryDateGoodUnit',
    'serialNumberGoodUnit',
    'descriptionMaterial',
  ],
  [
    'adminApprover',
    'adminApprovalStatus',
    'picBaRegion',
    'picBaApprovalStatus',
    'deliveryStatus',
  ],
  ['statusReturn'],
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

function SummaryTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.05)
            : alpha(theme.palette.primary.main, 0.045),
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.primary.light, 0.16)
            : alpha(theme.palette.primary.main, 0.1),
        borderRadius: 1,
        minWidth: 0,
        p: 1.5,
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
        <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            color="text.secondary"
            sx={{ fontWeight: 800 }}
            variant="caption"
          >
            {label}
          </Typography>
          <Typography noWrap sx={{ fontWeight: 900 }} variant="body2">
            {value || '-'}
          </Typography>
        </Box>
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
  initialValues = createDefaultSpmsRequestValues(),
  onCancel,
  onSave,
}: SpmsRequestFormProps) {
  const [activeStep, setActiveStep] = useState(0)
  const isLastStep = activeStep === formSteps.length - 1

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

  const validateCurrentStep = async () => {
    const fields = stepFields[activeStep] ?? []
    const errors = await formik.validateForm()
    const hasStepError = fields.some((field) => Boolean(errors[field]))

    if (hasStepError) {
      await touchFields(fields)
    }

    return !hasStepError
  }

  const goToStep = async (step: number) => {
    if (step <= activeStep) {
      setActiveStep(step)
      return
    }

    if (await validateCurrentStep()) {
      setActiveStep(step)
    }
  }

  const goToNextStep = async () => {
    if (await validateCurrentStep()) {
      setActiveStep((current) => Math.min(current + 1, formSteps.length - 1))
    }
  }

  const handleSave = async () => {
    const errors = await formik.validateForm()
    const errorFields = Object.keys(errors) as FieldName[]

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

    await formik.submitForm()
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

  const approvalTimelineItems: TimelineItem[] = [
    {
      actor: formik.values.createdBy,
      description: 'Request BA delivery dibuat',
      label: 'Open',
      meta: formik.values.requestDate,
      state: 'done' as TimelineState,
    },
    {
      actor: formik.values.adminApprover,
      description: 'Validasi admin / manager',
      label: 'Approval 1',
      meta: formik.values.adminApprovalDate,
      state: getApprovalTimelineState(
        formik.values.adminApprovalStatus,
        'active',
      ),
    },
    {
      actor: formik.values.picBaRegion,
      description: 'Konfirmasi PIC BA region',
      label: 'Approval 2',
      meta: formik.values.picBaApprovalDate,
      state: getApprovalTimelineState(formik.values.picBaApprovalStatus),
    },
    {
      actor: formik.values.sendBy,
      description: 'Material delivery process',
      label: 'Closed In Customer',
      meta: formik.values.deliveryDateGoodUnit,
      state:
        deliveryEvidenceName || formik.values.deliveryStatus === 'DELIVERED'
          ? 'done'
          : 'pending',
    },
  ]

  const workflowItems = [
    { label: 'BA', value: formik.values.deliveryStatus },
    { label: 'Approval 1', value: formik.values.adminApprovalStatus },
    { label: 'Approval 2', value: formik.values.picBaApprovalStatus },
    { label: 'Stock', value: formik.values.reservationStatus },
  ]

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={(event) => event.preventDefault()}
    >
      <LiquidPanel sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2.5}>
          <Tabs
            value={activeStep}
            onChange={(_, nextStep: number) => {
              void goToStep(nextStep)
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
                      {index + 1}. {step.title}
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

          {activeStep === 0 ? (
            <Stack spacing={2}>
              <FieldGrid columns={3}>
                <SummaryTile
                  icon={<AssignmentRoundedIcon />}
                  label="Order Number"
                  value={formik.values.orderNumber}
                />
                <SummaryTile
                  icon={<FactCheckRoundedIcon />}
                  label="BA Number"
                  value={formik.values.baNumber}
                />
                <SummaryTile
                  icon={<WarehouseRoundedIcon />}
                  label="Reservation"
                  value={formik.values.reservationStatus}
                />
              </FieldGrid>

              <FormSection
                icon={<AssignmentRoundedIcon fontSize="small" />}
                subtitle="Data utama request dan customer order"
                title="Request Identity"
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
                    label="Operator"
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
                </FieldGrid>
              </FormSection>

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
                  icon={<LocalShippingRoundedIcon fontSize="small" />}
                  subtitle="Lokasi kebutuhan dan prioritas SLA"
                  title="Site & Delivery Need"
                >
                  <FieldGrid>
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
                    <SpmsTextInput
                      label="PM Area"
                      name="pmArea"
                      required
                      {...textProps('pmArea')}
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
                  </FieldGrid>
                </FormSection>

                <FormSection
                  icon={<Inventory2RoundedIcon fontSize="small" />}
                  subtitle="Material yang diminta untuk BA"
                  title="Material Request"
                >
                  <FieldGrid>
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
                      sx={{ gridColumn: { md: '1 / -1' } }}
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
                  </FieldGrid>
                </FormSection>
              </Box>

              <FormSection
                icon={<WarehouseRoundedIcon fontSize="small" />}
                subtitle="Sumber material dan status reservasi stock"
                title="Stock Source & Reservation"
              >
                <FieldGrid columns={3}>
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
                  <SpmsTextInput
                    label="AWB Transfer"
                    name="awbTransfer"
                    {...textProps('awbTransfer')}
                  />
                  <FormAutocomplete
                    accent
                    label="Origin LSP"
                    name="originLsp"
                    options={lspOptions}
                    required
                    {...autocompleteProps('originLsp')}
                  />
                  <FormAutocomplete
                    accent
                    label="Destination LSP"
                    name="destinationLsp"
                    options={lspOptions}
                    required
                    {...autocompleteProps('destinationLsp')}
                  />
                  <SpmsTextInput
                    label="Serial Number"
                    name="materialSerialNumber"
                    {...textProps('materialSerialNumber')}
                  />
                  <FormAutocomplete
                    accent
                    label="Stock Status"
                    name="stockStatus"
                    options={stockStatusOptions}
                    required
                    {...autocompleteProps('stockStatus')}
                  />
                  <FormAutocomplete
                    accent
                    label="System Label"
                    name="systemLabel"
                    options={systemLabelOptions}
                    required
                    {...autocompleteProps('systemLabel')}
                  />
                  <FormAutocomplete
                    accent
                    label="Reservation Status"
                    name="reservationStatus"
                    options={reservationStatusOptions}
                    required
                    {...autocompleteProps('reservationStatus')}
                  />
                  <SpmsTextInput
                    label="Stock Remark"
                    name="stockRemark"
                    sx={{ gridColumn: { md: '1 / -1' } }}
                    {...textProps('stockRemark')}
                  />
                </FieldGrid>
              </FormSection>
            </Stack>
          ) : null}

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
                  title="Delivery Result"
                >
                  <FieldGrid>
                    <FormAutocomplete
                      accent
                      label="Delivery Status"
                      name="deliveryStatus"
                      options={deliveryStatusOptions}
                      required
                      {...autocompleteProps('deliveryStatus')}
                    />
                    <FormAutocomplete
                      accent
                      label="Stock Status"
                      name="stockStatus"
                      options={stockStatusOptions}
                      required
                      {...autocompleteProps('stockStatus')}
                    />
                  </FieldGrid>
                </FormSection>
              </Stack>
            </Box>
          ) : null}

          {activeStep === 2 ? (
            <Stack spacing={2.25}>
              <ProcessTimeline items={approvalTimelineItems} />
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
                  subtitle="Approval pertama dari admin atau manager"
                  title="Approval 1"
                >
                  <FieldGrid columns={1}>
                    <SpmsTextInput
                      label="Approval 1 By"
                      name="adminApprover"
                      required
                      {...textProps('adminApprover')}
                    />
                    <ApprovalRadioGroup
                      label="Approval 1 Status"
                      name="adminApprovalStatus"
                      required
                      disabled={formik.isSubmitting}
                      error={hasError('adminApprovalStatus')}
                      helperText={getHelperText('adminApprovalStatus')}
                      onBlur={() => {
                        void formik.setFieldTouched('adminApprovalStatus', true)
                      }}
                      onChange={(value) => {
                        void formik.setFieldValue('adminApprovalStatus', value)
                      }}
                      sx={{ gridColumn: { md: '1 / -1' } }}
                      value={formik.values.adminApprovalStatus}
                    />
                    <SpmsTextInput
                      label="Approval 1 Notes"
                      name="adminApprovalNotes"
                      multiline
                      sx={{ gridColumn: { md: '1 / -1' } }}
                      {...textProps('adminApprovalNotes')}
                    />
                  </FieldGrid>
                </FormSection>

                <FormSection
                  icon={<AssignmentTurnedInRoundedIcon fontSize="small" />}
                  subtitle="Approval kedua oleh PIC BA region"
                  title="Approval 2"
                >
                  <FieldGrid columns={1}>
                    <SpmsTextInput
                      label="Approval 2 By"
                      name="picBaRegion"
                      required
                      {...textProps('picBaRegion')}
                    />
                    <ApprovalRadioGroup
                      label="Approval 2 Status"
                      name="picBaApprovalStatus"
                      required
                      disabled={formik.isSubmitting}
                      error={hasError('picBaApprovalStatus')}
                      helperText={getHelperText('picBaApprovalStatus')}
                      onBlur={() => {
                        void formik.setFieldTouched('picBaApprovalStatus', true)
                      }}
                      onChange={(value) => {
                        void formik.setFieldValue('picBaApprovalStatus', value)
                      }}
                      sx={{ gridColumn: { md: '1 / -1' } }}
                      value={formik.values.picBaApprovalStatus}
                    />
                    <SpmsTextInput
                      label="Approval 2 Notes"
                      name="adminApprovalNotes"
                      multiline
                      sx={{ gridColumn: { md: '1 / -1' } }}
                      {...textProps('adminApprovalNotes')}
                    />
                  </FieldGrid>
                </FormSection>

                <FormSection
                  icon={<AssignmentTurnedInRoundedIcon fontSize="small" />}
                  subtitle="Gate closing setelah approval 2 selesai"
                  title="Closed in Customer"
                >
                  <FieldGrid columns={1}>
                    <SpmsTextInput
                      label="Closed By"
                      name="picBaRegion"
                      required
                      {...textProps('picBaRegion')}
                    />
                    <ApprovalRadioGroup
                      label="Closed Status"
                      name="picBaApprovalStatus"
                      required
                      disabled={formik.isSubmitting}
                      error={hasError('picBaApprovalStatus')}
                      helperText={getHelperText('picBaApprovalStatus')}
                      onBlur={() => {
                        void formik.setFieldTouched('picBaApprovalStatus', true)
                      }}
                      onChange={(value) => {
                        void formik.setFieldValue('picBaApprovalStatus', value)
                      }}
                      sx={{ gridColumn: { md: '1 / -1' } }}
                      value={formik.values.picBaApprovalStatus}
                      isClosedStatus
                    />
                  </FieldGrid>
                </FormSection>
              </Box>
            </Stack>
          ) : null}

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
                      {...autocompleteProps('deliveryStatus')}
                    />
                    <FormAutocomplete
                      accent
                      label="Stock Status"
                      name="stockStatus"
                      options={stockStatusOptions}
                      required
                      {...autocompleteProps('stockStatus')}
                    />
                  </FieldGrid>
                </FormSection>
              </Stack>
            </Box>
          ) : null}

          {activeStep === 4 ? (
            <Stack spacing={2.25}>
              <ProcessTimeline items={approvalTimelineItems} />
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
                  subtitle="Approval pertama dari admin atau manager"
                  title="Approval 1"
                >
                  <FieldGrid columns={1}>
                    <SpmsTextInput
                      label="Approval 1 By"
                      name="adminApprover"
                      required
                      {...textProps('adminApprover')}
                    />
                    <ApprovalRadioGroup
                      label="Approval 1 Status"
                      name="adminApprovalStatus"
                      required
                      disabled={formik.isSubmitting}
                      error={hasError('adminApprovalStatus')}
                      helperText={getHelperText('adminApprovalStatus')}
                      onBlur={() => {
                        void formik.setFieldTouched('adminApprovalStatus', true)
                      }}
                      onChange={(value) => {
                        void formik.setFieldValue('adminApprovalStatus', value)
                      }}
                      sx={{ gridColumn: { md: '1 / -1' } }}
                      value={formik.values.adminApprovalStatus}
                    />
                    <SpmsTextInput
                      label="Approval 1 Notes"
                      name="adminApprovalNotes"
                      multiline
                      sx={{ gridColumn: { md: '1 / -1' } }}
                      {...textProps('adminApprovalNotes')}
                    />
                  </FieldGrid>
                </FormSection>

                <FormSection
                  icon={<AssignmentTurnedInRoundedIcon fontSize="small" />}
                  subtitle="Approval kedua oleh PIC BA region"
                  title="Approval 2"
                >
                  <FieldGrid columns={1}>
                    <SpmsTextInput
                      label="Approval 2 By"
                      name="picBaRegion"
                      required
                      {...textProps('picBaRegion')}
                    />
                    <ApprovalRadioGroup
                      label="Approval 2 Status"
                      name="picBaApprovalStatus"
                      required
                      disabled={formik.isSubmitting}
                      error={hasError('picBaApprovalStatus')}
                      helperText={getHelperText('picBaApprovalStatus')}
                      onBlur={() => {
                        void formik.setFieldTouched('picBaApprovalStatus', true)
                      }}
                      onChange={(value) => {
                        void formik.setFieldValue('picBaApprovalStatus', value)
                      }}
                      sx={{ gridColumn: { md: '1 / -1' } }}
                      value={formik.values.picBaApprovalStatus}
                    />
                    <SpmsTextInput
                      label="Approval 2 Notes"
                      name="adminApprovalNotes"
                      multiline
                      sx={{ gridColumn: { md: '1 / -1' } }}
                      {...textProps('adminApprovalNotes')}
                    />
                  </FieldGrid>
                </FormSection>

                <FormSection
                  icon={<AssignmentTurnedInRoundedIcon fontSize="small" />}
                  subtitle="Gate closing setelah approval 2 selesai"
                  title="Closed in Customer"
                >
                  <FieldGrid columns={1}>
                    <SpmsTextInput
                      label="Closed By"
                      name="picBaRegion"
                      required
                      {...textProps('picBaRegion')}
                    />
                    <ApprovalRadioGroup
                      label="Closed Status"
                      name="picBaApprovalStatus"
                      required
                      disabled={formik.isSubmitting}
                      error={hasError('picBaApprovalStatus')}
                      helperText={getHelperText('picBaApprovalStatus')}
                      onBlur={() => {
                        void formik.setFieldTouched('picBaApprovalStatus', true)
                      }}
                      onChange={(value) => {
                        void formik.setFieldValue('picBaApprovalStatus', value)
                      }}
                      sx={{ gridColumn: { md: '1 / -1' } }}
                      value={formik.values.picBaApprovalStatus}
                      isClosedStatus
                    />
                  </FieldGrid>
                </FormSection>
              </Box>
            </Stack>
          ) : null}
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
        <Button
          disabled={formik.isSubmitting || activeStep === 0}
          onClick={() => setActiveStep((current) => Math.max(current - 1, 0))}
          startIcon={<KeyboardArrowLeftRoundedIcon />}
          type="button"
          variant="outlined"
          sx={{
            background: 'transparent',
            minWidth: 112,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Previous
        </Button>
        {isLastStep ? (
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
            Save BA
          </AppButton>
        ) : (
          <AppButton
            disabled={formik.isSubmitting}
            endIcon={<KeyboardArrowRightRoundedIcon />}
            onClick={() => {
              void goToNextStep()
            }}
            type="button"
            sx={{
              minWidth: 112,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Next
          </AppButton>
        )}
      </Stack>
    </Box>
  )
}
