// Common API response types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

export interface ApiError {
  response?: {
    data?: {
      message?: string
    }
    status?: number
  }
  message?: string
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  firstname: string
  lastname: string
  email: string
  password: string
  confirmPassword: string
  contact_phone: string
  address: string
  role?: string
}

export interface AppointmentForm {
  doctor_id: number
  appointment_date: string
  time_slot: string
}

export interface UserForm {
  firstname: string
  lastname: string
  email: string
  contact_phone: string
  address: string
  role: 'user' | 'admin' | 'doctor'
}

// Navigation types
export interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<any>
  roles?: string[]
}

// Component props
export interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

export interface DashboardCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<any>
  color?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

// Time slot options
export const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM', 
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
] as const

export type TimeSlot = typeof TIME_SLOTS[number]

// Appointment status options
export const APPOINTMENT_STATUSES = [
  'Pending',
  'Confirmed', 
  'Cancelled',
  'Completed'
] as const

export type AppointmentStatus = typeof APPOINTMENT_STATUSES[number]

// User roles
export const USER_ROLES = ['user', 'admin', 'doctor'] as const
export type UserRole = typeof USER_ROLES[number]
