import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-heading text-4xl text-gray-900 tracking-wider">PROFILE</h1>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-brand-orange flex items-center justify-center font-heading text-3xl text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-heading text-2xl text-gray-900">{user?.name}</h2>
              <p className="text-gray-400 font-accent text-sm">{user?.email}</p>
            </div>
          </div>

          {[
            { label: 'Full Name', value: user?.name, type: 'text' },
            { label: 'Email Address', value: user?.email, type: 'email' },
            { label: 'Phone Number', value: user?.phone || '', type: 'tel' },
          ].map(({ label, value, type }) => (
            <div key={label}>
              <label className="block text-xs font-accent text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
              <input
                type={type}
                defaultValue={value}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 font-accent text-sm focus:outline-none focus:border-brand-orange/50 transition-all"
              />
            </div>
          ))}

          <button className="w-full btn-primary py-3">Save Changes</button>
        </div>
      </div>
    </div>
  )
}
