import { useState } from 'react'
import { CreditCard, Loader2 } from 'lucide-react'
import { createPaymentSession } from '../utils/paymentApi'
import toast from 'react-hot-toast'

interface PaymentButtonProps {
  appointmentId: string
  amount: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
}

export default function PaymentButton({
  appointmentId,
  amount,
  className = '',
  size = 'md',
  variant = 'primary'
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)
    
    try {
      const response = await createPaymentSession({
        appointment_id: appointmentId,
        amount: amount
      })

      // Redirect to Stripe Checkout
      window.location.href = response.url
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Failed to initiate payment. Please try again.')
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
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`
        flex items-center justify-center rounded-md font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <CreditCard className="w-4 h-4 mr-2" />
      )}
      {isLoading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
    </button>
  )
}
