import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/stores/authStore'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterForm) {
    setIsLoading(true)
    try {
      const response = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      })
      const { user, accessToken } = response.data.data
      login(user, accessToken)
      toast.success('Account created! Welcome to Gabbar Sports!')
      navigate('/')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error?.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <div className="font-heading text-7xl text-gray-200 tracking-widest mb-6">JOIN THE</div>
            <div className="font-heading text-7xl text-brand-orange tracking-widest">SQUAD</div>
            <p className="mt-8 text-gray-400 font-accent text-lg">Create your Gabbar Sports account</p>
          </div>
        </div>
        <div className="absolute top-20 right-10 w-40 h-40 bg-brand-orange/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-amber-200/40 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto bg-white">
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

          <h1 className="font-heading text-4xl text-gray-900 tracking-wider mb-2">CREATE ACCOUNT</h1>
          <p className="text-gray-400 font-accent mb-10">Join 50,000+ athletes</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              { field: 'name' as const, label: 'Full Name', type: 'text', placeholder: 'Arjun Sharma' },
              { field: 'email' as const, label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
              { field: 'phone' as const, label: 'Mobile Number', type: 'tel', placeholder: '9876543210' },
            ].map(({ field, label, type, placeholder }) => (
              <div key={field}>
                <label className="block text-sm font-accent text-gray-600 mb-2">{label}</label>
                <input
                  {...register(field)}
                  type={type}
                  placeholder={placeholder}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 font-accent text-sm focus:outline-none focus:border-brand-orange/50 transition-all duration-200"
                />
                {errors[field] && (
                  <p className="mt-1.5 text-red-500 text-xs font-accent">{errors[field]?.message}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-accent text-gray-600 mb-2">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
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

            <div>
              <label className="block text-sm font-accent text-gray-600 mb-2">Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Re-enter password"
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 font-accent text-sm focus:outline-none focus:border-brand-orange/50 transition-all duration-200"
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-red-500 text-xs font-accent">{errors.confirmPassword.message}</p>
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
                  Create Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm font-accent mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-orange hover:text-brand-orange-dark transition-colors font-semibold">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
