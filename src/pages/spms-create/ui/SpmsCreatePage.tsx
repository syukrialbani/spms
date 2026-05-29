import { deliveryOrderStorage } from '@entities/delivery-order'
import { spmsStorage } from '@entities/spms'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { AppButton } from '@shared/ui/AppButton'
import { PageHeader } from '@shared/ui/PageHeader'
import {
  SpmsRequestForm,
  type SpmsRequestFormValues,
} from '@shared/ui/SpmsRequestForm'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export function SpmsCreatePage() {
  const navigate = useNavigate()

  const goBackToList = useCallback(() => {
    navigate('/spms')
  }, [navigate])

  const handleSaveSpms = useCallback(
    (values: SpmsRequestFormValues) => {
      const createdSpms = spmsStorage.createFromForm(values)
      deliveryOrderStorage.createFromSpms({
        ...values,
        orderNumber: createdSpms.orderNumber,
      })
      navigate('/spms')
    },
    [navigate],
  )

  return (
    <>
      <PageHeader
        title="Add SPMS"
        subtitle="Input request awal SPMS sebelum proses BA dan approval."
        actions={
          <AppButton
            onClick={goBackToList}
            startIcon={<ArrowBackRoundedIcon />}
            type="button"
            variant="outlined"
            sx={{
              background: 'transparent',
              boxShadow: 'none',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.light',
                boxShadow: 'none',
              },
            }}
          >
            Back
          </AppButton>
        }
      />
      <SpmsRequestForm
        mode="create"
        onCancel={goBackToList}
        onSave={handleSaveSpms}
      />
    </>
  )
}
