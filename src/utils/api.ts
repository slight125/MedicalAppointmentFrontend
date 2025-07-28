import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return false;
  }
}

// Request interceptor to add auth token and check expiry
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new axios.Cancel('Token expired, auto-logout');
      }
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const fetchUserComplaints = async () => {
  return api.get('/support'); // For user, backend should filter by user
};

export const fetchAdminComplaints = async () => {
  return api.get('/support/all');
};

export const submitComplaint = async (data: { related_appointment_id?: number; subject: string; description: string; category?: string; priority?: string }) => {
  return api.post('/support', data);
};

export const deleteComplaint = async (id: string | number) => {
  return api.delete(`/support/${id}`);
};

export const updateComplaintStatus = async (id: string | number, status: string) => {
  return api.patch(`/support/${id}/status`, { status });
};

export const fetchMedicalHistory = async () => {
  return api.get('/medical-history/self');
};

export const fetchAdminSummaryAnalytics = async () => {
  return api.get('/admin/analytics/summary');
};
export const fetchAdminBookingTrends = async (range = 30) => {
  return api.get(`/admin/analytics/bookings?range=${range}`);
};
export const fetchAdminRevenueAnalytics = async (range = 30) => {
  return api.get(`/admin/analytics/revenue?range=${range}`);
};
export const fetchAdminAppointmentStatus = async () => {
  return api.get('/admin/analytics/appointment-status');
};

export const fetchAllUsers = async () => {
  return api.get('/admin/users');
};
export const downloadReport = async (type: string) => {
  return api.get(`/admin/reports/${type}.csv`, { responseType: 'blob' });
};

export const updateUser = async (id: string | number, data: any) => {
  return api.patch(`/admin/users/${id}`, data);
};

export const deleteUser = async (id: string | number) => {
  return api.delete(`/admin/users/${id}`);
};

export const fetchComplaintMessages = async (id: string | number) => {
  return api.get(`/support/${id}/messages`);
};

export const addComplaintMessage = async (id: string | number, message: string) => {
  return api.post(`/support/${id}/messages`, { message });
};

export default api
