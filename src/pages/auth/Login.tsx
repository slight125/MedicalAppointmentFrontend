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
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      toast.error(errorMessage)
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
          <div className="card bg-white/80 dark:bg-gray-900/80 shadow-[0_0_20px_rgba(139,92,246,0.3)] dark:shadow-[0_0_25px_rgba(139,92,246,0.5)] backdrop-blur-sm border border-fuchsia-200 dark:border-fuchsia-900/50 rounded-xl w-full transition-all duration-300">
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
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 5xl:h-8 5xl:w-8 6xl:h-9 6xl:w-9 text-fuchsia-500 dark:text-cyan-400" />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Enter your email"
                      className={`input w-full pl-10 md:pl-12 lg:pl-14 5xl:pl-16 6xl:pl-20 h-11 md:h-12 lg:h-14 5xl:h-16 6xl:h-18 text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl bg-white/50 dark:bg-gray-800/50 border-fuchsia-300 dark:border-fuchsia-900 focus:border-fuchsia-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-fuchsia-500/30 dark:focus:ring-cyan-400/30 transition-colors ${
                        errors.email ? 'border-rose-500 dark:border-rose-600 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/30 dark:focus:ring-rose-600/30' : ''
                      }`}
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
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 5xl:h-8 5xl:w-8 6xl:h-9 6xl:w-9 text-fuchsia-500 dark:text-cyan-400" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className={`input w-full pl-10 md:pl-12 lg:pl-14 5xl:pl-16 6xl:pl-20 pr-10 md:pr-12 lg:pr-14 5xl:pr-16 6xl:pr-20 h-11 md:h-12 lg:h-14 5xl:h-16 6xl:h-18 text-sm md:text-base lg:text-lg 5xl:text-xl 6xl:text-2xl bg-white/50 dark:bg-gray-800/50 border-fuchsia-300 dark:border-fuchsia-900 focus:border-fuchsia-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-fuchsia-500/30 dark:focus:ring-cyan-400/30 transition-colors ${
                        errors.password ? 'border-rose-500 dark:border-rose-600 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/30 dark:focus:ring-rose-600/30' : ''
                      }`}
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
        <div className="hidden lg:flex w-full lg:w-3/5 5xl:w-2/3 6xl:w-2/3 justify-center items-center ml-6 md:ml-8 lg:ml-10 xl:ml-12 2xl:ml-16 3xl:ml-20 4xl:ml-24 5xl:ml-28 6xl:ml-32">
          <div className="relative w-full h-full p-6 md:p-8 lg:p-10 5xl:p-12 6xl:p-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] dark:shadow-[0_0_25px_rgba(139,92,246,0.5)] border border-fuchsia-200 dark:border-fuchsia-900/50 transition-all duration-300">
            <img 
              src="https://cdn.jsdelivr.net/gh/gist/yuhongda0315/5f5476c427ea67a01e8c580ee580ce6f/raw/c2aa4e744a0bd64d7a1c89cd013c8245d6c0f748/undraw_medicine_b-1-ol.svg" 
              alt="Healthcare illustration" 
              className="w-full h-auto max-h-[60vh] lg:max-h-[65vh] xl:max-h-[70vh] 2xl:max-h-[75vh] 3xl:max-h-[80vh] 4xl:max-h-[85vh] 5xl:max-h-[90vh] 6xl:max-h-[95vh] object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://cdn.jsdelivr.net/gh/gist/SethClydesdale/085b7e87a9d05fbd8e941c86ef0fdd1c/raw/Healthcare-rafiki.svg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 dark:from-fuchsia-500/20 dark:to-cyan-500/20 rounded-2xl"></div>
            <div className="absolute bottom-6 md:bottom-8 lg:bottom-10 5xl:bottom-12 6xl:bottom-16 left-0 right-0 text-center text-base md:text-lg lg:text-xl 5xl:text-2xl 6xl:text-3xl text-gray-600 dark:text-gray-300 font-medium">
              Quality healthcare at your fingertips
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
