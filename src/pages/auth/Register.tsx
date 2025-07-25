import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Heart } from 'lucide-react'
import type { AppDispatch, RootState } from '../../store'
import { registerUser } from '../../store/slices/authSlice'

const registerSchema = z.object({
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  contact_phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data
      await dispatch(registerUser(registerData)).unwrap()
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Registration failed')
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] w-screen bg-gradient-to-br from-indigo-600/20 to-cyan-400/20 dark:from-indigo-600/30 dark:to-cyan-400/30 flex items-center justify-center transition-colors duration-300 overflow-hidden">
      <div className="w-screen h-full flex flex-col lg:flex-row-reverse items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 3xl:px-48 4xl:px-64 5xl:px-96 6xl:px-[15rem] py-2 lg:py-3 5xl:py-4 6xl:py-5">
        <div className="w-full lg:w-2/5 5xl:w-1/3 6xl:w-1/3 h-full flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-1 md:mb-2 lg:mb-3 5xl:mb-4 6xl:mb-5">
            <div className="flex items-center justify-center gap-2 md:gap-3 lg:gap-4 mb-1 md:mb-2 lg:mb-3">
              <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full p-1.5 md:p-2 lg:p-3 shadow-[0_0_15px_rgba(99,102,241,0.6)] dark:shadow-[0_0_20px_rgba(99,102,241,0.8)]">
                <Heart className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 5xl:w-8 5xl:h-8 6xl:w-10 6xl:h-10 text-white animate-pulse" />
              </div>
              <h1 className="text-lg md:text-xl lg:text-2xl 5xl:text-3xl 6xl:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-500 dark:to-cyan-400">MediCare</h1>
            </div>
            <h2 className="text-base md:text-lg lg:text-xl 5xl:text-2xl 6xl:text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-0.5 md:mb-1 drop-shadow-sm dark:drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]">Create Account</h2>
            <p className="text-xs md:text-sm lg:text-base 5xl:text-lg 6xl:text-xl text-gray-600 dark:text-gray-300">Join our healthcare platform</p>
          </div>          {/* Register Form */}
          <div className="card bg-white dark:bg-gray-900 shadow-lg dark:shadow-[0_0_25px_rgba(99,102,241,0.5)] border border-gray-300 dark:border-indigo-900/50 rounded-xl w-full transition-all duration-300 flex-1 overflow-hidden">
            <div className="card-body p-2 md:p-3 lg:p-4 5xl:p-5 6xl:p-6 h-full overflow-y-auto">
              {error && (
                <div className="alert mb-2 md:mb-3 lg:mb-4 text-xs md:text-sm lg:text-base 5xl:text-lg 6xl:text-xl border-l-4 border-l-rose-500 bg-rose-100/80 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200">
                  <span>{error}</span>
                </div>
              )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-1 md:space-y-2 lg:space-y-3 5xl:space-y-4 6xl:space-y-5">              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 lg:gap-3">
                <div className="form-control">
                  <label className="label py-0 md:py-0.5 lg:py-1">
                    <span className="label-text font-medium text-xs md:text-sm lg:text-base 5xl:text-lg 6xl:text-xl">First Name</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500 dark:text-cyan-400 pointer-events-none" />
                    <input
                      {...register('firstname')}
                      type="text"
                      placeholder="First name"
                      className={`input w-full pl-7 md:pl-8 lg:pl-10 5xl:pl-12 6xl:pl-16 h-8 md:h-9 lg:h-10 5xl:h-12 6xl:h-14 text-xs md:text-sm lg:text-base 5xl:text-lg 6xl:text-xl bg-white dark:bg-gray-800 border-gray-400 dark:border-indigo-900 focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-cyan-400/30 text-gray-800 dark:text-white transition-colors ${
                        errors.firstname ? 'border-rose-500 dark:border-rose-600 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/30 dark:focus:ring-rose-600/30' : ''
                      }`}
                    />
                    </div>
                    {errors.firstname && (
                      <label className="label py-0 md:py-0.5">
                        <span className="label-text-alt text-rose-500 dark:text-rose-400 text-xs md:text-sm lg:text-base 5xl:text-lg">
                          {errors.firstname.message}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label py-0 md:py-0.5 lg:py-1">
                      <span className="label-text font-medium text-xs md:text-sm lg:text-base 5xl:text-lg 6xl:text-xl">Last Name</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500 dark:text-cyan-400 pointer-events-none" />
                      <input
                        {...register('lastname')}
                        type="text"
                        placeholder="Last name"
                        className={`input w-full pl-7 md:pl-8 lg:pl-10 5xl:pl-12 6xl:pl-16 h-8 md:h-9 lg:h-10 5xl:h-12 6xl:h-14 text-xs md:text-sm lg:text-base 5xl:text-lg 6xl:text-xl bg-white dark:bg-gray-800 border-gray-400 dark:border-indigo-900 focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-cyan-400/30 text-gray-800 dark:text-white transition-colors ${
                          errors.lastname ? 'border-rose-500 dark:border-rose-600 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/30 dark:focus:ring-rose-600/30' : ''
                        }`}
                      />
                    </div>
                    {errors.lastname && (
                      <label className="label py-0 md:py-0.5">
                        <span className="label-text-alt text-rose-500 dark:text-rose-400 text-xs md:text-sm lg:text-base 5xl:text-lg">
                          {errors.lastname.message}
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="form-control">
                  <label className="label py-0 md:py-0.5 lg:py-1">
                    <span className="label-text font-medium text-xs md:text-sm lg:text-base 5xl:text-lg 6xl:text-xl">Email</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500 dark:text-cyan-400 pointer-events-none" />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Enter your email"
                      className={`input w-full pl-7 md:pl-8 lg:pl-10 5xl:pl-12 6xl:pl-16 h-8 md:h-9 lg:h-10 5xl:h-12 6xl:h-14 text-xs md:text-sm lg:text-base 5xl:text-lg 6xl:text-xl bg-white dark:bg-gray-800 border-gray-400 dark:border-indigo-900 focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-cyan-400/30 text-gray-800 dark:text-white transition-colors ${
                        errors.email ? 'border-rose-500 dark:border-rose-600 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/30 dark:focus:ring-rose-600/30' : ''
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <label className="label py-0 md:py-0.5">
                      <span className="label-text-alt text-rose-500 dark:text-rose-400 text-xs md:text-sm lg:text-base 5xl:text-lg">
                        {errors.email.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Phone Field */}
                <div className="form-control">
                  <label className="label py-0.5 md:py-1 lg:py-1.5">
                    <span className="label-text font-medium text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl">Phone Number</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 dark:text-cyan-400 pointer-events-none" />
                    <input
                      {...register('contact_phone')}
                      type="tel"
                      placeholder="Enter your phone number"
                      className={`input w-full pl-10 md:pl-12 lg:pl-14 5xl:pl-16 6xl:pl-20 h-11 md:h-12 lg:h-14 5xl:h-16 6xl:h-18 text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl bg-white dark:bg-gray-800 border-gray-400 dark:border-indigo-900 focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-cyan-400/30 text-gray-800 dark:text-white transition-colors ${
                        errors.contact_phone ? 'border-rose-500 dark:border-rose-600 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/30 dark:focus:ring-rose-600/30' : ''
                      }`}
                    />
                  </div>
                  {errors.contact_phone && (
                    <label className="label py-0.5 md:py-1">
                      <span className="label-text-alt text-rose-500 dark:text-rose-400 text-sm md:text-base lg:text-lg 5xl:text-xl">
                        {errors.contact_phone.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Address Field */}
                <div className="form-control">
                  <label className="label py-0.5 md:py-1 lg:py-1.5">
                    <span className="label-text font-medium text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl">Address</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-4 h-5 w-5 text-indigo-500 dark:text-cyan-400 pointer-events-none" />
                    <textarea
                      {...register('address')}
                      placeholder="Enter your address"
                      className={`textarea w-full pl-10 md:pl-12 lg:pl-14 5xl:pl-16 6xl:pl-20 min-h-12 md:min-h-14 lg:min-h-16 5xl:min-h-18 6xl:min-h-20 text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl bg-white dark:bg-gray-800 border-gray-400 dark:border-indigo-900 focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-cyan-400/30 text-gray-800 dark:text-white transition-colors ${
                        errors.address ? 'border-rose-500 dark:border-rose-600 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/30 dark:focus:ring-rose-600/30' : ''
                      }`}
                      rows={1}
                    />
                  </div>
                  {errors.address && (
                    <label className="label py-0.5 md:py-1">
                      <span className="label-text-alt text-rose-500 dark:text-rose-400 text-sm md:text-base lg:text-lg 5xl:text-xl">
                        {errors.address.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  <div className="form-control">
                    <label className="label py-0.5 md:py-1 lg:py-1.5">
                      <span className="label-text font-medium text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl">Password</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 dark:text-cyan-400 pointer-events-none" />
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className={`input w-full pl-10 md:pl-12 lg:pl-14 5xl:pl-16 6xl:pl-20 pr-10 md:pr-12 lg:pr-14 5xl:pr-16 6xl:pr-20 h-11 md:h-12 lg:h-14 5xl:h-16 6xl:h-18 text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl bg-white/50 dark:bg-gray-800/50 border-gray-400 dark:border-indigo-900 focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-cyan-400/30 text-gray-800 dark:text-white transition-colors ${
                          errors.password ? 'border-rose-500 dark:border-rose-600 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/30 dark:focus:ring-rose-600/30' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-cyan-400 hover:text-indigo-600 dark:hover:text-cyan-500 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 5xl:h-8 5xl:w-8 6xl:h-9 6xl:w-9" />
                        ) : (
                          <Eye className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 5xl:h-8 5xl:w-8 6xl:h-9 6xl:w-9" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <label className="label py-0.5 md:py-1">
                        <span className="label-text-alt text-rose-500 dark:text-rose-400 text-sm md:text-base lg:text-lg 5xl:text-xl">
                          {errors.password.message}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label py-0.5 md:py-1 lg:py-1.5">
                      <span className="label-text font-medium text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl">Confirm Password</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 dark:text-cyan-400 pointer-events-none" />
                      <input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className={`input w-full pl-10 md:pl-12 lg:pl-14 5xl:pl-16 6xl:pl-20 pr-10 md:pr-12 lg:pr-14 5xl:pr-16 6xl:pr-20 h-11 md:h-12 lg:h-14 5xl:h-16 6xl:h-18 text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl bg-white dark:bg-gray-800 border-gray-400 dark:border-indigo-900 focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-cyan-400/30 text-gray-800 dark:text-white transition-colors ${
                          errors.confirmPassword ? 'border-rose-500 dark:border-rose-600 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/30 dark:focus:ring-rose-600/30' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-cyan-400 hover:text-indigo-600 dark:hover:text-cyan-500 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 5xl:h-8 5xl:w-8 6xl:h-9 6xl:w-9" />
                        ) : (
                          <Eye className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 5xl:h-8 5xl:w-8 6xl:h-9 6xl:w-9" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <label className="label py-0.5 md:py-1">
                        <span className="label-text-alt text-rose-500 dark:text-rose-400 text-sm md:text-base lg:text-lg 5xl:text-xl">
                          {errors.confirmPassword.message}
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-control mt-1 md:mt-2 lg:mt-3 5xl:mt-4 6xl:mt-5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn w-full h-10 md:h-12 lg:h-14 5xl:h-16 6xl:h-20 text-base md:text-lg lg:text-xl 5xl:text-2xl 6xl:text-3xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-none bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 dark:from-indigo-500 dark:to-cyan-400 dark:hover:from-indigo-600 dark:hover:to-cyan-500 text-white"
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm md:loading-md lg:loading-lg"></span>
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </form>

              {/* Footer */}
              <div className="divider text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl font-medium text-gray-600 dark:text-gray-400 my-1 md:my-2 lg:my-3 5xl:my-4 6xl:my-5 before:bg-indigo-200 after:bg-indigo-200 dark:before:bg-indigo-800/50 dark:after:bg-indigo-800/50">OR</div>
              <div className="text-center">
                <p className="text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl text-gray-600 dark:text-gray-300">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold hover:underline transition-all duration-300 text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Illustration - Hidden on mobile, visible on lg screens and up */}
        <div className="hidden lg:flex w-full lg:w-3/5 justify-center items-center mr-6 aspect-[4/3] min-h-[400px]">
          <img 
            src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80"
            alt="Doctors in hospital"
            className="w-full h-full object-cover rounded-2xl shadow-lg border border-gray-200"
          />
        </div>
      </div>
    </div>
  )
}
