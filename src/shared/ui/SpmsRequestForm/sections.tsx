import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { alpha } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { AppButton } from '@shared/ui/AppButton'
import { FormAutocomplete } from '@shared/ui/FormAutocomplete'
import { FormDateTimeField } from '@shared/ui/FormDateTimeField'
import { FormTextField } from '@shared/ui/FormTextField'
import type { FormikProps } from 'formik'
import type { ChangeEvent, ReactNode } from 'react'

import {
  areaOptions,
  categoryMaterialOptions,
  customerOptions,
  defaultBaType,
  descriptionOptions,
  dopOptions,
  partNumberOptions,
  picKancabOptions,
  pickupStatusOptions,
  regionalOptions,
  requestorOptions,
  severityOptions,
  slaHourOptions,
  statusTransactionOptions,
  typeMaterialOptions,
  type SpmsMaterialFormValues,
  type SpmsRequestFormValues,
} from './model'
import {
  ApprovalRadioGroup,
  EvidenceUpload,
  FieldGrid,
  FormSection,
} from './parts'
import type { EvidenceFieldName, FieldName, MaterialFieldName } from './types'

type DetailRequestFieldsProps = {
  formik: FormikProps<SpmsRequestFormValues>
  getMaterialPath: (index: number, name: MaterialFieldName) => string
  getMaterialsError: () => ReactNode
  handleAddMaterial: () => void
  handlePicKancabChange: (value: string) => void
  handleRemoveMaterial: (index: number) => void
  handleRequestorChange: (value: string) => void
  handleSeverityChange: (value: string) => void
  isCreateMode: boolean
  isTelkomCustomer: boolean
  materialRows: SpmsMaterialFormValues[]
}

type WorkflowActionFields = {
  by: FieldName
  date: FieldName
  notes: FieldName
  status: FieldName
  statusValue: string
}

type ApprovalCardsProps = {
  canApprove1: boolean
  canApprove2: boolean
  canCloseCustomer: boolean
  currentRole: string
  formik: FormikProps<SpmsRequestFormValues>
  getHelperText: (name: FieldName) => ReactNode
  hasError: (name: FieldName) => boolean
  saveWorkflowAction: (
    allowed: boolean,
    fields: WorkflowActionFields,
  ) => void | Promise<void>
  scope: 'delivery' | 'pickup'
}

type DeliveryEvidenceStepProps = {
  deliveryEvidenceName: string
  formik: FormikProps<SpmsRequestFormValues>
  handleFileChange: (
    field: EvidenceFieldName,
  ) => (event: ChangeEvent<HTMLInputElement>) => void
  materialRows: SpmsMaterialFormValues[]
}

type PickupEvidenceStepProps = {
  formik: FormikProps<SpmsRequestFormValues>
  handleFileChange: (
    field: EvidenceFieldName,
  ) => (event: ChangeEvent<HTMLInputElement>) => void
  isPickupUploaded: boolean
  pickupUploadStatus: string
}

export function DetailRequestFields({
  formik,
  getMaterialPath,
  getMaterialsError,
  handleAddMaterial,
  handlePicKancabChange,
  handleRemoveMaterial,
  handleRequestorChange,
  handleSeverityChange,
  isCreateMode,
  isTelkomCustomer,
  materialRows,
}: DetailRequestFieldsProps) {
  return (
    <Stack spacing={1.25}>
      <FormSection
        icon={<AssignmentRoundedIcon fontSize="small" />}
        subtitle="Order, site, dan identitas network"
        title={isCreateMode ? 'Create SPMS Request' : 'Detail Request'}
      >
        <FieldGrid columns={3}>
          <FormTextField
            label="Order Number"
            name="orderNumber"
            readOnly
            formik={formik}
          />
          <FormAutocomplete
            accent
            label="Area"
            name="areal"
            options={areaOptions}
            required
            formik={formik}
          />
          {isTelkomCustomer ? (
            <FormTextField
              label="NE ID"
              name="neId"
              required
              formik={formik}
            />
          ) : null}
          <FormAutocomplete
            accent
            label="Customer"
            name="customer"
            options={customerOptions}
            required
            formik={formik}
            onChange={(value) => {
              void formik.setFieldValue('customer', value)

              if (value !== 'Telkom') {
                void formik.setFieldValue('feId', '')
                void formik.setFieldValue('neId', '')
              }
            }}
            value={formik.values.customer}
          />
          <FormAutocomplete
            accent
            label="DOP"
            name="dop"
            options={dopOptions}
            required
            formik={formik}
          />
          {isTelkomCustomer ? (
            <FormTextField
              label="FE ID"
              name="feId"
              required
              formik={formik}
            />
          ) : null}
          <FormTextField
            label="Ticket Customer"
            name="customerOrderNumber"
            required
            formik={formik}
          />
          <FormAutocomplete
            accent
            label="Regional"
            name="regional"
            options={regionalOptions}
            required
            formik={formik}
          />
          <FormTextField
            label="Create By"
            name="createdBy"
            readOnly
            required
            formik={formik}
          />
          <FormDateTimeField
            label="Req Date"
            name="requestDate"
            required
            formik={formik}
          />
          <FormTextField
            label="Site Name"
            name="siteName"
            required
            formik={formik}
          />
          {!isCreateMode ? (
            <FormTextField
              label="Delivery Order"
              name="deliveryOrderNumber"
              readOnly
              formik={formik}
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
            formik={formik}
            onChange={handleRequestorChange}
          />
          <FormTextField
            label="Email"
            name="requestorEmail"
            required
            formik={formik}
          />
          <FormTextField
            label="No.Hp"
            name="requestorPhone"
            required
            formik={formik}
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
            formik={formik}
            onChange={handlePicKancabChange}
          />
          <FormTextField
            label="Email"
            name="picKancabEmail"
            formik={formik}
          />
          <FormTextField
            label="No.Hp"
            name="picKancabPhone"
            formik={formik}
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
            formik={formik}
          />
          <FormTextField
            label="PM Area"
            name="pmArea"
            required
            formik={formik}
          />
          {!isCreateMode ? (
            <FormTextField
              label="DO Pickup"
              name="pickupDeliveryOrderNumber"
              readOnly
              formik={formik}
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
                    formik={formik}
                  />
                  <FormAutocomplete
                    accent
                    label="Type"
                    name={getMaterialPath(index, 'typeMaterial')}
                    options={typeMaterialOptions}
                    required
                    formik={formik}
                  />
                  <FormTextField
                    label="Qty"
                    name={getMaterialPath(index, 'quantity')}
                    disabled
                    required
                    type="number"
                    formik={formik}
                  />
                  <FormAutocomplete
                    accent
                    label="Detail Equipment"
                    name={getMaterialPath(index, 'categoryMaterial')}
                    options={categoryMaterialOptions}
                    required
                    formik={formik}
                  />
                  <FormAutocomplete
                    accent
                    label="Severity"
                    name="severity"
                    options={severityOptions}
                    required
                    formik={formik}
                    onChange={handleSeverityChange}
                  />
                  <FormAutocomplete
                    accent
                    label="Product Number"
                    name={getMaterialPath(index, 'partNumber')}
                    options={partNumberOptions}
                    required
                    formik={formik}
                  />
                  <FormAutocomplete
                    accent
                    label="SLA"
                    name="slaHours"
                    options={slaHourOptions}
                    required
                    formik={formik}
                  />
                  {!isCreateMode && (
                    <FormTextField
                      label="Serial Number"
                      name={getMaterialPath(index, 'serialNumber')}
                      readOnly
                      formik={formik}
                    />
                  )}
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
}

export function ApprovalCards({
  canApprove1,
  canApprove2,
  canCloseCustomer,
  currentRole,
  formik,
  getHelperText,
  hasError,
  saveWorkflowAction,
  scope,
}: ApprovalCardsProps) {
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
          Hanya role yang sesuai yang bisa mengubah approval{' '}
          {scopeLabel.toLowerCase()}.
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
            <FormTextField
              label="Approval 1 By"
              name={fields.approval1By}
              required
              formik={formik}
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
            <FormTextField
              label="Approval 1 Notes"
              name={fields.approval1Notes}
              multiline
              sx={{ gridColumn: { md: '1 / -1' } }}
              formik={formik}
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
            <FormTextField
              label="Approval 2 By"
              name={fields.approval2By}
              required
              formik={formik}
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
            <FormTextField
              label="Approval 2 Notes"
              name={fields.approval2Notes}
              multiline
              sx={{ gridColumn: { md: '1 / -1' } }}
              formik={formik}
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
            <FormTextField
              label="Closed By"
              name={fields.closedBy}
              required
              formik={formik}
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
            <FormTextField
              label="Closed Notes"
              name={fields.closedNotes}
              multiline
              sx={{ gridColumn: { md: '1 / -1' } }}
              formik={formik}
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

export function DeliveryEvidenceStep({
  deliveryEvidenceName,
  formik,
  handleFileChange,
  materialRows,
}: DeliveryEvidenceStepProps) {
  return (
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
            <FormTextField
              label="BA Type"
              name="baType"
              disabled
              readOnly
              required
              value={defaultBaType}
            />
            <FormTextField
              label="Send By"
              name="sendBy"
              required
              formik={formik}
            />
            <FormDateTimeField
              label="Delivery Date Good Unit"
              name="deliveryDateGoodUnit"
              required
              formik={formik}
            />
            <FormTextField
              label="Serial Number Good Unit"
              name="serialNumberGoodUnit"
              required
              formik={formik}
            />
            <FormAutocomplete
              accent
              label="Description Material"
              name="descriptionMaterial"
              options={descriptionOptions}
              required
              sx={{ gridColumn: { md: '1 / -1' } }}
              formik={formik}
            />
          </FieldGrid>
        </FormSection>
      </Stack>
    </Box>
  )
}

export function PickupEvidenceStep({
  formik,
  handleFileChange,
  isPickupUploaded,
  pickupUploadStatus,
}: PickupEvidenceStepProps) {
  return (
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
                formik={formik}
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
              <FormTextField
                label="BA Pickup Status"
                name="statusReturn"
                disabled
                readOnly
                required
                value={
                  pickupUploadStatus === 'OPEN' ? 'UNRETURN' : pickupUploadStatus
                }
              />
            )}
            <FormTextField
              label="Serial Number Faulty Unit"
              name="serialNumberFaultyUnit"
              formik={formik}
            />
            <FormTextField
              label="Pickup By"
              name="pickupBy"
              formik={formik}
            />
            <FormDateTimeField
              label="Pickup Date"
              name="pickupDate"
              formik={formik}
            />
          </FieldGrid>
        </FormSection>

        <FormSection
          icon={<AssignmentTurnedInRoundedIcon fontSize="small" />}
          subtitle="Catatan akhir untuk BA pickup dan closing"
          title="Pickup Notes"
        >
          <FieldGrid>
            <FormTextField
              label="Evidence Notes"
              name="evidenceNotes"
              multiline
              sx={{ gridColumn: { md: '1 / -1' } }}
              formik={formik}
            />
          </FieldGrid>
        </FormSection>
      </Stack>
    </Box>
  )
}
