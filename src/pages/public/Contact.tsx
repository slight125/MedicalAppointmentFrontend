import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  User,
  FileText
} from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', data)
      toast.success('Thank you for your message! We will get back to you soon.')
      reset()
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      subtitle: 'Available 24/7'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['support@medicare.com', 'info@medicare.com'],
      subtitle: 'We respond within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['123 Healthcare Street', 'Medical City, MC 12345'],
      subtitle: 'Visit our headquarters'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon-Fri: 8:00 AM - 6:00 PM', 'Sat-Sun: 9:00 AM - 4:00 PM'],
      subtitle: 'Emergency support available 24/7'
    }
  ]

  const departments = [
    {
      icon: User,
      title: 'Patient Support',
      description: 'General inquiries and patient assistance',
      email: 'patients@medicare.com'
    },
    {
      icon: FileText,
      title: 'Medical Records',
      description: 'Medical records and documentation',
      email: 'records@medicare.com'
    },
    {
      icon: MessageCircle,
      title: 'Technical Support',
      description: 'Platform issues and technical assistance',
      email: 'tech@medicare.com'
    }
  ]

  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'You can book an appointment by logging into your account, selecting "Book Appointment" from the dashboard, choosing your preferred doctor and time slot.'
    },
    {
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time through your patient dashboard.'
    },
    {
      question: 'How do I access my medical records?',
      answer: 'Your medical records are available in your patient dashboard under the "Medical History" section. You can view, download, or share them with other healthcare providers.'
    },
    {
      question: 'Is my health information secure?',
      answer: 'Yes, we use industry-standard encryption and follow HIPAA compliance guidelines to ensure your health information is completely secure and private.'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white py-16 md:py-20 lg:py-24 xl:py-32 2xl:py-40">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold mb-6 lg:mb-8 xl:mb-12">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-8 lg:mb-12 xl:mb-16 text-blue-100 max-w-7xl mx-auto">
              We're here to help you with all your healthcare needs
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 md:py-20 lg:py-24 xl:py-32 2xl:py-40">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-12 2xl:gap-16">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="text-center bg-white dark:bg-gray-800 p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 xl:mb-8">
                  <info.icon className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4 xl:mb-6">
                  {info.title}
                </h3>
                <div className="space-y-2 lg:space-y-3 xl:space-y-4">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-600 dark:text-gray-400">
                      {detail}
                    </p>
                  ))}
                </div>
                <p className="text-xs lg:text-sm xl:text-base 2xl:text-lg text-blue-600 dark:text-blue-400 mt-3 lg:mt-4 xl:mt-6">
                  {info.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Departments */}
      <section className="py-16 md:py-20 lg:py-24 xl:py-32 2xl:py-40 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 2xl:gap-24">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 dark:text-white mb-6 lg:mb-8 xl:mb-10">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:space-y-6 xl:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 xl:gap-8">
                  <div>
                    <label htmlFor="name" className="block text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium text-gray-700 dark:text-gray-300 mb-2 lg:mb-3 xl:mb-4">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className="w-full px-4 lg:px-6 xl:px-8 py-3 lg:py-4 xl:py-5 2xl:py-6 text-base lg:text-lg xl:text-xl 2xl:text-2xl border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium text-gray-700 dark:text-gray-300 mb-2 lg:mb-3 xl:mb-4">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className="w-full px-4 lg:px-6 xl:px-8 py-3 lg:py-4 xl:py-5 2xl:py-6 text-base lg:text-lg xl:text-xl 2xl:text-2xl border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium text-gray-700 dark:text-gray-300 mb-2 lg:mb-3 xl:mb-4">
                    Subject
                  </label>
                  <select
                    id="subject"
                    {...register('subject')}
                    className="w-full px-4 lg:px-6 xl:px-8 py-3 lg:py-4 xl:py-5 2xl:py-6 text-base lg:text-lg xl:text-xl 2xl:text-2xl border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="appointment">Appointment Issue</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium text-gray-700 dark:text-gray-300 mb-2 lg:mb-3 xl:mb-4">
                    Message
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    rows={6}
                    className="w-full px-4 lg:px-6 xl:px-8 py-3 lg:py-4 xl:py-5 2xl:py-6 text-base lg:text-lg xl:text-xl 2xl:text-2xl border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Enter your message here..."
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 lg:py-4 xl:py-5 2xl:py-6 px-6 lg:px-8 xl:px-10 2xl:px-12 text-base lg:text-lg xl:text-xl 2xl:text-2xl rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 lg:gap-3 xl:gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Send className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Department Contacts */}
            <div>
              <h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 dark:text-white mb-6 lg:mb-8 xl:mb-10">
                Contact by Department
              </h2>
              <div className="space-y-4 lg:space-y-6 xl:space-y-8">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-900 p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center mb-4 lg:mb-6 xl:mb-8">
                      <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-lg flex items-center justify-center mr-4 lg:mr-6 xl:mr-8">
                        <dept.icon className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-gray-900 dark:text-white">
                          {dept.title}
                        </h3>
                        <p className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-600 dark:text-gray-400">
                          {dept.description}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`mailto:${dept.email}`}
                      className="text-base lg:text-lg xl:text-xl 2xl:text-2xl text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {dept.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 lg:py-24 xl:py-32 2xl:py-40">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-12 lg:mb-16 xl:mb-20 2xl:mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 xl:mb-8">
              Frequently Asked Questions
            </h2>
            <p className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-600 dark:text-gray-400">
              Find answers to common questions about our services
            </p>
          </div>

          <div className="space-y-6 lg:space-y-8 xl:space-y-10 2xl:space-y-12">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4 xl:mb-6">
                  {faq.question}
                </h3>
                <p className="text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-20 lg:py-24 xl:py-32 2xl:py-40 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-12 lg:mb-16 xl:mb-20 2xl:mb-24">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 xl:mb-8">
              Visit Our Office
            </h2>
            <p className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-600 dark:text-gray-400">
              Come see us at our headquarters in Medical City
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div className="h-96 lg:h-[32rem] xl:h-[40rem] 2xl:h-[48rem] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-32 2xl:h-32 text-gray-400 mx-auto mb-4 lg:mb-6 xl:mb-8" />
                <p className="text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 dark:text-gray-400">
                  Interactive map would be integrated here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
