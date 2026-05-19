import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { Star, Shield, Award, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Lanyard = lazy(() => import('@/components/ui/Lanyard/Lanyard'))

export default function LanyardSection() {
  return (
    <section
      className="relative overflow-hidden bg-white"
      style={{ minHeight: '92vh' }}
    >
      {/* Subtle orange glow behind card area */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%',
          right: '2%',
          width: '480px',
          height: '480px',
          background: 'radial-gradient(circle, rgba(255,107,0,0.07) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.6,
        }}
      />

      {/* Full-section canvas — card hangs naturally in the right half */}
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
            </div>
          }
        >
          <Lanyard position={[-5, 0, 18]} gravity={[0, -40, 0]} fov={22} transparent />
        </Suspense>
      </div>

      {/* Text — left overlay */}
      <div className="relative z-10 pointer-events-none min-h-[92vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-lg py-28">

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-7"
              style={{
                background: 'rgba(255,107,0,0.08)',
                border: '1px solid rgba(255,107,0,0.25)',
                pointerEvents: 'auto',
              }}
            >
              <Star className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
              <span className="text-brand-orange text-xs font-accent font-bold uppercase tracking-widest">
                Brand Ambassador
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.07 }}
              className="font-heading uppercase leading-none tracking-wider mb-6"
              style={{ fontSize: 'clamp(44px, 6vw, 88px)', color: '#111827' }}
            >
              Shikhar <span style={{ color: '#FF6B00' }}>Dhawan</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="font-body leading-relaxed mb-8 max-w-sm"
              style={{ color: 'rgba(0,0,0,0.45)' }}
            >
              Drag the card. Feel the physics. Gabbar Sportz — trusted by India's cricket
              stars and 50,000+ athletes nationwide.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
              style={{ pointerEvents: 'auto' }}
            >
              {[
                { Icon: Shield, text: '100% Authentic Gear' },
                { Icon: Award, text: '4.9★ Rated' },
              ].map(({ Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                  style={{
                    background: 'rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <Icon className="w-4 h-4 text-brand-orange" />
                  <span className="text-sm font-accent" style={{ color: 'rgba(0,0,0,0.6)' }}>
                    {text}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.26 }}
              style={{ pointerEvents: 'auto' }}
            >
              <Link
                to="/category/cricket"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-accent font-semibold text-sm text-white transition-all"
                style={{
                  background: '#FF6B00',
                  boxShadow: '0 4px 24px rgba(255,107,0,0.3)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e05f00')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FF6B00')}
              >
                Shop Cricket Gear <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Drag hint — bottom center */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      >
        <p
          className="font-accent text-xs uppercase tracking-widest"
          style={{ color: 'rgba(0,0,0,0.2)' }}
        >
          ↑ Drag the card
        </p>
      </motion.div>
    </section>
  )
}
