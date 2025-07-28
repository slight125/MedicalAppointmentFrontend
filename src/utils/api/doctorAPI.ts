import { api } from "../api";

export const doctorAPI = {
  getNotifications: async () => {
    const res = await api.get("/doctor/notifications");
    return { data: res.data };
  },
  getPerformance: async () => {
    const res = await api.get("/doctor/performance");
    return { data: res.data };
  },
  updateFee: async (doctor_id: number, fee: number) => {
    const res = await api.patch(`/doctor/${doctor_id}/fee`, { fee });
    return res.data;
  },
  getDoctorProfileByUserId: async (user_id: number) => {
    const res = await api.get(`/doctor/profile-by-user/${user_id}`);
    return res.data;
  },
}; 