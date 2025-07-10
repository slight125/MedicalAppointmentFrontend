import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../../store'
import { fetchUserPrescriptions } from '../../store/slices/prescriptionSlice'
import { Clock, FileText, Pill, Download } from 'lucide-react'

interface Medicine {
  name: string
  dosage?: string
  frequency?: string
}

const PrescriptionList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { prescriptions, isLoading, error } = useSelector((state: RootState) => state.prescriptions)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (user?.role === 'user') {
      dispatch(fetchUserPrescriptions())
    }
  }, [dispatch, user])

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading prescriptions: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 xl:px-16 2xl:px-20 py-6 lg:py-8 xl:py-12">
      <div className="mb-8 lg:mb-12 xl:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">My Prescriptions</h1>
        <p className="text-gray-600 text-lg lg:text-xl xl:text-2xl">View and download your medical prescriptions</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl lg:rounded-2xl shadow-lg p-12 lg:p-16 xl:p-20 text-center max-w-2xl mx-auto">
          <FileText className="mx-auto h-16 w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24 text-gray-400 mb-6 lg:mb-8" />
          <h3 className="text-2xl lg:text-3xl xl:text-4xl font-medium text-gray-900 mb-4 lg:mb-6">No prescriptions found</h3>
          <p className="text-gray-600 text-lg lg:text-xl xl:text-2xl">You don't have any prescriptions yet.</p>
        </div>
      ) : (
        <div className="grid gap-8 lg:gap-10 xl:gap-12 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {prescriptions.map((prescription) => {
            const medicines = parseMedicines(prescription.medicines || '[]')
            
            return (
              <div key={prescription.prescription_id} className="bg-white rounded-xl shadow-lg p-8 lg:p-10 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-6 lg:mb-8">
                  <div className="flex items-center">
                    <Pill className="h-8 w-8 lg:h-10 lg:w-10 text-blue-500 mr-4" />
                    <h3 className="text-xl lg:text-2xl font-semibold text-gray-900">
                      Prescription #{prescription.prescription_id}
                    </h3>
                  </div>
                  <button 
                    className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50"
                    title="Download prescription"
                    aria-label="Download prescription"
                  >
                    <Download className="h-6 w-6 lg:h-7 lg:w-7" />
                  </button>
                </div>

                <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-6 w-6 lg:h-7 lg:w-7 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium text-lg lg:text-xl">Date Issued</p>
                      <p className="text-lg lg:text-xl">
                        {prescription.issued_at ? formatDate(prescription.issued_at) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 text-lg lg:text-xl">Medicines:</h4>
                    {medicines.length > 0 ? (
                      <div className="space-y-3">
                        {medicines.map((medicine: Medicine, index: number) => (
                          <div key={index} className="bg-gray-50 rounded-xl p-4 lg:p-6">
                            <p className="font-medium text-lg lg:text-xl text-gray-900">
                              {typeof medicine === 'string' ? medicine : medicine.name || 'Unknown medicine'}
                            </p>
                            {typeof medicine === 'object' && medicine.dosage && (
                              <p className="text-gray-600 text-lg">Dosage: {medicine.dosage}</p>
                            )}
                            {typeof medicine === 'object' && medicine.frequency && (
                              <p className="text-gray-600 text-lg">Frequency: {medicine.frequency}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-lg text-gray-500">No medicines listed</p>
                    )}
                  </div>

                  {prescription.notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 text-lg lg:text-xl">Notes:</h4>
                      <p className="text-lg text-gray-600 bg-gray-50 rounded-xl p-4 lg:p-6">
                        {prescription.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-500">
                      Appointment ID: {prescription.appointment_id}
                    </span>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg lg:text-xl hover:bg-blue-700 transition-colors">
                      Download PDF
                    </button>
                  </div>
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
