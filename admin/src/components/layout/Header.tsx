import { Bell, Menu, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/orders': 'Orders',
  '/customers': 'Customers',
  '/coupons': 'Coupons',
  '/categories': 'Categories',
  '/brands': 'Brands',
  '/inventory': 'Inventory',
  '/banners': 'Banners',
  '/settings': 'Settings',
}

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || 'Admin Panel'

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-heading text-2xl text-gray-900 tracking-wider">{title.toUpperCase()}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Quick search..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:border-brand-orange/40 focus:bg-white w-48 transition-all duration-200"
          />
        </div>
        <button className="relative p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full" />
        </button>
      </div>
    </header>
  )
}
