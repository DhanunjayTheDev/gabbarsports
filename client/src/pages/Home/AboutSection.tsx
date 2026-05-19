import { motion } from 'framer-motion'
import { LoopingWords } from '@/components/ui/LoopingWords'

const WORDS = ['CRICKET', 'PASSION', 'QUALITY', 'VICTORY', 'INDIA', 'CHAMPIONS']

const STATS = [
  { value: '10,000+', label: 'Products' },
  { value: '50+', label: 'Top Brands' },
  { value: '1 Lakh+', label: 'Happy Players' },
  { value: '100%', label: 'Authentic Gear' },
]

export default function AboutSection() {
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <span className="w-8 h-px bg-brand-orange" />
          <p className="text-brand-orange font-accent text-sm font-semibold tracking-widest uppercase">
            About Us
          </p>
          <span className="w-8 h-px bg-brand-orange" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-heading text-center text-4xl md:text-5xl text-gray-900 tracking-wider mb-4"
        >
          GABBAR <span className="text-brand-orange">SPORTS</span>
        </motion.h2>

        {/* Looping words */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <LoopingWords words={WORDS} className="my-6" />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-500 font-accent text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-14"
        >
          Born from love of the game. Gabbar Sports brings you India's finest cricket and sports
          equipment from grassroots gully cricket to professional turf. Every product, every brand,
          built for players who play to win.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="text-center p-6 bg-gray-50 border border-gray-100 rounded-2xl"
            >
              <p className="font-heading text-3xl md:text-4xl text-brand-orange tracking-wider mb-1">
                {stat.value}
              </p>
              <p className="text-gray-500 font-accent text-sm uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
