import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { FileText, Plus, Edit, Trash2, Search, Calendar, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchMedicalHistory } from '../../utils/api';

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
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    condition: '',
    diagnosis: '',
    treatment: '',
    medications: '',
    notes: ''
  });
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchMedicalHistory()
      .then((res: any) => {
        // Flatten appointments and prescriptions into MedicalRecord[]
        const { appointments = [], prescriptions = [] } = res.data || {};
        const apptRecords = appointments.map((appt: any) => ({
          id: `appt-${appt.appointment_id}`,
          patientId: appt.user_id?.toString() || '',
          patientName: user ? `${user.firstname} ${user.lastname}` : 'User',
          doctorId: appt.doctor?.doctor_id?.toString() || '',
          doctorName: appt.doctor ? `${appt.doctor.first_name} ${appt.doctor.last_name}` : '',
          condition: 'Appointment',
          diagnosis: '',
          treatment: '',
          medications: '',
          notes: '',
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
          diagnosis: presc.notes || '',
          treatment: '',
          medications: Array.isArray(presc.medicines) ? presc.medicines.map((m: any) => m.name).join(', ') : '',
          notes: presc.notes || '',
          dateCreated: presc.issued_at,
          dateUpdated: presc.updated_at,
        }));
        setRecords([...apptRecords, ...prescRecords]);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load medical history');
        setLoading(false);
      });
  }, [user]);

  const filteredRecords = records.filter(record =>
    record.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (record?: MedicalRecord) => {
    if (record) {
      setSelectedRecord(record);
      setFormData({
        condition: record.condition,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        medications: record.medications,
        notes: record.notes
      });
      setIsEditing(true);
    } else {
      setSelectedRecord(null);
      setFormData({
        condition: '',
        diagnosis: '',
        treatment: '',
        medications: '',
        notes: ''
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setFormData({
      condition: '',
      diagnosis: '',
      treatment: '',
      medications: '',
      notes: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedRecord) {
        // TODO: Replace with real API call
        // await dispatch(updateMedicalRecord({ id: selectedRecord.id, ...formData }));
        toast.success('Medical record updated successfully');
      } else {
        // TODO: Replace with real API call
        // await dispatch(addMedicalRecord(formData));
        toast.success('Medical record added successfully');
      }
      handleCloseModal();
    } catch {
      toast.error('Failed to save medical record');
    }
  };

  const handleDelete = async (_id: string) => {
    if (window.confirm('Are you sure you want to delete this medical record?')) {
      try {
        // TODO: Replace with real API call
        // await dispatch(deleteMedicalRecord(id));
        toast.success('Medical record deleted successfully');
      } catch {
        toast.error('Failed to delete medical record');
      }
    }
  };

  const canEdit = user?.role === 'doctor' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 xl:px-16 2xl:px-20 py-6 lg:py-8 xl:py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 lg:mb-12 xl:mb-16 gap-6 lg:gap-8">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold flex items-center gap-4 lg:gap-6 mb-4 leading-tight text-primary">
              <FileText className="h-8 w-8 lg:h-12 lg:w-12 xl:h-16 xl:w-16" />
              Medical History
            </h1>
            <p className="text-lg lg:text-xl xl:text-2xl">
              View and manage medical records and history
            </p>
          </div>
          {canEdit && (
            <button
              onClick={() => handleOpenModal()}
              className="btn btn-primary gap-3 px-8 lg:px-10 py-4 lg:py-5 text-xl lg:text-2xl w-full lg:w-auto"
            >
              <Plus className="h-6 w-6 lg:h-7 lg:h-7" />
              Add Record
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-10">
            <div className="form-control flex-1">
              <div className="input-group">
                <span className="px-4 lg:px-6">
                  <Search className="h-6 w-6 lg:h-7 lg:w-7" />
                </span>
                <input
                  type="text"
                  placeholder="Search by condition, diagnosis, or doctor..."
                  className="input input-bordered w-full text-lg lg:text-xl xl:text-2xl py-4 lg:py-5 bg-base-100 text-base-content"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Medical Records */}
        {loading ? (
          <div>Loading medical history...</div>
        ) : error ? (
          <div className="text-error">{error}</div>
        ) : (
          <div className="grid gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className={`rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 md:p-8 mb-4 transition-transform hover:scale-[1.015] hover:shadow-2xl relative overflow-hidden`}
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
                  {canEdit && (
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
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold mb-1 text-gray-700 dark:text-gray-200">Diagnosis</h4>
                    <p className="text-gray-600 dark:text-gray-300">{record.diagnosis || <span className="italic text-gray-400">N/A</span>}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold mb-1 text-gray-700 dark:text-gray-200">Treatment</h4>
                    <p className="text-gray-600 dark:text-gray-300">{record.treatment || <span className="italic text-gray-400">N/A</span>}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold mb-1 text-gray-700 dark:text-gray-200">Medications</h4>
                    <p className="text-gray-600 dark:text-gray-300">{record.medications || <span className="italic text-gray-400">N/A</span>}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold mb-1 text-gray-700 dark:text-gray-200">Notes</h4>
                    <p className="text-gray-600 dark:text-gray-300">{record.notes || <span className="italic text-gray-400">N/A</span>}</p>
                  </div>
                </div>
              </div>
            ))}

            {filteredRecords.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 mx-auto max-w-lg">
                <FileText className="h-16 w-16 text-fuchsia-300 dark:text-fuchsia-700 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2 text-fuchsia-700 dark:text-fuchsia-400">
                  No Medical Records Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search criteria.' : 'No medical records available.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg mb-4">
                {isEditing ? 'Edit Medical Record' : 'Add Medical Record'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Condition</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="Enter condition"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Diagnosis</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Enter diagnosis details"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Treatment</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Enter treatment plan"
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Medications</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Enter medications prescribed"
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Notes</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Enter additional notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? 'Update' : 'Add'} Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;
