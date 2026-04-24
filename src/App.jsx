import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage   from './pages/LandingPage'
import AuthPage      from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import NeedsManagementPage from './pages/NeedsManagementPage'
import VolunteerManagementPage from './pages/VolunteerManagementPage'
import VolunteerProfilePage from './pages/VolunteerProfilePage'
import AssignmentsPage from './pages/AssignmentsPage'
import ReportsPage from './pages/ReportsPage'
import SmartUploadPage from './pages/SmartUploadPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<LandingPage />} />
        <Route path="/auth"           element={<AuthPage />} />
        <Route path="/login"          element={<AuthPage />} />
        <Route path="/register"       element={<AuthPage />} />
        <Route path="/dashboard"      element={<DashboardPage />} />
        <Route path="/needs"          element={<NeedsManagementPage />} />
        <Route path="/volunteers"     element={<VolunteerManagementPage />} />
        <Route path="/volunteers/:id" element={<VolunteerProfilePage />} />
        <Route path="/assignments"    element={<AssignmentsPage />} />
        <Route path="/reports"        element={<ReportsPage />} />
        <Route path="/upload"         element={<SmartUploadPage />} />
        <Route path="/settings"       element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
