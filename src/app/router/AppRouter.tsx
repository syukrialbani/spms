import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { FullPageLoader } from '@shared/ui/FullPageLoader'
import { ProtectedRoute } from './ProtectedRoute'

const AppShell = lazy(() =>
  import('@widgets/app-shell').then((module) => ({ default: module.AppShell })),
)
const DashboardPage = lazy(() =>
  import('@pages/dashboard').then((module) => ({
    default: module.DashboardPage,
  })),
)
const LoginPage = lazy(() =>
  import('@pages/login').then((module) => ({ default: module.LoginPage })),
)
const SpmsDetailPage = lazy(() =>
  import('@pages/spms-detail').then((module) => ({
    default: module.SpmsDetailPage,
  })),
)
const SpmsListPage = lazy(() =>
  import('@pages/spms-list').then((module) => ({
    default: module.SpmsListPage,
  })),
)

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/spms" element={<SpmsListPage />} />
              <Route path="/spms/:id" element={<SpmsDetailPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
