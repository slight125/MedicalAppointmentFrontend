import React, { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '../../store';
import { FileText, Edit, Trash2, Search, Calendar, User, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchMedicalHistory } from '../../utils/api';
import prescriptionAPI from '../../utils/api/prescriptionAPI';
import appointmentAPI from '../../utils/api/appointmentAPI';

interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  condition: string;
  diagnosis: string;
  treatment: string;
  medications: string;
  notes: string;
  dateCreated: string;
  dateUpdated: string;
}

const MedicalHistory: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Reusable function to fetch and process medical history data
  const fetchAndProcessData = useCallback(async () => {
    try {
      const res: any = await fetchMedicalHistory();
      const { appointments = [], prescriptions = [] } = res.data || {};
      
      const apptRecords = appointments.map((appt: any) => ({
        id: `appt-${appt.appointment_id}`,
        patientId: appt.user_id?.toString() || '',
        patientName: user ? `${user.firstname} ${user.lastname}` : 'User',
        doctorId: appt.doctor?.doctor_id?.toString() || '',
        doctorName: appt.doctor ? `${appt.doctor.first_name} ${appt.doctor.last_name}` : '',
        condition: 'Appointment',
        diagnosis: appt.diagnosis || '',
        treatment: appt.treatment || '',
        medications: appt.medications || '',
        notes: appt.notes || '',
        dateCreated: appt.appointment_date,
        dateUpdated: appt.updated_at,
      }));
      
      const prescRecords = prescriptions.map((presc: any) => ({
        id: `presc-${presc.prescription_id}`,
        patientId: presc.patient_id?.toString() || '',
        patientName: user ? `${user.firstname} ${user.lastname}` : 'User',
        doctorId: presc.doctor?.doctor_id?.toString() || '',
        doctorName: presc.doctor ? `${presc.doctor.first_name} ${presc.doctor.last_name}` : '',
        condition: 'Prescription',
        diagnosis: presc.diagnosis || '',
        treatment: presc.treatment || '',
        medications: Array.isArray(presc.medicines) ? presc.medicines.map((m: any) => m.name).join(', ') : presc.medicines || '',
        notes: presc.notes || '',
        dateCreated: presc.issued_at,
        dateUpdated: presc.updated_at,
      }));
      
      setRecords([...apptRecords, ...prescRecords]);
      setError('');
    } catch (err) {
      console.error('Failed to fetch medical history:', err);
      setError('Failed to load medical history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    setLoading(true);
    fetchAndProcessData();
  }, [fetchAndProcessData]);

  // Auto-refresh every 30 seconds to keep data current
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        setRefreshing(true);
        fetchAndProcessData();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchAndProcessData, loading, refreshing]);

  // Manual refresh function
  const handleRefresh = () => {
    setRefreshing(true);
    fetchAndProcessData();
    toast.success('Medical history refreshed');
  };

  const filteredRecords = records.filter(record =>
    record.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (record?: MedicalRecord) => {
    if (record) {
      // setSelectedRecord(record); // Removed
      // setFormData({ // Removed
      //   condition: record.condition,
      //   diagnosis: record.diagnosis,
      //   treatment: record.treatment,
      //   medications: record.medications,
      //   notes: record.notes
      // });
      // setIsEditing(true); // Removed
    } else {
      // setSelectedRecord(null); // Removed
      // setFormData({ // Removed
      //   condition: '',
      //   diagnosis: '',
      //   treatment: '',
      //   medications: '',
      //   notes: ''
      // });
      // setIsEditing(false); // Removed
    }
  };

  // const handleCloseModal = () => { // Removed
  //   setSelectedRecord(null);
  //   setFormData({
  //     condition: '',
  //     diagnosis: '',
  //     treatment: '',
  //     medications: '',
  //     notes: ''
  //   });
  // };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this medical record?')) return;
    try {
      if (id.startsWith('presc-')) {
        await prescriptionAPI.deletePrescription(id.replace('presc-', ''));
        toast.success('Medical record deleted successfully');
      } else if (id.startsWith('appt-')) {
        await appointmentAPI.deleteAppointment(id.replace('appt-', ''));
        toast.success('Medical record deleted successfully');
      } else {
        toast.error('Invalid record type.');
      }
      // Refresh data after deletion
      setRefreshing(true);
      fetchAndProcessData();
    } catch {
      toast.error('Failed to delete medical record');
    }
  };

  const sampleRecord: MedicalRecord = {
    id: 'sample-1',
    patientId: '1',
    patientName: 'Sample Patient',
    doctorId: '1',
    doctorName: 'Sample Doctor',
    condition: 'Appointment',
    diagnosis: 'Hypertension',
    treatment: 'Lifestyle modification and medication',
    medications: 'Lisinopril',
    notes: 'Patient is responding well to treatment.',
    dateCreated: new Date().toISOString(),
    dateUpdated: new Date().toISOString(),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-purple-700 dark:text-purple-400 flex items-center gap-3">
            <FileText className="h-10 w-10 text-purple-400 dark:text-purple-300" />
            Medical History
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">View and manage medical records and history</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn btn-outline btn-primary px-4 py-2 rounded-lg shadow flex items-center gap-2"
          title="Refresh medical history"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      <div className="flex items-center gap-2 mb-8">
        <Search className="w-6 h-6 text-gray-500 dark:text-gray-300" />
        <input
          type="text"
          className="input input-bordered w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Search by condition, diagnosis, or doctor..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <span className="ml-3 text-lg">Loading medical history...</span>
        </div>
      ) : error ? (
        <div className="alert alert-error mb-4 dark:bg-red-900/30 dark:border-red-700 dark:text-red-200">
          <span>{error}</span>
          <button onClick={handleRefresh} className="btn btn-sm btn-outline">Retry</button>
        </div>
      ) : (
        <div className="grid gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
          {(filteredRecords.length > 0 ? filteredRecords : [sampleRecord]).map((record) => (
            <div
              key={record.id}
              className="rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 md:p-8 mb-4 transition-transform hover:scale-[1.015] hover:shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {record.condition === 'Prescription' ? (
                      <FileText className="h-6 w-6 text-fuchsia-500" />
                    ) : (
                      <Calendar className="h-6 w-6 text-blue-500" />
                    )}
                    <h3 className={`text-xl font-bold ${record.condition === 'Prescription' ? 'text-fuchsia-600' : 'text-blue-600'}`}>{record.condition}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span className="font-medium">Dr. {record.doctorName || 'N/A'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {record.dateCreated ? new Date(record.dateCreated).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(record)}
                    className="btn btn-sm btn-ghost"
                    title="Edit record"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="btn btn-sm btn-ghost text-error"
                    title="Delete record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-1 text-gray-700 dark:text-gray-200">Diagnosis</h4>
                  <p className="text-gray-600 dark:text-gray-300">{record.diagnosis || <span className="italic text-gray-400">-</span>}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-1 text-gray-700 dark:text-gray-200">Treatment</h4>
                  <p className="text-gray-600 dark:text-gray-300">{record.treatment || <span className="italic text-gray-400">-</span>}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-1 text-gray-700 dark:text-gray-200">Medications</h4>
                  <p className="text-gray-600 dark:text-gray-300">{record.medications || <span className="italic text-gray-400">-</span>}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-1 text-gray-700 dark:text-gray-200">Notes</h4>
                  <p className="text-gray-600 dark:text-gray-300">{record.notes || <span className="italic text-gray-400">-</span>}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal for Add/Edit Record would go here */}
    </div>
  );
};

export default MedicalHistory;
