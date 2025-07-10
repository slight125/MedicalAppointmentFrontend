import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  Users, 
  FileText, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import type { RootState } from '../../store'

export default function DoctorDashboard() {
  const { user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  const todayStats = [
    {
      title: 'Today\'s Appointments',
      value: '8',
      change: '+2 from yesterday',
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Total Patients',
      value: '156',
      change: '+12 this month',
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Prescriptions Issued',
      value: '23',
      change: '+5 today',
      icon: FileText,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Avg. Consultation',
      value: '25 min',
      change: 'Normal range',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ]

  const todayAppointments = [
    {
      id: 1,
      patient: 'John Smith',
      time: '09:00 AM',
      type: 'Regular Checkup',
      status: 'completed',
      duration: '30 min'
    },
    {
      id: 2,
      patient: 'Sarah Johnson',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'completed',
      duration: '20 min'
    },
    {
      id: 3,
      patient: 'Michael Brown',
      time: '11:00 AM',
      type: 'Consultation',
      status: 'in-progress',
      duration: '25 min'
    },
    {
      id: 4,
      patient: 'Emily Davis',
      time: '02:00 PM',
      type: 'Emergency',
      status: 'scheduled',
      duration: '45 min'
    },
    {
      id: 5,
      patient: 'Robert Wilson',
      time: '03:30 PM',
      type: 'Regular Checkup',
      status: 'scheduled',
      duration: '30 min'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success'
      case 'in-progress':
        return 'badge-warning'
      case 'scheduled':
        return 'badge-info'
      case 'cancelled':
        return 'badge-error'
      default:
        return 'badge-neutral'
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, Dr. {user?.lastname}!
        </h1>
        <p className="text-gray-600">
          Here's your schedule and patient overview for today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {todayStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
                <button 
                  onClick={() => navigate('/dashboard/appointments')}
                  className="btn btn-primary btn-sm"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(appointment.status)}
                      <div>
                        <h3 className="font-medium text-gray-900">{appointment.patient}</h3>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                      <p className="text-xs text-gray-500">{appointment.duration}</p>
                      <span className={`badge badge-sm ${getStatusBadge(appointment.status)} mt-1`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/dashboard/prescriptions')}
                className="w-full btn btn-outline btn-primary justify-start gap-3"
              >
                <FileText className="w-4 h-4" />
                Write Prescription
              </button>
              <button 
                onClick={() => navigate('/dashboard/medical-history')}
                className="w-full btn btn-outline btn-secondary justify-start gap-3"
              >
                <Users className="w-4 h-4" />
                View Patient History
              </button>
              <button 
                onClick={() => navigate('/dashboard/appointments')}
                className="w-full btn btn-outline btn-accent justify-start gap-3"
              >
                <Calendar className="w-4 h-4" />
                Manage Schedule
              </button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Patients Seen</span>
                <span className="font-medium">42</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Rating</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">4.8</span>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">On-time Rate</span>
                <span className="font-medium text-green-600">96%</span>
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Great performance this week!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Urgent Notifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Emergency Appointment</p>
                  <p className="text-xs text-red-600">Emily Davis - 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Lab Results Ready</p>
                  <p className="text-xs text-blue-600">3 patients have new results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
