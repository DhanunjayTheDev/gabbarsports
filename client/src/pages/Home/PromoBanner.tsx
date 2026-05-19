import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Zap, Shirt } from 'lucide-react'
import { GiCricketBat } from 'react-icons/gi'

const CRICKET_BALL_IMG = 'https://images.unsplash.com/photo-oDs_AxeR5g4?auto=format&fit=crop&w=800&q=80'

export default function PromoBanner() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-5">

          {/* Banner 1 Cricket Essentials dark with image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl h-72 md:h-80 group"
          >
            {/* BG image */}
            <img
              src={CRICKET_BALL_IMG}
              alt="Cricket ball"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950/90 via-gray-900/75 to-gray-900/60" />

            {/* Big discount watermark */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 font-heading text-[9rem] leading-none text-white/5 select-none pointer-events-none">
              40%
            </div>

            <div className="relative h-full flex flex-col justify-between p-7 md:p-9">
              {/* Top */}
              <div className="flex items-start justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange text-white text-[11px] font-bold font-accent rounded-full uppercase tracking-widest">
                  <Zap className="w-3 h-3" /> Flash Sale
                </span>
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <GiCricketBat size={22} className="text-white" />
                </div>
              </div>

              {/* Bottom */}
              <div>
                <p className="text-white/50 font-accent text-xs uppercase tracking-widest mb-2">Up to 40% off</p>
                <h3 className="font-heading text-5xl md:text-6xl text-white tracking-wide leading-none mb-5">
                  CRICKET<br />ESSENTIALS
                </h3>
                <Link
                  to="/category/cricket"
                  className="group/btn inline-flex items-center gap-2.5 px-6 py-3 bg-brand-orange hover:bg-white rounded-2xl text-white hover:text-brand-orange font-accent font-semibold text-sm transition-all duration-300"
                >
                  Shop Cricket
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Banner 2 Cricket Jerseys light with bold type */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl h-72 md:h-80 group bg-[#FFF5EC]"
          >
            {/* Decorative circles */}
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-brand-orange/10 transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-brand-orange/15 transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute right-10 top-8 w-24 h-24 rounded-full border-2 border-brand-orange/20 transition-all duration-700 group-hover:scale-125 group-hover:opacity-50" />

            {/* Watermark jersey icon */}
            <div className="absolute right-6 bottom-6 opacity-[0.08]">
              <Shirt className="w-48 h-48 text-brand-orange" />
            </div>

            <div className="relative h-full flex flex-col justify-between p-7 md:p-9">
              {/* Top */}
              <div className="flex items-start justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange/15 text-brand-orange text-[11px] font-bold font-accent rounded-full uppercase tracking-widest border border-brand-orange/20">
                  New Arrivals
                </span>
                <div className="w-10 h-10 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                  <Shirt className="w-5 h-5 text-brand-orange" />
                </div>
              </div>

              {/* Bottom */}
              <div>
                <p className="text-brand-orange/60 font-accent text-xs uppercase tracking-widest mb-2">Club, state & national</p>
                <h3 className="font-heading text-5xl md:text-6xl text-gray-900 tracking-wide leading-none mb-5">
                  CRICKET<br />JERSEYS
                </h3>
                <Link
                  to="/category/jerseys"
                  className="group/btn inline-flex items-center gap-2.5 px-6 py-3 bg-gray-900 hover:bg-brand-orange rounded-2xl text-white font-accent font-semibold text-sm transition-all duration-300"
                >
                  Shop Jerseys
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
