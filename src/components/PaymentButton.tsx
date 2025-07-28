import { useState } from 'react'
import { CreditCard, Loader2, Smartphone } from 'lucide-react'
import { createPaymentSession } from '../utils/paymentApi'
import { api } from '../utils/api'
import toast from 'react-hot-toast'

interface PaymentButtonProps {
  appointmentId: number
  amount: number
  doctor?: { first_name: string; last_name: string }
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
}

export default function PaymentButton({
  appointmentId,
  amount,
  doctor,
  className = '',
  size = 'md',
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showMpesa, setShowMpesa] = useState(false)
  const [phone, setPhone] = useState('')

  const handleStripePayment = async () => {
    setIsLoading(true)
    try {
      const response = await createPaymentSession({
        appointment_id: appointmentId,
        amount: amount
      })
      window.location.href = response.url
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Failed to initiate payment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMpesaPayment = async () => {
    setIsLoading(true)
    try {
      await api.post('/mpesa/stkpush', {
        phone,
        amount,
        appointment_id: appointmentId
      })
      toast.success('STK Push sent! Check your phone to complete payment.')
      setShowMpesa(false)
    } catch (error) {
      toast.error('Failed to initiate M-Pesa payment.')
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-green-600 hover:bg-green-700 text-white'
  }

  return (
    <div>
      <div className="mb-2 text-sm text-gray-700">
        {doctor && (
          <div>
            <span className="font-semibold">Doctor:</span> Dr. {doctor.first_name} {doctor.last_name}
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleStripePayment}
          disabled={isLoading}
          className={`flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses.primary} ${className}`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Processing...' : `Pay with Stripe (Ksh ${amount.toLocaleString()})`}
        </button>
        <button
          onClick={() => setShowMpesa((v) => !v)}
          disabled={isLoading}
          className={`flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses.secondary} ${className}`}
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Pay with M-Pesa
        </button>
      </div>
      {showMpesa && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="tel"
            placeholder="Enter M-Pesa phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="input input-bordered bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={handleMpesaPayment}
            disabled={isLoading || !phone}
            className="btn btn-success ml-2"
          >
            {isLoading ? 'Processing...' : 'Confirm M-Pesa Payment'}
          </button>
        </div>
      )}
    </div>
  )
}
