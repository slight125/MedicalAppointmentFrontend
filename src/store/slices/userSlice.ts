import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../utils/api'

export interface Prescription {
  prescription_id: number
  appointment_id: number
  doctor_id: number
  patient_id: number
  medicines: string
  notes: string
  issued_at: string
  doctor_name?: string
  appointment_date?: string
}

export interface UserStats {
  totalAppointments: number
  pendingAppointments: number
  completedAppointments: number
  totalPrescriptions: number
  upcomingAppointments: number
}

export interface UserState {
  prescriptions: Prescription[]
  medicalHistory: any[]
  userStats: UserStats | null
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  prescriptions: [],
  medicalHistory: [],
  userStats: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchUserDashboard = createAsyncThunk(
  'user/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/dashboard')
      return response.data
    } catch (error: unknown) {
      const err = error as any
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard')
    }
  }
)

export const fetchUserPrescriptions = createAsyncThunk(
  'user/fetchPrescriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/prescriptions/user')
      return response.data
    } catch (error: unknown) {
      const err = error as any
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch prescriptions')
    }
  }
)

export const fetchMedicalHistory = createAsyncThunk(
  'user/fetchMedicalHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/medical-history')
      return response.data.history
    } catch (error: unknown) {
      const err = error as any
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch medical history')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard
      .addCase(fetchUserDashboard.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserDashboard.fulfilled, (state, action) => {
        state.isLoading = false
        state.userStats = action.payload.stats
      })
      .addCase(fetchUserDashboard.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch prescriptions
      .addCase(fetchUserPrescriptions.fulfilled, (state, action) => {
        state.prescriptions = action.payload
      })
      .addCase(fetchUserPrescriptions.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // Fetch medical history
      .addCase(fetchMedicalHistory.fulfilled, (state, action) => {
        state.medicalHistory = action.payload
      })
      .addCase(fetchMedicalHistory.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { clearError } = userSlice.actions
export default userSlice.reducer
