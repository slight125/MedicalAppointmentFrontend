import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, Heart } from 'lucide-react'
import type { AppDispatch, RootState } from '../../store'
import { loginUser } from '../../store/slices/authSlice'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap()
      toast.success('Login successful!')
      // Store token in localStorage
      if (result.token) {
        localStorage.setItem('token', result.token)
      }
      // Redirect based on user role
      const { user } = result
      switch (user.role) {
        case 'admin':
          navigate('/dashboard/admin')
          break
        case 'doctor':
          navigate('/dashboard/doctor')
          break
        default:
          navigate('/dashboard')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid email or password.'
      toast.error(errorMessage)
    }
  }

  // Clear error on input change
  const handleInputChange = () => {
    if (error) {
      dispatch({ type: 'auth/clearError' })
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] w-screen bg-gradient-to-br from-purple-600/20 to-cyan-400/20 dark:from-purple-600/30 dark:to-cyan-400/30 flex items-center justify-center transition-colors duration-300">
      <div className="w-screen flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 3xl:px-48 4xl:px-64 5xl:px-96 6xl:px-[15rem] py-8 lg:py-12 5xl:py-16 6xl:py-20">
        <div className="w-full lg:w-2/5 5xl:w-1/3 6xl:w-1/3">
          {/* Header */}
          <div className="text-center mb-4 md:mb-6 lg:mb-8 5xl:mb-10 6xl:mb-12">
            <div className="flex items-center justify-center gap-2 md:gap-3 lg:gap-4 mb-3 md:mb-4 lg:mb-5">
              <div className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 rounded-full p-2 md:p-3 lg:p-4 shadow-[0_0_15px_rgba(139,92,246,0.6)] dark:shadow-[0_0_20px_rgba(139,92,246,0.8)]">
                <Heart className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 5xl:w-10 5xl:h-10 6xl:w-12 6xl:h-12 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl 5xl:text-4xl 6xl:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-cyan-500 dark:from-fuchsia-500 dark:to-cyan-400">MediCare</h1>
            </div>
            <h2 className="text-lg md:text-xl lg:text-2xl 5xl:text-3xl 6xl:text-4xl font-semibold text-gray-800 dark:text-gray-100 mb-2 md:mb-3 drop-shadow-sm dark:drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]">Welcome Back</h2>
            <p className="text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl text-gray-600 dark:text-gray-300">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <div className="card bg-white dark:bg-gray-900 shadow-lg dark:shadow-[0_0_25px_rgba(139,92,246,0.5)] border border-gray-300 dark:border-fuchsia-900/50 rounded-xl w-full transition-all duration-300">
            <div className="card-body p-5 md:p-6 lg:p-8 5xl:p-10 6xl:p-12">
              {error && (
                <div className="alert alert-error mb-3 md:mb-4 lg:mb-5 text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl border-l-4 border-l-rose-500">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5 lg:space-y-6 5xl:space-y-8 6xl:space-y-10">
                {/* Email Field */}
                <div className="form-control">
                  <label className="label py-1 md:py-2 lg:py-3">
                    <span className="label-text font-medium text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl">Email</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-fuchsia-500 dark:text-cyan-400 pointer-events-none" />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="alice@example.com"
                      className={`input w-full pl-10 md:pl-12 lg:pl-14 5xl:pl-16 6xl:pl-20 h-11 md:h-12 lg:h-14 5xl:h-16 6xl:h-18 text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl bg-white dark:bg-gray-800 border-gray-400 dark:border-fuchsia-900 focus:border-fuchsia-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-fuchsia-500/30 dark:focus:ring-cyan-400/30 text-gray-800 dark:text-white transition-colors ${
                        errors.email ? 'border-rose-500 dark:border-rose-600 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/30 dark:focus:ring-rose-600/30' : ''
                      }`}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.email && (
                    <label className="label py-1 md:py-2">
                      <span className="label-text-alt text-rose-500 dark:text-rose-400 text-sm md:text-base lg:text-lg 5xl:text-xl">
                        {errors.email.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Password Field */}
                <div className="form-control">
                  <label className="label py-1 md:py-2 lg:py-3">
                    <span className="label-text font-medium text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl">Password</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-fuchsia-500 dark:text-cyan-400 pointer-events-none" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className={`input w-full pl-10 md:pl-12 lg:pl-14 5xl:pl-16 6xl:pl-20 pr-10 md:pr-12 lg:pr-14 5xl:pr-16 6xl:pr-20 h-11 md:h-12 lg:h-14 5xl:h-16 6xl:h-18 text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl bg-white dark:bg-gray-800 border-gray-400 dark:border-fuchsia-900 focus:border-fuchsia-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-fuchsia-500/30 dark:focus:ring-cyan-400/30 text-gray-800 dark:text-white transition-colors ${
                        errors.password ? 'border-rose-500 dark:border-rose-600 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/30 dark:focus:ring-rose-600/30' : ''
                      }`}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-fuchsia-500 dark:text-cyan-400 hover:text-fuchsia-600 dark:hover:text-cyan-500 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 5xl:h-8 5xl:w-8 6xl:h-9 6xl:w-9" />
                      ) : (
                        <Eye className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 5xl:h-8 5xl:w-8 6xl:h-9 6xl:w-9" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <label className="label py-1 md:py-2">
                      <span className="label-text-alt text-error text-sm md:text-base lg:text-lg 5xl:text-xl">
                        {errors.password.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Submit Button */}
                <div className="form-control mt-4 md:mt-6 lg:mt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn w-full h-12 md:h-14 lg:h-16 5xl:h-20 6xl:h-24 text-base md:text-lg lg:text-xl 5xl:text-2xl 6xl:text-3xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-none bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:from-fuchsia-700 hover:to-cyan-600 dark:from-fuchsia-500 dark:to-cyan-400 dark:hover:from-fuchsia-600 dark:hover:to-cyan-500 text-white"
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm md:loading-md lg:loading-lg"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>
              </form>

              {/* Footer */}
              <div className="divider text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl font-medium text-gray-600 dark:text-gray-400 my-3 md:my-4 lg:my-6 5xl:my-8 6xl:my-10 before:bg-fuchsia-200 after:bg-fuchsia-200 dark:before:bg-fuchsia-800/50 dark:after:bg-fuchsia-800/50">OR</div>
              <div className="text-center">
                <p className="text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl text-gray-600 dark:text-gray-300">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-semibold hover:underline transition-all duration-300 text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl text-fuchsia-600 dark:text-cyan-400 hover:text-fuchsia-700 dark:hover:text-cyan-300"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Illustration - Hidden on mobile, visible on lg screens and up */}
        <div className="hidden lg:flex w-full lg:w-3/5 justify-center items-center ml-6 aspect-[4/3] min-h-[400px]">
          <img 
            src="https://undraw.org/illustrations/svg/undraw_medicine_b1ol.svg" 
            alt="Login medical illustration" 
            className="w-full h-full object-cover rounded-2xl shadow-lg border border-gray-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&w=800";
            }}
          />
        </div>
      </div>
    </div>
  )
}
