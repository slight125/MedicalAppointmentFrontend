import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { 
  Calendar, 
  Clock, 
  User, 
  Plus,
  Filter,
  Search,
  CheckCircle,
  XCircle
} from 'lucide-react'
import PaymentButton from '../../components/PaymentButton'
import type { RootState, AppDispatch } from '../../store'
import { fetchAppointments, type Appointment, type AppointmentState } from '../../store/slices/appointmentSlice'
import type { AuthState } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'
import { fetchUserPrescriptions } from '../../store/slices/prescriptionSlice'
import { adminUpdateAppointmentAmount, fetchAllAppointmentsAdmin } from '../../utils/appointmentAPI';

export default function AppointmentList() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const authState = useSelector((state: RootState) => state.auth) as AuthState
  const appointmentState = useSelector((state: RootState) => state.appointments) as AppointmentState
  const { user } = authState
  const { appointments = [], isLoading = false, error } = appointmentState
  const prescriptions = useSelector((state: RootState) => state.prescriptions.prescriptions)

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [editAmountId, setEditAmountId] = useState<string | null>(null);
  const [newAmount, setNewAmount] = useState<string>('');

  // Fetch appointments on component mount
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAllAppointmentsAdmin().then((data) => {
        dispatch({ type: 'appointments/setAppointments', payload: data });
      });
    } else {
      dispatch(fetchAppointments());
    }
  }, [dispatch, user]);

  // Fetch prescriptions for user on mount (if user)
  useEffect(() => {
    if (user?.role === 'user') {
      dispatch(fetchUserPrescriptions())
    }
  }, [dispatch, user])

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(`Error loading appointments: ${error}`)
    }
  }, [error])

  // Helper functions for status display
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'confirmed':
      case 'pending':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'badge-success'
      case 'confirmed':
        return 'badge-info'
      case 'pending':
        return 'badge-warning'
      case 'cancelled':
        return 'badge-error'
      default:
        return 'badge-ghost'
    }
  }

  // Format date display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Filter appointments based on search and filters
  const filteredAppointments = (appointments || []).filter((appointment: Appointment) => {
    const doctorName = appointment.doctor ? 
      `${appointment.doctor.first_name} ${appointment.doctor.last_name}` : 
      ''
    const patientName = appointment.patient_full_name || ''
    
    const matchesSearch = searchTerm === '' || 
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointment_status.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || 
      appointment.appointment_status.toLowerCase() === statusFilter.toLowerCase()

    const today = new Date()
    const appointmentDate = new Date(appointment.appointment_date)
    let matchesDate = true

    if (dateFilter === 'upcoming') {
      matchesDate = appointmentDate >= today
    } else if (dateFilter === 'past') {
      matchesDate = appointmentDate < today
    } else if (dateFilter === 'today') {
      matchesDate = appointmentDate.toDateString() === today.toDateString()
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 xl:px-16 2xl:px-20 py-6 lg:py-8 xl:py-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 lg:mb-12 xl:mb-16 gap-6 lg:gap-8">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-4 leading-tight">Appointments</h1>
          <p className="text-gray-600 text-base lg:text-lg xl:text-xl">
            {user?.role === 'doctor' 
              ? 'Manage your patient appointments' 
              : 'View and manage your upcoming appointments'
            }
          </p>
        </div>
        {user?.role === 'user' && (
          <button
            onClick={() => navigate('/dashboard/appointments/book')}
            className="btn btn-primary gap-3 px-8 lg:px-10 py-4 lg:py-5 text-base lg:text-lg w-full lg:w-auto"
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
            Book Appointment
          </button>
        )}
      </div>

      {/* Enhanced Filters Section */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-xl lg:rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-600 p-6 lg:p-8 xl:p-10 mb-8 lg:mb-12">
        {/* Filter Header */}
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-full">
            <Filter className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <h2 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">Filter & Search Appointments</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-10">
          {/* Search */}
          <div className="form-control">
            <label className="label mb-3">
              <span className="label-text font-bold flex items-center gap-3 text-base lg:text-lg text-blue-700 dark:text-blue-300">
                <Search className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 dark:text-blue-400" />
                SEARCH
              </span>
            </label>
            <input
              type="text"
              placeholder="Search by doctor, patient, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-4 lg:py-5 text-base lg:text-lg font-medium border-3 border-blue-300 dark:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-600 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 shadow-lg transition-all duration-300 hover:shadow-xl"
            />
          </div>

          {/* Status Filter */}
          <div className="form-control">
            <label className="label mb-3">
              <span className="label-text font-bold flex items-center gap-3 text-base lg:text-lg text-green-700 dark:text-green-300">
                <div className="flex items-center justify-center w-4 h-4 lg:w-5 lg:h-5 bg-green-600 rounded-full">
                  <Filter className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                STATUS
              </span>
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-5 py-4 lg:py-5 text-base lg:text-lg font-medium border-3 border-green-300 dark:border-green-500 rounded-xl focus:ring-4 focus:ring-green-500/50 focus:border-green-600 dark:focus:border-green-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
              aria-label="Filter by appointment status"
            >
              <option value="all" className="text-base font-medium">🔍 All Status</option>
              <option value="pending" className="text-base font-medium">⏳ Pending</option>
              <option value="confirmed" className="text-base font-medium">✅ Confirmed</option>
              <option value="completed" className="text-base font-medium">🏁 Completed</option>
              <option value="cancelled" className="text-base font-medium">❌ Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="form-control">
            <label className="label mb-3">
              <span className="label-text font-bold flex items-center gap-3 text-base lg:text-lg text-purple-700 dark:text-purple-300">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 dark:text-purple-400" />
                DATE
              </span>
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-5 py-4 lg:py-5 text-base lg:text-lg font-medium border-3 border-purple-300 dark:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/50 focus:border-purple-600 dark:focus:border-purple-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
              aria-label="Filter by appointment date"
            >
              <option value="all" className="text-base font-medium">📅 All Dates</option>
              <option value="today" className="text-base font-medium">📍 Today</option>
              <option value="upcoming" className="text-base font-medium">🔮 Upcoming</option>
              <option value="past" className="text-base font-medium">📚 Past</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="form-control">
            <label className="label mb-3">
              <span className="label-text font-bold text-base lg:text-lg text-orange-700 dark:text-orange-300">RESULTS</span>
            </label>
            <div className="flex items-center h-16 lg:h-20 px-5 lg:px-6 bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-100 dark:from-orange-900/30 dark:via-yellow-900/30 dark:to-orange-900/30 border-3 border-orange-300 dark:border-orange-500 rounded-xl shadow-lg">
              <span className="text-orange-800 dark:text-orange-200 text-sm flex flex-col items-center justify-center w-full">
                <span className="text-sm flex items-center justify-center mb-1">
                  <span className="inline-block w-4 h-4 mr-1 align-middle">📊</span>
                  <span className="font-bold">{filteredAppointments.length}</span>
                </span>
                <span className="font-medium">appointment{filteredAppointments.length !== 1 ? 's' : ''}</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Quick Filter Buttons */}
        <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 border-t-2 border-blue-200 dark:border-blue-600">
          <div className="flex flex-wrap gap-3 lg:gap-4">
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setDateFilter('all')
              }}
              className="px-6 py-3 lg:px-8 lg:py-4 bg-gray-600 hover:bg-gray-700 text-white font-bold text-base lg:text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              🔄 Clear All Filters
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className="px-6 py-3 lg:px-8 lg:py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-base lg:text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ✅ Show Confirmed Only
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className="px-6 py-3 lg:px-8 lg:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base lg:text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              📍 Today's Appointments
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-6 lg:space-y-8">
        {filteredAppointments.length === 0 ? (
          <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl shadow-2xl border-2 border-blue-200 dark:border-blue-600 p-16 lg:p-20 xl:p-24 2xl:p-32 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center w-32 h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 mx-auto mb-8 lg:mb-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-2xl">
                <Calendar className="w-16 h-16 lg:w-20 lg:h-20 text-white" />
              </div>
              <h3 className="text-base lg:text-lg xl:text-xl 2xl:text-2xl font-black text-gray-900 dark:text-white mb-6 lg:mb-8">
                No Appointments Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-12 lg:mb-16 text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium leading-relaxed">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? '🔍 Try adjusting your filters to see more results.'
                  : user?.role === 'user'
                  ? '📅 You don\'t have any appointments yet. Book your first appointment!'
                  : '👨‍⚕️ No patient appointments scheduled.'
                }
              </p>
              {user?.role === 'user' && (
                <button
                  onClick={() => navigate('/dashboard/appointments/book')}
                  className="btn btn-primary gap-4 px-12 lg:px-16 py-6 lg:py-8 text-base lg:text-lg xl:text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12" />
                  📅 Book Your First Appointment
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredAppointments.map((appointment: Appointment) => (
            <div key={appointment.appointment_id} className="bg-gradient-to-r from-white via-blue-50/30 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl shadow-xl border-2 border-blue-100 dark:border-blue-800 p-4 lg:p-6 xl:p-8 2xl:p-10 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
              <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-6 lg:mb-8 xl:mb-10 gap-6">
                <div className="flex items-center">
                  <div className="mr-6 xl:mr-8">
                    <div className="flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg">
                      {getStatusIcon(appointment.appointment_status)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 leading-tight">
                      {user?.role === 'doctor' 
                        ? appointment.patient_full_name || 'Patient'
                        : appointment.doctor 
                          ? `Dr. ${appointment.doctor.first_name} ${appointment.doctor.last_name}`
                          : 'Doctor'
                      }
                    </h3>
                    <span className={`badge ${getStatusBadge(appointment.appointment_status)} text-base lg:text-lg px-6 py-3 lg:px-8 lg:py-4 font-bold shadow-lg`}>
                      {appointment.appointment_status}
                    </span>
                  </div>
                </div>
                <div className="text-right xl:text-right">
                  <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 font-medium mb-2">Appointment #{appointment.appointment_id}</p>
                  {user?.role === 'admin' && editAmountId === appointment.appointment_id.toString() ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={newAmount}
                        onChange={e => setNewAmount(e.target.value)}
                        className="input input-bordered w-24"
                        min="0"
                      />
                      <button
                        className="btn btn-success btn-sm"
                        onClick={async () => {
                          try {
                            await adminUpdateAppointmentAmount(appointment.appointment_id.toString(), parseFloat(newAmount));
                            toast.success('Amount updated!');
                            setEditAmountId(null);
                            dispatch(fetchAppointments());
                          } catch (err) {
                            toast.error('Failed to update amount');
                          }
                        }}
                      >
                        Save
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditAmountId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div className="inline-flex items-center bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-600 rounded-xl px-6 py-3 lg:px-8 lg:py-4">
                      <span className="text-2xl lg:text-3xl xl:text-4xl font-black text-green-800 dark:text-green-300">
                        💰 ${appointment.total_amount}
                      </span>
                      {user?.role === 'admin' && (
                        <button
                          className="ml-2 btn btn-outline btn-xs"
                          onClick={() => {
                            setEditAmountId(appointment.appointment_id.toString());
                            setNewAmount(appointment.total_amount.toString());
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 lg:gap-10 xl:gap-12 text-base lg:text-lg mb-8 lg:mb-10">
                <div className="flex items-center text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 lg:p-8 border-2 border-blue-200 dark:border-blue-700">
                  <Calendar className="w-8 h-8 lg:w-10 lg:h-10 mr-6 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-bold mb-3 text-blue-800 dark:text-blue-300">DATE</p>
                    <p className="font-medium">{formatDate(appointment.appointment_date)}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 rounded-xl p-6 lg:p-8 border-2 border-green-200 dark:border-green-700">
                  <Clock className="w-8 h-8 lg:w-10 lg:h-10 mr-6 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-bold mb-3 text-green-800 dark:text-green-300">TIME</p>
                    <p className="font-medium">{appointment.time_slot}</p>
                  </div>
                </div>
                {appointment.doctor && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 lg:p-8 border-2 border-purple-200 dark:border-purple-700">
                    <User className="w-8 h-8 lg:w-10 lg:h-10 mr-6 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="font-bold mb-3 text-purple-800 dark:text-purple-300">SPECIALIZATION</p>
                      <p className="font-medium">{appointment.doctor.specialization}</p>
                    </div>
                  </div>
                )}
                {/* Payment Status Card */}
                <div className="flex items-center text-gray-700 dark:text-gray-300 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 lg:p-8 border-2 border-orange-200 dark:border-orange-700">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 mr-6 flex items-center justify-center">
                    {appointment.paid ? (
                      <span className="text-2xl lg:text-3xl">✅</span>
                    ) : (
                      <span className="text-2xl lg:text-3xl">⏳</span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold mb-3 text-orange-800 dark:text-orange-300">PAYMENT</p>
                    <p className="font-medium">{appointment.paid ? 'Paid' : 'Pending'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 lg:mt-10 pt-8 lg:pt-10 border-t-2 border-gray-200 dark:border-gray-600">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 lg:gap-8">
                  <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                    {appointment.paid && (
                      <span className="inline-flex items-center bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-600 rounded-xl px-6 py-3 lg:px-8 lg:py-4">
                        <span className="text-base lg:text-lg font-bold text-green-800 dark:text-green-300">
                          ✅ PAID
                        </span>
                      </span>
                    )}
                    <span className="text-base lg:text-lg text-gray-600 dark:text-gray-400 font-medium">
                      Created: {new Date(appointment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 lg:gap-6">
                    {/* Payment Button - Show if appointment is confirmed/pending and not paid */}
                    {(appointment.appointment_status === 'Confirmed' || appointment.appointment_status === 'Pending') && 
                     !appointment.paid && 
                     user?.role === 'user' && 
                     appointment.total_amount && (
                      <PaymentButton
                        appointmentId={appointment.appointment_id.toString()}
                        amount={parseFloat(appointment.total_amount)}
                        doctor={appointment.doctor}
                        size="lg"
                        variant="primary"
                      />
                    )}
                    
                    {appointment.appointment_status === 'Pending' && user?.role === 'user' && (
                      <button className="btn btn-outline btn-error px-8 py-4 text-base lg:text-lg font-bold">
                        ❌ Cancel
                      </button>
                    )}
                    {appointment.appointment_status === 'Completed' && user?.role === 'user' && (
                      (() => {
                        const prescription = prescriptions.find(
                          (p) => p.appointment_id === appointment.appointment_id
                        );
                        if (!prescription) return null;
                        return (
                          <button
                            onClick={() => navigate(`/dashboard/prescriptions/${prescription.prescription_id}`)}
                            className="btn btn-outline btn-info px-8 py-4 text-base lg:text-lg font-bold"
                          >
                            📋 View Prescription
                          </button>
                        );
                      })()
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
