import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Heart, Search, User, Menu, X,
  ChevronDown, LogOut, Package, MapPin, Settings, ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import { GiCricketBat, GiSoccerBall, GiShuttlecock, GiHockey, GiRunningShoe, GiPoloShirt, GiSportMedal } from 'react-icons/gi'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'
import type { IconType } from 'react-icons'

type SubItem = { label: string; href: string }
type ShopCategory = { label: string; href: string; Icon: IconType; color: string; sub: SubItem[] }

const SHOP_CATEGORIES: ShopCategory[] = [
  {
    label: 'Cricket', href: '/category/cricket', Icon: GiCricketBat, color: '#FF6B00',
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
    label: 'Football', href: '/category/football', Icon: GiSoccerBall, color: '#22C55E',
    sub: [
      { label: 'Boots', href: '/category/football-boots' },
      { label: 'Balls', href: '/category/football-balls' },
      { label: 'Shin Guards', href: '/category/football-shin-guards' },
      { label: 'Gloves', href: '/category/football-gloves' },
      { label: 'Jerseys', href: '/category/football-jerseys' },
    ],
  },
  {
    label: 'Badminton', href: '/category/badminton', Icon: GiShuttlecock, color: '#EAB308',
    sub: [
      { label: 'Rackets', href: '/category/badminton-rackets' },
      { label: 'Shuttlecocks', href: '/category/badminton-shuttlecocks' },
      { label: 'Shoes', href: '/category/badminton-shoes' },
      { label: 'Bags', href: '/category/badminton-bags' },
      { label: 'Strings', href: '/category/badminton-strings' },
    ],
  },
  {
    label: 'Hockey', href: '/category/hockey', Icon: GiHockey, color: '#3B82F6',
    sub: [
      { label: 'Sticks', href: '/category/hockey-sticks' },
      { label: 'Balls', href: '/category/hockey-balls' },
      { label: 'Gloves', href: '/category/hockey-gloves' },
      { label: 'Shoes', href: '/category/hockey-shoes' },
      { label: 'Gear', href: '/category/hockey-gear' },
    ],
  },
  { label: 'Shoes', href: '/category/shoes', Icon: GiRunningShoe, color: '#A855F7', sub: [] },
  { label: 'Jerseys', href: '/category/jerseys', Icon: GiPoloShirt, color: '#EF4444', sub: [] },
  { label: 'Accessories', href: '/category/accessories', Icon: GiSportMedal, color: '#06B6D4', sub: [] },
]

const TOP_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileShopOpen, setMobileShopOpen] = useState(false)
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

  useEffect(() => {
    setShopOpen(false)
    setProfileOpen(false)
    setMobileExpanded(null)
    setMobileShopOpen(false)
  }, [location.pathname])

  function openShop() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setShopOpen(true)
  }
  function scheduleClose() {
    closeTimer.current = setTimeout(() => setShopOpen(false), 140)
  }
  function handleLogout() { logout(); setProfileOpen(false); navigate('/') }

  const isShopActive = location.pathname.startsWith('/category')

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
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-accent font-medium transition-all duration-150',
                location.pathname === '/'
                  ? 'text-brand-orange'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
              )}
            >
              Home
            </Link>

            {/* Shop with mega menu */}
            <div
              className="relative"
              onMouseEnter={openShop}
              onMouseLeave={scheduleClose}
            >
              <button
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-accent font-medium transition-all duration-150',
                  isShopActive || shopOpen
                    ? 'text-brand-orange'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                )}
              >
                Shop
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', shopOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {shopOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 10, x: '-50%' }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    style={{ left: '50%' }}
                    className="fixed top-[68px] w-[min(1100px,calc(100vw-2rem))] z-50 pt-3"
                    onMouseEnter={openShop}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.12)] overflow-hidden">
                      <div className="grid grid-cols-[1fr_280px]">

                        {/* Categories grid */}
                        <div className="p-6 grid grid-cols-4 gap-x-6 gap-y-5">
                          {SHOP_CATEGORIES.map((cat) => (
                            <div key={cat.label}>
                              <Link
                                to={cat.href}
                                className="group flex items-center gap-2 mb-3"
                              >
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                                  style={{ backgroundColor: `${cat.color}15`, border: `1px solid ${cat.color}25` }}
                                >
                                  <cat.Icon size={16} style={{ color: cat.color }} />
                                </div>
                                <span className="font-heading text-sm tracking-wider text-gray-900 group-hover:text-brand-orange transition-colors">
                                  {cat.label.toUpperCase()}
                                </span>
                              </Link>
                              {cat.sub.length > 0 ? (
                                <ul className="space-y-1.5">
                                  {cat.sub.map((s) => (
                                    <li key={s.href}>
                                      <Link
                                        to={s.href}
                                        className={cn(
                                          'text-xs font-accent text-gray-500 hover:text-brand-orange transition-colors block py-0.5',
                                          location.pathname === s.href && 'text-brand-orange font-semibold',
                                        )}
                                      >
                                        {s.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <Link
                                  to={cat.href}
                                  className="text-xs font-accent text-gray-400 hover:text-brand-orange transition-colors"
                                >
                                  Shop all →
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Featured panel */}
                        <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50/50 p-6 flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-orange/10 rounded-full blur-2xl" />
                          <div className="relative">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 mb-3">
                              <Sparkles className="w-3 h-3 text-brand-orange" />
                              <span className="text-[10px] font-accent font-bold text-brand-orange uppercase tracking-widest">Featured</span>
                            </div>
                            <p className="font-heading text-2xl text-gray-900 tracking-wider leading-tight mb-2">
                              SEASON<br />SALE
                            </p>
                            <p className="text-gray-500 text-xs font-accent leading-relaxed">
                              Up to 40% off on premium cricket gear. Limited time.
                            </p>
                          </div>
                          <Link
                            to="/search"
                            className="relative mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-accent font-bold rounded-xl transition-all duration-200 shadow-[0_4px_20px_rgba(255,107,0,0.3)]"
                          >
                            Shop Deals <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {TOP_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-accent font-medium transition-all duration-150',
                  location.pathname === link.href
                    ? 'text-brand-orange'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                )}
              >
                {link.label}
              </Link>
            ))}
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

              <Link
                to="/"
                onClick={() => setMobileMenu(false)}
                className={cn(
                  'flex items-center px-4 py-3 rounded-xl font-accent text-sm',
                  location.pathname === '/' ? 'text-brand-orange font-semibold bg-orange-50' : 'text-gray-700 hover:bg-gray-50',
                )}
              >
                Home
              </Link>

              {/* Shop accordion */}
              <div>
                <button
                  onClick={() => setMobileShopOpen(!mobileShopOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-accent text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className={cn(isShopActive && 'text-brand-orange font-semibold')}>Shop</span>
                  <ChevronDown className={cn('w-4 h-4 transition-transform', mobileShopOpen && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {mobileShopOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pl-3"
                    >
                      <div className="space-y-0.5 py-1 border-l-2 border-gray-100 ml-2 pl-3">
                        {SHOP_CATEGORIES.map((cat) => (
                          <div key={cat.label}>
                            <div className="flex items-center">
                              <Link
                                to={cat.href}
                                onClick={() => setMobileMenu(false)}
                                className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg font-accent text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <cat.Icon size={16} style={{ color: cat.color }} />
                                {cat.label}
                              </Link>
                              {cat.sub.length > 0 && (
                                <button
                                  onClick={() => setMobileExpanded(mobileExpanded === cat.label ? null : cat.label)}
                                  className="p-2.5 text-gray-400"
                                >
                                  <ChevronDown className={cn('w-4 h-4 transition-transform', mobileExpanded === cat.label && 'rotate-180')} />
                                </button>
                              )}
                            </div>
                            <AnimatePresence>
                              {mobileExpanded === cat.label && cat.sub.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden pl-7 pb-1"
                                >
                                  {cat.sub.map((sub) => (
                                    <Link
                                      key={sub.href}
                                      to={sub.href}
                                      onClick={() => { setMobileMenu(false); setMobileExpanded(null) }}
                                      className={cn(
                                        'block px-3 py-2 rounded-lg text-sm font-accent',
                                        location.pathname === sub.href
                                          ? 'text-brand-orange font-semibold bg-orange-50'
                                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
                                      )}
                                    >
                                      {sub.label}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {TOP_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenu(false)}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-xl font-accent text-sm',
                    location.pathname === link.href ? 'text-brand-orange font-semibold bg-orange-50' : 'text-gray-700 hover:bg-gray-50',
                  )}
                >
                  {link.label}
                </Link>
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
