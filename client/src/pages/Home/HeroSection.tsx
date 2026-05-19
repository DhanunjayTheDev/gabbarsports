import { useEffect, useRef } from 'react'
import React from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import {
  ShieldCheck, Truck, Star, Trophy, Sparkles,
  ArrowRight, ArrowUpRight, TrendingUp, Users, Package, Zap,
} from 'lucide-react'
import { GiCricketBat, GiSoccerBall, GiShuttlecock, GiRunningShoe, GiPoloShirt } from 'react-icons/gi'

const IMG_CRICKET = 'https://images.unsplash.com/photo-1540747913346-19212a4b423e?auto=format&fit=crop&w=900&q=85'

const MARQUEE_ITEMS = [
  'Cricket World Cup Gear',
  'Pro Athlete Endorsed',
  '100% Authentic Brands',
  'Free Delivery Above ₹999',
  '7-Day Easy Returns',
  '50,000+ Happy Athletes',
  '4.9 Star Rated',
]

const STATS = [
  { value: '50K+', label: 'Happy Athletes', Icon: Users },
  { value: '4.9★', label: 'Customer Rating', Icon: Star },
  { value: '200+', label: 'Premium Products', Icon: Package },
  { value: '15+', label: 'Sports Categories', Icon: Trophy },
]

const CATEGORIES = [
  { label: 'Cricket', sub: 'Bats · Pads', href: '/category/cricket', Icon: GiCricketBat, color: '#FF6B00' },
  { label: 'Football', sub: 'Boots · Balls', href: '/category/football', Icon: GiSoccerBall, color: '#22C55E' },
  { label: 'Badminton', sub: 'Rackets', href: '/category/badminton', Icon: GiShuttlecock, color: '#EAB308' },
  { label: 'Shoes', sub: 'Sports & Training', href: '/category/shoes', Icon: GiRunningShoe, color: '#A855F7' },
  { label: 'Jerseys', sub: 'Club & National', href: '/category/jerseys', Icon: GiPoloShirt, color: '#EF4444' },
]

function CategoryPill({ label, sub, href, Icon, color }: typeof CATEGORIES[0]) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 400, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 400, damping: 30 })

  return (
    <Link to={href} style={{ perspective: '800px' }}>
      <motion.div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          x.set((e.clientX - r.left - r.width / 2) / r.width)
          y.set((e.clientY - r.top - r.height / 2) / r.height)
        }}
        onMouseLeave={() => { x.set(0); y.set(0) }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.03, boxShadow: `0 12px 32px -8px ${color}30` }}
        transition={{ scale: { type: 'spring', stiffness: 500, damping: 30 } }}
        className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-gray-200/80 hover:border-gray-300 cursor-pointer transition-colors duration-200"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 text-sm font-heading tracking-wider leading-none">{label}</p>
          <p className="text-gray-400 text-[11px] font-accent mt-0.5">{sub}</p>
        </div>
        <ArrowUpRight size={13} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
      </motion.div>
    </Link>
  )
}

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [imgErr, setImgErr] = React.useState(false)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 })
    tl.fromTo(contentRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .fromTo(imageRef.current, { opacity: 0, x: 30, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, '-=0.6')
  }, [])

  return (
    <section className="relative min-h-screen bg-white flex flex-col overflow-hidden">

      {/* CSS dot-grid background — no canvas, always visible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #CACACA 1.5px, transparent 1.5px)',
          backgroundSize: '36px 36px',
        }}
      />
      {/* Radial fade to white at edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, white 85%)',
        }}
      />

      {/* Orange glow accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/6 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />

      {/* ── Marquee strip ── */}
      <div className="absolute top-20 left-0 right-0 z-[5] border-y border-gray-100 bg-white/80 backdrop-blur-sm overflow-hidden py-3">
        <div className="flex animate-marquee gap-10 whitespace-nowrap">
          {Array(3).fill(0).flatMap((_, batch) =>
            MARQUEE_ITEMS.map((item, i) => (
              <span key={`${batch}-${i}`} className="inline-flex items-center gap-2.5 text-gray-500 font-accent text-xs uppercase tracking-[0.2em]">
                <Sparkles className="w-3 h-3 text-brand-orange flex-shrink-0" />
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-[4] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-12 w-full flex-1 flex flex-col">

        {/* Live ticker + index */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-red-600 text-[10px] font-accent font-bold uppercase tracking-widest">Live</span>
            </div>
            <p className="text-gray-500 text-xs font-accent">
              Cricket World Cup gear · <span className="text-gray-900 font-semibold">Up to 40% off</span>
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-gray-300 font-heading text-sm tracking-widest">01</span>
            <span className="w-12 h-px bg-gray-200" />
            <span className="text-gray-400 text-[11px] font-accent uppercase tracking-[0.2em]">Hero</span>
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-14">

          {/* ── LEFT: Editorial text ── */}
          <div
            ref={contentRef}
            className="lg:col-span-7 flex flex-col"
            style={{ opacity: 0 }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-7 self-start px-3 py-1.5 rounded-full border border-brand-orange/25 bg-brand-orange/6">
              <Zap className="w-3 h-3 text-brand-orange fill-brand-orange" />
              <span className="text-brand-orange text-[10px] font-accent font-bold uppercase tracking-[0.25em]">
                India's #1 Sports Store
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading leading-[0.82] tracking-wide uppercase mb-8">
              <span className="block text-[clamp(72px,11vw,156px)] text-gray-900">GAME</span>
              <span className="block text-[clamp(72px,11vw,156px)] text-gray-900">
                ON<span className="text-brand-orange">.</span>
              </span>
              <span className="block text-[clamp(40px,6vw,84px)] mt-4 text-gray-400">
                GEAR UP{' '}
                <span className="relative inline-block text-brand-orange italic">
                  NOW
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    height="8"
                    viewBox="0 0 200 8"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path d="M2 5 Q60 1 100 4 T198 5" stroke="#FF6B00" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
                <span className="text-brand-orange">.</span>
              </span>
            </h1>

            <p className="text-gray-500 text-base lg:text-lg font-body leading-relaxed max-w-[480px] mb-9">
              Premium gear for cricket, football, badminton & beyond. Trusted by
              <span className="text-gray-900 font-semibold"> 50,000+ athletes </span>
              across India.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                to="/category/cricket"
                className="group inline-flex items-center gap-2.5 px-7 py-4 bg-gray-900 hover:bg-brand-orange text-white font-accent font-semibold text-sm rounded-2xl transition-all duration-300 hover:-translate-y-0.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_30px_rgba(255,107,0,0.35)]"
              >
                Shop Cricket
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-7 py-4 bg-white border border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 font-accent font-semibold text-sm rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
              >
                All Sports
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-gray-100">
              {[
                { Icon: ShieldCheck, text: '100% Genuine' },
                { Icon: Truck, text: 'Free Delivery ₹999+' },
                { Icon: Star, text: '4.9 Rated' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-brand-orange" />
                  <span className="text-gray-500 text-sm font-accent">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Hero product card ── */}
          <div
            ref={imageRef}
            className="lg:col-span-5 relative"
            style={{ opacity: 0 }}
          >
            <div className="relative">

              {/* Rotated backdrop */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 right-4 w-full aspect-[4/5] rounded-[2.5rem] bg-gradient-to-br from-brand-orange/12 via-amber-50 to-orange-100/30 border border-brand-orange/12 rotate-[3deg]"
              />

              {/* Main card */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.22)]"
              >
                {!imgErr ? (
                  <img
                    src={IMG_CRICKET}
                    alt="Cricket gear"
                    className="w-full h-full object-cover"
                    loading="eager"
                    onError={() => setImgErr(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <GiCricketBat size={80} className="text-brand-orange/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange text-white rounded-full shadow-[0_8px_24px_rgba(255,107,0,0.5)]">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-[10px] font-accent font-bold uppercase tracking-widest">New Drop</span>
                </div>
                <div className="absolute top-5 left-5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-accent font-bold text-gray-900 uppercase tracking-widest">
                  Cricket
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <p className="text-white/60 text-[10px] font-accent uppercase tracking-widest mb-1">Featured</p>
                    <p className="text-white font-heading text-xl tracking-wider">Pro Cricket Gear</p>
                  </div>
                  <Link
                    to="/category/cricket"
                    className="w-12 h-12 rounded-2xl bg-brand-orange flex items-center justify-center text-white shadow-[0_8px_24px_rgba(255,107,0,0.5)] hover:bg-white hover:text-brand-orange transition-all duration-300 group/btn"
                  >
                    <ArrowUpRight className="w-5 h-5 group-hover/btn:rotate-45 transition-transform" />
                  </Link>
                </div>
              </motion.div>

              {/* Floating chip — left */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="absolute -left-6 top-12 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-100 p-4 min-w-[130px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-brand-orange" />
                  </div>
                  <span className="text-gray-400 text-[10px] font-accent uppercase tracking-widest">Sales</span>
                </div>
                <p className="font-heading text-3xl text-gray-900 tracking-wider leading-none">+248%</p>
                <p className="text-gray-400 text-[10px] font-accent mt-1.5">This week</p>
              </motion.div>

              {/* Floating chip — right */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="absolute -right-4 bottom-12 bg-gray-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.22)] p-4 min-w-[120px]"
              >
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="font-heading text-3xl text-white tracking-wider leading-none">4.9</p>
                <p className="text-white/40 text-[10px] font-accent mt-1.5">12K+ Reviews</p>
              </motion.div>

            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 mb-12"
        >
          {STATS.map(({ value, label, Icon }) => (
            <div
              key={label}
              className="bg-white p-6 md:p-8 hover:bg-gray-50/50 transition-colors group cursor-default"
            >
              <Icon className="w-5 h-5 text-brand-orange mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-heading text-4xl md:text-5xl text-gray-900 tracking-wider leading-none">{value}</p>
              <p className="text-gray-400 text-[10px] md:text-xs font-accent uppercase tracking-widest mt-2">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Category pills ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-gray-400 text-[11px] font-accent uppercase tracking-[0.2em]">Popular Categories</p>
            <Link to="/search" className="text-gray-500 hover:text-brand-orange text-xs font-accent flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.07, duration: 0.4, ease: 'easeOut' }}
              >
                <CategoryPill {...cat} />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
