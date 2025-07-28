import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../utils/api'

export interface Doctor {
  doctor_id: number
  first_name: string
  last_name: string
  specialization: string
  contact_phone: string
  available_days: string
}

export interface Appointment {
  appointment_id: number
  user_id: number
  doctor_id: number
  appointment_date: string
  time_slot: string
  total_amount: string
  appointment_status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'
  paid: boolean
  created_at: string
  updated_at: string
  doctor?: Doctor
  patient_full_name?: string
}

export interface AppointmentState {
  appointments: Appointment[]
  doctors: Doctor[]
  currentAppointment: Appointment | null
  isLoading: boolean
  error: string | null
}

const initialState: AppointmentState = {
  appointments: [],
  doctors: [],
  currentAppointment: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/appointments')
      // Backend returns appointments directly, not wrapped in appointments property
      return response.data
    } catch (error: unknown) {
      return rejectWithValue((error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch appointments')
    }
  }
)

export const fetchDoctors = createAsyncThunk(
  'appointments/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/appointments/doctors')
      return response.data.doctors
    } catch (error: unknown) {
      return rejectWithValue((error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch doctors')
    }
  }
)

export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async (appointmentData: {
    doctor_id: number
    appointment_date: string
    time_slot: string
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/appointments', appointmentData)
      return response.data.appointment
    } catch (error: unknown) {
      return rejectWithValue((error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to book appointment')
    }
  }
)

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/appointments/${id}/status`, { status })
      return response.data.appointment
    } catch (error: unknown) {
      return rejectWithValue((error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update appointment')
    }
  }
)

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentAppointment: (state, action) => {
      state.currentAppointment = action.payload
    },
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.isLoading = false
        state.appointments = action.payload
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch doctors
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // Book appointment
      .addCase(bookAppointment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.isLoading = false
        state.appointments.unshift(action.payload)
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update appointment status
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          apt => apt.appointment_id === action.payload.appointment_id
        )
        if (index !== -1) {
          state.appointments[index] = action.payload
        }
      })
  },
})

export const { clearError, setCurrentAppointment, setAppointments } = appointmentSlice.actions
export default appointmentSlice.reducer
