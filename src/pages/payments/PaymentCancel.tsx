import { useNavigate } from 'react-router-dom'
import { XCircle, ArrowLeft, Home } from 'lucide-react'

export default function PaymentCancel() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your payment was cancelled. No charges were made to your account.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard/appointments')}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Appointments
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
