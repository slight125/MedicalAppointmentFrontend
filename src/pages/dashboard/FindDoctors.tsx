import React, { useEffect, useState } from 'react';
import { FiUsers, FiSearch } from 'react-icons/fi';
import appointmentAPI from '../../utils/api/appointmentAPI';
import { useNavigate } from 'react-router-dom';

const FindDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    appointmentAPI.getDoctors()
      .then((res: any) => {
        let doctorsList = res.data?.doctors || res.data || [];
        if (!Array.isArray(doctorsList)) doctorsList = [];
        setDoctors(doctorsList);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load doctors');
        setLoading(false);
      });
  }, []);

  // Get unique specializations
  const specializations = Array.from(new Set(doctors.map((doc: any) => doc.specialization)));

  // Filter doctors by selected specialization and search
  const filteredDoctors = doctors.filter((doc: any) => {
    const matchesSpecialization = specialization ? doc.specialization === specialization : true;
    const matchesSearch = search
      ? (`${doc.first_name} ${doc.last_name}`.toLowerCase().includes(search.toLowerCase()))
      : true;
    return matchesSpecialization && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-3 mb-4 text-blue-700">
        <FiUsers className="w-6 h-6" /> Find Doctors
      </h2>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-4 mb-6 border border-gray-200 dark:border-gray-800">
        <div className="flex-1">
          <label className="font-medium mr-2">Search by Name:</label>
          <input
            type="text"
            className="input input-bordered w-full focus:ring-2 focus:ring-blue-400"
            placeholder="Enter doctor's name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="font-medium mr-2">Browse by Specialization:</label>
          <select
            className="select select-bordered w-full focus:ring-2 focus:ring-blue-400"
            value={specialization}
            onChange={e => setSpecialization(e.target.value)}
          >
            <option value="">All Specializations</option>
            {specializations.map((spec, idx) => (
              <option key={idx} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div>Loading doctors...</div>
      ) : error ? (
        <div className="text-error">{error}</div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-gray-500 text-center py-12">
          <FiSearch className="w-12 h-12 mx-auto mb-2 text-blue-300" />
          <div className="text-lg font-semibold">No doctors found.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor: any) => (
            <div
              key={doctor.doctor_id}
              className="bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-6 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-700">
                  {doctor.first_name?.[0]}{doctor.last_name?.[0]}
                </div>
                <div>
                  <div className="font-bold text-lg text-blue-800 dark:text-blue-200 mb-1">{doctor.first_name} {doctor.last_name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{doctor.specialization}</span>
                  </div>
                </div>
              </div>
              <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="block mb-1"><span className="font-medium">Contact:</span> {doctor.contact_phone}</span>
                <span className="block"><span className="font-medium">Available:</span> {doctor.available_days}</span>
              </div>
              <button
                className="btn btn-primary mt-4 font-semibold text-base py-2 px-6 rounded-lg shadow-md hover:scale-105 transition-transform"
                onClick={() => navigate(`/dashboard/appointments/book?doctor_id=${doctor.doctor_id}`)}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindDoctors;
