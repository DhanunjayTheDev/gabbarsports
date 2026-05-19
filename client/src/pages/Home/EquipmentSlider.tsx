import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ImageSlider3D from '@/components/ui/ImageSlider3D'

// Sports equipment images bats, balls, pads, gloves, rackets, shuttlecocks,
// footballs, hockey sticks, shoes, helmets, jerseys, accessories
const EQUIPMENT_IMAGES = [
  // Cricket bat
  'https://images.unsplash.com/photo-1540747913346-19212a4b423e?w=800&auto=format&fit=crop&q=60',
  // Badminton racket
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=60',
  // Football
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=60',
  // Sports shoes
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
  // Cricket helmet / protective gear
  'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&auto=format&fit=crop&q=60',
  // Cricket pads
  'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=800&auto=format&fit=crop&q=60',
  // Basketball (substitute for hockey)
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=60',
  // Running / sports shoes 2
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=60',
  // Sports jersey / athlete
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60',
  // Cricket ball / red leather
  'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&auto=format&fit=crop&q=60',
  // Tennis racket
  'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=60',
  // Sports bag / kit bag
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60',
]

export default function EquipmentSlider() {
  return (
    <section className="py-20 md:py-28 bg-[#0d0d0d] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-2"
            >
              <span className="w-8 h-px bg-brand-orange" />
              <p className="text-brand-orange font-accent text-sm font-semibold tracking-widest uppercase">
                Premium Gear
              </p>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-5xl md:text-6xl text-white tracking-wider"
            >
              ALL THE <span className="text-brand-orange">EQUIPMENT</span>
              <br />YOU NEED
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange hover:bg-brand-orange/90 text-white font-accent font-semibold text-sm rounded-xl transition-all duration-200"
            >
              Shop All Gear <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <ImageSlider3D
            images={EQUIPMENT_IMAGES}
            duration={36}
            cardWidth="16em"
            cardAspectRatio="3/4"
            perspective="40em"
            rotationDirection="left"
            withMask={true}
            containerClassName="min-h-[480px] md:min-h-[560px]"
          />
        </motion.div>

        {/* Category quick links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mt-2"
        >
          {[
            { label: 'Cricket', href: '/category/cricket' },
            { label: 'Football', href: '/category/football' },
            { label: 'Badminton', href: '/category/badminton' },
            { label: 'Hockey', href: '/category/hockey' },
            { label: 'Shoes', href: '/category/shoes' },
            { label: 'Accessories', href: '/category/accessories' },
          ].map((cat) => (
            <Link
              key={cat.label}
              to={cat.href}
              className="px-5 py-2 border border-white/10 hover:border-brand-orange/60 text-white/60 hover:text-white font-accent text-sm rounded-full transition-all duration-200 hover:bg-brand-orange/10"
            >
              {cat.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
