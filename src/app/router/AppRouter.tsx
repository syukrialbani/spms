import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashboardPage } from '@pages/dashboard'
import { LoginPage } from '@pages/login'
import { SpmsDetailPage } from '@pages/spms-detail'
import { SpmsListPage } from '@pages/spms-list'
import { AppShell } from '@widgets/app-shell'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRouter() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
