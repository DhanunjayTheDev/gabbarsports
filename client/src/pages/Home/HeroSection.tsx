import { useEffect, useRef } from 'react'
import React from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ShieldCheck, Truck, Star, Trophy, Users, Package, ArrowRight, ArrowUpRight } from 'lucide-react'
import { GiCricketBat, GiSoccerBall, GiShuttlecock, GiRunningShoe, GiPoloShirt } from 'react-icons/gi'

const CRICKET_IMAGES = {
  main: 'https://images.unsplash.com/WJUjQcx0sRM?auto=format&fit=crop&w=900&q=85',
  action: 'https://images.unsplash.com/x7RAeWFHwu0?auto=format&fit=crop&w=500&q=80',
  mainFallback: 'https://images.unsplash.com/photo-1540747913346-19212a4b423e?auto=format&fit=crop&w=900&q=85',
  actionFallback: 'https://images.unsplash.com/7r6cX6FYNz0?auto=format&fit=crop&w=500&q=80',
}

const TRUST_BADGES = [
  { icon: ShieldCheck, label: '100% Genuine' },
  { icon: Truck, label: 'Free Delivery ₹999+' },
  { icon: Star, label: '4.9 Rated' },
]

const CATEGORIES = [
  { label: 'Cricket', sub: 'Bats · Pads · Helmets', href: '/category/cricket', Icon: GiCricketBat, color: '#FF6B00', bg: 'from-orange-50 to-amber-50/60', border: 'border-orange-100' },
  { label: 'Football', sub: 'Boots · Balls · Shin', href: '/category/football', Icon: GiSoccerBall, color: '#22C55E', bg: 'from-green-50 to-emerald-50/60', border: 'border-green-100' },
  { label: 'Badminton', sub: 'Rackets · Shuttles', href: '/category/badminton', Icon: GiShuttlecock, color: '#EAB308', bg: 'from-yellow-50 to-lime-50/60', border: 'border-yellow-100' },
  { label: 'Shoes', sub: 'Sports & Training', href: '/category/shoes', Icon: GiRunningShoe, color: '#A855F7', bg: 'from-purple-50 to-violet-50/60', border: 'border-purple-100' },
  { label: 'Jerseys', sub: 'Club & National', href: '/category/jerseys', Icon: GiPoloShirt, color: '#EF4444', bg: 'from-red-50 to-rose-50/60', border: 'border-red-100' },
]

function CategoryCard({ label, sub, href, Icon, color, bg, border }: typeof CATEGORIES[0]) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 500, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 500, damping: 30 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) / rect.width)
    y.set((e.clientY - rect.top - rect.height / 2) / rect.height)
  }

  return (
    <Link to={href} style={{ perspective: '900px' }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0) }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{
          scale: 1.06,
          boxShadow: `0 20px 50px -10px ${color}40, 0 8px 20px -6px ${color}25`,
        }}
        initial={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
        transition={{ scale: { type: 'spring', stiffness: 500, damping: 30 } }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${bg} border ${border} cursor-pointer p-5 flex flex-col gap-5`}
      >
        {/* Watermark icon in background */}
        <div
          className="absolute -right-5 -bottom-5 opacity-[0.07] pointer-events-none"
          style={{ transform: 'translateZ(0)' }}
        >
          <Icon size={100} style={{ color }} />
        </div>

        {/* Icon box */}
        <div style={{ transform: 'translateZ(20px)' }}>
          <motion.div
            whileHover={{ scale: 1.12 }}
            transition={{ type: 'spring', stiffness: 600, damping: 20 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15`, border: `1.5px solid ${color}30` }}
          >
            <Icon size={28} style={{ color }} />
          </motion.div>
        </div>

        {/* Text block directly below icon, no gap */}
        <div className="flex flex-col gap-0.5" style={{ transform: 'translateZ(16px)' }}>
          <p className="font-heading text-xl text-gray-900 tracking-wide leading-none">{label}</p>
          <p className="text-gray-400 text-[11px] font-accent">{sub}</p>
          <motion.div
            className="flex items-center gap-1 mt-3"
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            <span className="text-[11px] font-accent font-bold uppercase tracking-widest" style={{ color }}>
              Shop Now
            </span>
            <ArrowUpRight size={12} style={{ color }} />
          </motion.div>
        </div>

        {/* Hover accent left bar */}
        <motion.div
          className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full origin-bottom"
          initial={{ scaleY: 0 }}
          whileHover={{ scaleY: 1 }}
          transition={{ duration: 0.25 }}
          style={{ backgroundColor: color }}
        />
      </motion.div>
    </Link>
  )
}

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLDivElement>(null)
  const [mainImgSrc, setMainImgSrc] = React.useState(CRICKET_IMAGES.main)
  const [actionImgSrc, setActionImgSrc] = React.useState(CRICKET_IMAGES.action)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 })
    tl.fromTo(
      contentRef.current,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
    ).fromTo(
      imagesRef.current,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6',
    )
  }, [])

  return (
    <section className="relative min-h-screen bg-white flex items-center overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/4 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/4 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left: Content */}
          <div ref={contentRef} className="space-y-8" style={{ opacity: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/8 rounded-full border border-brand-orange/20">
              <Trophy className="w-3.5 h-3.5 text-brand-orange" />
              <span className="text-brand-orange text-sm font-accent font-bold uppercase tracking-widest">
                India's #1 Cricket Store
              </span>
            </div>

            <div>
              <h1 className="font-heading text-[72px] sm:text-[88px] lg:text-[96px] leading-[0.92] tracking-wide text-gray-900 uppercase">
                PLAY YOUR
                <br />
                <span className="relative inline-block">
                  BEST
                  <span className="text-brand-orange"> GAME.</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="6"
                    viewBox="0 0 300 6"
                    fill="none"
                  >
                    <path d="M0 3 Q150 0 300 3" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </div>

            <p className="text-gray-500 text-lg font-body leading-relaxed max-w-md">
              India's premier cricket store. Premium bats, pads, helmets &amp; complete cricket gear trusted by 50,000+ athletes.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/category/cricket" className="btn-primary flex items-center gap-2.5 text-base py-4 px-8">
                Shop Cricket <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/category/all" className="btn-ghost flex items-center gap-2 text-base py-4 px-8">
                All Sports
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-brand-orange" />
                  </div>
                  <span className="text-gray-600 text-sm font-accent font-medium">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-10 pt-2 border-t border-gray-100">
              {[
                { value: '50K+', label: 'Athletes', icon: Users },
                { value: '5000+', label: 'Products', icon: Package },
                { value: '100+', label: 'Top Brands', icon: Trophy },
              ].map(({ value, label, icon: Icon }) => (
                <div key={label}>
                  <div className="font-heading text-3xl text-gray-900">{value}</div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs font-accent uppercase tracking-wider mt-0.5">
                    <Icon className="w-3 h-3" />
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Images */}
          <div ref={imagesRef} className="relative h-[580px] lg:h-[640px]" style={{ opacity: 0 }}>
            <div className="absolute top-8 right-8 w-72 h-72 bg-brand-orange/8 rounded-full -z-0" />
            <div className="absolute bottom-12 left-4 w-40 h-40 bg-brand-blue/6 rounded-full -z-0" />

            {/* Main large image */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 right-0 w-[78%] h-[78%] rounded-3xl overflow-hidden shadow-hero-image z-10"
            >
              <img
                src={mainImgSrc}
                alt="Cricket equipment"
                className="w-full h-full object-cover object-center"
                loading="eager"
                onError={() => setMainImgSrc(CRICKET_IMAGES.mainFallback)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                <Trophy className="w-3.5 h-3.5 text-brand-orange" />
                <span className="text-xs font-accent font-bold text-gray-900">Pro Cricket Gear</span>
              </div>
            </motion.div>

            {/* Secondary image */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-0 left-0 w-[50%] h-[46%] rounded-2xl overflow-hidden shadow-hero-image z-20 border-4 border-white"
            >
              <img
                src={actionImgSrc}
                alt="Cricket training"
                className="w-full h-full object-cover object-center"
                loading="lazy"
                onError={() => setActionImgSrc(CRICKET_IMAGES.actionFallback)}
              />
            </motion.div>

            {/* Floating rating card */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute top-[30%] -left-4 lg:-left-8 z-30 bg-white rounded-2xl px-5 py-4 shadow-card-hover border border-gray-100 min-w-[160px]"
            >
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-2xl font-heading text-gray-900">4.9</span>
              </div>
              <div className="text-gray-500 text-xs font-accent mt-0.5">12,000+ Reviews</div>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                    <Users className="w-3 h-3 text-gray-400" />
                  </div>
                ))}
                <div className="w-6 h-6 rounded-full bg-brand-orange flex items-center justify-center text-[10px] font-bold text-white border-2 border-white">+</div>
              </div>
            </motion.div>

            {/* Free delivery badge */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [3, -3, 3] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="absolute bottom-[30%] right-0 z-30 bg-brand-orange text-white rounded-2xl px-4 py-3 shadow-brand-orange"
            >
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span className="text-xs font-accent font-bold uppercase tracking-wider">Free Delivery</span>
              </div>
              <div className="text-white/80 text-[11px] font-body mt-0.5">Orders above ₹999</div>
            </motion.div>
          </div>
        </div>

        {/* Category quick links 3D tilt cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-16 pt-8 border-t border-gray-100"
        >
          <p className="text-xs text-gray-400 font-accent uppercase tracking-widest mb-5">Popular Categories</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.08, duration: 0.45, ease: 'easeOut' }}
              >
                <CategoryCard {...cat} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
