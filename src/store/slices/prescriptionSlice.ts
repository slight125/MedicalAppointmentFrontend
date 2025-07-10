import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../utils/api'

export interface Medicine {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

export interface Prescription {
  prescription_id: number
  appointment_id: number
  doctor_id: number
  patient_id: number
  medicines: string | Medicine[]
  notes: string
  issued_at: string
  created_at: string
  // Additional fields for formatted responses
  appointment_date?: string
  appointment_time?: string
  patient_name?: string
  patient_lastname?: string
  patient_full_name?: string
  doctor_name?: string
}

export interface PrescriptionState {
  prescriptions: Prescription[]
  currentPrescription: Prescription | null
  isLoading: boolean
  error: string | null
}

const initialState: PrescriptionState = {
  prescriptions: [],
  currentPrescription: null,
  isLoading: false,
  error: null,
}

// User: Get their prescriptions
export const fetchUserPrescriptions = createAsyncThunk(
  'prescriptions/fetchUserPrescriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/prescriptions/user')
      return response.data
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch prescriptions')
    }
  }
)

// Doctor: Get prescriptions they've issued
export const fetchDoctorPrescriptions = createAsyncThunk(
  'prescriptions/fetchDoctorPrescriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/prescriptions/doctor')
      return response.data
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch doctor prescriptions')
    }
  }
)

// Create prescription (Doctor only)
export const createPrescription = createAsyncThunk(
  'prescriptions/createPrescription',
  async (prescriptionData: {
    appointment_id: number
    medicines: Medicine[]
    notes: string
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/prescriptions', {
        ...prescriptionData,
        medicines: JSON.stringify(prescriptionData.medicines)
      })
      return response.data.prescription
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || 'Failed to create prescription')
    }
  }
)

// Get single prescription by ID
export const fetchPrescriptionById = createAsyncThunk(
  'prescriptions/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/prescriptions/${id}`)
      return response.data
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch prescription')
    }
  }
)

// Download prescription PDF
export const downloadPrescriptionPDF = createAsyncThunk(
  'prescriptions/downloadPDF',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/prescriptions/${id}/pdf`, {
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `prescription_${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return { id, success: true }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || 'Failed to download prescription')
    }
  }
)

const prescriptionSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentPrescription: (state, action) => {
      state.currentPrescription = action.payload
    },
    clearCurrentPrescription: (state) => {
      state.currentPrescription = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user prescriptions
      .addCase(fetchUserPrescriptions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserPrescriptions.fulfilled, (state, action) => {
        state.isLoading = false
        state.prescriptions = action.payload
      })
      .addCase(fetchUserPrescriptions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch doctor prescriptions
      .addCase(fetchDoctorPrescriptions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDoctorPrescriptions.fulfilled, (state, action) => {
        state.isLoading = false
        state.prescriptions = action.payload
      })
      .addCase(fetchDoctorPrescriptions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create prescription
      .addCase(createPrescription.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.isLoading = false
        state.prescriptions.unshift(action.payload)
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch prescription by ID
      .addCase(fetchPrescriptionById.fulfilled, (state, action) => {
        state.currentPrescription = action.payload
      })
      .addCase(fetchPrescriptionById.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // Download PDF
      .addCase(downloadPrescriptionPDF.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { clearError, setCurrentPrescription, clearCurrentPrescription } = prescriptionSlice.actions
export default prescriptionSlice.reducer
