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
      {/* Animated Medical Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Floating Medical Icons */}
        <div className="absolute top-20 left-4 md:left-10 animate-pulse">
          <Heart className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 opacity-30" />
        </div>
        <div className="absolute top-40 right-4 md:right-20 animate-bounce delay-300">
          <Shield className="w-5 h-5 md:w-6 md:h-6 text-green-400 opacity-40" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-pulse delay-700">
          <Award className="w-8 h-8 md:w-10 md:h-10 text-pink-400 opacity-25" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-bounce delay-1000">
          <Calendar className="w-6 h-6 md:w-7 md:h-7 text-blue-400 opacity-35" />
        </div>
        
        {/* Neon Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#00ff88_1px,transparent_1px),linear-gradient(to_bottom,#00ff88_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
      </div>

      {/* Hero Section - Fully Responsive */}
      <section className="relative z-10 py-8 md:py-16 lg:py-20 xl:py-24 2xl:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto">
          
          {/* Welcome Image - Prominent Display */}
          <div className="mb-8 md:mb-12 lg:mb-16">
            <div className="relative group max-w-lg mx-auto lg:max-w-3xl xl:max-w-4xl">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur-lg opacity-25 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-4 md:p-6 lg:p-8 border border-cyan-500/30">
                <img
                  src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1600&h=800&fit=crop&crop=faces"
                  alt="Welcome to MediCare - Professional healthcare team ready to help you"
                  className="w-full h-48 md:h-60 lg:h-80 xl:h-96 object-cover rounded-2xl shadow-2xl"
                  loading="eager"
                  onError={(e) => {
                    console.log('Primary image failed, loading fallback');
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "https://images.pexels.com/photos/4226219/pexels-photo-4226219.jpeg?auto=compress&cs=tinysrgb&w=1600&h=800";
                  }}
                  onLoad={() => console.log('✅ Welcome image loaded successfully')}
                />
                
                {/* Floating Welcome Badge */}
                <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 lg:-top-6 lg:-right-6 bg-gradient-to-r from-green-400 to-cyan-500 text-white px-3 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-full shadow-lg animate-bounce">
                  <span className="font-bold text-xs md:text-sm lg:text-base">👋 Welcome!</span>
                </div>
                
                {/* Floating Stats */}
                <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 lg:-bottom-8 lg:-left-8 bg-white/90 backdrop-blur-sm rounded-xl p-2 md:p-4 lg:p-6 shadow-xl border border-cyan-200">
                  <div className="text-center">
                    <div className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800">24/7</div>
                    <div className="text-xs md:text-sm lg:text-base text-gray-600">Available</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 lg:-bottom-8 lg:-right-8 bg-white/90 backdrop-blur-sm rounded-xl p-2 md:p-4 lg:p-6 shadow-xl border border-green-200">
                  <div className="text-center">
                    <div className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800">99%</div>
                    <div className="text-xs md:text-sm lg:text-base text-gray-600">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content - Fully Responsive */}
          <div className="text-center">
            {/* Glowing Logo */}
            <div className="mb-6 md:mb-8 lg:mb-12 flex justify-center">
              <div className="relative">
                <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-4 md:p-6 lg:p-8 xl:p-10 rounded-full shadow-2xl shadow-cyan-500/50">
                  <Heart className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold mb-6 md:mb-8 lg:mb-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
              MediCare
            </h1>
            
            <div className="relative mb-6 md:mb-8 lg:mb-12">
              <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-4 md:mb-6 lg:mb-8 leading-tight">
                Your Health Journey
                <span className="block bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Starts Here
                </span>
              </h2>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg blur opacity-20"></div>
            </div>
            
            <p className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl mb-8 md:mb-12 lg:mb-16 text-gray-300 max-w-6xl mx-auto leading-relaxed px-4">
              Experience the future of healthcare with our revolutionary platform powered by 
              <span className="text-cyan-400 font-semibold"> cutting-edge technology</span> and 
              <span className="text-green-400 font-semibold"> personalized care</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 lg:gap-8 justify-center px-4">
              {isAuthenticated ? (                  <Link
                    to="/dashboard"
                    className="group relative inline-flex items-center justify-center px-8 md:px-10 lg:px-12 xl:px-16 py-3 md:py-4 lg:py-5 xl:py-6 text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50"
                >
                  <span className="relative z-10 flex items-center gap-2 md:gap-3">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center justify-center px-8 md:px-10 lg:px-12 xl:px-16 py-3 md:py-4 lg:py-5 xl:py-6 text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-cyan-500 rounded-full hover:from-green-400 hover:to-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25 hover:shadow-green-500/50"
                  >
                    <span className="relative z-10 flex items-center gap-2 md:gap-3">
                      Start Healing
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  </Link>
                  <Link
                    to="/login"
                    className="group relative inline-flex items-center justify-center px-8 md:px-10 lg:px-12 xl:px-16 py-3 md:py-4 lg:py-5 xl:py-6 text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-cyan-400 border-2 border-cyan-400 rounded-full hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/25"
                  >
                    <span className="relative z-10">Sign In</span>
                    <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Responsive Neon Cards */}
      <section className="relative z-10 py-12 md:py-20 lg:py-24 xl:py-32 2xl:py-40 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20">
            {stats.map((stat, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative bg-gray-800 border border-gray-700 rounded-2xl p-4 md:p-8 lg:p-10 xl:p-12 text-center hover:bg-gray-750 transition-all duration-300">
                  <div className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 md:mb-3 lg:mb-4 animate-pulse">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-semibold text-sm md:text-lg lg:text-xl xl:text-2xl">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Responsive Holographic Cards */}
      <section className="relative z-10 py-12 md:py-24 lg:py-32 xl:py-40 2xl:py-48 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto">
          <div className="text-center mb-12 md:mb-20 lg:mb-24 xl:mb-32 2xl:mb-40">
            <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-9xl font-extrabold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 md:mb-6 lg:mb-8 xl:mb-12">
              Why Choose MediCare?
            </h2>
            <p className="text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-300 max-w-6xl mx-auto leading-relaxed px-4">
              Experience the <span className="text-cyan-400 font-semibold">future of healthcare</span> with our 
              comprehensive platform designed for modern patients and healthcare providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-1000"></div>
                
                <div className="relative bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 hover:bg-gray-800 transition-all duration-300 transform group-hover:scale-105">
                  <div className="relative mb-4 md:mb-6 lg:mb-8 2xl:mb-12">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-32 2xl:h-32 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/75 transition-all duration-300">
                      <feature.icon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-16 2xl:h-16 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                  
                  <h3 className="text-lg md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-3 md:mb-4 lg:mb-6 xl:mb-8 group-hover:text-cyan-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Responsive Neon Spotlight */}
      <section className="relative z-10 py-16 md:py-32 lg:py-40 xl:py-48 2xl:py-56 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-cyan-900/50 rounded-3xl blur-3xl"></div>
        
        <div className="relative max-w-screen-2xl 2xl:max-w-none mx-auto text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-3xl animate-pulse"></div>
          
          <div className="relative z-10 p-8 md:p-16 lg:p-20 xl:p-24 2xl:p-32 rounded-3xl border border-cyan-500/30 bg-gray-800/50 backdrop-blur-sm">
            <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-9xl font-extrabold mb-6 md:mb-8 lg:mb-12 xl:mb-16">
              <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <span className="block text-white mt-2">Your Health Journey?</span>
            </h2>
            
            <p className="text-lg md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-gray-300 mb-8 md:mb-12 lg:mb-16 xl:mb-20 max-w-6xl mx-auto leading-relaxed px-4">
              Join <span className="text-cyan-400 font-bold">10,000+</span> patients who trust MediCare for their 
              <span className="text-green-400 font-semibold"> revolutionary healthcare experience</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 justify-center">
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-8 md:px-12 lg:px-16 xl:px-20 py-4 md:py-5 lg:py-6 xl:py-8 text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 rounded-full hover:from-pink-400 hover:via-purple-500 hover:to-cyan-400 transition-all duration-500 transform hover:scale-110 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/75"
                >
                  <span className="relative z-10 flex items-center gap-2 md:gap-3 lg:gap-4">
                    🚀 Start Your Journey
                    <ArrowRight className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                </Link>
              )}
              <Link
                to="/contact"
                className="group relative inline-flex items-center justify-center px-8 md:px-12 lg:px-16 xl:px-20 py-4 md:py-5 lg:py-6 xl:py-8 text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-cyan-400 border-2 border-cyan-400 rounded-full hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/50"
              >
                <span className="relative z-10">💬 Contact Us</span>
                <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section - Responsive Futuristic Cards */}
      <section className="relative z-10 py-12 md:py-24 lg:py-32 xl:py-40 2xl:py-48 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto">
          <div className="text-center mb-8 md:mb-16 lg:mb-20 xl:mb-24 2xl:mb-32">
            <h3 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent mb-4 lg:mb-6 xl:mb-8">
              Get In Touch
            </h3>
            <p className="text-gray-300 text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">Connect with our healthcare technology experts</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20">
            {[
              { icon: Phone, title: '📞 Call Us', content: '+1 (555) 123-4567', color: 'from-green-400 to-cyan-500' },
              { icon: Mail, title: '✉️ Email Us', content: 'support@medicare.com', color: 'from-blue-400 to-purple-500' },
              { icon: MapPin, title: '📍 Visit Us', content: '123 Healthcare Tech Hub\nMedical City, MC 12345', color: 'from-pink-400 to-red-500' }
            ].map((contact, index) => (
              <div key={index} className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${contact.color} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000`}></div>
                <div className="relative bg-gray-800 border border-gray-700 rounded-2xl p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 text-center hover:bg-gray-750 transition-all duration-300">
                  <div className={`bg-gradient-to-r ${contact.color} w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-32 2xl:h-32 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6 lg:mb-8 xl:mb-12 shadow-lg`}>
                    <contact.icon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-16 2xl:h-16 text-white" />
                  </div>
                  <h3 className="text-lg md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-3 md:mb-4 lg:mb-6 xl:mb-8 group-hover:text-cyan-400 transition-colors">
                    {contact.title}
                  </h3>
                  <p className="text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-300 group-hover:text-white transition-colors whitespace-pre-line">
                    {contact.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Glow */}
      <div className="relative z-10 h-16 md:h-32 lg:h-40 xl:h-48 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
    </div>
  )
}
