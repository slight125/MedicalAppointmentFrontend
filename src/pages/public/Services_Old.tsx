import { Link } from 'react-router-dom'
import { 
  Heart, 
  Stethoscope, 
  Calendar, 
  FileText, 
  Users, 
  Clock, 
  Shield, 
  Smartphone,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function Services() {
  const services = [
    {
      icon: Calendar,
      title: 'Appointment Scheduling',
      description: 'Book appointments with your preferred doctors at your convenience',
      features: [
        'Real-time availability',
        'Automatic reminders',
        'Easy rescheduling',
        'Multiple time slots'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Stethoscope,
      title: 'Telemedicine',
      description: 'Consult with doctors remotely through video calls',
      features: [
        'HD video consultations',
        'Secure messaging',
        'Digital prescriptions',
        'Follow-up care'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FileText,
      title: 'Medical Records',
      description: 'Access and manage your complete medical history',
      features: [
        'Digital health records',
        'Lab results tracking',
        'Prescription history',
        'Secure cloud storage'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Heart,
      title: 'Health Monitoring',
      description: 'Track your vital signs and health metrics',
      features: [
        'Vital signs tracking',
        'Health analytics',
        'Progress monitoring',
        'Personalized insights'
      ],
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Users,
      title: 'Family Care',
      description: 'Manage healthcare for your entire family',
      features: [
        'Family profiles',
        'Shared calendars',
        'Dependent management',
        'Emergency contacts'
      ],
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Shield,
      title: 'Health Insurance',
      description: 'Integrated insurance and billing management',
      features: [
        'Insurance verification',
        'Claims processing',
        'Payment tracking',
        'Coverage details'
      ],
      color: 'from-yellow-500 to-yellow-600'
    }
  ]

  const specialties = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics',
    'Psychiatry', 'Radiology', 'Surgery', 'Urology'
  ]

  const benefits = [
    {
      icon: Clock,
      title: '24/7 Access',
      description: 'Access your health information and book appointments anytime, anywhere.'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First',
      description: 'Our platform is optimized for mobile devices for on-the-go access.'
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Your health data is protected with the highest security standards.'
    },
    {
      icon: Users,
      title: 'Expert Care',
      description: 'Connect with board-certified doctors and healthcare professionals.'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white py-16 md:py-20 lg:py-24 xl:py-32 2xl:py-40">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold mb-6 lg:mb-8 xl:mb-12">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-8 lg:mb-12 xl:mb-16 text-blue-100 max-w-7xl mx-auto">
              Comprehensive healthcare solutions designed for modern patients
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-20 lg:py-24 xl:py-32 2xl:py-40">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16 lg:mb-20 xl:mb-24 2xl:mb-32">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 xl:mb-8">
              Complete Healthcare Solutions
            </h2>
            <p className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-600 dark:text-gray-400 max-w-5xl mx-auto">
              Everything you need to manage your health in one integrated platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12 2xl:gap-16">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
              >
                <div className={`bg-gradient-to-r ${service.color} p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-t-xl`}>
                  <service.icon className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 text-white mb-4 lg:mb-6 xl:mb-8" />
                  <h3 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-white mb-2 lg:mb-3 xl:mb-4">
                    {service.title}
                  </h3>
                  <p className="text-base lg:text-lg xl:text-xl 2xl:text-2xl text-white/90">
                    {service.description}
                  </p>
                </div>
                <div className="p-6 lg:p-8 xl:p-10 2xl:p-12">
                  <ul className="space-y-3 lg:space-y-4 xl:space-y-5 2xl:space-y-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-green-500 mr-3 lg:mr-4 xl:mr-5 flex-shrink-0" />
                        <span className="text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Medical Specialties
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Connect with specialists across a wide range of medical fields
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {specialties.map((specialty, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center border border-gray-100 dark:border-gray-700"
              >
                <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {specialty}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience healthcare the way it should be - convenient, secure, and patient-centered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who have transformed their healthcare experience with MediCare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
