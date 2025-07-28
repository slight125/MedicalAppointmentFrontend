import { api } from "../api";

const API_BASE = "/appointments";

const appointmentAPI = {
  getAppointmentsStats: async () => {
    const res = await api.get(`${API_BASE}/stats`);
    return { data: res.data };
  },
  getDoctors: async () => {
    const res = await api.get(`${API_BASE}/doctors`);
    return { data: res.data };
  },
  getDoctorAppointments: async () => {
    const res = await api.get(`${API_BASE}/doctor`);
    return { data: res.data };
  },
  addAppointment: async (data: any) => {
    const res = await api.post(`${API_BASE}/`, data);
    return res.data;
  },
  updateAppointment: async (id: string | number, data: any) => {
    const res = await api.patch(`${API_BASE}/${id}`, data);
    return res.data;
  },
  deleteAppointment: async (id: string | number) => {
    const res = await api.delete(`${API_BASE}/${id}`);
    return res.data;
  },
};

export default appointmentAPI;