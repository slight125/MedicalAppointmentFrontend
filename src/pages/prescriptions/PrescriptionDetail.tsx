import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { fetchPrescriptionById } from '../../store/slices/prescriptionSlice';
import { Clock, Pill } from 'lucide-react';

const PrescriptionDetail: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentPrescription, isLoading, error } = useSelector((state: RootState) => state.prescriptions);

  useEffect(() => {
    if (appointmentId) {
      dispatch(fetchPrescriptionById(Number(appointmentId)));
    }
  }, [dispatch, appointmentId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading prescription: {error}</p>
        </div>
      </div>
    );
  }

  if (!currentPrescription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-700">No prescription found for this appointment.</p>
        </div>
      </div>
    );
  }

  const medicines = Array.isArray(currentPrescription.medicines)
    ? currentPrescription.medicines
    : (() => { try { return JSON.parse(currentPrescription.medicines as string); } catch { return []; } })();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Prescription Details</h2>
        <div className="mb-4">
          <span className="font-semibold">Prescription ID:</span> {currentPrescription.prescription_id}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Doctor:</span> {currentPrescription.doctor_name || currentPrescription.doctor_id}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Patient:</span> {currentPrescription.patient_id}
        </div>
        <div className="mb-4 flex items-center text-gray-600">
          <Clock className="h-5 w-5 mr-2" />
          <span className="font-semibold">Issued At:</span> {currentPrescription.issued_at ? new Date(currentPrescription.issued_at).toLocaleString() : 'N/A'}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Medicines:</span>
          <ul className="list-disc ml-6 mt-2">
            {medicines.length > 0 ? medicines.map((med: any, idx: number) => (
              <li key={idx} className="flex items-center">
                <Pill className="h-4 w-4 mr-2 text-blue-500" />
                {typeof med === 'string' ? med : med.name || 'Unknown medicine'}
                {med.dosage && <span className="ml-2 text-gray-500">({med.dosage})</span>}
              </li>
            )) : <li>No medicines listed</li>}
          </ul>
        </div>
        {currentPrescription.notes && (
          <div className="mb-4">
            <span className="font-semibold">Notes:</span>
            <div className="bg-gray-50 rounded-lg p-4 mt-2 text-gray-700">{currentPrescription.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionDetail; 