import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
  Settings,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

const NAV_CATEGORIES = [
  {
    label: 'Cricket',
    href: '/category/cricket',
    sub: ['Bats', 'Balls', 'Pads', 'Gloves', 'Helmets', 'Bags'],
  },
  {
    label: 'Football',
    href: '/category/football',
    sub: ['Boots', 'Balls', 'Shin Guards', 'Gloves', 'Jerseys'],
  },
  {
    label: 'Badminton',
    href: '/category/badminton',
    sub: ['Rackets', 'Shuttlecocks', 'Shoes', 'Bags', 'Strings'],
  },
  {
    label: 'Hockey',
    href: '/category/hockey',
    sub: ['Sticks', 'Balls', 'Gloves', 'Shoes', 'Gear'],
  },
  { label: 'Shoes', href: '/category/shoes', sub: [] },
  { label: 'Jerseys', href: '/category/jerseys', sub: [] },
  { label: 'Accessories', href: '/category/accessories', sub: [] },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)

  const { user, isAuthenticated, logout } = useAuthStore()
  const itemCount = useCartStore((s) => s.itemCount())
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const { setCartOpen, setSearchOpen, isMobileMenuOpen, setMobileMenu } = useUIStore()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleLogout() {
    logout()
    setProfileOpen(false)
    navigate('/')
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm'
          : 'bg-white border-b border-gray-100',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand-orange flex items-center justify-center font-heading text-xl text-white group-hover:bg-brand-orange-dark transition-colors duration-200">
              G
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-2xl tracking-widest text-gray-900">
                GABBAR <span className="text-brand-orange">SPORTS</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="relative"
                onMouseEnter={() => cat.sub.length > 0 && setActiveMenu(cat.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to={cat.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-accent font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-150"
                >
                  {cat.label}
                  {cat.sub.length > 0 && (
                    <ChevronDown className={cn('w-3 h-3 transition-transform duration-150', activeMenu === cat.label && 'rotate-180')} />
                  )}
                </Link>

                <AnimatePresence>
                  {activeMenu === cat.label && cat.sub.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full left-0 pt-2 z-50"
                    >
                      <div className="bg-white border border-gray-100 rounded-xl shadow-card-hover p-2 min-w-[160px]">
                        {cat.sub.map((sub) => (
                          <Link
                            key={sub}
                            to={`${cat.href}?type=${sub.toLowerCase()}`}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-100"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-150"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              to="/dashboard/wishlist"
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-150"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-150"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative ml-1">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition-all duration-150"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-2 z-50"
                    >
                      <div className="bg-white border border-gray-100 rounded-xl shadow-card-hover p-2 min-w-[200px]">
                        <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                          <p className="text-gray-900 font-medium text-sm">{user?.name}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{user?.email}</p>
                        </div>
                        {[
                          { label: 'Dashboard', href: '/dashboard', icon: User },
                          { label: 'My Orders', href: '/dashboard/orders', icon: Package },
                          { label: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
                          { label: 'Settings', href: '/dashboard/profile', icon: Settings },
                        ].map(({ label, href, icon: Icon }) => (
                          <Link
                            key={label}
                            to={href}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-100"
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-100 mt-1 border-t border-gray-100 pt-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex btn-primary py-2 px-5 text-sm ml-2">
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileMenu(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-150 ml-1"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-0.5">
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.href}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-150 font-accent text-sm"
                >
                  {cat.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 flex gap-3 border-t border-gray-100 mt-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenu(false)}
                    className="btn-primary flex-1 text-center py-3"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenu(false)}
                    className="btn-ghost flex-1 text-center py-3"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
