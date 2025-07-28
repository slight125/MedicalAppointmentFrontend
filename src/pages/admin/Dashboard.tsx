import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  BarChart3,
  AlertTriangle,
  Activity,
  UserCheck
} from 'lucide-react'
import { fetchAdminSummaryAnalytics, fetchAdminComplaints } from '../../utils/api'

export default function AdminDashboard() {
  const navigate = useNavigate()

  // Dynamic state
  const [stats, setStats] = useState({ users: 0, doctors: 0, appointments: 0, revenue: 0 })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [pendingActions, setPendingActions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch summary analytics
        const summaryRes = await fetchAdminSummaryAnalytics()
        const summary = summaryRes.data || {}
        // Fetch support tickets (pending)
        const complaintsRes = await fetchAdminComplaints()
        const complaints = complaintsRes.data || []
        // Set stats using the 'totals' object from backend
        const totals = summary.totals || {};
        setStats({
          users: Number(totals.users) || 0,
          doctors: Number(totals.doctors) || 0,
          appointments: Number(totals.appointments) || 0,
          revenue: Number(totals.revenue) || 0
        })
        // Set recent activity (use latest users, appointments, or payments as proxy)
        setRecentActivity([
          ...(summary.recentUsers || []),
          ...(summary.recentAppointments || []),
          ...(summary.recentPayments || [])
        ].slice(0, 5))
        // Set pending actions
        setPendingActions([
          {
            id: 1,
            title: 'Doctor verification pending',
            description: `${summary.pendingDoctors || 0} doctors awaiting approval`,
            type: 'warning',
            count: summary.pendingDoctors || 0
          },
          {
            id: 2,
            title: 'Support tickets',
            description: `${complaints.filter((c: any) => c.status !== 'resolved').length} unresolved tickets`,
            type: 'error',
            count: complaints.filter((c: any) => c.status !== 'resolved').length
          },
          {
            id: 3,
            title: 'Payment disputes',
            description: `${summary.paymentDisputes || 0} disputes require attention`,
            type: 'warning',
            count: summary.paymentDisputes || 0
          }
        ])
      } catch (err) {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 rounded-xl p-8 shadow text-white mb-8 border border-blue-700 dark:border-blue-900">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Welcome back, Admin!</h1>
              <p className="text-blue-100 text-lg">Manage the system, users, and analytics</p>
            </div>
          </div>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 shadow text-center border border-gray-700 dark:border-gray-800">
            <div className="text-2xl font-bold text-blue-400">{stats.users}</div>
            <div className="text-gray-300">Total Users</div>
          </div>
          <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 shadow text-center border border-gray-700 dark:border-gray-800">
            <div className="text-2xl font-bold text-green-400">{stats.doctors}</div>
            <div className="text-gray-300">Total Doctors</div>
          </div>
          <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 shadow text-center border border-gray-700 dark:border-gray-800">
            <div className="text-2xl font-bold text-purple-400">{stats.appointments}</div>
            <div className="text-gray-300">Total Appointments</div>
          </div>
          <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 shadow text-center border border-gray-700 dark:border-gray-800">
            <div className="text-2xl font-bold text-yellow-400">{stats.revenue}</div>
            <div className="text-gray-300">Revenue</div>
          </div>
        </div>

      {/* Pending Actions Alert */}
      {pendingActions.length > 0 ? (
        <div className="mb-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Pending Actions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {pendingActions.map((action) => (
                <div key={action.id} className="bg-white dark:bg-gray-900 rounded-lg p-2 border border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{action.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{action.description}</p>
                    </div>
                    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-300">{action.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 text-gray-500 dark:text-gray-400 text-center">No pending actions.</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">Recent Activity</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {recentActivity.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-400 text-center">No recent activity.</div>
                ) : recentActivity.map((activity, idx) => (
                  <div key={activity.id || idx} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className={`p-1.5 rounded-lg ${getActivityColor(activity.status || 'info')}`}>
                      {getActivityIcon(activity.type || 'user')}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{activity.action || activity.event || activity.description || 'Activity'}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">by {activity.user || activity.performedBy || 'System'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time || activity.timestamp || ''}</p>
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
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Revenue Trend</h3>
          </div>
          <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-xs">Revenue chart would go here</p>
              <button 
                onClick={() => navigate('/dashboard/admin/analytics')}
                className="btn btn-primary btn-xs mt-2"
              >
                View Analytics
              </button>
            </div>
          </div>
        </div>

        {/* User Growth Chart Placeholder */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-center mb-3">
            <Users className="w-4 h-4 text-blue-500 mr-2" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">User Growth</h3>
          </div>
          <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-xs">User growth chart would go here</p>
              <button 
                onClick={() => navigate('/dashboard/admin/users')}
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
