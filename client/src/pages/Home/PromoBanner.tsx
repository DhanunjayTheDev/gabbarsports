import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Trophy, Shirt } from 'lucide-react'

export default function PromoBanner() {
  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-4">

          {/* Banner 1 — Cricket Essentials */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl p-8 md:p-10 bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 group hover:border-blue-200 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/60 rounded-full blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold font-accent rounded-full mb-4 uppercase tracking-wider">
                <Zap className="w-3 h-3" /> Flash Sale
              </span>
              <h3 className="font-heading text-4xl md:text-5xl text-gray-900 tracking-wider leading-none">
                CRICKET<br />ESSENTIALS
              </h3>
              <p className="text-gray-500 font-accent mt-3 mb-6">
                Up to 40% off on premium cricket gear
              </p>
              <Link
                to="/category/cricket"
                className="inline-flex items-center gap-2 text-blue-600 font-accent font-semibold hover:gap-4 transition-all duration-200"
              >
                <Trophy className="w-4 h-4" />
                Shop Cricket <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Banner 2 — Cricket Jerseys */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl p-8 md:p-10 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 group hover:border-orange-200 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/60 rounded-full blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-brand-orange text-xs font-bold font-accent rounded-full mb-4 uppercase tracking-wider">
                New Arrivals
              </span>
              <h3 className="font-heading text-4xl md:text-5xl text-gray-900 tracking-wider leading-none">
                CRICKET<br />JERSEYS
              </h3>
              <p className="text-gray-500 font-accent mt-3 mb-6">
                Club, state & national team jerseys
              </p>
              <Link
                to="/category/jerseys"
                className="inline-flex items-center gap-2 text-brand-orange font-accent font-semibold hover:gap-4 transition-all duration-200"
              >
                <Shirt className="w-4 h-4" />
                Shop Jerseys <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
