import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Calendar, FileText, Heart } from 'lucide-react';
import type { RootState, AppDispatch } from '../../store';
import { fetchAppointments } from '../../store/slices/appointmentSlice';
import { fetchUserPrescriptions } from '../../store/slices/prescriptionSlice';

export default function UserDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments, isLoading: apptLoading } = useSelector((state: RootState) => state.appointments);
  const { prescriptions, isLoading: prescLoading } = useSelector((state: RootState) => state.prescriptions);

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchUserPrescriptions());
  }, [dispatch]);

  // Debug logging
  console.log('🔍 Frontend Debug:');
  console.log('🔍 appointments from Redux:', appointments);
  console.log('🔍 apptLoading:', apptLoading);

  // Today's Appointments
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysAppointments = appointments.filter(a => a.appointment_date?.slice(0, 10) === todayStr);

  // Upcoming Appointments (next 2) - show future appointments or recent ones as fallback
  const futureAppointments = appointments.filter(a => new Date(a.appointment_date) > new Date());
  const upcomingAppointments = futureAppointments.length > 0 
    ? [...futureAppointments]
        .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
        .slice(0, 2)
    : [...appointments]
        .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
        .slice(0, 2);

  console.log('🔍 todayStr:', todayStr);
  console.log('🔍 todaysAppointments:', todaysAppointments);
  console.log('🔍 upcomingAppointments:', upcomingAppointments);
  console.log('🔍 futureAppointments:', futureAppointments);
  console.log('🔍 futureAppointments.length:', futureAppointments.length);
  
  // Debug individual appointments
  appointments.forEach((appt, index) => {
    console.log(`🔍 Appointment ${index}:`, {
      id: appt.appointment_id,
      date: appt.appointment_date,
      dateType: typeof appt.appointment_date,
      isToday: appt.appointment_date?.slice(0, 10) === todayStr,
      isFuture: new Date(appt.appointment_date) > new Date(),
      currentDate: new Date(),
      appointmentDate: new Date(appt.appointment_date)
    });
  });

  // Recent Prescriptions (latest 2)
  const recentPrescriptions = [...prescriptions]
    .sort((a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime())
    .slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6 sm:space-y-10 text-xs sm:text-base">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 rounded-xl p-8 shadow text-white mb-8 border border-blue-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold mb-2">
              Welcome back, {user?.firstname}!
            </h1>
            <p className="text-blue-100 text-lg">
              Manage your health appointments and medical records
            </p>
          </div>
          <Heart className="w-12 h-12 opacity-40 text-blue-300" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-center flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
          onClick={() => window.location.href = '/dashboard/appointments/book'}
        >
          Book Appointment
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
          onClick={() => window.location.href = '/dashboard/medical-history'}
        >
          View Medical History
        </button>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
          onClick={() => window.location.href = '/dashboard/support'}
        >
          Contact Support
        </button>
      </div>

      {/* Stats Overview */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow text-center border border-gray-700 w-48 sm:w-64 text-xs sm:text-base">
          <div className="text-2xl font-bold text-blue-400">{apptLoading ? '...' : todaysAppointments.length}</div>
          <div className="text-gray-300">Today's Appointments</div>
        </div>
      </div>

      {/* Recent/Upcoming Appointments */}
      <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow mb-6 sm:mb-8 border border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-white border-b border-gray-700 pb-1 sm:pb-2">
          {futureAppointments.length > 0 ? 'Upcoming Appointments' : 'Recent Appointments'}
        </h2>
        <div className="space-y-4">
          {apptLoading ? (
            <div className="text-gray-400">Loading...</div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-gray-400">No upcoming appointments.</div>
          ) : upcomingAppointments.map((appt) => (
            <div key={appt.appointment_id} className="bg-white p-2 sm:p-4 rounded-xl shadow flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-base">
              <div className="flex items-center gap-4">
                <Calendar className="text-green-500 w-6 h-6" />
                <div>
                  <p className="font-medium text-gray-900">
                    {appt.doctor ? `Checkup with Dr. ${appt.doctor.first_name} ${appt.doctor.last_name}` : 'Appointment'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(appt.appointment_date).toLocaleString()} at {appt.time_slot}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-400">
                {Math.ceil((new Date(appt.appointment_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Prescriptions */}
      <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow mb-6 sm:mb-8 border border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-white border-b border-gray-700 pb-1 sm:pb-2">Recent Prescriptions</h2>
        <div className="space-y-4">
          {prescLoading ? (
            <div className="text-gray-400">Loading...</div>
          ) : recentPrescriptions.length === 0 ? (
            <div className="text-gray-400">No recent prescriptions.</div>
          ) : recentPrescriptions.map((presc) => (
            <div key={presc.prescription_id} className="bg-white p-2 sm:p-4 rounded-xl shadow flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-base">
              <div className="flex items-center gap-4">
                <FileText className="text-blue-500 w-6 h-6" />
                <div>
                  <p className="font-medium text-gray-900">
                    {Array.isArray(presc.medicines) && presc.medicines.length > 0
                      ? presc.medicines[0].name
                      : typeof presc.medicines === 'string'
                        ? presc.medicines
                        : 'Prescription'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Issued by Dr. {presc.doctor_name || presc.doctor_id} on {new Date(presc.issued_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-400">
                {Math.ceil((Date.now() - new Date(presc.issued_at).getTime()) / (1000 * 60 * 60 * 24))} days ago
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Appointments Table (optional, can be removed if not needed) */}
      {/* ... */}
    </div>
  );
}
