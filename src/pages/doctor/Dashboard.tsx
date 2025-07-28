import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { 
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import type { RootState } from '../../store'
import appointmentAPI from '../../utils/api/appointmentAPI'
import prescriptionAPI from '../../utils/api/prescriptionAPI'
import { doctorAPI } from '../../utils/api/doctorAPI'
import { toast } from 'react-hot-toast';

export default function DoctorDashboard() {
  const { user } = useSelector((state: RootState) => state.auth)

  const [appointments, setAppointments] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any>({ emergencies: [], labResults: [] })
  const [performance, setPerformance] = useState<any>({ patientsSeen: 0, avgRating: 0, onTimeRate: 0 })
  const [loading, setLoading] = useState(true)
  const [fee, setFee] = useState<number | null>(null);
  const [feeEdit, setFeeEdit] = useState(false);
  const [feeInput, setFeeInput] = useState('');
  const [feeLoading, setFeeLoading] = useState(false);
  const [doctorId, setDoctorId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch all appointments for this doctor
        const apptRes = await appointmentAPI.getDoctorAppointments?.() || await appointmentAPI.getAppointmentsStats();
        setAppointments(apptRes.data || [])
        // Fetch all prescriptions for this doctor
        if (prescriptionAPI.getDoctorPrescriptions) {
          const presRes = await prescriptionAPI.getDoctorPrescriptions()
          setPrescriptions(presRes.data || [])
        }
        // Fetch notifications
        const notifRes = await doctorAPI.getNotifications()
        setNotifications(notifRes.data || { emergencies: [], labResults: [] })
        // Fetch performance metrics
        const perfRes = await doctorAPI.getPerformance()
        setPerformance(perfRes.data || { patientsSeen: 0, avgRating: 0, onTimeRate: 0 })
      } catch (err) {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchFee() {
      if (user?.role === 'doctor' && user.user_id) {
        try {
          const profile = await doctorAPI.getDoctorProfileByUserId(user.user_id);
          setDoctorId(profile.doctor_id);
          setFee(Number(profile.fee));
        } catch (err) {
          console.error('Failed to fetch doctor profile:', err);
          toast.error('Failed to load doctor profile.');
        }
      }
    }
    fetchFee();
  }, [user]);

  // Calculate stats dynamically
  const today = new Date().toISOString().slice(0, 10)
  const todaysAppointments = appointments.filter(a => a.appointment_date?.slice(0, 10) === today)

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

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6 sm:space-y-10 text-xs sm:text-base">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 rounded-xl p-8 shadow text-white mb-8 border border-blue-700 dark:border-blue-900">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold mb-2">
              Welcome back, Dr. {user?.lastname}!
            </h1>
            <p className="text-blue-100 text-lg">
              Here's your schedule and patient overview for today.
            </p>
          </div>
        </div>
      </div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gray-900 rounded-xl p-6 shadow text-center border border-gray-700">
          <div className="text-2xl font-bold text-blue-400">{appointments.length}</div>
          <div className="text-gray-300">Today's Appointments</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 shadow text-center border border-gray-700">
          <div className="text-2xl font-bold text-green-400">{performance.patientsSeen}</div>
          <div className="text-gray-300">Total Patients</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 shadow text-center border border-gray-700">
          <div className="text-2xl font-bold text-purple-400">{prescriptions.length}</div>
          <div className="text-gray-300">Prescriptions Issued</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 shadow text-center border border-gray-700">
          <div className="text-2xl font-bold text-yellow-400">{performance.avgConsultation} min</div>
          <div className="text-gray-300">Avg. Consultation</div>
        </div>
      </div>
      {/* Appointments Table */}
      <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow mb-6 sm:mb-8 border border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-white border-b border-gray-700 pb-1 sm:pb-2">Today's Appointments</h2>
        <div className="overflow-x-auto">
          <table className="table w-full text-xs sm:text-base">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {todaysAppointments.map((appt, idx) => (
                <tr key={appt.appointment_id || idx}>
                  <td>{appt.user?.firstname} {appt.user?.lastname}</td>
                  <td>{appt.time_slot}</td>
                  <td>{appt.type || appt.appointment_status}</td>
                  <td><span className={`badge ${getStatusBadge(appt.appointment_status)}`}>{appt.appointment_status}</span></td>
                  <td>{appt.duration || '25 min'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Performance */}
      <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow mb-6 sm:mb-8 border border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-white border-b border-gray-700 pb-1 sm:pb-2">This Week</h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          <div className="text-center">
            <span className="text-sm text-gray-400">Patients Seen</span>
            <div className="font-medium text-blue-400 text-2xl">{performance.patientsSeen}</div>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-400">Avg. Rating</span>
            <div className="flex items-center gap-1 justify-center">
              <span className="font-medium text-yellow-400 text-2xl">{performance.avgRating}</span>
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.round(performance.avgRating))}
              </div>
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-400">On-time Rate</span>
            <span className="font-medium text-green-400 text-2xl">{performance.onTimeRate}%</span>
          </div>
        </div>
        <div className="pt-2 flex items-center justify-center gap-2 text-sm text-green-400">
          <TrendingUp className="w-4 h-4" />
          <span>Great performance this week!</span>
        </div>
      </div>
      {/* Notifications */}
      <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow border border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-white border-b border-gray-700 pb-1 sm:pb-2">Notifications</h3>
        <div className="space-y-2 sm:space-y-3">
          {notifications.labResults && notifications.labResults.map((lab: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-blue-800/40 rounded-lg border border-blue-900">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-200">{lab.message}</span>
            </div>
          ))}
          {notifications.emergencies.map((appt: any, idx: number) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300">Emergency Appointment</p>
                <p className="text-xs text-red-600 dark:text-red-400">{appt.user?.firstname} {appt.user?.lastname} - {appt.time_slot}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Doctor Fee Section */}
      <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow mb-6 sm:mb-8 border border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-white border-b border-gray-700 pb-1 sm:pb-2">Consultation Fee</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          {feeEdit ? (
            <>
              <input
                type="number"
                className="input input-bordered w-32 mr-2"
                value={feeInput}
                onChange={e => setFeeInput(e.target.value)}
                min={0}
                disabled={feeLoading}
              />
              <button
                className="btn btn-success btn-sm mr-2"
                disabled={feeLoading}
                onClick={async () => {
                  setFeeLoading(true);
                  try {
                    if (!doctorId) throw new Error('Doctor ID missing');
                    await doctorAPI.updateFee(doctorId, Number(feeInput));
                    setFee(Number(feeInput));
                    setFeeEdit(false);
                    toast.success('Fee updated!');
                  } catch (err) {
                    toast.error('Failed to update fee');
                  } finally {
                    setFeeLoading(false);
                  }
                }}
              >
                Save
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setFeeEdit(false)} disabled={feeLoading}>Cancel</button>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold text-green-400">{fee !== null ? `Ksh ${fee.toLocaleString()}` : 'Not set'}</span>
              <button className="btn btn-outline btn-sm ml-2" onClick={() => { setFeeEdit(true); setFeeInput(fee?.toString() || ''); }}>Edit</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
