import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

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

function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"               element={<LandingPage />} />
          <Route path="/auth"           element={<PublicRoute><AuthPage /></PublicRoute>} />
          <Route path="/login"          element={<PublicRoute><AuthPage /></PublicRoute>} />
          <Route path="/register"       element={<PublicRoute><AuthPage /></PublicRoute>} />
          
          <Route path="/dashboard"      element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/needs"          element={<ProtectedRoute><NeedsManagementPage /></ProtectedRoute>} />
          <Route path="/volunteers"     element={<ProtectedRoute><VolunteerManagementPage /></ProtectedRoute>} />
          <Route path="/volunteers/:id" element={<ProtectedRoute><VolunteerProfilePage /></ProtectedRoute>} />
          <Route path="/assignments"    element={<ProtectedRoute><AssignmentsPage /></ProtectedRoute>} />
          <Route path="/reports"        element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/upload"         element={<ProtectedRoute><SmartUploadPage /></ProtectedRoute>} />
          <Route path="/settings"       element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
