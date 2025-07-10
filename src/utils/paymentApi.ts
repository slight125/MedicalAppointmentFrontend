import api from './api'

export interface PaymentSessionRequest {
  appointment_id: string
  amount: number
}

export interface PaymentSessionResponse {
  url: string
}

export interface PaymentConfirmRequest {
  appointment_id: string
  amount: number
  transaction_id: string
  payment_status: 'completed' | 'failed'
}

export interface Payment {
  id: string
  appointment_id: string
  amount: number
  transaction_id: string
  payment_status: 'completed' | 'pending' | 'failed' | 'refunded'
  created_at: string
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
export const getPaymentByAppointment = async (appointmentId: string): Promise<Payment | null> => {
  try {
    const response = await api.get(`/payments/appointment/${appointmentId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching payment by appointment:', error)
    return null
  }
}
