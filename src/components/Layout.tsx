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
import { useState, useRef } from 'react'
import { logout } from '../store/slices/authSlice'
import { Dialog } from '@headlessui/react'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function Layout({ navbarSidebarControl, children }: { navbarSidebarControl?: boolean, children?: (handleSidebarOpen: () => void) => React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const auth = useSelector((state: RootState) => state.auth)
  const { user } = auth
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const [profileForm, setProfileForm] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    contact_phone: user?.contact_phone || '',
    address: user?.address || '',
    profile_picture_url: user?.profilePictureUrl || '',
  })
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(user?.profilePictureUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Expose sidebar open handler for Navbar
  const handleSidebarOpen = () => setIsSidebarOpen(true);

  // Handle profile picture file select
  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      setIsUploading(true)
      try {
        const res = await axios.post('/api/user/profile-picture', { imageBase64: base64 })
        setProfileForm((f) => ({ ...f, profile_picture_url: res.data.url }))
        setProfilePicPreview(res.data.url)
        toast.success('Profile picture updated!')
      } catch {
        toast.error('Failed to upload profile picture')
      } finally {
        setIsUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle profile form change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  // Save profile details
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await axios.patch('/api/user/profile', profileForm)
      toast.success('Profile updated!')
      setIsProfileModalOpen(false)
      // Optionally, refresh user in Redux
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle password form change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  // Save password
  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      await axios.post('/api/user/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      toast.success('Password changed!')
      setShowPasswordSection(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      toast.error('Failed to change password')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children && children(handleSidebarOpen)}
      {/* Removed custom header row for hamburger + logo. Navbar will handle this. */}

      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-[110] bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always visible on desktop, collapsible on mobile */}
      <div className={`fixed inset-y-0 left-0 z-[120] w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
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
          {/* User profile clickable area */}
          <div
            className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg p-2 transition"
            onClick={() => setIsProfileModalOpen(true)}
            title="View/Edit Profile"
          >
            {/* Profile picture or initials */}
            {user?.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-blue-500" />
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold">
                {user?.firstname?.[0]}{user?.lastname?.[0]}
              </div>
            )}
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
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-2 sm:py-4 xl:p-12 2xl:p-16">
          <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
      {/* Profile Modal */}
      <Dialog open={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} className="fixed z-[200] inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
          <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full mx-auto p-6 z-[210]">
            <Dialog.Title className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Profile</Dialog.Title>
            {/* Profile picture upload */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                {profilePicPreview ? (
                  <img src={profilePicPreview} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 mb-2" />
                ) : (
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                    {user?.firstname?.[0]}{user?.lastname?.[0]}
                  </div>
                )}
                <button
                  type="button"
                  className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow border border-blue-500 text-blue-600 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? '...' : '✎'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                  disabled={isUploading}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1">Click ✎ to change photo</span>
            </div>
            {/* User details form */}
            <form className="space-y-3" onSubmit={handleProfileSave}>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                <input type="text" name="firstname" className="input input-bordered w-full" value={profileForm.firstname} onChange={handleProfileChange} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <input type="text" name="lastname" className="input input-bordered w-full" value={profileForm.lastname} onChange={handleProfileChange} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" className="input input-bordered w-full" value={user?.email} disabled />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input type="text" name="contact_phone" className="input input-bordered w-full" value={profileForm.contact_phone} onChange={handleProfileChange} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <input type="text" name="address" className="input input-bordered w-full" value={profileForm.address} onChange={handleProfileChange} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="btn btn-ghost" onClick={() => setIsProfileModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
            {/* Password change section */}
            <div className="mt-6">
              <button
                className="text-blue-600 hover:underline text-xs mb-2"
                onClick={() => setShowPasswordSection((v) => !v)}
                type="button"
              >
                {showPasswordSection ? 'Hide Password Change' : 'Change Password'}
              </button>
              {showPasswordSection && (
                <form className="space-y-3" onSubmit={handlePasswordSave}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <input type="password" name="currentPassword" className="input input-bordered w-full" value={passwordForm.currentPassword} onChange={handlePasswordChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input type="password" name="newPassword" className="input input-bordered w-full" value={passwordForm.newPassword} onChange={handlePasswordChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <input type="password" name="confirmPassword" className="input input-bordered w-full" value={passwordForm.confirmPassword} onChange={handlePasswordChange} />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button type="button" className="btn btn-ghost" onClick={() => setShowPasswordSection(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Change Password</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
