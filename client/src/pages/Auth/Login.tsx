import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/stores/authStore'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    setIsLoading(true)
    try {
      const response = await api.post('/auth/login', data)
      const { user, accessToken } = response.data.data
      login(user, accessToken)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error?.response?.data?.message || 'Login failed. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left - decorative */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <div className="font-heading text-8xl text-gray-200 tracking-widest mb-8">GABBAR</div>
            <div className="font-heading text-8xl text-brand-orange tracking-widest">SPORTS</div>
            <p className="mt-8 text-gray-400 font-accent text-lg">India's Premium Sports Store</p>
          </div>
        </div>
        <div className="absolute top-20 left-10 w-40 h-40 bg-brand-orange/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-amber-200/40 rounded-full blur-3xl" />
      </div>

      {/* Right - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-brand-orange flex items-center justify-center font-heading text-white">
              G
            </div>
            <span className="font-heading text-xl tracking-widest text-gray-900">GABBAR SPORTS</span>
          </Link>

          <h1 className="font-heading text-4xl text-gray-900 tracking-wider mb-2">WELCOME BACK</h1>
          <p className="text-gray-400 font-accent mb-10">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-accent text-gray-600 mb-2">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 font-accent text-sm focus:outline-none focus:border-brand-orange/50 transition-all duration-200"
              />
              {errors.email && (
                <p className="mt-1.5 text-red-500 text-xs font-accent">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-accent text-gray-600">Password</label>
                <Link to="/forgot-password" className="text-xs font-accent text-brand-orange hover:text-brand-orange-dark transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 font-accent text-sm focus:outline-none focus:border-brand-orange/50 transition-all duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-red-500 text-xs font-accent">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm font-accent mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-orange hover:text-brand-orange-dark transition-colors font-semibold">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
