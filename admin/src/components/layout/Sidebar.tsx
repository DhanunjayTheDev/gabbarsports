import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, FolderOpen,
  Award, Warehouse, Image, Settings, ChevronRight, LogOut, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdminAuthStore } from '@/stores/authStore'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Orders', href: '/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/customers', icon: Users },
  { label: 'Coupons', href: '/coupons', icon: Tag },
  { label: 'Categories', href: '/categories', icon: FolderOpen },
  { label: 'Brands', href: '/brands', icon: Award },
  { label: 'Inventory', href: '/inventory', icon: Warehouse },
  { label: 'Banners', href: '/banners', icon: Image },
  { label: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAdminAuthStore()

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="w-[240px] flex-shrink-0 h-full flex flex-col bg-white border-r border-gray-100"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-orange flex items-center justify-center font-heading text-white text-lg">
            G
          </div>
          <div>
            <p className="font-heading text-sm text-gray-900 tracking-wider">GABBAR SPORTS</p>
            <p className="text-gray-400 text-[10px] font-medium uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={label}
            to={href}
            onClick={onClose}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
              isActive
                ? 'bg-brand-orange/10 text-brand-orange'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
            )}
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-brand-orange' : 'text-gray-400 group-hover:text-gray-600')} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-3 h-3 text-brand-orange" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 border border-gray-100 mb-2">
          <div className="w-8 h-8 rounded-xl bg-brand-orange flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gray-400 text-xs capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </motion.aside>
  )
}
