import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Phone, Mail } from 'lucide-react'

const CONTACT = {
  phone: '+91-98765 43210',
  email: 'hello@gabbarsports.in',
}

export default function CTABanner() {
  return (
    <section className="relative bg-[#111111] overflow-hidden py-20 md:py-28">

      {/* Scrolling watermark marquee pointer-events-auto so hover works */}
      <div className="absolute inset-0 flex flex-col justify-center select-none overflow-hidden gap-4 group/marquee">
        {/* Row 1 scrolls left, pauses + highlights on hover */}
        <div
          className="flex items-center whitespace-nowrap"
          style={{ animation: 'cta-left 18s linear infinite', width: 'max-content', animationPlayState: 'running' }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="inline-flex items-center">
              <span
                className="font-heading text-[11vw] leading-none tracking-widest uppercase px-8 cursor-default transition-colors duration-300 hover:text-brand-orange"
                style={{ color: 'rgba(255,255,255,0.06)' }}
              >
                GABBAR SPORTS
              </span>
              <span className="font-heading text-[11vw] leading-none px-6 text-brand-orange/10 hover:text-brand-orange transition-colors duration-300 cursor-default">·</span>
              <span
                className="font-heading text-[11vw] leading-none tracking-wider uppercase px-8 cursor-default transition-colors duration-300 hover:text-white"
                style={{ color: 'rgba(255,255,255,0.06)' }}
              >
                +91-98765 43210
              </span>
              <span className="font-heading text-[11vw] leading-none px-6 text-brand-orange/10 hover:text-brand-orange transition-colors duration-300 cursor-default">·</span>
            </span>
          ))}
        </div>
        {/* Row 2 scrolls right */}
        <div
          className="flex items-center whitespace-nowrap"
          style={{ animation: 'cta-right 22s linear infinite', width: 'max-content' }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="inline-flex items-center">
              <span
                className="font-heading text-[9vw] leading-none tracking-widest uppercase px-8 cursor-default transition-colors duration-300 hover:text-brand-orange"
                style={{ color: 'rgba(255,255,255,0.05)' }}
              >
                CRICKET STORE
              </span>
              <span className="font-heading text-[9vw] leading-none px-6 text-brand-orange/8 hover:text-brand-orange transition-colors duration-300 cursor-default">·</span>
              <span
                className="font-heading text-[9vw] leading-none tracking-widest uppercase px-8 cursor-default transition-colors duration-300 hover:text-white"
                style={{ color: 'rgba(255,255,255,0.05)' }}
              >
                INDIA'S #1
              </span>
              <span className="font-heading text-[9vw] leading-none px-6 text-brand-orange/8 hover:text-brand-orange transition-colors duration-300 cursor-default">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Rotating circular badge */}
      <div className="absolute top-8 right-8 md:top-12 md:right-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 md:w-32 md:h-32 relative"
        >
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <defs>
              <path id="circle-text" d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" />
            </defs>
            <text fill="#FF6B00" fontSize="11" fontFamily="sans-serif" fontWeight="700" letterSpacing="3">
              <textPath href="#circle-text">
                GABBAR SPORTS • CRICKET • INDIA • EST 2024 •
              </textPath>
            </text>
          </svg>
          {/* Center G */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-orange flex items-center justify-center">
              <span className="font-heading text-white text-xl md:text-2xl">G</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-brand-orange font-accent text-xs font-bold tracking-[0.3em] uppercase mb-6"
        >
          Start a Project
        </motion.p>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="font-heading text-6xl sm:text-7xl md:text-[96px] lg:text-[120px] leading-[0.9] tracking-wide text-white uppercase mb-10"
        >
          LET'S PLAY<br />
          <span className="text-brand-orange">TOGETHER.</span>
        </motion.h2>

        {/* Big phone number */}
        <motion.a
          href={`tel:${CONTACT.phone.replace(/\s|-/g, '')}`}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16 }}
          className="group inline-flex items-center gap-4 mb-6"
        >
          <Phone className="w-6 h-6 text-brand-orange flex-shrink-0" />
          <span className="font-heading text-4xl sm:text-5xl md:text-6xl text-brand-orange tracking-wider group-hover:text-white transition-colors duration-300">
            {CONTACT.phone}
          </span>
          <ArrowUpRight className="w-8 h-8 text-brand-orange/40 group-hover:text-brand-orange group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
        </motion.a>

        {/* Email */}
        <motion.a
          href={`mailto:${CONTACT.email}`}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22 }}
          className="group inline-flex items-center gap-3 mb-14"
        >
          <Mail className="w-5 h-5 text-gray-500" />
          <span className="font-accent text-gray-400 text-lg group-hover:text-white transition-colors duration-300 tracking-wider">
            {CONTACT.email}
          </span>
        </motion.a>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-10" />

        {/* Bottom row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.28 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <p className="text-gray-500 font-accent text-sm max-w-md">
            India's #1 cricket sports store. Premium gear, 100% genuine products, delivered across India.
          </p>
          <Link
            to="/category/cricket"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-orange rounded-2xl text-white font-accent font-bold uppercase tracking-wider hover:bg-white hover:text-brand-orange transition-all duration-300"
          >
            Shop Now
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <style>{`
        @keyframes cta-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes cta-right {
          0%   { transform: translateX(-25%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </section>
  )
}
