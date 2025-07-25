import api from './api';

export const adminUpdateAppointmentAmount = async (appointmentId: string, total_amount: number) => {
  const token = localStorage.getItem('token');
  const response = await api.patch(
    `/appointments/${appointmentId}/amount`,
    { total_amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const fetchAllAppointmentsAdmin = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/appointments/admin/all', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
