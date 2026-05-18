import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Heart, MapPin, Settings, User, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const MENU_ITEMS = [
  { icon: Package, label: 'My Orders', description: 'Track and manage your orders', href: '/dashboard/orders', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Heart, label: 'Wishlist', description: 'Items you saved for later', href: '/dashboard/wishlist', color: 'text-red-500', bg: 'bg-red-50' },
  { icon: MapPin, label: 'Addresses', description: 'Manage delivery addresses', href: '/dashboard/addresses', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: Settings, label: 'Account Settings', description: 'Profile, password & preferences', href: '/dashboard/profile', color: 'text-brand-orange', bg: 'bg-orange-50' },
]

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-5 mb-8 shadow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-orange flex items-center justify-center font-heading text-3xl text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-heading text-3xl text-gray-900 tracking-wider">{user?.name?.toUpperCase()}</h1>
            <p className="text-gray-400 font-accent text-sm mt-0.5">{user?.email}</p>
          </div>
          <Link to="/dashboard/profile" className="ml-auto">
            <User className="w-5 h-5 text-gray-300 hover:text-gray-700 transition-colors" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {MENU_ITEMS.map(({ icon: Icon, label, description, href, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={href}
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-card-hover transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-accent font-semibold">{label}</p>
                  <p className="text-gray-400 text-xs font-accent mt-0.5">{description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
