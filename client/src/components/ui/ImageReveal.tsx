import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { MoveUpRight } from 'lucide-react'

interface RevealItem {
  key: number
  url: string
  label: string
  sub?: string
  href?: string
}

interface ImageRevealProps {
  items: RevealItem[]
  className?: string
  imageWidth?: number
  imageHeight?: number
}

export default function ImageReveal({
  items,
  className = '',
  imageWidth = 280,
  imageHeight = 360,
}: ImageRevealProps) {
  const [focused, setFocused] = useState<RevealItem | null>(null)
  const [isLarge, setIsLarge] = useState(true)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const smoothX = useSpring(cursorX, { stiffness: 280, damping: 38 })
  const smoothY = useSpring(cursorY, { stiffness: 280, damping: 38 })

  useEffect(() => {
    const update = () => setIsLarge(window.innerWidth >= 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const onMouseTrack = (e: React.MouseEvent) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
  }

  return (
    <div
      className={`relative w-full bg-white rounded-3xl border border-gray-100 overflow-hidden ${className}`}
      onMouseMove={onMouseTrack}
      onMouseLeave={() => setFocused(null)}
    >
      {items.map((item) => (
        <div
          key={item.key}
          className="group relative flex items-center justify-between px-6 sm:px-10 py-5 sm:py-7 cursor-pointer select-none"
          onMouseEnter={() => setFocused(item)}
          onClick={() => item.href && (window.location.href = item.href)}
        >
          {/* Mobile: show inline image */}
          {!isLarge && (
            <img
              src={item.url}
              className="w-20 h-14 object-cover rounded-xl mr-4 flex-shrink-0"
              alt={item.label}
            />
          )}

          <div className="flex-1">
            <h2
              className={`font-heading uppercase text-[clamp(28px,5vw,64px)] leading-none tracking-wider transition-colors duration-200 ${
                focused?.key === item.key
                  ? 'text-brand-orange'
                  : 'text-gray-900'
              }`}
            >
              {item.label}
            </h2>
            {item.sub && (
              <p className="text-gray-400 font-accent text-xs uppercase tracking-widest mt-1">{item.sub}</p>
            )}
          </div>

          <button
            aria-label={`View ${item.label}`}
            className={`hidden sm:flex w-12 h-12 rounded-full items-center justify-center transition-all duration-300 flex-shrink-0 ${
              focused?.key === item.key
                ? 'bg-brand-orange text-white shadow-[0_4px_20px_rgba(255,107,0,0.4)] scale-110'
                : 'bg-gray-50 text-gray-400 border border-gray-200'
            }`}
          >
            <MoveUpRight className="w-5 h-5" />
          </button>

          {/* Bottom border animated on hover */}
          <div
            className={`absolute bottom-0 left-0 h-px bg-brand-orange transition-all duration-300 ease-out ${
              focused?.key === item.key ? 'w-full' : 'w-0'
            }`}
          />
        </div>
      ))}

      {/* Floating image */}
      {isLarge && focused && (
        <motion.img
          key={focused.key}
          src={focused.url}
          alt={focused.label}
          className="fixed z-[100] object-cover rounded-2xl pointer-events-none shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          style={{
            width: imageWidth,
            height: imageHeight,
            left: smoothX,
            top: smoothY,
            x: '-50%',
            y: '-50%',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        />
      )}
    </div>
  )
}
