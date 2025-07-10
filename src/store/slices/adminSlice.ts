import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../utils/api'
import type { User } from './authSlice'
import type { Doctor, Appointment } from './appointmentSlice'

export interface AdminStats {
  totalUsers: number
  totalDoctors: number
  totalAppointments: number
  totalRevenue: number
  pendingAppointments: number
  completedAppointments: number
}

export interface AdminState {
  stats: AdminStats | null
  users: User[]
  doctors: Doctor[]
  appointments: Appointment[]
  isLoading: boolean
  error: string | null
}

const initialState: AdminState = {
  stats: null,
  users: [],
  doctors: [],
  appointments: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/analytics/summary')
      return response.data.totals
    } catch (error: unknown) {
      const err = error as any
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch admin stats')
    }
  }
)

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/users')
      return response.data.users
    } catch (error: unknown) {
      const err = error as any
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch users')
    }
  }
)

export const fetchAllDoctors = createAsyncThunk(
  'admin/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/doctors')
      return response.data.doctors
    } catch (error: unknown) {
      const err = error as any
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch doctors')
    }
  }
)

export const fetchAllAppointments = createAsyncThunk(
  'admin/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/appointments')
      return response.data.appointments
    } catch (error: unknown) {
      const err = error as any
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch appointments')
    }
  }
)

export const createUser = createAsyncThunk(
  'admin/createUser',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/users', userData)
      return response.data.user
    } catch (error: unknown) {
      const err = error as any
      return rejectWithValue(err.response?.data?.message || 'Failed to create user')
    }
  }
)

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ id, userData }: { id: number; userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${id}`, userData)
      return response.data.user
    } catch (error: unknown) {
      const err = error as any
      return rejectWithValue(err.response?.data?.message || 'Failed to update user')
    }
  }
)

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${id}`)
      return id
    } catch (error: unknown) {
      const err = error as any
      return rejectWithValue(err.response?.data?.message || 'Failed to delete user')
    }
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch users
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // Fetch doctors
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload
      })
      // Fetch appointments
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload
      })
      // Create user
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.user_id === action.payload.user_id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.user_id !== action.payload)
      })
  },
})

export const { clearError } = adminSlice.actions
export default adminSlice.reducer
