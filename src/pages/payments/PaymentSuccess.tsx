import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowLeft, Receipt } from 'lucide-react'
import { confirmPayment } from '../../utils/paymentApi'
import toast from 'react-hot-toast'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isConfirming, setIsConfirming] = useState(true)


  useEffect(() => {
    const handlePaymentConfirmation = async () => {
      const sessionId = searchParams.get('session_id')
      const appointmentId = searchParams.get('appointment_id')
      const amount = searchParams.get('amount')

      if (!sessionId || !appointmentId || !amount) {
        toast.error('Missing payment information')
        navigate('/dashboard/appointments')
        return
      }

      try {
        await confirmPayment({
          appointment_id: Number(appointmentId),
          amount: parseFloat(amount),
          transaction_id: sessionId,
          payment_status: 'completed'
        })
        
        toast.success('Payment confirmed successfully!')
      } catch (error) {
        console.error('Payment confirmation failed:', error)
        toast.error('Failed to confirm payment. Please contact support.')
      } finally {
        setIsConfirming(false)
      }
    }

    handlePaymentConfirmation()
  }, [searchParams, navigate])

  if (isConfirming) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Confirming Payment...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we process your payment confirmation.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard/payments')}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            <Receipt className="w-4 h-4 mr-2" />
            View Payment History
          </button>
          
          <button
            onClick={() => navigate('/dashboard/appointments')}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Appointments
          </button>
        </div>
      </div>
    </div>
  )
}
