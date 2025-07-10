import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { FileText, Plus, Edit, Trash2, Search, Calendar, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

  // Mock data for development
  const mockMedicalHistory: MedicalRecord[] = [
    {
      id: '1',
      patientId: user?.user_id?.toString() || '1',
      patientName: user ? `${user.firstname} ${user.lastname}` : 'John Doe',
      doctorId: '1',
      doctorName: 'Dr. Sarah Wilson',
      condition: 'Hypertension',
      diagnosis: 'Essential hypertension, stage 1',
      treatment: 'Lifestyle modifications and medication',
      medications: 'Lisinopril 10mg daily, Hydrochlorothiazide 25mg daily',
      notes: 'Patient responds well to medication. Blood pressure stable.',
      dateCreated: '2024-01-15',
      dateUpdated: '2024-02-20'
    },
    {
      id: '2',
      patientId: user?.user_id?.toString() || '1',
      patientName: user ? `${user.firstname} ${user.lastname}` : 'John Doe',
      doctorId: '2',
      doctorName: 'Dr. Michael Chen',
      condition: 'Type 2 Diabetes',
      diagnosis: 'Type 2 diabetes mellitus with good glycemic control',
      treatment: 'Metformin therapy and dietary management',
      medications: 'Metformin 500mg twice daily',
      notes: 'HbA1c levels within target range. Continue current regimen.',
      dateCreated: '2024-03-10',
      dateUpdated: '2024-03-10'
    }
  ];

  useEffect(() => {
    // TODO: Replace with real API call
    // dispatch(fetchMedicalHistory());
  }, [dispatch]);

  const filteredRecords = mockMedicalHistory.filter(record =>
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
    <div className="min-h-screen bg-base-100">
      <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 xl:px-16 2xl:px-20 py-6 lg:py-8 xl:py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 lg:mb-12 xl:mb-16 gap-6 lg:gap-8">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-base-content flex items-center gap-4 lg:gap-6 mb-4 leading-tight">
              <FileText className="h-8 w-8 lg:h-12 lg:w-12 xl:h-16 xl:w-16 text-primary" />
              Medical History
            </h1>
            <p className="text-base-content/70 text-lg lg:text-xl xl:text-2xl">
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
        <div className="card bg-base-200 shadow-lg mb-8 lg:mb-12 border border-gray-100">
          <div className="card-body p-6 lg:p-8 xl:p-10">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-10">
              <div className="form-control flex-1">
                <div className="input-group">
                  <span className="px-4 lg:px-6">
                    <Search className="h-6 w-6 lg:h-7 lg:w-7" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by condition, diagnosis, or doctor..."
                    className="input input-bordered w-full text-lg lg:text-xl xl:text-2xl py-4 lg:py-5"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Records */}
        <div className="grid gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
          {filteredRecords.map((record) => (
            <div key={record.id} className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-base-content mb-2">
                      {record.condition}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-base-content/70">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Dr. {record.doctorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(record.dateCreated).toLocaleDateString()}
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-base-content mb-1">Diagnosis</h4>
                    <p className="text-base-content/80">{record.diagnosis}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content mb-1">Treatment</h4>
                    <p className="text-base-content/80">{record.treatment}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content mb-1">Medications</h4>
                    <p className="text-base-content/80">{record.medications}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content mb-1">Notes</h4>
                    <p className="text-base-content/80">{record.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-base-content/70 mb-2">
                No Medical Records Found
              </h3>
              <p className="text-base-content/50">
                {searchTerm ? 'Try adjusting your search criteria' : 'No medical records available'}
              </p>
            </div>
          )}
        </div>

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
