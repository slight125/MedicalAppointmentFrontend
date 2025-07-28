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

export const adminDeleteAppointment = async (appointmentId: string) => {
  const token = localStorage.getItem('token');
  const response = await api.delete(`/appointments/${appointmentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const adminUpdateAppointmentStatus = async (appointmentId: string, status: string) => {
  const token = localStorage.getItem('token');
  const response = await api.patch(`/appointments/${appointmentId}/override`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
