import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Calendar, Clock, User, FileText, ArrowLeft, CreditCard } from 'lucide-react'
import PaymentButton from '../../components/PaymentButton'
import appointmentAPI from '../../utils/api/appointmentAPI';

const appointmentSchema = z.object({
  doctor_id: z.string().min(1, 'Please select a doctor'),
  appointment_date: z.string().min(1, 'Please select a date'),
  appointment_time: z.string().min(1, 'Please select a time'),
  appointment_type: z.string().min(1, 'Please select appointment type'),
  reason: z.string().min(10, 'Please provide a reason (at least 10 characters)'),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

export default function BookAppointment() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [bookedAppointment, setBookedAppointment] = useState<{
    id: string
    doctor: string
    date: string
    time: string
    type: string
    amount: number
  } | null>(null)
  const [doctors, setDoctors] = useState<any[]>([])
  const [doctorLoading, setDoctorLoading] = useState(true)
  const [doctorError, setDoctorError] = useState('')

  // Parse doctor_id from query param
  const params = new URLSearchParams(location.search)
  const preselectedDoctorId = params.get('doctor_id') || ''

  useEffect(() => {
    setDoctorLoading(true)
    appointmentAPI.getDoctors()
      .then((res: any) => {
        setDoctors(res.data.doctors || [])
        setDoctorLoading(false)
      })
      .catch(() => {
        setDoctorError('Failed to load doctors')
        setDoctorLoading(false)
      })
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctor_id: preselectedDoctorId,
    },
  })

  useEffect(() => {
    // If preselectedDoctorId is present, set it in the form
    if (preselectedDoctorId && doctors.length > 0) {
      setValue('doctor_id', preselectedDoctorId)
    }
  }, [preselectedDoctorId, doctors, setValue])

  const selectedDate = watch('appointment_date')

  // Mock data - in real app, this would come from API
  const appointmentTypes = [
    'Regular Checkup',
    'Follow-up',
    'Consultation',
    'Emergency',
    'Vaccination',
    'Lab Work',
  ]

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM'
  ]

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split('T')[0]
  }

  const onSubmit = async (data: AppointmentFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call to book appointment
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Get selected doctor info
      const selectedDoctor = doctors.find(d => d.doctor_id === data.doctor_id)
      
      // Calculate appointment cost based on type
      const appointmentCosts = {
        'Regular Checkup': 150,
        'Follow-up': 100,
        'Consultation': 200,
        'Emergency': 300,
        'Vaccination': 80,
        'Lab Work': 120,
      }
      
      const cost = appointmentCosts[data.appointment_type as keyof typeof appointmentCosts] || 150
      
      // Simulate successful booking with generated ID
      const appointmentId = `APT-${Date.now()}`
      
      setBookedAppointment({
        id: appointmentId,
        doctor: selectedDoctor?.first_name + ' ' + selectedDoctor?.last_name || 'Unknown Doctor',
        date: data.appointment_date,
        time: data.appointment_time,
        type: data.appointment_type,
        amount: cost
      })
      
      toast.success('Appointment booked successfully! Please proceed with payment.')
    } catch {
      toast.error('Failed to book appointment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-base font-bold text-gray-900 mb-2">Book Appointment</h1>
        <p className="text-sm text-gray-600">Schedule your appointment with our healthcare professionals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Doctor Selection */}
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Select Doctor
                </span>
              </label>
              {doctorLoading ? (
                <div>Loading doctors...</div>
              ) : doctorError ? (
                <div className="text-error">{doctorError}</div>
              ) : (
                <select
                  {...register('doctor_id')}
                  className={`select select-bordered w-full ${errors.doctor_id ? 'select-error' : ''}`}
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.doctor_id} value={doctor.doctor_id}>
                      Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              )}
              {errors.doctor_id && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.doctor_id.message}
                  </span>
                </label>
              )}

              {/* Appointment Type */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Appointment Type
                  </span>
                </label>
                <select
                  {...register('appointment_type')}
                  className={`select select-bordered w-full ${
                    errors.appointment_type ? 'select-error' : ''
                  }`}
                >
                  <option value="">Select appointment type</option>
                  {appointmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.appointment_type && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.appointment_type.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Date Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Appointment Date
                  </span>
                </label>
                <input
                  {...register('appointment_date')}
                  type="date"
                  min={getMinDate()}
                  max={getMaxDate()}
                  className={`input input-bordered w-full ${
                    errors.appointment_date ? 'input-error' : ''
                  }`}
                />
                {errors.appointment_date && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.appointment_date.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Time Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Appointment Time
                  </span>
                </label>
                <select
                  {...register('appointment_time')}
                  disabled={!selectedDate}
                  className={`select select-bordered w-full ${
                    errors.appointment_time ? 'select-error' : ''
                  } ${!selectedDate ? 'select-disabled' : ''}`}
                >
                  <option value="">
                    {!selectedDate ? 'Please select a date first' : 'Choose a time slot'}
                  </option>
                  {selectedDate && timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.appointment_time && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.appointment_time.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Reason */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Reason for Visit</span>
                </label>
                <textarea
                  {...register('reason')}
                  placeholder="Please describe your symptoms or reason for the appointment..."
                  className={`textarea textarea-bordered w-full h-32 ${
                    errors.reason ? 'textarea-error' : ''
                  }`}
                />
                {errors.reason && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.reason.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <div className="form-control mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full"
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Booking Appointment...
                    </>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Payment Confirmation Section */}
          {bookedAppointment && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-4 h-4 text-green-600" />
                <h3 className="text-base font-semibold text-gray-900">
                  Complete Payment
                </h3>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-green-900 mb-3">Appointment Confirmed</h4>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex justify-between">
                    <span>Doctor:</span>
                    <span className="font-medium truncate">{bookedAppointment.doctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium truncate">{bookedAppointment.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium truncate">{bookedAppointment.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium truncate">{bookedAppointment.type}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Amount:</span>
                    <span className="font-bold text-lg">${bookedAppointment.amount}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <PaymentButton
                  appointmentId={bookedAppointment.id}
                  amount={bookedAppointment.amount}
                  className="flex-1"
                  size="lg"
                />
                <button
                  onClick={() => navigate('/dashboard/appointments')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                >
                  Pay Later
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Booking Summary & Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Booking Guidelines */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">Booking Guidelines</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Appointments can be booked up to 30 days in advance</li>
              <li>• Please arrive 15 minutes before your appointment</li>
              <li>• Bring a valid ID and insurance card</li>
              <li>• Cancellations must be made 24 hours in advance</li>
            </ul>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <h3 className="font-semibold text-red-900 mb-3">Emergency?</h3>
            <p className="text-sm text-red-800 mb-3">
              If this is a medical emergency, please call 911 or visit your nearest emergency room.
            </p>
            <p className="text-sm text-red-800">
              For urgent but non-emergency care, call our clinic at{' '}
              <span className="font-medium">(555) 123-4567</span>
            </p>
          </div>

          {/* Office Hours */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Office Hours</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
