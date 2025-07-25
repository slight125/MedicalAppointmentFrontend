import axios from "axios";

const API_BASE = "/api/prescriptions";

const prescriptionAPI = {
  updatePrescription: async (id: string | number, data: any) => {
    const res = await axios.patch(`${API_BASE}/${id}`, data);
    return res.data;
  },
  deletePrescription: async (id: string | number) => {
    const res = await axios.delete(`${API_BASE}/${id}`);
    return res.data;
  },
};

export default prescriptionAPI; 