import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import {
  ShieldCheck, Truck, Star, Trophy, Sparkles,
  ArrowRight, ArrowUpRight, Users, Package,
} from 'lucide-react'
import { GiCricketBat, GiSoccerBall, GiShuttlecock, GiRunningShoe, GiPoloShirt } from 'react-icons/gi'
import AnimatedCircle from '@/components/ui/AnimatedCircle'

const MARQUEE_ITEMS = [
  'Cricket World Cup Gear',
  'Pro Athlete Endorsed',
  '100% Authentic Brands',
  'Free Delivery Above ₹999',
  '7-Day Easy Returns',
  '50,000+ Happy Athletes',
  '4.9 Star Rated',
]

const SPORT_CARDS = [
  { label: 'Cricket', sub: 'Bats · Pads · Helmets', href: '/category/cricket', color: '#FF6B00', Icon: GiCricketBat, img: 'https://images.unsplash.com/photo-1540747913346-19212a4b423e?auto=format&fit=crop&w=400&q=80' },
  { label: 'Football', sub: 'Boots · Balls · Kits', href: '/category/football', color: '#22C55E', Icon: GiSoccerBall, img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80' },
  { label: 'Badminton', sub: 'Rackets · Shuttles', href: '/category/badminton', color: '#EAB308', Icon: GiShuttlecock, img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=400&q=80' },
  { label: 'Shoes', sub: 'Sports & Training', href: '/category/shoes', color: '#A855F7', Icon: GiRunningShoe, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80' },
  { label: 'Jerseys', sub: 'Club & National', href: '/category/jerseys', color: '#EF4444', Icon: GiPoloShirt, img: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=400&q=80' },
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
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) / r.width); y.set((e.clientY - r.top - r.height / 2) / r.height) }}
        onMouseLeave={() => { x.set(0); y.set(0) }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.03, boxShadow: `0 12px 32px -8px ${color}30` }}
        transition={{ scale: { type: 'spring', stiffness: 500, damping: 30 } }}
        className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-gray-200/80 hover:border-gray-300 cursor-pointer transition-colors duration-200"
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}>
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
  const headlineRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 })
    tl.fromTo(headlineRef.current, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .fromTo(cardsRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
  }, [])

  return (
    <section className="relative min-h-screen bg-white flex flex-col overflow-hidden">

      {/* CSS dot-grid bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #C8C8C8 1.5px, transparent 1.5px)',
          backgroundSize: '36px 36px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, white 80%)' }}
      />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-brand-orange/5 rounded-full blur-[140px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />

      {/* Marquee strip */}
      <div className="absolute top-20 left-0 right-0 z-[5] border-y border-gray-100 bg-white/80 backdrop-blur-sm overflow-hidden py-3">
        <div className="flex animate-marquee gap-10 whitespace-nowrap">
          {Array(3).fill(0).flatMap((_, b) =>
            MARQUEE_ITEMS.map((item, i) => (
              <span key={`${b}-${i}`} className="inline-flex items-center gap-2.5 text-gray-500 font-accent text-xs uppercase tracking-[0.2em]">
                <Sparkles className="w-3 h-3 text-brand-orange flex-shrink-0" />
                {item}
              </span>
            ))
          )}
        </div>
      </div>

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

        {/* ── Editorial headline block ── */}
        <div ref={headlineRef} className="mb-14" style={{ opacity: 0 }}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

            {/* Left: big headline */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-brand-orange/25 bg-brand-orange/6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                <span className="text-brand-orange text-[10px] font-accent font-bold uppercase tracking-[0.25em]">India's #1 Sports Store</span>
              </div>

              <h1 className="font-heading leading-[0.82] tracking-wide uppercase">
                <span className="block text-[clamp(64px,10vw,150px)] text-gray-900">PLAY YOUR</span>
                <span className="block text-[clamp(64px,10vw,150px)]">
                  BEST{' '}
                  <AnimatedCircle color="#FF6B00" strokeWidth={4} className="text-brand-orange">
                    GAME
                  </AnimatedCircle>
                  <span className="text-brand-orange">.</span>
                </span>
              </h1>
            </div>

            {/* Right: subtext + CTAs + trust */}
            <div className="lg:max-w-xs xl:max-w-sm lg:pb-2">
              <p className="text-gray-500 text-base font-body leading-relaxed mb-6">
                Premium gear for cricket, football, badminton & beyond. Trusted by
                <span className="text-gray-900 font-semibold"> 50,000+ athletes</span> across India.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Link
                  to="/category/cricket"
                  className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-gray-900 hover:bg-brand-orange text-white font-accent font-semibold text-sm rounded-2xl transition-all duration-300 hover:-translate-y-0.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_30px_rgba(255,107,0,0.35)]"
                >
                  Shop Cricket
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 font-accent font-semibold text-sm rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  All Sports
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-5 border-t border-gray-100">
                {[
                  { Icon: ShieldCheck, text: '100% Genuine' },
                  { Icon: Truck, text: 'Free ₹999+' },
                  { Icon: Star, text: '4.9 Rated' },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-brand-orange" />
                    <span className="text-gray-500 text-xs font-accent">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Horizontal sport cards row ── */}
        <div ref={cardsRef} className="mb-12" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between mb-5">
            <p className="text-gray-400 text-[11px] font-accent uppercase tracking-[0.2em]">Shop by Sport</p>
            <Link to="/search" className="text-gray-500 hover:text-brand-orange text-xs font-accent flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {SPORT_CARDS.map(({ label, sub, href, color, Icon, img }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
              >
                <Link
                  to={href}
                  className="group block relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img
                    src={img}
                    alt={label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Top icon */}
                  <div
                    className="absolute top-3 left-3 w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}CC` }}
                  >
                    <Icon size={16} color="white" />
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-heading text-base tracking-wider leading-none">{label}</p>
                    <p className="text-white/60 text-[10px] font-accent mt-0.5">{sub}</p>
                    <div className="flex items-center gap-1 mt-2 text-white/80 text-[10px] font-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Shop now <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 rounded-3xl overflow-hidden border border-gray-100"
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

      </div>
    </section>
  )
}
