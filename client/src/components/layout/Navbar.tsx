import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Heart, Search, User, Menu, X,
  ChevronDown, LogOut, Package, MapPin, Settings, ArrowUpRight,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

type SubItem = { label: string; href: string }
type NavCategory = { label: string; href: string; sub: SubItem[] }

const NAV_CATEGORIES: NavCategory[] = [
  {
    label: 'Cricket',
    href: '/category/cricket',
    sub: [
      { label: 'Bats', href: '/category/cricket-bats' },
      { label: 'Balls', href: '/category/cricket-balls' },
      { label: 'Pads', href: '/category/cricket-pads' },
      { label: 'Gloves', href: '/category/cricket-gloves' },
      { label: 'Helmets', href: '/category/cricket-helmets' },
      { label: 'Bags', href: '/category/cricket-bags' },
    ],
  },
  {
    label: 'Football',
    href: '/category/football',
    sub: [
      { label: 'Boots', href: '/category/football-boots' },
      { label: 'Balls', href: '/category/football-balls' },
      { label: 'Shin Guards', href: '/category/football-shin-guards' },
      { label: 'Gloves', href: '/category/football-gloves' },
      { label: 'Jerseys', href: '/category/football-jerseys' },
    ],
  },
  {
    label: 'Badminton',
    href: '/category/badminton',
    sub: [
      { label: 'Rackets', href: '/category/badminton-rackets' },
      { label: 'Shuttlecocks', href: '/category/badminton-shuttlecocks' },
      { label: 'Shoes', href: '/category/badminton-shoes' },
      { label: 'Bags', href: '/category/badminton-bags' },
      { label: 'Strings', href: '/category/badminton-strings' },
    ],
  },
  {
    label: 'Hockey',
    href: '/category/hockey',
    sub: [
      { label: 'Sticks', href: '/category/hockey-sticks' },
      { label: 'Balls', href: '/category/hockey-balls' },
      { label: 'Gloves', href: '/category/hockey-gloves' },
      { label: 'Shoes', href: '/category/hockey-shoes' },
      { label: 'Gear', href: '/category/hockey-gear' },
    ],
  },
  { label: 'Shoes', href: '/category/shoes', sub: [] },
  { label: 'Jerseys', href: '/category/jerseys', sub: [] },
  { label: 'Accessories', href: '/category/accessories', sub: [] },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()

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

  useEffect(() => { setActiveMenu(null); setProfileOpen(false); setMobileExpanded(null) }, [location.pathname])

  function openMenu(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveMenu(label)
  }
  function scheduleClose() {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120)
  }
  function handleLogout() { logout(); setProfileOpen(false); navigate('/') }

  const isActive = (href: string) => {
    if (location.pathname === href) return true
    return NAV_CATEGORIES.find((c) => c.href === href)?.sub.some((s) => location.pathname === s.href) ?? false
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
        <div className="flex items-center justify-between h-16 md:h-[68px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand-orange flex items-center justify-center font-heading text-xl text-white group-hover:scale-105 transition-transform duration-200">
              G
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-xl tracking-widest text-gray-900">
                GABBAR <span className="text-brand-orange">SPORTS</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-gray-50 rounded-2xl px-2 py-1.5 border border-gray-100">
            {NAV_CATEGORIES.map((cat) => {
              const active = isActive(cat.href)
              return (
                <div
                  key={cat.label}
                  className="relative"
                  onMouseEnter={() => cat.sub.length > 0 ? openMenu(cat.label) : null}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    to={cat.href}
                    className={cn(
                      'flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-accent font-medium transition-all duration-150',
                      active
                        ? 'bg-brand-orange text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm',
                    )}
                  >
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-white mr-0.5 flex-shrink-0" />}
                    {cat.label}
                    {cat.sub.length > 0 && (
                      <ChevronDown className={cn('w-3 h-3 transition-transform duration-150', activeMenu === cat.label && 'rotate-180')} />
                    )}
                  </Link>

                  <AnimatePresence>
                    {activeMenu === cat.label && cat.sub.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.13, ease: 'easeOut' }}
                        className="absolute top-full left-0 pt-3 z-50"
                        onMouseEnter={() => openMenu(cat.label)}
                        onMouseLeave={scheduleClose}
                      >
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-2 min-w-[190px]">
                          {cat.sub.map((sub) => {
                            const subActive = location.pathname === sub.href
                            return (
                              <Link
                                key={sub.href}
                                to={sub.href}
                                className={cn(
                                  'flex items-center justify-between px-3.5 py-2.5 text-sm font-accent rounded-xl transition-all duration-100',
                                  subActive
                                    ? 'bg-brand-orange text-white font-semibold'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                                )}
                              >
                                {sub.label}
                                {subActive && <ArrowUpRight className="w-3.5 h-3.5" />}
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <button onClick={() => setSearchOpen(true)} className="p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>

            <Link to="/dashboard/wishlist" className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            <button onClick={() => setCartOpen(true)} className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span key={itemCount} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="absolute top-1 right-1 w-4 h-4 bg-brand-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative ml-1">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center p-1.5 rounded-xl hover:bg-gray-50 transition-all">
                  <div className="w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.13 }}
                      className="absolute right-0 top-full mt-3 z-50"
                    >
                      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-2 min-w-[210px]">
                        <div className="px-3.5 py-2.5 border-b border-gray-100 mb-1">
                          <p className="text-gray-900 font-semibold text-sm">{user?.name}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{user?.email}</p>
                        </div>
                        {[
                          { label: 'Dashboard', href: '/dashboard', icon: User },
                          { label: 'My Orders', href: '/dashboard/orders', icon: Package },
                          { label: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
                          { label: 'Settings', href: '/dashboard/profile', icon: Settings },
                        ].map(({ label, href, icon: Icon }) => (
                          <Link key={label} to={href} onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                            <Icon className="w-4 h-4" />{label}
                          </Link>
                        ))}
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1 border-t border-gray-100 pt-2">
                          <LogOut className="w-4 h-4" />Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-2 ml-2 px-5 py-2 bg-brand-orange hover:bg-brand-orange/90 text-white text-sm font-accent font-semibold rounded-xl transition-all">
                Sign In
              </Link>
            )}

            <button onClick={() => setMobileMenu(!isMobileMenuOpen)} className="lg:hidden p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all ml-1" aria-label="Menu">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden overflow-hidden bg-white border-t border-gray-100">
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-0.5">
              {NAV_CATEGORIES.map((cat) => (
                <div key={cat.label}>
                  <div className="flex items-center">
                    <Link
                      to={cat.href}
                      onClick={() => setMobileMenu(false)}
                      className={cn(
                        'flex-1 flex items-center px-4 py-3 rounded-xl transition-all font-accent text-sm',
                        isActive(cat.href) ? 'bg-brand-orange text-white font-semibold' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                      )}
                    >
                      {cat.label}
                    </Link>
                    {cat.sub.length > 0 && (
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === cat.label ? null : cat.label)}
                        className="p-3 text-gray-400 hover:text-gray-700 transition-colors"
                        aria-label={`Expand ${cat.label}`}
                      >
                        <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', mobileExpanded === cat.label && 'rotate-180')} />
                      </button>
                    )}
                  </div>
                  <AnimatePresence>
                    {mobileExpanded === cat.label && cat.sub.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-4"
                      >
                        <div className="space-y-0.5 pb-1 pt-0.5 border-l-2 border-gray-100 ml-4 pl-3">
                          {cat.sub.map((sub) => (
                            <Link
                              key={sub.href}
                              to={sub.href}
                              onClick={() => { setMobileMenu(false); setMobileExpanded(null) }}
                              className={cn(
                                'flex items-center px-3 py-2.5 rounded-lg text-sm font-accent transition-all',
                                location.pathname === sub.href
                                  ? 'text-brand-orange font-semibold bg-brand-orange/5'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                              )}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 flex gap-3 border-t border-gray-100 mt-3">
                  <Link to="/login" onClick={() => setMobileMenu(false)} className="flex-1 text-center py-3 bg-brand-orange text-white rounded-xl font-accent font-semibold text-sm">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileMenu(false)} className="flex-1 text-center py-3 bg-gray-50 text-gray-700 rounded-xl font-accent text-sm border border-gray-200">Register</Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
