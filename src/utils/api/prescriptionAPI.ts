import { api } from "../api";

const API_BASE = "/prescriptions";

const prescriptionAPI = {
  updatePrescription: async (id: string | number, data: any) => {
    const res = await api.patch(`${API_BASE}/${id}`, data);
    return res.data;
  },
  deletePrescription: async (id: string | number) => {
    const res = await api.delete(`${API_BASE}/${id}`);
    return res.data;
  },
  getDoctorPrescriptions: async () => {
    const res = await api.get(`${API_BASE}/doctor`);
    return { data: res.data };
  },
  addPrescription: async (data: any) => {
    const res = await api.post(`${API_BASE}/`, data);
    return res.data;
  },
};

export default prescriptionAPI; 