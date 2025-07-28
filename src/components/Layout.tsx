import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { 
  Heart, 
  Home, 
  Calendar, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  Users,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { logout } from '../store/slices/authSlice'

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const auth = useSelector((state: RootState) => state.auth)
  const { user } = auth
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const getNavigationItems = () => {
    if (user?.role === 'user') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
        { name: 'Prescriptions', href: '/dashboard/prescriptions', icon: FileText },
        { name: 'Medical History', href: '/dashboard/medical-history', icon: FileText },
        { name: 'Support', href: '/dashboard/support', icon: MessageSquare },
        { name: 'Find Doctors', href: '/dashboard/find-doctors', icon: Users },
        { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
      ];
    }
    if (user?.role === 'doctor') {
      return [
        { name: 'Dashboard', href: '/dashboard/doctor', icon: Home },
        { name: 'Appointments', href: '/dashboard/doctor/appointments', icon: Calendar },
        { name: 'Prescriptions', href: '/dashboard/doctor/prescriptions', icon: FileText },
        { name: 'Medical History', href: '/dashboard/doctor/medical-history', icon: FileText },
        { name: 'Support', href: '/dashboard/doctor/support', icon: MessageSquare },
      ];
    }
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/dashboard/admin', icon: Home },
        { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
        { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
        { name: 'Reports', href: '/dashboard/admin/reports', icon: FileText },
        { name: 'Appointments', href: '/dashboard/admin/appointments', icon: Calendar },
        { name: 'Support', href: '/dashboard/admin/support', icon: MessageSquare },
      ];
    }
    // fallback
    return [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
    ];
  };

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden" // z-50 to ensure overlay is above all
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always visible on desktop, collapsible on mobile */}
      <div className={`fixed inset-y-0 left-0 z-60 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-full p-2">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-bold text-gray-800 dark:text-white">MediCare</span>
          </div>
          {/* Close button only visible on mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">
                {user?.firstname?.[0]}{user?.lastname?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.firstname} {user?.lastname}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content - Account for sidebar on desktop */}
      <div className="lg:ml-64 min-h-screen">
        {/* Page content with proper padding for large screens */}
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 lg:p-1 xl:p-12 2xl:p-16">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-4 left-4 z-[110] p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors lg:hidden"
            title="Open sidebar"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
