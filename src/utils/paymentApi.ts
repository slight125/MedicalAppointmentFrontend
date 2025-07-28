import { api } from "./api";

export interface PaymentSessionRequest {
  appointment_id: number
  amount: number
}

export interface PaymentSessionResponse {
  url: string
}

export interface PaymentConfirmRequest {
  appointment_id: number
  amount: number
  transaction_id: string
  payment_status: 'completed' | 'failed'
}

export interface Payment {
  payment_id: number
  appointment_id: number
  amount: string
  payment_status: 'completed' | 'pending' | 'failed' | 'refunded'
  transaction_id: string
  payment_date: string | null
  created_at: string
  updated_at: string
  appointment?: {
    appointment_id: number
    user_id: number
    doctor_id: number
    appointment_date: string
    time_slot: string
    total_amount: string
    appointment_status: string
    paid: boolean
    diagnosis: string | null
    treatment: string | null
    medications: string | null
    notes: string | null
    created_at: string
    updated_at: string
    user?: {
      user_id: number
      firstname: string
      lastname: string
      email: string
      contact_phone: string
      address: string
      role: string
      created_at: string
      updated_at: string
    }
    doctor?: {
      doctor_id: number
      user_id: number
      first_name: string
      last_name: string
      specialization: string
      license_number: string
      experience_years: number
      consultation_fee: string
      created_at: string
      updated_at: string
    }
  }
}

// Create Stripe payment session
export const createPaymentSession = async (data: PaymentSessionRequest): Promise<PaymentSessionResponse> => {
  try {
    const response = await api.post('/payments/create', data)
    return response.data
  } catch (error) {
    console.error('Error creating payment session:', error)
    throw error
  }
}

// Confirm payment after Stripe success
export const confirmPayment = async (data: PaymentConfirmRequest): Promise<void> => {
  try {
    await api.post('/payments/confirm', data)
  } catch (error) {
    console.error('Error confirming payment:', error)
    throw error
  }
}

// Get payment history for user
export const getPaymentHistory = async (): Promise<Payment[]> => {
  try {
    const response = await api.get('/payments/history')
    return response.data
  } catch (error) {
    console.error('Error fetching payment history:', error)
    throw error
  }
}

// Get payment details by appointment ID
export const getPaymentByAppointment = async (appointmentId: number): Promise<Payment | null> => {
  try {
    const response = await api.get(`/payments/appointment/${appointmentId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching payment by appointment:', error)
    return null
  }
}

export const updatePayment = async (id: string | number, data: any): Promise<any> => {
  const response = await api.patch(`/payments/${id}`, data);
  return response.data;
};

export const deletePayment = async (id: string | number): Promise<any> => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};
