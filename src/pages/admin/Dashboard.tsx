import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  BarChart3,
  FileText,
  AlertTriangle,
  Activity,
  UserCheck
} from 'lucide-react'
import type { RootState } from '../../store'

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth as { user: { firstname?: string } })
  const navigate = useNavigate()

  const systemStats = [
    {
      title: 'Total Users',
      value: '1,284',
      change: '+12% from last month',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Total Appointments',
      value: '856',
      change: '+8% from last month',
      icon: Calendar,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Revenue',
      value: '$45,280',
      change: '+15% from last month',
      icon: DollarSign,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: 'Excellent performance',
      icon: Activity,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'New user registration',
      user: 'John Smith',
      time: '2 minutes ago',
      type: 'user',
      status: 'success'
    },
    {
      id: 2,
      action: 'Payment processed',
      user: 'Sarah Johnson',
      time: '5 minutes ago',
      type: 'payment',
      status: 'success'
    },
    {
      id: 3,
      action: 'Appointment cancelled',
      user: 'Michael Brown',
      time: '10 minutes ago',
      type: 'appointment',
      status: 'warning'
    },
    {
      id: 4,
      action: 'Doctor profile updated',
      user: 'Dr. Emily Davis',
      time: '15 minutes ago',
      type: 'user',
      status: 'info'
    },
    {
      id: 5,
      action: 'System backup completed',
      user: 'System',
      time: '1 hour ago',
      type: 'system',
      status: 'success'
    }
  ]

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users, doctors, and administrators',
      icon: Users,
      color: 'btn-primary',
      onClick: () => navigate('/admin/users')
    },
    {
      title: 'Analytics',
      description: 'View system analytics and reports',
      icon: BarChart3,
      color: 'btn-secondary',
      onClick: () => navigate('/admin/analytics')
    },
    {
      title: 'Reports',
      description: 'Generate and download reports',
      icon: FileText,
      color: 'btn-accent',
      onClick: () => navigate('/admin/reports')
    },
    {
      title: 'System Health',
      description: 'Monitor system performance',
      icon: Activity,
      color: 'btn-info',
      onClick: () => navigate('/admin/system')
    }
  ]

  const pendingActions = [
    {
      id: 1,
      title: 'Doctor verification pending',
      description: '3 doctors awaiting approval',
      type: 'warning',
      count: 3
    },
    {
      id: 2,
      title: 'Support tickets',
      description: '12 unresolved tickets',
      type: 'error',
      count: 12
    },
    {
      id: 3,
      title: 'Payment disputes',
      description: '2 disputes require attention',
      type: 'warning',
      count: 2
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <UserCheck className="w-4 h-4" />
      case 'payment':
        return <DollarSign className="w-4 h-4" />
      case 'appointment':
        return <Calendar className="w-4 h-4" />
      case 'system':
        return <Activity className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      case 'info':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-[95vw] xl:max-w-7xl 2xl:max-w-[90vw] mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-sm">
            Welcome back, {user?.firstname}! Here's your system overview.
          </p>
        </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {systemStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Actions Alert */}
      {pendingActions.length > 0 && (
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <h3 className="text-sm font-medium text-yellow-800">Pending Actions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {pendingActions.map((action) => (
                <div key={action.id} className="bg-white rounded-lg p-2 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-900">{action.title}</p>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                    <span className="text-sm font-bold text-yellow-600">{action.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">Quick Actions</h2>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`w-full btn btn-sm ${action.color} justify-start gap-2`}
                >
                  <action.icon className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-medium text-xs">{action.title}</div>
                    <div className="text-xs opacity-75">{action.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 text-center">Recent Activity</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className={`p-1.5 rounded-lg ${getActivityColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">by {activity.user}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
            <h3 className="text-base font-semibold text-gray-900">Revenue Trend</h3>
          </div>
          <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-xs">Revenue chart would go here</p>
              <button 
                onClick={() => navigate('/admin/analytics')}
                className="btn btn-primary btn-xs mt-2"
              >
                View Analytics
              </button>
            </div>
          </div>
        </div>

        {/* User Growth Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-center mb-3">
            <Users className="w-4 h-4 text-blue-500 mr-2" />
            <h3 className="text-base font-semibold text-gray-900">User Growth</h3>
          </div>
          <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-xs">User growth chart would go here</p>
              <button 
                onClick={() => navigate('/admin/users')}
                className="btn btn-secondary btn-xs mt-2"
              >
                Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
