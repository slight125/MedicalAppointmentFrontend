import { useState, useEffect } from 'react'
import { Calendar, CreditCard, Search, Filter, Clock } from 'lucide-react'
import { getPaymentHistory, type Payment } from '../../utils/paymentApi'
import toast from 'react-hot-toast'

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    setIsLoading(true)
    try {
      const data = await getPaymentHistory()
      setPayments(data)
    } catch (error) {
      toast.error('Failed to load payment history. Please try again later.')
      console.error('Error fetching payment history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Format date display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Format currency display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Get status badge class
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'badge-success'
      case 'pending':
        return 'badge-warning'
      case 'failed':
        return 'badge-error'
      case 'refunded':
        return 'badge-info'
      default:
        return 'badge-ghost'
    }
  }

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    const doctorName = '' // We don't have appointment details in the Payment type
    
    const matchesSearch = searchTerm === '' ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toString().includes(searchTerm.toLowerCase()) ||
      payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_status.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' ||
      payment.payment_status.toLowerCase() === statusFilter.toLowerCase()
    
    const today = new Date()
    const paymentDate = new Date(payment.created_at)
    let matchesDate = true
    
    if (dateFilter === 'today') {
      matchesDate = paymentDate.toDateString() === today.toDateString()
    } else if (dateFilter === 'this-week') {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      matchesDate = paymentDate >= oneWeekAgo
    } else if (dateFilter === 'this-month') {
      matchesDate = 
        paymentDate.getMonth() === today.getMonth() &&
        paymentDate.getFullYear() === today.getFullYear()
    } else if (dateFilter === 'this-year') {
      matchesDate = paymentDate.getFullYear() === today.getFullYear()
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleViewReceipt = async (paymentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/payments/${paymentId}/receipt`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch receipt');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      toast.error('Failed to fetch receipt');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 py-6 lg:py-8">
      {/* Header */}
      <div className="mb-8 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Payment History</h1>
        <p className="text-gray-600 text-lg">
          View all your past transactions and payment details
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 mb-8 lg:mb-12 border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Search */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-3 text-lg text-gray-800">
                <Search className="w-5 h-5 text-blue-600" />
                Search
              </span>
            </label>
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full text-lg py-4"
            />
          </div>

          {/* Status Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-3 text-lg text-gray-800">
                <Filter className="w-5 h-5 text-green-600" />
                Status
              </span>
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-bordered w-full text-lg py-4"
              aria-label="Filter by payment status"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-3 text-lg text-gray-800">
                <Calendar className="w-5 h-5 text-purple-600" />
                Time Period
              </span>
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="select select-bordered w-full text-lg py-4"
              aria-label="Filter by payment date"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="this-year">This Year</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-lg text-gray-800">Results</span>
            </label>
            <div className="flex items-center h-16 px-6 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-gray-800 font-semibold text-lg">
                {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-6 lg:space-y-8">
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 lg:p-16 text-center">
            <CreditCard className="mx-auto h-16 w-16 lg:h-20 lg:w-20 text-gray-400 mb-6" />
            <h3 className="text-2xl lg:text-3xl font-medium text-gray-900 mb-4">No payments found</h3>
            <p className="text-gray-600 mb-8 text-lg lg:text-xl">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'You don\'t have any payment records yet.'
              }
            </p>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div key={payment.transaction_id || payment.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Payment #{payment.id}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${getStatusBadge(payment.payment_status)}`}>{payment.payment_status}</span>
                  </div>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(payment.amount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(payment.created_at)}
                  </p>
                </div>
              </div>

              {/* Appointment details not available in current Payment type */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">Payment Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Appointment ID</p>
                      <p className="font-medium">{payment.appointment_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Transaction ID</p>
                      <p className="font-medium">{payment.transaction_id}</p>
                    </div>
                  </div>
                  {payment.phone_number && (
                    <div className="flex items-center text-gray-600">
                      <CreditCard className="w-5 h-5 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">Phone Number</p>
                        <p className="font-medium">{payment.phone_number}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                {payment.payment_status === 'completed' && (
                  <button className="btn btn-outline btn-sm" onClick={() => handleViewReceipt(payment.payment_id)}>
                    View Receipt
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
