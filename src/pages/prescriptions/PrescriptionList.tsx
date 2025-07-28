import React, { useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../../store'
import { fetchUserPrescriptions, fetchDoctorPrescriptions, fetchAllPrescriptions, downloadPrescriptionPDF } from '../../store/slices/prescriptionSlice'
import { Clock, FileText, Pill, RefreshCw, User, Calendar } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Medicine {
  name: string
  dosage?: string
  frequency?: string
  instructions?: string
}

const PrescriptionList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { prescriptions, isLoading, error } = useSelector((state: RootState) => state.prescriptions)
  const { user } = useSelector((state: RootState) => state.auth)
  const [refreshing, setRefreshing] = useState(false)

  // Reusable function to fetch prescriptions based on user role
  const fetchPrescriptions = useCallback(async () => {
    try {
      if (user?.role === 'user') {
        await dispatch(fetchUserPrescriptions()).unwrap();
      } else if (user?.role === 'doctor') {
        await dispatch(fetchDoctorPrescriptions()).unwrap();
      } else if (user?.role === 'admin') {
        await dispatch(fetchAllPrescriptions()).unwrap();
      }
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, user]);

  // Initial data fetch
  useEffect(() => {
    fetchPrescriptions()
  }, [fetchPrescriptions])

  // Auto-refresh every 30 seconds to keep data current
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && !refreshing) {
        setRefreshing(true)
        fetchPrescriptions()
      }
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [fetchPrescriptions, isLoading, refreshing])

  // Manual refresh function
  const handleRefresh = () => {
    setRefreshing(true)
    fetchPrescriptions()
    toast.success('Prescriptions refreshed')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const parseMedicines = (medicinesData: string | Medicine[]): Medicine[] => {
    if (Array.isArray(medicinesData)) {
      return medicinesData
    }
    try {
      return JSON.parse(medicinesData)
    } catch {
      return []
    }
  }

  const handleDownloadPDF = async (prescriptionId: number) => {
    try {
      await dispatch(downloadPrescriptionPDF(prescriptionId)).unwrap()
      toast.success('Prescription downloaded successfully')
    } catch (error) {
      toast.error('Failed to download prescription')
    }
  }

  if (isLoading && !refreshing) {
    return (
      <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 xl:px-16 2xl:px-20 py-6 lg:py-8 xl:py-12">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <span className="ml-3 text-lg">Loading prescriptions...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 xl:px-16 2xl:px-20 py-6 lg:py-8 xl:py-12">
        <div className="alert alert-error mb-4">
          <span>Error loading prescriptions: {error}</span>
          <button onClick={handleRefresh} className="btn btn-sm btn-outline">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 xl:px-16 2xl:px-20 py-6 lg:py-8 xl:py-12 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 lg:mb-12 xl:mb-16 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 lg:mb-6 leading-tight tracking-tight drop-shadow-md">
            My Prescriptions
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg lg:text-xl xl:text-2xl">
            View and download your medical prescriptions
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn btn-outline btn-primary px-4 py-2 rounded-lg shadow flex items-center gap-2"
          title="Refresh prescriptions"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl lg:rounded-2xl shadow-lg p-12 lg:p-16 xl:p-20 text-center max-w-2xl mx-auto">
          <FileText className="mx-auto h-16 w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24 text-gray-400 dark:text-gray-500 mb-6 lg:mb-8" />
          <h3 className="text-2xl lg:text-3xl xl:text-4xl font-medium text-gray-900 dark:text-gray-100 mb-4 lg:mb-6">
            No prescriptions found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg lg:text-xl xl:text-2xl">
            You don't have any prescriptions yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:gap-10 xl:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {prescriptions.map((prescription, idx) => {
            const medicines = parseMedicines(prescription.medicines || '[]')
            
            return (
              <div 
                key={prescription.prescription_id} 
                className={
                  `relative group bg-white dark:bg-gray-900 border-l-8 border-blue-500 dark:border-blue-400 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.025] p-8 lg:p-10 flex flex-col min-h-[340px] animate-fade-in`
                }
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-center gap-3 mb-6 lg:mb-8">
                  <Pill className="h-8 w-8 lg:h-10 lg:w-10 text-blue-500 dark:text-blue-400" />
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Prescription <span className="text-blue-600 dark:text-blue-300">#{prescription.prescription_id}</span>
                  </h3>
                </div>

                <div className="flex-1 flex flex-col gap-4 lg:gap-6">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <span className="font-medium">Date Issued:</span>
                    <span className="ml-1">{prescription.issued_at ? formatDate(prescription.issued_at) : 'N/A'}</span>
                  </div>
                  {prescription.appointment_date && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span className="font-medium">Appointment Date:</span>
                      <span className="ml-1">{formatDate(prescription.appointment_date)}</span>
                    </div>
                  )}
                  {prescription.doctor_name && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span className="font-medium">Doctor:</span>
                      <span className="ml-1">Dr. {prescription.doctor_name}</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-base lg:text-lg">Medicines</h4>
                    {medicines.length > 0 ? (
                      <ul className="space-y-2">
                        {medicines.map((medicine: Medicine, index: number) => (
                          <li key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700 flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {typeof medicine === 'string' ? medicine : medicine.name || 'Unknown medicine'}
                            </span>
                            <span className="text-gray-600 dark:text-gray-300 text-sm">
                              {typeof medicine === 'object' && medicine.dosage ? `Dosage: ${medicine.dosage}` : ''}
                              {typeof medicine === 'object' && medicine.frequency ? `, Frequency: ${medicine.frequency}` : ''}
                              {typeof medicine === 'object' && medicine.instructions ? `, ${medicine.instructions}` : ''}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">No medicines listed</span>
                    )}
                  </div>
                  {prescription.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-base lg:text-lg">Notes</h4>
                      <p className="text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
                        {prescription.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Appointment ID: <span className="font-semibold">{prescription.appointment_id}</span>
                  </span>
                  <button 
                    onClick={() => handleDownloadPDF(prescription.prescription_id)}
                    className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PrescriptionList
