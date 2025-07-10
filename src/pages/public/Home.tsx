import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  Heart, 
  Calendar, 
  Users, 
  Award, 
  Clock, 
  Shield,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import type { RootState } from '../../store'

export default function Home() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const features = [
    {
      icon: Calendar,
      title: 'Easy Appointment Booking',
      description: 'Schedule appointments with your preferred doctors in just a few clicks.',
    },
    {
      icon: Users,
      title: 'Expert Doctors',
      description: 'Connect with certified healthcare professionals across various specialties.',
    },
    {
      icon: Heart,
      title: 'Comprehensive Care',
      description: 'Complete medical records, prescriptions, and health monitoring in one place.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is protected with enterprise-grade security.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our round-the-clock support team.',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Trusted by thousands of patients for reliable healthcare management.',
    },
  ]

  const stats = [
    { number: '10,000+', label: 'Happy Patients' },
    { number: '500+', label: 'Expert Doctors' },
    { number: '50+', label: 'Specialties' },
    { number: '99.9%', label: 'Uptime' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Live Image Indicator */}
      <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
        🖼️ Live Image Active
      </div>
      
      {/* Animated Medical Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Floating Medical Icons */}
        <div className="absolute top-20 left-10 animate-pulse">
          <Heart className="w-8 h-8 text-cyan-400 opacity-30" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce delay-300">
          <Shield className="w-6 h-6 text-green-400 opacity-40" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-pulse delay-700">
          <Award className="w-10 h-10 text-pink-400 opacity-25" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-bounce delay-1000">
          <Calendar className="w-7 h-7 text-blue-400 opacity-35" />
        </div>
        
        {/* Neon Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#00ff88_1px,transparent_1px),linear-gradient(to_bottom,#00ff88_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Image - Show prominently at top */}
          <div className="mb-12 lg:hidden">
            <div className="relative group max-w-md mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur-lg opacity-25 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-cyan-500/30">
                <img
                  src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=500&fit=crop&crop=faces"
                  alt="Welcoming medical team - Professional healthcare providers ready to help"
                  className="w-full h-48 object-cover rounded-2xl shadow-2xl"
                  loading="eager"
                  onError={(e) => {
                    console.log('Primary image failed, loading fallback');
                    e.currentTarget.src = "https://images.pexels.com/photos/4226219/pexels-photo-4226219.jpeg?auto=compress&cs=tinysrgb&w=800&h=500"
                  }}
                  onLoad={() => console.log('Welcome image loaded successfully')}
                />
                
                {/* Floating Welcome Badge */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-400 to-cyan-500 text-white px-4 py-2 rounded-full shadow-lg animate-bounce">
                  <span className="font-bold text-xs">👋 Welcome!</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              {/* Glowing Logo */}
              <div className="mb-8 flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-6 rounded-full shadow-2xl shadow-cyan-500/50">
                    <Heart className="w-16 h-16 text-white animate-pulse" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                MediCare
              </h1>
              
              <div className="relative mb-8">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  Your Health Journey
                  <span className="block bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Starts Here
                  </span>
                </h2>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg blur opacity-20"></div>
              </div>
              
              <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Experience the future of healthcare with our revolutionary platform powered by 
                <span className="text-cyan-400 font-semibold"> cutting-edge technology</span> and 
                <span className="text-green-400 font-semibold"> personalized care</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Go to Dashboard
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-cyan-500 rounded-full hover:from-green-400 hover:to-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25 hover:shadow-green-500/50"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        Start Healing
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                    </Link>
                    <Link
                      to="/login"
                      className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-cyan-400 border-2 border-cyan-400 rounded-full hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/25"
                    >
                      <span className="relative z-10">Sign In</span>
                      <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Welcome Image (Desktop Only) */}
            <div className="relative hidden lg:block">
              {/* Main Welcome Image */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur-lg opacity-25 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-cyan-500/30">
                  <img
                    src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=500&fit=crop&crop=faces"
                    alt="Welcoming medical team - Professional healthcare providers ready to help"
                    className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                    loading="eager"
                    onError={(e) => {
                      console.log('Primary image failed, loading fallback');
                      e.currentTarget.src = "https://images.pexels.com/photos/4226219/pexels-photo-4226219.jpeg?auto=compress&cs=tinysrgb&w=800&h=500"
                    }}
                    onLoad={() => console.log('Welcome image loaded successfully')}
                  />
                  
                  {/* Floating Welcome Badge */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-cyan-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
                    <span className="font-bold text-sm">👋 Welcome!</span>
                  </div>
                  
                  {/* Floating Stats */}
                  <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-cyan-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">24/7</div>
                      <div className="text-sm text-gray-600">Available</div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-green-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">99%</div>
                      <div className="text-sm text-gray-600">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-8 -left-8 w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute bottom-8 -right-8 w-12 h-12 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full opacity-60 animate-bounce delay-300"></div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section - Neon Cards */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="group relative">
                {/* Neon glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center hover:bg-gray-750 transition-all duration-300">
                  <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3 animate-pulse">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-semibold text-lg">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Holographic Cards */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
              Why Choose MediCare?
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience the <span className="text-cyan-400 font-semibold">future of healthcare</span> with our 
              comprehensive platform designed for modern patients and healthcare providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Holographic border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                
                {/* Card content */}
                <div className="relative bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800 transition-all duration-300 transform group-hover:scale-105">
                  {/* Neon icon */}
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/75 transition-all duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Glowing bottom border */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Neon Spotlight */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        {/* Neon spotlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-cyan-900/50 rounded-3xl blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          {/* Pulsing background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-3xl animate-pulse"></div>
          
          <div className="relative z-10 p-16 rounded-3xl border border-cyan-500/30 bg-gray-800/50 backdrop-blur-sm">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-8">
              <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <span className="block text-white mt-2">Your Health Journey?</span>
            </h2>
            
            <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join <span className="text-cyan-400 font-bold">10,000+</span> patients who trust MediCare for their 
              <span className="text-green-400 font-semibold"> revolutionary healthcare experience</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 rounded-full hover:from-pink-400 hover:via-purple-500 hover:to-cyan-400 transition-all duration-500 transform hover:scale-110 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/75"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    🚀 Start Your Journey
                    <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                </Link>
              )}
              <Link
                to="/contact"
                className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-cyan-400 border-2 border-cyan-400 rounded-full hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/50"
              >
                <span className="relative z-10">💬 Contact Us</span>
                <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section - Futuristic Cards */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent mb-4">
              Get In Touch
            </h3>
            <p className="text-gray-300 text-lg">Connect with our healthcare technology experts</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center hover:bg-gray-750 transition-all duration-300">
                <div className="bg-gradient-to-r from-green-500 to-cyan-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">
                  📞 Call Us
                </h3>
                <p className="text-gray-300 text-lg group-hover:text-white transition-colors">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center hover:bg-gray-750 transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/50">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  ✉️ Email Us
                </h3>
                <p className="text-gray-300 text-lg group-hover:text-white transition-colors">
                  support@medicare.com
                </p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-red-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center hover:bg-gray-750 transition-all duration-300">
                <div className="bg-gradient-to-r from-pink-500 to-red-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/50">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-pink-400 transition-colors">
                  📍 Visit Us
                </h3>
                <p className="text-gray-300 text-lg group-hover:text-white transition-colors">
                  123 Healthcare Tech Hub
                  <br />Medical City, MC 12345
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Glow */}
      <div className="relative z-10 h-32 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
    </div>
  )
}
