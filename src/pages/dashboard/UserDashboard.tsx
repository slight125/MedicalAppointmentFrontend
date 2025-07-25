
// // // ...existing code...

// // const FindDoctors = () => {
// //   const [doctors, setDoctors] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     appointmentAPI.getDoctors()
// //       .then(res => {
// //         setDoctors(res.data.doctors || []);
// //         setLoading(false);
// //       })
// //       .catch(() => {
// //         setError('Failed to load doctors');
// //         setLoading(false);
// //       });
// //   }, []);

// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-2xl font-bold">Find Doctors</h2>
// //       {loading ? (
// //         <div>Loading doctors...</div>
// //       ) : error ? (
// //         <div className="text-error">{error}</div>
// //       ) : (
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {doctors.map((doctor) => (
// //             <div key={doctor.doctor_id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
// // <div className="flex min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
// //   {/* Sidebar */}
// //   <Sidebar userRole="user" />
// //   {/* Main Content */}
// //   <main className="flex-1 px-4 py-8 md:px-12 md:py-12 bg-transparent">
// //     <div className="max-w-7xl mx-auto space-y-8">
// //       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
// //         <div>
// //           <h1 className="text-4xl md:text-5xl font-extrabold text-primary drop-shadow mb-2">Welcome back, Allan!</h1>
// //           <p className="text-lg md:text-xl text-base-content/80 font-medium">Manage your health and appointments</p>
// //         </div>
// //         <button className="btn btn-primary btn-lg shadow-lg rounded-xl px-8 py-3 text-lg font-bold flex items-center gap-2">
// //           <span>+ Book Appointment</span>
// //         </button>
// //       </div>
// //       {/* Stats */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
// //         {/* ...existing code for stats cards, but add card, shadow, and icon styling... */}
// //       </div>
// //       {/* Quick Actions */}
// //       <div className="card bg-base-100/90 shadow-2xl rounded-3xl border border-base-300 mb-8">
// //         <div className="card-body">
// //           <h2 className="card-title text-primary text-2xl font-bold mb-6">Quick Actions</h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// //             {/* ...existing code for quick action buttons, but use btn-glass, btn-lg, and add icons... */}
// // // ...existing code...
// //   }, [user?.id]);

// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-2xl font-bold">My Prescriptions</h2>
// //       <div className="space-y-4">
// //         {loading ? (
// //           <div>Loading prescriptions...</div>
// //         ) : error ? (
// //           <div className="text-error">{error}</div>
// //         ) : prescriptions.length === 0 ? (
// //           <div>No prescriptions found.</div>
// //         ) : (
// //           prescriptions.map((presc) => (
// //             <div key={presc.prescription_id} className="card bg-base-100 shadow-lg">
// //               <div className="card-body">
// //                 <div className="flex justify-between items-start">
// //                   <div>
// //                     <h3 className="card-title">Prescription #{presc.prescription_id}</h3>
// //                     <p className="text-base-content/70">Dr. {presc.doctor?.first_name} {presc.doctor?.last_name} - {presc.issued_at?.slice(0,10)}</p>
// //                     <div className="mt-2">
// //                       <p className="text-sm font-medium">Medications:</p>
// //                       <ul className="text-sm text-base-content/70 ml-4">
// //                         {presc.medicines?.map((med, idx) => (
// //                           <li key={idx}>• {med.name} {med.dosage} - {med.frequency}</li>
// //                         ))}
// //                       </ul>
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="card-actions justify-end">
// //                   <button className="btn btn-outline btn-sm">Download</button>
// //                 </div>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // const Support = () => {
// //   const { user } = useSelector((state: RootState) => state.auth);
// //   const [complaints, setComplaints] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     if (user?.id) {
// //       complaintAPI.getComplaints(user.id)
// //         .then(res => {
// //           setComplaints(res.data || []);
// //           setLoading(false);
// //         })
// //         .catch(() => {
// //           setError('Failed to load complaints');
// //           setLoading(false);
// //         });
// //     }
// //   }, [user?.id]);

// //   return (
// //     <div className="space-y-6 bg-base-100 dark:bg-neutral min-h-screen transition-colors">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-2xl font-bold text-base-content">Support & Complaints</h2>
// //         <button className="btn btn-primary">
// //           <FiPlus className="h-4 w-4 mr-2" />
// //           New Ticket
// //         </button>
// //       </div>
// //       <div className="space-y-4">
// //         {loading ? (
// //           <div className="text-base-content">Loading complaints...</div>
// //         ) : error ? (
// //           <div className="text-error">{error}</div>
// //         ) : complaints.length === 0 ? (
// //           <div className="text-base-content">No complaints found.</div>
// //         ) : (
// //           complaints.map((ticket) => (
// //             <div key={ticket.complaint_id} className="card bg-base-100 dark:bg-white shadow-lg border border-base-300 dark:border-neutral-700 transition-colors">
// //               <div className="card-body">
// //                 <div className="flex justify-between items-start">
// //                   <div>
// //                     <h3 className="card-title text-base-content dark:text-base-content">Ticket #{ticket.complaint_id}</h3>
// //                     <p className="text-base-content/70 dark:text-base-content/70">{ticket.subject}</p>
// //                     <p className="text-sm text-base-content/60 dark:text-base-content/60">Created: {ticket.created_at?.slice(0,10)}</p>
// //                   </div>
// //                   <div className={`badge ${ticket.status === 'In Progress' ? 'badge-warning' : 'badge-primary'} text-base-content dark:text-base-content`}>{ticket.status}</div>
// //                 </div>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // const UserDashboardHome: React.FC = () => {
// //   const { user } = useSelector((state: RootState) => state.auth);
// //   const { appointments } = useSelector((state: RootState) => state.appointments);
// //   const dispatch = useDispatch<AppDispatch>();
// //   const { is4K, is8K } = useResponsive();

// //   useEffect(() => {
// //     if (user?.id) {
// //       dispatch(fetchAppointments(user.id));
// //     }
// //   }, [dispatch, user?.id]);

// //   const stats = [
// //     {
// //       title: 'Upcoming Appointments',
// //       value: appointments.filter(apt => apt.status === 'scheduled').length,
// //       icon: FiCalendar,
// //       description: 'Next 30 days',
// //     },
// //     {
// //       title: 'Completed Visits',
// //       value: appointments.filter(apt => apt.status === 'completed').length,
// //       icon: FiActivity,
// //       description: 'This year',
// //     },
// //     {
// //       title: 'Active Prescriptions',
// //       value: 3,
// //       icon: FiFileText,
// //       description: 'Current medications',
// //     },
// //     {
// //       title: 'My Doctors',
// //       value: 2,
// //       icon: FiUsers,
// //       description: 'Regular physicians',
// //     },
// //   ];

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
// //         <div>
// //           <h1 className={`
// //             font-bold text-primary
// //             ${is8K ? 'text-8k-2xl' : is4K ? 'text-4xl' : 'text-2xl md:text-3xl'}
// //           `}>
// //             Welcome back, {user?.firstname}!
// //           </h1>
// //           <p className={`
// //             text-base-content/70
// //             ${is8K ? 'text-8k-base' : is4K ? 'text-xl' : 'text-base'}
// //           `}>
// //             Manage your health and appointments
// //           </p>
// //         </div>
// //         <Link 
// //           to="/user-dashboard/appointments" 
// //           className={`
// //             btn btn-primary
// //             ${is8K ? 'btn-lg text-8k-base' : is4K ? 'btn-lg' : ''}
// //           `}
// //         >
// //           <FiPlus className="h-4 w-4 mr-2" />
// //           Book Appointment
// //         </Link>
// //       </div>

// //       {/* Stats Grid */}
// //       <div className={`
// //         grid gap-6
// //         ${is8K ? 'grid-cols-2 gap-16' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}
// //       `}>
// //         {stats.map((stat, index) => (
// //           <StatsCard
// //             key={index}
// //             title={stat.title}
// //             value={stat.value}
// //             icon={stat.icon}
// //             description={stat.description}
// //             className={is8K ? 'text-8k-base' : ''}
// //           />
// //         ))}
// //       </div>

// //       {/* Quick Actions */}
// //       <div className="card bg-base-100 shadow-lg">
// //         <div className="card-body">
// //           <h2 className={`
// //             card-title text-primary mb-4
// //             ${is8K ? 'text-8k-lg' : is4K ? 'text-2xl' : ''}
// //           `}>
// //             Quick Actions
// //           </h2>
// //           <div className={`
// //             grid gap-4
// //             ${is8K ? 'grid-cols-2 gap-8' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}
// //           `}>
// //             <Link 
// //               to="/dashboard/find-doctors" 
// //               className="btn btn-outline btn-lg flex-col h-auto py-4"
// //             >
// //               <FiUsers className="h-6 w-6 mb-2" />
// //               Find Doctors
// //             </Link>
// //             <Link 
// //               to="/user-dashboard/appointments" 
// //               className="btn btn-outline btn-lg flex-col h-auto py-4"
// //             >
// //               <FiCalendar className="h-6 w-6 mb-2" />
// //               My Appointments
// //             </Link>
// //             <Link 
// //               to="/user-dashboard/prescriptions" 
// //               className="btn btn-outline btn-lg flex-col h-auto py-4"
// //             >
// //               <FiFileText className="h-6 w-6 mb-2" />
// //               Prescriptions
// //             </Link>
// //             <Link 
// //               to="/user-dashboard/complaints" 
// //               className="btn btn-outline btn-lg flex-col h-auto py-4"
// //             >
// //               <FiClock className="h-6 w-6 mb-2" />
// //               Support
// //             </Link>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Recent Appointments */}
// //       <div className="card bg-base-100 shadow-lg">
// //         <div className="card-body">
// //           <div className="flex justify-between items-center mb-4">
// //             <h2 className={`
// //               card-title text-primary
// //               ${is8K ? 'text-8k-lg' : is4K ? 'text-2xl' : ''}
// //             `}>
// //               Recent Appointments
// //             </h2>
// //             <Link to="/user-dashboard/appointments" className="link link-primary">
// //               View All
// //             </Link>
// //           </div>
// //           <div className="space-y-3">
// //             {appointments.slice(0, 3).map((appointment) => (
// //               <div key={appointment.id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
// //                 <div className="flex items-center gap-4">
// //                   <div className="avatar placeholder">
// //                     <div className="bg-primary text-primary-content rounded-full w-12">
// //                       <span className="text-xl">Dr</span>
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <p className="font-medium">Dr. John Smith</p>
// //                     <p className="text-sm text-base-content/70">
// //                       {appointment.date} at {appointment.time}
// //                     </p>
// //             <div key={doctor.doctor_id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
// //               {/* Doctor card content */}
// //             </div>
// //                   badge
// //                   ${appointment.status === 'scheduled' ? 'badge-primary' : 
// //                     appointment.status === 'completed' ? 'badge-success' : 'badge-warning'}
// //                 `}>
// //                   {appointment.status}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const FindDoctorsDashboard = React.lazy(() => import('./FindDoctorsDashboard'));
// // const FindDoctors = React.lazy(() => import('./FindDoctors'));

// // const UserDashboard: React.FC = () => {
// //   return (
// //     <DashboardLayout userRole="user">
// //       <Suspense fallback={<div>Loading...</div>}>
// //         <Routes>
// //           <Route index element={<UserDashboardHome />} />
// //           <Route path="find-doctors" element={<FindDoctorsDashboard />} />
// //           <Route path="appointments" element={<MyAppointments />} />
// //           <Route path="prescriptions" element={<MyPrescriptions />} />
// //           <Route path="complaints" element={<Support />} />
// //         </Routes>
// //       </Suspense>
// //     </DashboardLayout>
// //   );
// // };

// // export default UserDashboard;
