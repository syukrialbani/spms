import { deliveryOrderStorage } from '@entities/delivery-order'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import { alpha } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { useConfirmation } from '@shared/lib/confirmation'
import { AppButton } from '@shared/ui/AppButton'
import { LiquidPanel } from '@shared/ui/LiquidPanel'
import { useFormik } from 'formik'
import { useEffect, useState, type ChangeEvent } from 'react'
import {
  createDefaultMaterialValues,
  createDefaultSpmsRequestValues,
  defaultBaType,
  getSlaHoursForSeverity,
  picKancabContactMap,
  requestorContactMap,
  spmsRequestValidationSchema,
  type SpmsRequestFormValues,
} from './model'
import { ApprovalChain, ProcessTimeline } from './parts'
import {
  ApprovalCards,
  DeliveryEvidenceStep,
  DetailRequestFields,
  PickupEvidenceStep,
} from './sections'
import type {
  ApprovalChainItem,
  DetailFieldName,
  EvidenceFieldName,
  FieldName,
  MaterialFieldName,
  SpmsRequestFormProps,
  TimelineItem,
  TimelineState,
} from './types'
import {
  detailRequestFields,
  formSteps,
  formatTimelineDate,
  getAutoPickupStatus,
  materialFieldNames,
  normalizeFormMaterials,
  stepFields,
} from './workflow'

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

  useEffect(() => {
    const contact = picKancabContactMap[formik.values.picKancabName]

    if (!contact) {
      return
    }

    if (!formik.values.picKancabEmail && contact.email) {
      void formik.setFieldValue('picKancabEmail', contact.email, false)
    }

    if (!formik.values.picKancabPhone && contact.phone) {
      void formik.setFieldValue('picKancabPhone', contact.phone, false)
    }
  }, [
    formik,
    formik.values.picKancabEmail,
    formik.values.picKancabName,
    formik.values.picKancabPhone,
  ])

  const getHelperText = (name: FieldName) =>
    formik.touched[name] ? formik.errors[name] : undefined

  const hasError = (name: FieldName) =>
    Boolean(formik.touched[name] && formik.errors[name])

  const materialRows =
    formik.values.materials.length > 0
      ? formik.values.materials
      : [createDefaultMaterialValues()]

  const getMaterialPath = (index: number, name: MaterialFieldName) =>
    `materials.${index}.${name}`

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
    const isTelkomCustomer = values.customer === 'Telkom'

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
      feId: isTelkomCustomer ? values.feId : '',
      neId: isTelkomCustomer ? values.neId : '',
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
  const linkedDeliveryOrder = formik.values.deliveryOrderNumber
    ? deliveryOrderStorage.getByDeliveryOrder(formik.values.deliveryOrderNumber)
    : null
  const isDeliveryOrderOnDelivery =
    !linkedDeliveryOrder ||
    linkedDeliveryOrder.statusDo === 'ON_PROGRESS' ||
    linkedDeliveryOrder.statusDo === 'NEED_UPLOAD_DO' ||
    linkedDeliveryOrder.statusDo === 'NEED_REVIEW_DO' ||
    linkedDeliveryOrder.statusDo === 'CLOSED'
  const canOpenDeliveryBaTab = hasDeliveryOrder && isDeliveryOrderOnDelivery
  const hasPickupDeliveryOrder = Boolean(formik.values.pickupDeliveryOrderNumber)
  const isTelkomCustomer = formik.values.customer === 'Telkom'
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
        : canOpenDeliveryBaTab
          ? 'Menunggu upload BA delivery'
          : hasDeliveryOrder
            ? 'Proses On Progress di menu DO terlebih dahulu'
            : 'Create DO terlebih dahulu',
      label: 'Upload BA Delivery',
      meta: isDeliveryDelivered ? 'Delivered' : 'Open',
      state: isDeliveryDelivered
        ? 'done'
        : canOpenDeliveryBaTab
          ? 'active'
          : 'pending',
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
                  if (!canOpenDeliveryBaTab && nextStep > 0) {
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
                      (!canOpenDeliveryBaTab && index > 0) ||
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

          {isCreateMode || activeStep === 0 ? (
            <DetailRequestFields
              formik={formik}
              getMaterialPath={getMaterialPath}
              getMaterialsError={getMaterialsError}
              handleAddMaterial={handleAddMaterial}
              handlePicKancabChange={handlePicKancabChange}
              handleRemoveMaterial={handleRemoveMaterial}
              handleRequestorChange={handleRequestorChange}
              handleSeverityChange={handleSeverityChange}
              isCreateMode={isCreateMode}
              isTelkomCustomer={isTelkomCustomer}
              materialRows={materialRows}
            />
          ) : null}

          {activeStep === 1 ? (
            <DeliveryEvidenceStep
              deliveryEvidenceName={deliveryEvidenceName}
              formik={formik}
              handleFileChange={handleFileChange}
              materialRows={materialRows}
            />
          ) : null}

          {activeStep === 2 ? (
            <ApprovalCards
              canApprove1={canApprove1}
              canApprove2={canApprove2}
              canCloseCustomer={canCloseCustomer}
              currentRole={currentRole}
              formik={formik}
              getHelperText={getHelperText}
              hasError={hasError}
              saveWorkflowAction={saveWorkflowAction}
              scope="delivery"
            />
          ) : null}

          {activeStep === 3 ? (
            <PickupEvidenceStep
              formik={formik}
              handleFileChange={handleFileChange}
              isPickupUploaded={isPickupUploaded}
              pickupUploadStatus={pickupUploadStatus}
            />
          ) : null}

          {activeStep === 4 ? (
            <ApprovalCards
              canApprove1={canApprove1}
              canApprove2={canApprove2}
              canCloseCustomer={canCloseCustomer}
              currentRole={currentRole}
              formik={formik}
              getHelperText={getHelperText}
              hasError={hasError}
              saveWorkflowAction={saveWorkflowAction}
              scope="pickup"
            />
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
