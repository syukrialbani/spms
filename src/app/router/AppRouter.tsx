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
const DeliveryOrderPage = lazy(() =>
  import('@pages/delivery-order').then((module) => ({
    default: module.DeliveryOrderPage,
  })),
)
const DeliveryOrderPickupPage = lazy(() =>
  import('@pages/delivery-order').then((module) => ({
    default: module.DeliveryOrderPickupPage,
  })),
)
const DeliveryOrderCreatePage = lazy(() =>
  import('@pages/delivery-order').then((module) => ({
    default: module.DeliveryOrderCreatePage,
  })),
)
const DeliveryOrderDetailPage = lazy(() =>
  import('@pages/delivery-order').then((module) => ({
    default: module.DeliveryOrderDetailPage,
  })),
)
const DeliveryOrderEditPage = lazy(() =>
  import('@pages/delivery-order').then((module) => ({
    default: module.DeliveryOrderEditPage,
  })),
)
const SpmsDetailPage = lazy(() =>
  import('@pages/spms-detail').then((module) => ({
    default: module.SpmsDetailPage,
  })),
)
const SpmsEditPage = lazy(() =>
  import('@pages/spms-edit').then((module) => ({
    default: module.SpmsEditPage,
  })),
)
const SpmsCreatePage = lazy(() =>
  import('@pages/spms-create').then((module) => ({
    default: module.SpmsCreatePage,
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
              <Route path="/spms/add" element={<SpmsCreatePage />} />
              <Route path="/spms/:id/edit" element={<SpmsEditPage />} />
              <Route path="/spms/:id" element={<SpmsDetailPage />} />
              <Route
                path="/delivery-order/generate-pickup/:deliveryOrder"
                element={<DeliveryOrderPickupPage />}
              />
              <Route
                path="/delivery-order/create"
                element={<DeliveryOrderCreatePage />}
              />
              <Route
                path="/delivery-order/:deliveryOrder/edit"
                element={<DeliveryOrderEditPage />}
              />
              <Route
                path="/delivery-order/:deliveryOrder"
                element={<DeliveryOrderDetailPage />}
              />
              <Route path="/delivery-order" element={<DeliveryOrderPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
