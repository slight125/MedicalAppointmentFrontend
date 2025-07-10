import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />
      case 'doctor':
        return <Navigate to="/doctor" replace />
      default:
        return <Navigate to="/dashboard" replace />
    }
  }

  return <>{children}</>
}
