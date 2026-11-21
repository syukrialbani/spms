import { useCreateSpmsMutation } from '@entities/spms'
import { useAuth } from '@features/auth'
import {
  createDefaultSpmsRequestValues,
  SpmsRequestForm,
  type SpmsRequestFormValues,
} from '@features/spms-form'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { AppButton } from '@shared/ui/AppButton'
import { PageHeader } from '@shared/ui/PageHeader'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export function SpmsCreatePage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const currentUserName =
    session?.username?.toUpperCase() ||
    `${session?.firstName ?? ''} ${session?.lastName ?? ''}`.trim() ||
    'SPMS_USER'

  const initialValues = useMemo(
    () => createDefaultSpmsRequestValues(currentUserName),
    [currentUserName],
  )

  const goBackToList = useCallback(() => {
    navigate('/spms')
  }, [navigate])

  const { mutateAsync: createSpms } = useCreateSpmsMutation()

  const handleSaveSpms = useCallback(
    async (values: SpmsRequestFormValues) => {
      await createSpms({
        ...values,
        area: values.areal,
      })
      navigate('/spms')
    },
    [createSpms, navigate],
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
        currentUserName={currentUserName}
        initialValues={initialValues}
        mode="create"
        onCancel={goBackToList}
        onSave={handleSaveSpms}
      />
    </>
  )
}
