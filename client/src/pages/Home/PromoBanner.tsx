import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Zap, Timer, Shirt } from 'lucide-react'
import { GiCricketBat } from 'react-icons/gi'
import AnimatedCircle from '@/components/ui/AnimatedCircle'

const CRICKET_IMG = 'https://images.unsplash.com/photo-1540747913346-19212a4b423e?auto=format&fit=crop&w=800&q=80'
const RUNNING_IMG = 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80'

export default function PromoBanner() {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand-orange font-accent text-xs font-bold uppercase tracking-widest mb-2">Limited Time</p>
            <h2 className="font-heading text-4xl md:text-5xl text-gray-900 tracking-wider uppercase">
              Exclusive <AnimatedCircle className="text-brand-orange">Deals</AnimatedCircle>
            </h2>
          </div>
          <Link
            to="/search"
            className="hidden md:inline-flex items-center gap-1.5 text-gray-500 font-accent text-sm hover:text-brand-orange transition-colors"
          >
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid md:grid-cols-3 gap-4 md:h-[520px]">

          {/* Hero Cricket Essentials: spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl md:col-span-2 group h-72 md:h-full"
          >
            <img
              src={CRICKET_IMG}
              alt="Cricket"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-900/55 to-gray-900/10" />

            {/* Watermark */}
            <div className="absolute right-6 bottom-20 font-heading text-[10rem] leading-none text-white/[0.04] select-none pointer-events-none">
              40%
            </div>

            <div className="relative h-full flex flex-col justify-between p-7 md:p-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange text-white text-[11px] font-bold font-accent rounded-full uppercase tracking-widest shadow-[0_4px_16px_rgba(255,107,0,0.5)]">
                  <Zap className="w-3 h-3" /> Flash Sale
                </span>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Timer className="w-3.5 h-3.5 text-brand-orange" />
                  <span className="text-white/70 font-accent text-xs">Ends soon</span>
                </div>
              </div>

              <div>
                <p className="text-white/40 font-accent text-xs uppercase tracking-widest mb-3">
                  Up to 40% off · Premium Cricket Gear
                </p>
                <h3 className="font-heading text-5xl md:text-7xl text-white tracking-wide leading-none mb-6">
                  CRICKET<br />ESSENTIALS
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    to="/category/cricket"
                    className="group/btn inline-flex items-center gap-2.5 px-7 py-3.5 bg-brand-orange hover:bg-white rounded-2xl text-white hover:text-brand-orange font-accent font-semibold text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(255,107,0,0.4)]"
                  >
                    Shop Now
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </Link>
                  <div className="flex items-center gap-2 px-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl">
                    <GiCricketBat size={18} className="text-brand-orange" />
                    <span className="text-white text-sm font-accent">200+ Products</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column stacked cards */}
          <div className="flex flex-col gap-4 md:h-full">

            {/* Card 2 Jerseys */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl group bg-[#FFF5EC] flex-1 h-48 md:h-auto"
            >
              <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-brand-orange/15 transition-transform duration-700 group-hover:scale-125" />
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-brand-orange/10 transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute right-5 bottom-6 opacity-[0.06]">
                <Shirt className="w-32 h-32 text-brand-orange" />
              </div>

              <div className="relative h-full flex flex-col justify-between p-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange/10 text-brand-orange text-[11px] font-bold font-accent rounded-full uppercase tracking-widest border border-brand-orange/20 w-fit">
                  New Arrivals
                </span>
                <div>
                  <p className="text-brand-orange/60 font-accent text-[10px] uppercase tracking-widest mb-1.5">Club · State · National</p>
                  <h3 className="font-heading text-3xl text-gray-900 tracking-wide leading-tight mb-4">
                    CRICKET<br />JERSEYS
                  </h3>
                  <Link
                    to="/category/jerseys"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-brand-orange rounded-xl text-white font-accent font-semibold text-sm transition-all duration-300"
                  >
                    Shop <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Card 3 Running Shoes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl group flex-1 h-48 md:h-auto"
            >
              <img
                src={RUNNING_IMG}
                alt="Running shoes"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent" />

              <div className="relative h-full flex flex-col justify-between p-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm text-white text-[11px] font-bold font-accent rounded-full uppercase tracking-widest border border-white/20 w-fit">
                  Trending
                </span>
                <div>
                  <p className="text-white/45 font-accent text-[10px] uppercase tracking-widest mb-1.5">Performance footwear</p>
                  <h3 className="font-heading text-3xl text-white tracking-wide leading-tight mb-4">
                    RUNNING<br />SHOES
                  </h3>
                  <Link
                    to="/category/running"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange hover:bg-white rounded-xl text-white hover:text-brand-orange font-accent font-semibold text-sm transition-all duration-300"
                  >
                    Shop <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  )
}
