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
import { adminUpdateAppointmentAmount, fetchAllAppointmentsAdmin, adminDeleteAppointment, adminUpdateAppointmentStatus } from '../../utils/appointmentAPI';

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
    // Determine patient name for admin
    const patientName = user?.role === 'admin'
      ? appointment.patient_full_name || ''
      : appointment.patient_full_name || '';
    const doctorName = appointment.doctor ? 
      `${appointment.doctor.first_name} ${appointment.doctor.last_name}` : '';
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
    <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-8 xl:px-12 py-2 sm:py-4 lg:py-6 text-xs sm:text-base">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 sm:mb-4 lg:mb-6 gap-2 sm:gap-4">
        <div className="mb-2 lg:mb-0">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">Appointments</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
            {user?.role === 'doctor' 
              ? 'Manage your patient appointments' 
              : 'View and manage your upcoming appointments'
            }
          </p>
        </div>
        {user?.role === 'user' && (
          <button
            onClick={() => navigate('/dashboard/appointments/book')}
            className="btn btn-primary gap-2 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm lg:text-base w-full lg:w-auto"
          >
            <Plus className="w-4 h-4" />
            Book Appointment
          </button>
        )}
      </div>

      {/* Compact Filters Section */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg shadow-lg border border-blue-200 dark:border-blue-600 p-4 lg:p-6 mb-6">
        {/* Filter Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filter & Search</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="form-control">
            <label className="label mb-1">
              <span className="label-text font-semibold flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                SEARCH
              </span>
            </label>
            <input
              type="text"
              placeholder="Search by doctor, patient, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm font-medium border-2 border-blue-300 dark:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-600 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 shadow-md transition-all duration-300"
            />
          </div>

          {/* Status Filter */}
          <div className="form-control">
            <label className="label mb-1">
              <span className="label-text font-semibold flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                <div className="flex items-center justify-center w-4 h-4 bg-green-600 rounded-full">
                  <Filter className="w-4 h-4 text-white" />
                </div>
                STATUS
              </span>
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm font-medium border-2 border-green-300 dark:border-green-500 rounded-lg focus:ring-2 focus:ring-green-500/50 focus:border-green-600 dark:focus:border-green-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md transition-all duration-300 cursor-pointer"
              aria-label="Filter by appointment status"
            >
              <option value="all" className="text-sm font-medium">🔍 All Status</option>
              <option value="pending" className="text-sm font-medium">⏳ Pending</option>
              <option value="confirmed" className="text-sm font-medium">✅ Confirmed</option>
              <option value="completed" className="text-sm font-medium">🏁 Completed</option>
              <option value="cancelled" className="text-sm font-medium">❌ Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="form-control">
            <label className="label mb-1">
              <span className="label-text font-semibold flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                DATE
              </span>
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm font-medium border-2 border-purple-300 dark:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-600 dark:focus:border-purple-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md transition-all duration-300 cursor-pointer"
              aria-label="Filter by appointment date"
            >
              <option value="all" className="text-sm font-medium">📅 All Dates</option>
              <option value="today" className="text-sm font-medium">📍 Today</option>
              <option value="upcoming" className="text-sm font-medium">🔮 Upcoming</option>
              <option value="past" className="text-sm font-medium">📚 Past</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="form-control">
            <label className="label mb-1">
              <span className="label-text font-semibold text-sm text-orange-700 dark:text-orange-300">RESULTS</span>
            </label>
            <div className="flex items-center h-12 px-3 bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-100 dark:from-orange-900/30 dark:via-yellow-900/30 dark:to-orange-900/30 border-2 border-orange-300 dark:border-orange-500 rounded-lg shadow-md">
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
        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-600">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setDateFilter('all')
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 text-white font-semibold text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              🔄 Clear All
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-700 text-white font-semibold text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              ✅ Confirmed Only
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              📍 Today's
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-xl shadow-lg border border-blue-200 dark:border-blue-600 p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                No Appointments Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
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
                  className="btn btn-primary gap-2 px-6 py-3 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  📅 Book Your First Appointment
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredAppointments.map((appointment: Appointment) => (
            <div key={appointment.appointment_id} className="bg-gradient-to-r from-white via-blue-50/30 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-blue-800 p-4 lg:p-6 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
              {/* Header with Doctor/Patient and Status */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4 gap-4">
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-md">
                      {getStatusIcon(appointment.appointment_status)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                      {user?.role === 'admin'
                        ? appointment.patient_full_name || 'Patient'
                        : user?.role === 'doctor'
                          ? appointment.patient_full_name || 'Patient'
                          : appointment.doctor 
                            ? `Dr. ${appointment.doctor.first_name} ${appointment.doctor.last_name}`
                            : 'Doctor'
                      }
                    </h3>
                    <span className={`badge ${getStatusBadge(appointment.appointment_status)} text-sm px-3 py-1 font-semibold shadow-md`}>
                      {appointment.appointment_status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-2">Appointment #{appointment.appointment_id}</p>
                  {user?.role === 'admin' && editAmountId === appointment.appointment_id.toString() ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={newAmount}
                        onChange={e => setNewAmount(e.target.value)}
                        className="input input-bordered w-20 text-sm"
                        min="0"
                      />
                      <button
                        className="btn btn-success btn-xs"
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
                      <button className="btn btn-ghost btn-xs" onClick={() => setEditAmountId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div className="inline-flex items-center bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600 rounded-lg px-3 py-2">
                      <span className="text-lg font-bold text-green-800 dark:text-green-300">
                        💰 Ksh {Number(appointment.total_amount).toLocaleString()}
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

              {/* Compact Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-semibold mb-1 text-xs text-blue-800 dark:text-blue-300">DATE</p>
                    <p className="font-medium text-sm">{formatDate(appointment.appointment_date)}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                  <Clock className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold mb-1 text-xs text-green-800 dark:text-green-300">TIME</p>
                    <p className="font-medium text-sm">{appointment.time_slot}</p>
                  </div>
                </div>
                {appointment.doctor && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                    <User className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="font-semibold mb-1 text-xs text-purple-800 dark:text-purple-300">SPECIALIZATION</p>
                      <p className="font-medium text-sm">{appointment.doctor.specialization}</p>
                    </div>
                  </div>
                )}
                {/* Payment Status Card */}
                <div className="flex items-center text-gray-700 dark:text-gray-300 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                  <div className="w-5 h-5 mr-2 flex items-center justify-center">
                    {appointment.paid ? (
                      <span className="text-lg">✅</span>
                    ) : (
                      <span className="text-lg">⏳</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-xs text-orange-800 dark:text-orange-300">PAYMENT</p>
                    <p className="font-medium text-sm">{appointment.paid ? 'Paid' : 'Pending'}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {appointment.paid && (
                      <span className="inline-flex items-center bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600 rounded-lg px-3 py-1">
                        <span className="text-sm font-semibold text-green-800 dark:text-green-300">
                          ✅ PAID
                        </span>
                      </span>
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Created: {new Date(appointment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {/* Payment Button - Show if appointment is confirmed/pending and not paid */}
                    {(appointment.appointment_status === 'Confirmed' || appointment.appointment_status === 'Pending') && 
                     !appointment.paid && 
                     user?.role === 'user' && 
                     appointment.total_amount && (
                      <PaymentButton
                        appointmentId={appointment.appointment_id}
                        amount={parseFloat(appointment.total_amount)}
                        doctor={appointment.doctor}
                        size="sm"
                        variant="primary"
                      />
                    )}
                    
                    {appointment.appointment_status === 'Pending' && user?.role === 'user' && (
                      <button className="btn btn-outline btn-error btn-sm px-4 py-2 text-sm font-semibold">
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
                            className="btn btn-outline btn-info btn-sm px-4 py-2 text-sm font-semibold"
                          >
                            📋 View Prescription
                          </button>
                        );
                      })()
                    )}
                  </div>
                </div>
              </div>
              {user?.role === 'admin' && (
                <div className="flex gap-2 mt-2">
                  {/* Status Change Dropdown */}
                  <select
                    value={appointment.appointment_status}
                    onChange={async (e) => {
                      try {
                        await adminUpdateAppointmentStatus(appointment.appointment_id.toString(), e.target.value);
                        toast.success('Status updated!');
                        dispatch(fetchAppointments());
                      } catch {
                        toast.error('Failed to update status');
                      }
                    }}
                    className="select select-bordered select-xs"
                    style={{ minWidth: 120 }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  {/* Delete Button */}
                  <button
                    className="btn btn-xs btn-error"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this appointment?')) {
                        try {
                          await adminDeleteAppointment(appointment.appointment_id.toString());
                          toast.success('Appointment deleted!');
                          dispatch(fetchAppointments());
                        } catch {
                          toast.error('Failed to delete appointment');
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
