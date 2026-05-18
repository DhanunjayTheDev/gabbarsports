import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/axios'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    try {
      await api.post('/auth/forgot-password', data)
      setSent(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 font-accent text-sm mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        {sent ? (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="font-heading text-3xl text-gray-900 tracking-wider mb-3">CHECK YOUR EMAIL</h2>
            <p className="text-gray-400 font-accent">
              We sent a password reset link to your email address. Check your inbox.
            </p>
            <Link to="/login" className="btn-primary mt-8 inline-flex">
              Back to Login
            </Link>
          </motion.div>
        ) : (
          <>
            <h1 className="font-heading text-4xl text-gray-900 tracking-wider mb-2">FORGOT PASSWORD</h1>
            <p className="text-gray-400 font-accent mb-10">Enter your email to receive a reset link</p>

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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}
