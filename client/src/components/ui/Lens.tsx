import React, { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface LensProps {
  children: React.ReactNode
  zoomFactor?: number
  lensSize?: number
  isStatic?: boolean
  position?: { x: number; y: number }
  hovering?: boolean
  setHovering?: (v: boolean) => void
  className?: string
  maskShape?: 'circle' | 'square'
  blurEdge?: boolean
  smoothFollow?: boolean
  disabled?: boolean
}

export const Lens: React.FC<LensProps> = ({
  children,
  zoomFactor = 1.8,
  lensSize = 180,
  isStatic = false,
  position = { x: 200, y: 150 },
  hovering,
  setHovering,
  className,
  maskShape = 'circle',
  blurEdge = false,
  smoothFollow = true,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [localHovering, setLocalHovering] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 100, y: 100 })

  const isHovering = hovering !== undefined ? hovering : localHovering
  const setIsHovering = setHovering ?? setLocalHovering

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isStatic) return
    const rect = e.currentTarget.getBoundingClientRect()
    const raw = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    if (smoothFollow) {
      setMousePos(raw)
    } else {
      const g = 20
      setMousePos({ x: Math.round(raw.x / g) * g, y: Math.round(raw.y / g) * g })
    }
  }

  const cx = isStatic ? position.x : mousePos.x
  const cy = isStatic ? position.y : mousePos.y
  const r = lensSize / 2

  const getMask = (x: number, y: number) => {
    const shape = maskShape === 'circle'
      ? `circle ${r}px at ${x}px ${y}px`
      : `ellipse ${r}px ${r}px at ${x}px ${y}px`
    return blurEdge
      ? `radial-gradient(${shape}, black 60%, transparent 100%)`
      : `radial-gradient(${shape}, black 100%, transparent 100%)`
  }

  const lensContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute inset-0 overflow-hidden"
      style={{
        maskImage: getMask(cx, cy),
        WebkitMaskImage: getMask(cx, cy),
        transformOrigin: `${cx}px ${cy}px`,
        zIndex: 50,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${zoomFactor})`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      >
        {children}
      </div>
    </motion.div>
  )

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden z-20 h-full w-full rounded-2xl ${className ?? ''}`}
      onMouseEnter={() => !disabled && setIsHovering(true)}
      onMouseLeave={() => !disabled && setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {children}

      {isStatic
        ? lensContent
        : (
          <AnimatePresence>
            {isHovering && !disabled && lensContent}
          </AnimatePresence>
        )}
    </div>
  )
}

export default Lens
