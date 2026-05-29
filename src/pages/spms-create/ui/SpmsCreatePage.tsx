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
      console.info('SPMS saved', values)
      navigate('/spms')
    },
    [navigate],
  )

  return (
    <>
      <PageHeader
        title="Add SPMS"
        subtitle="Create BA, reservasi material, approval, dan upload evidence dalam satu flow."
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
      <SpmsRequestForm onCancel={goBackToList} onSave={handleSaveSpms} />
    </>
  )
}
