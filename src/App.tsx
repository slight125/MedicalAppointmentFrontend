import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from './store'
import { Toaster } from 'react-hot-toast'
import { setDarkMode } from './store/slices/themeSlice'

// Layout Components
import Layout from './components/Layout'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import Services from './pages/public/Services'
import Contact from './pages/public/Contact'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Dashboard Pages
import UserDashboard from './pages/user/Dashboard'
import DoctorDashboard from './pages/doctor/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'

// Feature Pages
import AppointmentBooking from './pages/appointments/BookAppointment'
import AppointmentList from './pages/appointments/AppointmentList'
import PrescriptionList from './pages/prescriptions/PrescriptionList'
import PrescriptionDetail from './pages/prescriptions/PrescriptionDetail'
import PaymentHistory from './pages/payments/PaymentHistory'
import PaymentSuccess from './pages/payments/PaymentSuccess'
import PaymentCancel from './pages/payments/PaymentCancel'
import MedicalHistory from './pages/medical-history/MedicalHistory'
import SupportTickets from './pages/support/SupportTickets'
import FindDoctors from './pages/dashboard/FindDoctors';
import WritePrescription from './pages/doctor/WritePrescription';
import DoctorPrescriptions from './pages/doctor/Prescriptions';

// Admin Pages
import AdminAnalytics from './pages/admin/Analytics'
import AdminUserManagement from './pages/admin/UserManagement'
import AdminReports from './pages/admin/Reports'
import AdminSupport from './pages/admin/Support'

function App() {
  const dispatch = useAppDispatch()
  const authState = useAppSelector((state) => state.auth)
  const { isAuthenticated, user, isLoading } = authState
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    // Initialize theme from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('darkMode') === 'true'
      dispatch(setDarkMode(savedTheme))
      
      // Apply theme to document
      if (savedTheme) {
        document.documentElement.classList.add('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.setAttribute('data-theme', 'light')
      }
    }
  }, [dispatch])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {isDashboard ? null : <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        
        <Route path="/login" element={
          isAuthenticated ? <Navigate to={getDashboardPath(user?.role)} /> : <Login />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to={getDashboardPath(user?.role)} /> : <Register />
        } />

        {/* Payment Routes (public for Stripe redirects) */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

        {/* Protected Routes with Layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['user', 'doctor', 'admin']}>
            <Layout>
              {(handleSidebarOpen: () => void) => <Navbar onSidebarOpen={handleSidebarOpen} />}
            </Layout>
          </ProtectedRoute>
        }>
          {/* Dashboard Routes */}
          <Route index element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="doctor/appointments" element={<ProtectedRoute allowedRoles={['doctor']}><AppointmentList /></ProtectedRoute>} />
          <Route path="doctor/write-prescription" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <WritePrescription />
            </ProtectedRoute>
          } />
          <Route path="doctor/prescriptions" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorPrescriptions /></ProtectedRoute>} />
          <Route path="doctor/medical-history" element={<ProtectedRoute allowedRoles={['doctor']}><MedicalHistory /></ProtectedRoute>} />
          <Route path="doctor/support" element={<ProtectedRoute allowedRoles={['doctor']}><SupportTickets /></ProtectedRoute>} />

          <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUserManagement /></ProtectedRoute>} />
          <Route path="admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
          <Route path="admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
          <Route path="admin/appointments" element={<ProtectedRoute allowedRoles={['admin']}><AppointmentList /></ProtectedRoute>} />
          <Route path="admin/support" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupport /></ProtectedRoute>} />

          {/* Appointment Routes */}
          <Route path="appointments" element={
            <ProtectedRoute allowedRoles={['user', 'doctor', 'admin']}>
              <AppointmentList />
            </ProtectedRoute>
          } />
          <Route path="appointments/book" element={
            <ProtectedRoute allowedRoles={['user']}>
              <AppointmentBooking />
            </ProtectedRoute>
          } />

          {/* Other Feature Routes */}
          <Route path="find-doctors" element={
            <ProtectedRoute allowedRoles={['user']}>
              <FindDoctors />
            </ProtectedRoute>
          } />
          <Route path="prescriptions" element={
            <ProtectedRoute allowedRoles={['user', 'doctor', 'admin']}>
              <PrescriptionList />
            </ProtectedRoute>
          } />
          <Route path="prescriptions/:prescriptionId" element={
            <ProtectedRoute allowedRoles={['user', 'doctor', 'admin']}>
              <PrescriptionDetail />
            </ProtectedRoute>
          } />
          <Route path="medical-history" element={
            <ProtectedRoute allowedRoles={['user', 'doctor', 'admin']}>
              <MedicalHistory />
            </ProtectedRoute>
          } />
          <Route path="payments" element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <PaymentHistory />
            </ProtectedRoute>
          } />
          <Route path="support" element={
            <ProtectedRoute allowedRoles={['user', 'doctor', 'admin']}>
              <SupportTickets />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          {/* These routes are now handled by the /dashboard/admin route */}
          {/* <Route path="admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUserManagement />
            </ProtectedRoute>
          } />
          <Route path="admin/analytics" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAnalytics />
            </ProtectedRoute>
          } />
          <Route path="admin/reports" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminReports />
            </ProtectedRoute>
          } />
          <Route path="admin/support" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminSupport />
            </ProtectedRoute>
          } /> */}
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </>
  )
}

function getDashboardPath(role?: string): string {
  switch (role) {
    case 'admin':
      return '/dashboard/admin'
    case 'doctor':
      return '/dashboard/doctor'
    case 'user':
    default:
      return '/dashboard'
  }
}

export default App
