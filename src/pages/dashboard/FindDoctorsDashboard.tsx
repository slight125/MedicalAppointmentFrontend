import React, { useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import api from '../../utils/api';

const FindDoctorsDashboard: React.FC = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [specialization, setSpecialization] = useState('');

  useEffect(() => {
    api.get('/doctors')
      .then(res => {
        setDoctors(res.data.doctors || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load doctors');
        setLoading(false);
      });
  }, []);

  const specializations = Array.from(new Set(doctors.map((doc: any) => doc.specialization)));
  const filteredDoctors = specialization
    ? doctors.filter((doc: any) => doc.specialization === specialization)
    : doctors;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2"><FiUsers /> Find Doctors</h2>
      <div className="mb-4">
        <label className="font-medium mr-2">Browse by Specialization:</label>
        <select
          className="select select-bordered"
          value={specialization}
          onChange={e => setSpecialization(e.target.value)}
        >
          <option value="">All Specializations</option>
          {specializations.map((spec, idx) => (
            <option key={idx} value={spec}>{spec}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div>Loading doctors...</div>
      ) : error ? (
        <div className="text-error">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor: any) => (
            <div key={doctor.doctor_id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow p-6">
              <div className="font-bold text-lg mb-2">Dr. {doctor.first_name} {doctor.last_name}</div>
              <div className="text-base-content/70 mb-1">Specialization: <span className="font-semibold">{doctor.specialization}</span></div>
              <div className="text-sm">Contact: {doctor.contact_phone}</div>
              <div className="text-xs mt-2">Available: {doctor.available_days}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindDoctorsDashboard;
