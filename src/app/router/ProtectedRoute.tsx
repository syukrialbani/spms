import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@features/auth/model/useAuth'
import { FullPageLoader } from '@shared/ui/FullPageLoader'

export function ProtectedRoute() {
  const location = useLocation()
  const { isAuthenticated, isReady } = useAuth()

  if (!isReady) {
    return <FullPageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
