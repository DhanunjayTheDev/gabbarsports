import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Trophy, Circle, Activity, Footprints, Shirt, Target } from 'lucide-react'

const CATEGORIES = [
  {
    name: 'Cricket',
    slug: 'cricket',
    description: 'Bats · Balls · Pads · Helmets',
    image: 'https://images.unsplash.com/photo-1540747913346-19212a4b423e?auto=format&fit=crop&w=800&q=80',
    accent: '#FF6B00',
    Icon: Trophy,
    featured: true,
  },
  {
    name: 'Football',
    slug: 'football',
    description: 'Boots · Balls · Jerseys',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=500&q=80',
    accent: '#22C55E',
    Icon: Circle,
    featured: false,
  },
  {
    name: 'Badminton',
    slug: 'badminton',
    description: 'Rackets · Shuttles · Grip',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=500&q=80',
    accent: '#EAB308',
    Icon: Activity,
    featured: false,
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    description: 'Sports & Training Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80',
    accent: '#A855F7',
    Icon: Footprints,
    featured: false,
  },
  {
    name: 'Jerseys',
    slug: 'jerseys',
    description: 'Club & National Teams',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=500&q=80',
    accent: '#EF4444',
    Icon: Shirt,
    featured: false,
  },
  {
    name: 'Hockey',
    slug: 'hockey',
    description: 'Sticks · Balls · Gear',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=500&q=80',
    accent: '#00B4FF',
    Icon: Target,
    featured: false,
  },
]

const featured = CATEGORIES[0]
const others = CATEGORIES.slice(1)

export default function FeaturedCategories() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-brand-orange font-accent text-xs font-bold tracking-widest uppercase mb-2"
          >
            Browse By Sport
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="font-heading text-5xl md:text-6xl text-gray-900 tracking-widest uppercase"
          >
            SHOP BY <span className="text-brand-orange">SPORT</span>
          </motion.h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 auto-rows-[220px] gap-3 md:gap-4">

          {/* Cricket big featured card spans 2 cols x 2 rows */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2 row-span-2"
          >
            <Link
              to={`/category/${featured.slug}`}
              className="group relative flex flex-col justify-end h-full rounded-3xl overflow-hidden"
            >
              <img
                src={featured.image}
                alt={featured.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Top icon */}
              <div
                className="absolute top-5 left-5 w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${featured.accent}25`, border: `1.5px solid ${featured.accent}60` }}
              >
                <featured.Icon className="w-5 h-5" style={{ color: featured.accent }} />
              </div>
              {/* Content */}
              <div className="relative p-6">
                <p className="text-white/60 text-xs font-accent uppercase tracking-wider mb-1">{featured.description}</p>
                <div className="flex items-end justify-between">
                  <h3 className="font-heading text-4xl md:text-5xl text-white tracking-wide">{featured.name}</h3>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center flex-shrink-0"
                  >
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
              </div>
              {/* Top right label */}
              <div className="absolute top-5 right-5 px-3 py-1 bg-brand-orange rounded-full text-white text-[10px] font-accent font-bold uppercase tracking-wider">
                Featured
              </div>
            </Link>
          </motion.div>

          {/* Other 5 categories */}
          {others.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Link
                to={`/category/${cat.slug}`}
                className="group relative flex flex-col justify-end h-full rounded-2xl overflow-hidden"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                {/* Icon top */}
                <div
                  className="absolute top-3 left-3 w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: `${cat.accent}30`, border: `1px solid ${cat.accent}50` }}
                >
                  <cat.Icon className="w-4 h-4" style={{ color: cat.accent }} />
                </div>

                {/* Hover arrow */}
                <motion.div
                  className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </motion.div>

                {/* Bottom content */}
                <div className="relative p-3">
                  <h3 className="font-heading text-xl text-white tracking-wide leading-tight">{cat.name}</h3>
                  <p className="text-white/50 text-[10px] font-accent mt-0.5 leading-tight">{cat.description}</p>
                </div>

                {/* Accent bottom line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-full"
                  style={{ backgroundColor: cat.accent }}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
