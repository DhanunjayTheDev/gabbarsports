import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AnimatedCircle from '@/components/ui/AnimatedCircle'
import {
  Trophy, Users, Package, Target, Heart, Shield, ArrowRight,
  CheckCircle2, Award, Star, MapPin,
} from 'lucide-react'
import ChromaGrid from '@/components/ui/ChromaGrid/ChromaGrid'

const TEAM_ITEMS = [
  {
    image: 'https://ui-avatars.com/api/?name=Katamayya+Shankar&background=FF6B00&color=fff&size=300&bold=true&font-size=0.33&rounded=true',
    title: 'Katamayya Shankar',
    subtitle: 'Chief Executive Officer',
    handle: '@katamayya',
    borderColor: '#FF6B00',
    gradient: 'linear-gradient(145deg, #FF6B00 0%, #1a0500 100%)',
  },
  {
    image: 'https://ui-avatars.com/api/?name=Jyothi+Prasad&background=3B82F6&color=fff&size=300&bold=true&font-size=0.33&rounded=true',
    title: 'Jyothi Prasad Naidu',
    subtitle: 'Co-Founder · Director',
    handle: '@jyothi',
    borderColor: '#3B82F6',
    gradient: 'linear-gradient(145deg, #3B82F6 0%, #050a1a 100%)',
  },
  {
    image: 'https://ui-avatars.com/api/?name=Vishnu+Teja&background=22C55E&color=fff&size=300&bold=true&font-size=0.33&rounded=true',
    title: 'Vishnu Teja Gade',
    subtitle: 'Co-Founder · Director',
    handle: '@vishnu',
    borderColor: '#22C55E',
    gradient: 'linear-gradient(145deg, #22C55E 0%, #021208 100%)',
  },
  {
    image: 'https://ui-avatars.com/api/?name=Basu+Seshu&background=A855F7&color=fff&size=300&bold=true&font-size=0.33&rounded=true',
    title: 'Basu Naga Seshu Babu',
    subtitle: 'Co-Founder · Director',
    handle: '@basu',
    borderColor: '#A855F7',
    gradient: 'linear-gradient(145deg, #A855F7 0%, #0d0218 100%)',
  },
]

const STATS = [
  { value: '50K+', label: 'Athletes Served', Icon: Users },
  { value: '5,000+', label: 'Products', Icon: Package },
  { value: '100+', label: 'Top Brands', Icon: Trophy },
  { value: '4.9★', label: 'Customer Rating', Icon: Star },
]

const MILESTONES = [
  { year: '2022', title: 'Founded', desc: 'Incorporated in Hyderabad, Telangana with 4 founding directors.' },
  { year: '2023', title: 'Retail Launch', desc: 'Opened flagship Kukatpally store. 50+ premium sports brands.' },
  { year: '2024', title: 'Digital', desc: 'Launched online platform. Crossed 10,000+ orders pan-India.' },
  { year: '2025', title: 'Scale', desc: '₹1Cr+ turnover. 50,000+ athletes. 4.9★ verified rating.' },
]

const VALUES = [
  { Icon: Shield, title: 'Authentic Gear', desc: 'Every product 100% genuine, sourced from authorized distributors.' },
  { Icon: Heart, title: 'Player First', desc: 'Built by players, for players. We test what we sell.' },
  { Icon: Target, title: 'Performance', desc: 'Premium equipment that elevates your game on every pitch.' },
  { Icon: Award, title: 'Quality Promise', desc: '4.9★ rating from 600+ verified customers on Justdial.' },
]

const WHY_US = [
  '100% authentic products from authorized distributors',
  'Free delivery on orders above ₹999 across India',
  'Easy 7-day returns on all eligible products',
  'Expert advice from athlete-led product team',
  'Best price guarantee on premium brands',
  'Verified 4.9★ by 600+ Justdial reviews',
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
})

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-0 min-h-[92vh] flex flex-col">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'linear-gradient(#111 1px,transparent 1px),linear-gradient(90deg,#111 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-brand-orange/6 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex-1 flex flex-col justify-center py-16">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-center">

            {/* Left editorial text */}
            <div>
              <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-8">
                <span className="text-brand-orange font-accent text-xs font-bold uppercase tracking-[0.25em]">Est. 2022</span>
                <span className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 font-accent text-xs uppercase tracking-widest">Hyderabad, India</span>
              </motion.div>

              <motion.h1
                {...fadeUp(0.08)}
                className="font-heading text-[clamp(52px,9vw,120px)] leading-[0.9] tracking-tight text-gray-900 uppercase mb-8"
              >
                We Live<br />
                <AnimatedCircle className="text-brand-orange italic">Sport.</AnimatedCircle>
              </motion.h1>

              <motion.p {...fadeUp(0.16)} className="text-gray-500 text-lg font-body leading-relaxed max-w-lg mb-10">
                Gabbar Sportz Private Limited Hyderabad's premier multi-sport retailer.
                From a single Kukatpally store in 2022 to 50,000+ athletes served nationwide.
              </motion.p>

              <motion.div {...fadeUp(0.22)} className="flex gap-3">
                <Link
                  to="/category/cricket"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-orange hover:bg-brand-orange/90 text-white font-accent font-semibold text-sm rounded-xl transition-all shadow-[0_4px_20px_rgba(255,107,0,0.35)]"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 font-accent font-semibold text-sm rounded-xl transition-all"
                >
                  Visit Store
                </Link>
              </motion.div>
            </div>

            {/* Right: stacked stat cards */}
            <motion.div {...fadeUp(0.2)} className="hidden lg:flex flex-col gap-4">
              <div className="bg-gray-900 rounded-3xl p-7 text-white">
                <p className="font-heading text-6xl tracking-wider text-brand-orange mb-1">4.9★</p>
                <p className="text-white/50 text-xs font-accent uppercase tracking-widest">Justdial Rating · 600+ Reviews</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-orange rounded-3xl p-6 text-white">
                  <p className="font-heading text-4xl tracking-wider mb-1">50K+</p>
                  <p className="text-white/75 text-xs font-accent uppercase tracking-widest">Athletes</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6">
                  <p className="font-heading text-4xl tracking-wider text-gray-900 mb-1">5K+</p>
                  <p className="text-gray-400 text-xs font-accent uppercase tracking-widest">Products</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom border line */}
        <div className="h-px bg-gray-100 mt-auto" />
      </section>

      {/* ── MANIFESTO BAND ── */}
      <section className="bg-brand-orange py-10 overflow-hidden">
        <div className="flex gap-16 whitespace-nowrap animate-marquee" style={{ willChange: 'transform' }}>
          {[...Array(6)].map((_, i) => (
            <span key={i} className="font-heading text-3xl md:text-4xl tracking-wider text-white uppercase flex-shrink-0">
              Authentic Gear ·&nbsp; Fair Prices ·&nbsp; Athlete First ·&nbsp;
            </span>
          ))}
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                {...fadeUp(i * 0.07)}
                className="px-8 py-2 text-center first:pl-0 last:pr-0"
              >
                <s.Icon className="w-5 h-5 text-brand-orange mx-auto mb-3" />
                <p className="font-heading text-4xl md:text-5xl text-white tracking-wider mb-1">{s.value}</p>
                <p className="text-white/35 text-xs font-accent uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[auto_1fr] gap-16 items-start">

            {/* Left: big number + label */}
            <div className="hidden lg:block">
              <p className="font-heading text-[160px] leading-none text-gray-100 tracking-tight select-none">01</p>
            </div>

            {/* Right: story text */}
            <div className="pt-4">
              <motion.p {...fadeUp(0)} className="text-brand-orange font-accent text-xs font-bold uppercase tracking-[0.25em] mb-4">
                Our Story
              </motion.p>
              <motion.h2 {...fadeUp(0.08)} className="font-heading text-5xl md:text-6xl text-gray-900 tracking-wider leading-none mb-8 uppercase">
                From Kukatpally<br />to <AnimatedCircle className="text-brand-orange">the Nation.</AnimatedCircle>
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div {...fadeUp(0.14)}>
                  <p className="text-gray-500 font-body leading-relaxed">
                    Gabbar Sportz Private Limited was incorporated in <strong className="text-gray-900">May 2022</strong> by four
                    cricket-obsessed entrepreneurs in Hyderabad. What started as a single retail outlet in
                    Kukatpally has grown into one of South India's most trusted multi-sport retailers.
                  </p>
                </motion.div>
                <motion.div {...fadeUp(0.2)}>
                  <p className="text-gray-500 font-body leading-relaxed">
                    Today we offer <strong className="text-gray-900">5,000+ products</strong> across cricket, football, badminton,
                    hockey, fitness, and athletic gear all sourced directly from authorized distributors and global brands. Our promise:
                    only authentic gear, only fair prices, only athlete-first service.
                  </p>
                </motion.div>
              </div>

              {/* Pull-quote */}
              <motion.blockquote
                {...fadeUp(0.28)}
                className="mt-10 border-l-4 border-brand-orange pl-6 py-2"
              >
                <p className="font-heading text-2xl md:text-3xl text-gray-900 tracking-wider italic leading-snug">
                  "Built by players, for players."
                </p>
                <p className="text-gray-400 font-accent text-sm mt-2">Katamayya Shankar, CEO</p>
              </motion.blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── JOURNEY / TIMELINE ── */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-16 gap-6">
            <div>
              <motion.p {...fadeUp(0)} className="text-brand-orange font-accent text-xs font-bold uppercase tracking-[0.25em] mb-3">
                Our Journey
              </motion.p>
              <motion.h2 {...fadeUp(0.08)} className="font-heading text-5xl md:text-6xl text-gray-900 tracking-wider uppercase leading-none">
                02 Timeline
              </motion.h2>
            </div>
            <motion.p {...fadeUp(0.14)} className="text-gray-400 font-accent text-sm hidden md:block max-w-xs text-right">
              Three years of growth, one milestone at a time.
            </motion.p>
          </div>

          {/* Horizontal milestone cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.year}
                {...fadeUp(i * 0.09)}
                whileHover={{ y: -6 }}
                className={`rounded-3xl p-7 transition-all cursor-default ${
                  i === MILESTONES.length - 1
                    ? 'bg-brand-orange text-white'
                    : 'bg-white border border-gray-100 hover:border-brand-orange/25 hover:shadow-xl'
                }`}
              >
                <p className={`font-heading text-6xl tracking-wider mb-4 ${i === MILESTONES.length - 1 ? 'text-white/30' : 'text-gray-100'}`}>
                  {m.year}
                </p>
                <p className={`font-heading text-2xl tracking-wider mb-2 ${i === MILESTONES.length - 1 ? 'text-white' : 'text-gray-900'}`}>
                  {m.title}
                </p>
                <p className={`text-sm font-body leading-relaxed ${i === MILESTONES.length - 1 ? 'text-white/75' : 'text-gray-400'}`}>
                  {m.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <motion.p {...fadeUp(0)} className="text-brand-orange font-accent text-xs font-bold uppercase tracking-[0.25em] mb-3">
                What We Stand For
              </motion.p>
              <motion.h2 {...fadeUp(0.08)} className="font-heading text-5xl md:text-6xl text-gray-900 tracking-wider uppercase leading-none">
                03 Values
              </motion.h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp(i * 0.08)}
                whileHover={{ y: -5 }}
                className="group bg-gray-50 border border-gray-100 rounded-3xl p-7 hover:border-brand-orange/30 hover:bg-white hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mb-5">
                  <v.Icon className="w-5 h-5 text-brand-orange" />
                </div>
                <h3 className="font-heading text-xl text-gray-900 tracking-wider mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm font-body leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-brand-orange/8 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <motion.p {...fadeUp(0)} className="text-brand-orange font-accent text-xs font-bold uppercase tracking-[0.25em] mb-3">
                Meet the Team
              </motion.p>
              <motion.h2 {...fadeUp(0.08)} className="font-heading text-5xl md:text-6xl text-white tracking-wider uppercase leading-none">
                04 Founders
              </motion.h2>
            </div>
            <motion.p {...fadeUp(0.16)} className="text-white/35 font-body text-sm max-w-xs hidden md:block text-right">
              Four entrepreneurs from Hyderabad building India's most trusted sports retailer.
            </motion.p>
          </div>

          <motion.p {...fadeUp(0.2)} className="text-white/25 font-accent text-xs text-center mb-6 hidden md:block">
            Move your cursor over the cards to reveal them
          </motion.p>

          {/* ChromaGrid team */}
          <motion.div
            {...fadeUp(0.22)}
            style={{ height: 'auto', minHeight: '500px', position: 'relative' }}
          >
            <ChromaGrid
              items={TEAM_ITEMS}
              columns={2}
              rows={2}
              radius={350}
              damping={0.4}
              fadeOut={0.7}
            />
          </motion.div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-start">

            <div className="lg:sticky lg:top-28">
              <motion.p {...fadeUp(0)} className="text-brand-orange font-accent text-xs font-bold uppercase tracking-[0.25em] mb-4">
                Why Choose Us
              </motion.p>
              <motion.h2 {...fadeUp(0.08)} className="font-heading text-5xl md:text-6xl text-gray-900 tracking-wider uppercase leading-none mb-6">
                05 The Gabbar Advantage
              </motion.h2>
              <motion.p {...fadeUp(0.14)} className="text-gray-400 font-body leading-relaxed">
                Six reasons 50,000+ Indian athletes trust us with their gear.
              </motion.p>
            </div>

            <div className="space-y-3">
              {WHY_US.map((w, i) => (
                <motion.div
                  key={w}
                  {...fadeUp(i * 0.06)}
                  className="flex items-start gap-4 p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:border-brand-orange/30 hover:bg-orange-50/20 transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-brand-orange/15 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                  </div>
                  <p className="text-gray-700 text-sm font-accent leading-relaxed">{w}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LOCATION CALLOUT ── */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            {...fadeUp(0)}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-brand-orange flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-heading text-xl text-gray-900 tracking-wider">GABBAR SPORTZ · FLAGSHIP</p>
                <p className="text-gray-400 text-sm font-accent">Kukatpally, KPHB Phase 1 · Hyderabad, Telangana 500072</p>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-200 hover:border-brand-orange hover:text-brand-orange text-gray-900 font-accent font-semibold text-sm rounded-xl transition-all flex-shrink-0"
            >
              Get Directions <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
          <span className="font-heading text-[28vw] text-gray-50 tracking-tight leading-none">PLAY</span>
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.p {...fadeUp(0)} className="text-brand-orange font-accent text-xs font-bold uppercase tracking-[0.25em] mb-4">
            Ready to Level Up?
          </motion.p>
          <motion.h2 {...fadeUp(0.08)} className="font-heading text-6xl md:text-8xl text-gray-900 tracking-wider uppercase leading-none mb-8">
            Shop the <AnimatedCircle className="text-brand-orange">Best.</AnimatedCircle>
          </motion.h2>
          <motion.div {...fadeUp(0.16)} className="flex flex-wrap justify-center gap-3">
            <Link
              to="/category/cricket"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-orange hover:bg-brand-orange/90 text-white font-accent font-semibold text-sm rounded-xl transition-all shadow-[0_4px_24px_rgba(255,107,0,0.4)]"
            >
              Shop Cricket <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 hover:bg-gray-150 text-gray-900 font-accent font-semibold text-sm rounded-xl transition-all"
            >
              Visit Store
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
