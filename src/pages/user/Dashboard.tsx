import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  Heart
} from 'lucide-react'
import type { RootState } from '../../store'

export default function UserDashboard() {
  const { user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  const quickActions = [
    {
      title: 'Book Appointment',
      description: 'Schedule a new appointment with a doctor',
      icon: Calendar,
      color: 'bg-blue-600',
      onClick: () => navigate('/dashboard/appointments/book')
    },
    {
      title: 'View Prescriptions',
      description: 'Check your prescription history',
      icon: FileText,
      color: 'bg-green-600',
      onClick: () => navigate('/dashboard/prescriptions')
    },
    {
      title: 'Payment History',
      description: 'View your payment records',
      icon: CreditCard,
      color: 'bg-purple-600',
      onClick: () => navigate('/dashboard/payments')
    },
    {
      title: 'Support',
      description: 'Get help or submit a complaint',
      icon: MessageSquare,
      color: 'bg-orange-600',
      onClick: () => navigate('/dashboard/support')
    }
  ]

  return (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10 2xl:space-y-12 max-w-screen-2xl 2xl:max-w-none mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 lg:p-8 xl:p-12 2xl:p-16 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8 xl:gap-12">
          <div>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold mb-4 lg:mb-6 xl:mb-8">
              Welcome back, {user?.firstname}!
            </h1>
            <p className="text-blue-100 text-base lg:text-lg xl:text-xl 2xl:text-3xl">
              Manage your health appointments and medical records
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 lg:p-4 xl:p-5 2xl:p-8">
              <Heart className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 2xl:gap-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6 xl:p-8 2xl:p-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base xl:text-lg 2xl:text-xl">Upcoming</p>
              <p className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 dark:text-white">3</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base xl:text-lg 2xl:text-xl">Appointments</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-3 lg:p-4 xl:p-5 2xl:p-6">
              <Calendar className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6 xl:p-8 2xl:p-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base xl:text-lg 2xl:text-xl">Active</p>
              <p className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 dark:text-white">5</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base xl:text-lg 2xl:text-xl">Prescriptions</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-3 lg:p-4 xl:p-5 2xl:p-6">
              <FileText className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6 xl:p-8 2xl:p-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base xl:text-lg 2xl:text-xl">Last Payment</p>
              <p className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 dark:text-white">$150</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base xl:text-lg 2xl:text-xl">Dec 10, 2024</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full p-3 lg:p-4 xl:p-5 2xl:p-6">
              <CreditCard className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6 xl:p-8 2xl:p-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base xl:text-lg 2xl:text-xl">Health Score</p>
              <p className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 dark:text-white">92%</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base xl:text-lg 2xl:text-xl">Excellent</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full p-3 lg:p-4 xl:p-5 2xl:p-6">
              <Heart className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 dark:text-white mb-6 lg:mb-8 xl:mb-10 2xl:mb-12">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={action.onClick}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group p-6 lg:p-8 xl:p-10 2xl:p-12 hover:scale-105"
            >
              <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 mb-4 lg:mb-6 xl:mb-8">
                <div className={`${action.color} rounded-lg p-3 lg:p-4 xl:p-5 2xl:p-6 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-white" />
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base xl:text-lg 2xl:text-xl leading-relaxed">
                {action.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 dark:text-white mb-6 lg:mb-8 xl:mb-10 2xl:mb-12">Recent Activity</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:p-8 xl:p-10 2xl:p-12">
          <div className="space-y-4 lg:space-y-6 xl:space-y-8">
            <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 p-4 lg:p-6 xl:p-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-2 lg:p-3 xl:p-4">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-base lg:text-lg xl:text-xl 2xl:text-2xl">Appointment scheduled</p>
                <p className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-500 dark:text-gray-400">General checkup with Dr. Sarah Johnson</p>
              </div>
              <p className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-500 dark:text-gray-400">2 hours ago</p>
            </div>

            <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 p-4 lg:p-6 xl:p-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-2 lg:p-3 xl:p-4">
                <FileText className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-base lg:text-lg xl:text-xl 2xl:text-2xl">Prescription updated</p>
                <p className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-500 dark:text-gray-400">New medication added to your profile</p>
              </div>
              <p className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-500 dark:text-gray-400">1 day ago</p>
            </div>

            <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 p-4 lg:p-6 xl:p-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full p-2 lg:p-3 xl:p-4">
                <CreditCard className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-base lg:text-lg xl:text-xl 2xl:text-2xl">Payment processed</p>
                <p className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-500 dark:text-gray-400">$150 paid for consultation</p>
              </div>
              <p className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-500 dark:text-gray-400">3 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div>
        <h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 dark:text-white mb-6 lg:mb-8 xl:mb-10 2xl:mb-12">Today's Health Tip</h2>
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg p-8 lg:p-10 xl:p-12 2xl:p-16 text-white">
          <div className="flex items-start gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 lg:p-5 xl:p-6 2xl:p-8 flex-shrink-0">
              <Heart className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-16 2xl:h-16" />
            </div>
            <div>
              <h3 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold mb-4 lg:mb-6 xl:mb-8">Stay Hydrated</h3>
              <p className="text-green-100 text-lg lg:text-xl xl:text-2xl 2xl:text-3xl leading-relaxed">
                Drink at least 8 glasses of water daily to maintain optimal health. 
                Proper hydration supports your immune system and helps your body function efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
