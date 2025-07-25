import axios from "axios";

const API_BASE = "/api/appointments";

const appointmentAPI = {
  getAppointmentsStats: async () => {
    const res = await axios.get(`${API_BASE}/stats`);
    return { data: res.data }; // match expected frontend format
  },
  getDoctors: async () => {
    const res = await axios.get(`${API_BASE}/doctors`);
    return { data: res.data };
  },
  updateAppointment: async (id: string | number, data: any) => {
    const res = await axios.patch(`${API_BASE}/${id}`, data);
    return res.data;
  },
  deleteAppointment: async (id: string | number) => {
    const res = await axios.delete(`${API_BASE}/${id}`);
    return res.data;
  },
};

export default appointmentAPI;