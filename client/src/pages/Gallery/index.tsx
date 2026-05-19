import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ImageReveal from '@/components/ui/ImageReveal'
import AnimatedCircle from '@/components/ui/AnimatedCircle'

const SPORT_ITEMS = [
  {
    key: 1,
    label: 'Cricket',
    sub: 'Bats · Pads · Helmets · Balls',
    url: 'https://images.unsplash.com/photo-1540747913346-19212a4b423e?auto=format&fit=crop&w=600&q=80',
    href: '/category/cricket',
  },
  {
    key: 2,
    label: 'Football',
    sub: 'Boots · Balls · Shin Guards',
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
    href: '/category/football',
  },
  {
    key: 3,
    label: 'Badminton',
    sub: 'Rackets · Shuttles · Grips',
    url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
    href: '/category/badminton',
  },
  {
    key: 4,
    label: 'Basketball',
    sub: 'Balls · Jerseys · Footwear',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
    href: '/category/basketball',
  },
  {
    key: 5,
    label: 'Tennis',
    sub: 'Rackets · Balls · Strings',
    url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80',
    href: '/category/tennis',
  },
  {
    key: 6,
    label: 'Running',
    sub: 'Shoes · Apparel · Accessories',
    url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80',
    href: '/category/running',
  },
]

const IMAGES = [
  { url: 'https://images.unsplash.com/photo-1540747913346-19212a4b423e?auto=format&fit=crop&w=800&q=80', alt: 'Cricket bat', span: 'md:col-span-2 md:row-span-2', cat: 'Cricket' },
  { url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80', alt: 'Badminton', span: '', cat: 'Badminton' },
  { url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80', alt: 'Football', span: '', cat: 'Football' },
  { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', alt: 'Shoes', span: 'md:col-span-2', cat: 'Shoes' },
  { url: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=600&q=80', alt: 'Cricket helmet', span: '', cat: 'Helmets' },
  { url: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?auto=format&fit=crop&w=600&q=80', alt: 'Cricket pads', span: '', cat: 'Pads' },
  { url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80', alt: 'Basketball', span: 'md:col-span-2', cat: 'Basketball' },
  { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80', alt: 'Running shoes', span: '', cat: 'Running' },
  { url: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=600&q=80', alt: 'Cricket ball', span: '', cat: 'Balls' },
  { url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80', alt: 'Tennis', span: 'md:col-span-2 md:row-span-2', cat: 'Tennis' },
  { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', alt: 'Sports bag', span: '', cat: 'Bags' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', alt: 'Jersey', span: '', cat: 'Jerseys' },
]

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/8 border border-brand-orange/20 mb-5"
          >
            <span className="text-brand-orange text-xs font-accent font-bold uppercase tracking-widest">Showcase</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-6xl md:text-7xl tracking-wider text-gray-900 uppercase"
          >
            Our <AnimatedCircle className="text-brand-orange">Gallery</AnimatedCircle>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 font-body mt-3 max-w-xl mx-auto"
          >
            Premium sports gear, captured. Hover to explore each sport.
          </motion.p>
        </div>

        {/* ── ImageReveal Explore by Sport ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-gray-400 font-accent text-xs uppercase tracking-widest">Hover to preview · Click to shop</p>
            <Link
              to="/search"
              className="text-brand-orange font-accent text-sm font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>
          <ImageReveal items={SPORT_ITEMS} imageWidth={280} imageHeight={360} />
        </motion.div>

        {/* ── Bento photo grid ── */}
        <div className="mb-6">
          <p className="text-gray-400 font-accent text-xs uppercase tracking-widest mb-5">Photo gallery</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-3">
          {IMAGES.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.05 }}
              whileHover={{ y: -4 }}
              className={`group relative rounded-2xl overflow-hidden bg-gray-100 cursor-pointer ${img.span}`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-block px-2.5 py-1 bg-brand-orange text-white text-[10px] font-accent font-bold uppercase tracking-widest rounded-full">
                  {img.cat}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}
