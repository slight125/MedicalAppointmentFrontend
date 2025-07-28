import { useState, useEffect } from 'react';
import appointmentAPI from '../../utils/api/appointmentAPI';
import prescriptionAPI from '../../utils/api/prescriptionAPI';
import { useNavigate } from 'react-router-dom';

const DOSAGE_SUGGESTIONS = ['500mg', '250mg', '100mg', '5ml', '10ml', '1 tablet', '2 tablets'];

const WritePrescription = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', instructions: '' }]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formTouched, setFormTouched] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch doctor's appointments
    appointmentAPI.getDoctorAppointments?.().then(res => {
      setAppointments(res.data || []);
    });
  }, []);

  useEffect(() => {
    // Fetch medical history for selected patient
    if (selectedAppointment) {
      const appt = appointments.find(a => a.appointment_id === Number(selectedAppointment));
      if (appt?.user_id) {
        // You may need to implement fetchMedicalHistoryByUserId in your API utils
        fetch(`/api/medical-history/user/${appt.user_id}`)
          .then(res => res.json())
          .then(data => setMedicalHistory(data.records || []));
      }
    } else {
      setMedicalHistory([]);
    }
  }, [selectedAppointment, appointments]);

  const handleMedicineChange = (idx: number, field: string, value: string) => {
    setMedicines(meds => meds.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const addMedicine = () => setMedicines([...medicines, { name: '', dosage: '', instructions: '' }]);
  const removeMedicine = (idx: number) => setMedicines(meds => meds.filter((_, i) => i !== idx));

  const validateForm = () => {
    if (!selectedAppointment) return false;
    if (medicines.length === 0) return false;
    for (const med of medicines) {
      if (!med.name.trim() || !med.dosage.trim() || !med.instructions.trim()) return false;
    }
    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormTouched(true);
    if (!validateForm()) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const appt = appointments.find(a => a.appointment_id === Number(selectedAppointment));
      await prescriptionAPI.addPrescription({
        appointment_id: appt.appointment_id,
        doctor_id: appt.doctor_id,
        patient_id: appt.user_id,
        medicines,
        notes,
      });
      setSuccess('Prescription created successfully!');
      setTimeout(() => navigate('/dashboard/prescriptions'), 1500);
    } catch (err: any) {
      setError('Failed to create prescription.');
    } finally {
      setLoading(false);
    }
  };

  const selectedAppt = appointments.find(a => a.appointment_id === Number(selectedAppointment));

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Write Prescription</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Appointment</label>
          <select
            className="select select-bordered w-full"
            value={selectedAppointment}
            onChange={e => setSelectedAppointment(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            {appointments.map(appt => (
              <option key={appt.appointment_id} value={appt.appointment_id}>
                {appt.user?.firstname} {appt.user?.lastname} - {appt.appointment_date} {appt.time_slot}
              </option>
            ))}
          </select>
          {selectedAppt && (
            <div className="mt-2 p-2 bg-gray-50 rounded">
              <div><b>Patient:</b> {selectedAppt.user?.firstname} {selectedAppt.user?.lastname}</div>
              <div><b>Date:</b> {selectedAppt.appointment_date} <b>Time:</b> {selectedAppt.time_slot}</div>
              <div><b>Type:</b> {selectedAppt.type || selectedAppt.appointment_status}</div>
              {medicalHistory.length > 0 && (
                <div className="mt-2">
                  <b>Medical History:</b>
                  <ul className="list-disc ml-6">
                    {medicalHistory.map((rec, idx) => (
                      <li key={idx}>{rec.condition || rec.diagnosis || rec.notes}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Medicines</label>
          {medicines.map((med, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input
                className={`input input-bordered flex-1 ${formTouched && !med.name.trim() ? 'border-red-500' : ''}`}
                placeholder="Name"
                value={med.name}
                list={`medicines-list-${idx}`}
                onChange={e => handleMedicineChange(idx, 'name', e.target.value)}
                required
              />
              <datalist id={`medicines-list-${idx}`}>
                {['Lisinopril', 'Metformin', 'Albuterol', 'Sumatriptan', 'Cetirizine',
                  'Amoxicillin', 'Omeprazole', 'Sertraline', 'Ibuprofen', 'Oseltamivir',
                  'Paracetamol', 'Aspirin', 'Atorvastatin', 'Simvastatin', 'Azithromycin'].map(medName => <option key={medName} value={medName} />)}
              </datalist>
              <input
                className={`input input-bordered w-24 ${formTouched && !med.dosage.trim() ? 'border-red-500' : ''}`}
                placeholder="Dosage"
                value={med.dosage}
                list={`dosage-list-${idx}`}
                onChange={e => handleMedicineChange(idx, 'dosage', e.target.value)}
                required
              />
              <datalist id={`dosage-list-${idx}`}>
                {DOSAGE_SUGGESTIONS.map(dose => <option key={dose} value={dose} />)}
              </datalist>
              <input
                className={`input input-bordered flex-1 ${formTouched && !med.instructions.trim() ? 'border-red-500' : ''}`}
                placeholder="Instructions"
                value={med.instructions}
                onChange={e => handleMedicineChange(idx, 'instructions', e.target.value)}
                required
              />
              <button type="button" className="btn btn-error btn-sm" onClick={() => removeMedicine(idx)} disabled={medicines.length === 1}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-primary btn-sm" onClick={addMedicine}>Add Medicine</button>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Notes</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading || !validateForm()}>
          {loading ? 'Saving...' : 'Save Prescription'}
        </button>
      </form>
    </div>
  );
};

export default WritePrescription; 