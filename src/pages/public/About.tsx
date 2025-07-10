import { 
  Heart, 
  Users, 
  Award, 
  Target, 
  Shield, 
  Globe 
} from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'We believe in treating every patient with empathy, respect, and dignity.',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your health information is protected with the highest security standards.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of healthcare delivery.',
    },
    {
      icon: Users,
      title: 'Patient-Centered',
      description: 'Every decision we make is focused on improving patient outcomes.',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'We continuously innovate to provide cutting-edge healthcare solutions.',
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Making quality healthcare accessible to everyone, everywhere.',
    },
  ]

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Medical Officer',
      bio: 'With over 15 years of experience in internal medicine, Dr. Johnson leads our medical team with expertise and compassion.',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    },
    {
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      bio: 'Michael brings 12 years of healthcare technology experience, ensuring our platform remains secure and user-friendly.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Head of Patient Experience',
      bio: 'Dr. Rodriguez focuses on improving patient satisfaction and healthcare accessibility across all our services.',
      image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face',
    },
  ]

  const milestones = [
    { year: '2020', event: 'MediCare founded with a vision to democratize healthcare' },
    { year: '2021', event: 'Launched our first telemedicine platform' },
    { year: '2022', event: 'Reached 1,000+ registered healthcare providers' },
    { year: '2023', event: 'Expanded to serve 10,000+ patients nationwide' },
    { year: '2024', event: 'Introduced AI-powered health insights' },
    { year: '2025', event: 'Continuing to innovate and expand our services' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white py-16 md:py-20 lg:py-24 xl:py-32 2xl:py-40">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold mb-6 lg:mb-8 xl:mb-12">
              About MediCare
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-8 lg:mb-12 xl:mb-16 text-blue-100 max-w-7xl mx-auto">
              Transforming healthcare through technology, compassion, and innovation
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20 lg:py-24 xl:py-32 2xl:py-40">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 2xl:gap-24 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 dark:text-white mb-6 lg:mb-8 xl:mb-10 2xl:mb-12">
                Our Mission
              </h2>
              <p className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 dark:text-gray-400 mb-6 lg:mb-8 xl:mb-10 leading-relaxed">
                At MediCare, we believe that quality healthcare should be accessible to everyone. 
                Our mission is to bridge the gap between patients and healthcare providers through 
                innovative technology and compassionate care.
              </p>
              <p className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 dark:text-gray-400 leading-relaxed">
                We're committed to creating a healthcare ecosystem where patients can easily 
                manage their health, doctors can provide better care, and healthcare becomes 
                more efficient and effective for everyone involved.
              </p>
            </div>
            <div className="relative">
              {/* Custom Medical Illustration */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-12 shadow-2xl">
                {/* Medical Cross Background */}
                <div className="relative w-full h-80 flex items-center justify-center">
                  {/* Large Medical Cross */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg"></div>
                    <div className="absolute w-4 h-32 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full shadow-lg"></div>
                  </div>
                  
                  {/* Floating Medical Icons */}
                  <div className="absolute top-8 left-8 animate-bounce">
                    <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="absolute top-12 right-12 animate-pulse delay-300">
                    <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-8 left-12 animate-bounce delay-700">
                    <div className="bg-purple-500 w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-12 right-8 animate-pulse delay-1000">
                    <div className="bg-cyan-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Central Stethoscope Shape */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Stethoscope Head */}
                      <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-full shadow-lg animate-pulse"></div>
                      {/* Stethoscope Tube */}
                      <div className="absolute top-8 left-3 w-0.5 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
                      <div className="absolute top-24 left-0 w-8 h-0.5 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full"></div>
                      <div className="absolute top-24 right-0 w-8 h-0.5 bg-gradient-to-l from-gray-600 to-gray-800 rounded-full"></div>
                      {/* Earpieces */}
                      <div className="absolute top-23 -left-2 w-3 h-3 bg-gray-700 rounded-full"></div>
                      <div className="absolute top-23 -right-2 w-3 h-3 bg-gray-700 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Pulse Wave Animation */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-end space-x-1">
                      <div className="w-1 h-5 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="w-1 h-9 bg-green-500 rounded-full animate-pulse [animation-delay:0.1s]"></div>
                      <div className="w-1 h-11 bg-green-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                      <div className="w-1 h-6 bg-green-500 rounded-full animate-pulse [animation-delay:0.3s]"></div>
                      <div className="w-1 h-10 bg-green-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                      <div className="w-1 h-8 bg-green-500 rounded-full animate-pulse [animation-delay:0.5s]"></div>
                    </div>
                  </div>
                  
                  {/* Decorative Medical Pills */}
                  <div className="absolute top-1/4 left-1/4 w-6 h-3 bg-gradient-to-r from-red-400 to-white rounded-full shadow-md animate-bounce delay-500"></div>
                  <div className="absolute top-3/4 right-1/4 w-6 h-3 bg-gradient-to-r from-blue-400 to-white rounded-full shadow-md animate-bounce delay-700"></div>
                  
                  {/* DNA Helix representation */}
                  <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                    <div className="w-2 h-16 relative">
                      <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-bounce top-0"></div>
                      <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-bounce top-2 [animation-delay:0.2s]"></div>
                      <div className="absolute w-2 h-2 bg-purple-400 rounded-full animate-bounce top-4 [animation-delay:0.4s]"></div>
                      <div className="absolute w-2 h-2 bg-pink-400 rounded-full animate-bounce top-6 [animation-delay:0.6s]"></div>
                    </div>
                  </div>
                </div>
                
                {/* Glowing Border Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-green-400/20 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 lg:py-24 xl:py-32 2xl:py-40 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16 lg:mb-20 xl:mb-24 2xl:mb-32">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 xl:mb-8">
              Our Core Values
            </h2>
            <p className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-600 dark:text-gray-400 max-w-5xl mx-auto">
              These values guide everything we do and help us stay true to our mission of providing exceptional healthcare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12 2xl:gap-16">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 p-8 lg:p-10 xl:p-12 2xl:p-16 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-lg flex items-center justify-center mb-6 lg:mb-8 xl:mb-10 2xl:mb-12">
                  <value.icon className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-gray-900 dark:text-white mb-4 lg:mb-6 xl:mb-8">
                  {value.title}
                </h3>
                <p className="text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20 lg:py-24 xl:py-32 2xl:py-40">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16 lg:mb-20 xl:mb-24 2xl:mb-32">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 xl:mb-8">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-600 dark:text-gray-400 max-w-5xl mx-auto">
              Our dedicated team of healthcare professionals and technology experts working to transform healthcare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 xl:gap-12 2xl:gap-16">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 lg:h-80 xl:h-96 2xl:h-[32rem] object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7a2d?w=400&h=400&fit=crop&crop=face';
                  }}
                />
                <div className="p-6 lg:p-8 xl:p-10 2xl:p-12">
                  <h3 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-gray-900 dark:text-white mb-2 lg:mb-3 xl:mb-4">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-4 lg:mb-6 xl:mb-8 text-base lg:text-lg xl:text-xl 2xl:text-2xl">
                    {member.role}
                  </p>
                  <p className="text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-20 lg:py-24 xl:py-32 2xl:py-40 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-screen-2xl 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16 lg:mb-20 xl:mb-24 2xl:mb-32">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 xl:mb-8">
              Our Journey
            </h2>
            <p className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-600 dark:text-gray-400 max-w-5xl mx-auto">
              From a small startup to a trusted healthcare platform serving thousands of patients.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 lg:w-1 xl:w-1.5 2xl:w-2 h-full bg-blue-600 dark:bg-blue-400"></div>
            
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative flex items-center mb-8 lg:mb-12 xl:mb-16 2xl:mb-20 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8 lg:pr-12 xl:pr-16 2xl:pr-20' : 'text-left pl-8 lg:pl-12 xl:pl-16 2xl:pl-20'}`}>
                  <div className="bg-white dark:bg-gray-900 p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2 lg:mb-3 xl:mb-4">
                      {milestone.year}
                    </div>
                    <p className="text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 dark:text-gray-400">
                      {milestone.event}
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 lg:w-6 lg:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 bg-blue-600 dark:bg-blue-400 rounded-full border-4 lg:border-6 xl:border-8 2xl:border-10 border-white dark:border-gray-900"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
