import { useState } from 'react'
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SlideToConfirmProps {
  text?: string
  successText?: string
  onConfirm: () => Promise<void> | void
  width?: number
  height?: number
  className?: string
}

export function SlideToConfirm({
  text = 'Slide to confirm',
  successText = 'Confirmed!',
  onConfirm,
  width = 380,
  height = 56,
  className,
}: SlideToConfirmProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle')
  const trackWidth = width - height
  const thumbSize = height - 8

  const x = useMotionValue(0)
  const controls = useAnimation()

  const textOpacity = useTransform(x, [0, trackWidth * 0.5], [1, 0])
  const bgWidth = useTransform(x, [0, trackWidth], [height, width])

  const handleDragEnd = async () => {
    if (state !== 'idle') return
    if (x.get() >= trackWidth * 0.9) {
      controls.start({ x: trackWidth, transition: { type: 'spring', stiffness: 400, damping: 30 } })
      setState('loading')
      try {
        await onConfirm()
        setState('success')
      } catch {
        setState('idle')
        controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } })
      }
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } })
    }
  }

  const handleReset = () => {
    if (state === 'success') {
      setState('idle')
      x.set(0)
      controls.start({ x: 0 })
    }
  }

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 select-none',
        state === 'success' ? 'cursor-pointer border-green-500/50' : '',
        className,
      )}
      style={{ width, height }}
      onClick={handleReset}
    >
      {/* Progress fill */}
      <motion.div
        className="absolute left-0 top-0 h-full rounded-full"
        style={{
          width: state === 'success' ? width : bgWidth,
          backgroundColor: state === 'success' ? '#22c55e' : '#FF6B00',
          opacity: state === 'success' ? 0.12 : 0.08,
        }}
        animate={{ width: state === 'success' ? width : undefined }}
        transition={{ duration: 0.3 }}
      />

      {/* Idle text */}
      <motion.span
        className={cn(
          'absolute font-accent text-sm font-medium z-0 pointer-events-none',
          state === 'success' ? 'text-green-600' : 'text-gray-400',
        )}
        style={{ opacity: state === 'idle' ? textOpacity : 0 }}
      >
        {text}
      </motion.span>

      {/* Success text */}
      <motion.span
        className="absolute font-accent text-sm font-semibold z-0 text-green-600 pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: state === 'success' ? 1 : 0, y: state === 'success' ? 0 : 10 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {successText}
      </motion.span>

      {/* Draggable thumb */}
      <motion.div
        drag={state === 'idle' ? 'x' : false}
        dragConstraints={{ left: 0, right: trackWidth }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        className={cn(
          'absolute left-1 z-10 flex items-center justify-center rounded-full bg-white shadow-md',
          state === 'idle' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
        )}
        initial={false}
        whileTap={{ scale: state === 'idle' ? 0.95 : 1 }}
        animate={
          state === 'success'
            ? { x: trackWidth, backgroundColor: '#22c55e', color: 'white' }
            : controls
        }
        style={{ width: thumbSize, height: thumbSize, x }}
      >
        {/* Arrow idle */}
        <motion.div
          animate={{ scale: state === 'idle' ? 1 : 0, opacity: state === 'idle' ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <ArrowRight className="h-5 w-5 text-brand-orange" />
        </motion.div>

        {/* Spinner loading (12-spoke macOS style) */}
        <motion.div
          animate={{ scale: state === 'loading' ? 1 : 0, opacity: state === 'loading' ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute flex h-full w-full items-center justify-center"
        >
          <div className="relative h-[20px] w-[20px]">
            {[...Array(12)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute left-[9px] top-0 h-[5.5px] w-[1.8px] rounded-full bg-gray-600"
                style={{ rotate: i * 30, transformOrigin: 'center 10px' }}
                animate={{ opacity: [0.15, 1, 0.15] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.091, ease: 'linear' }}
              />
            ))}
          </div>
        </motion.div>

        {/* Check success */}
        <motion.div
          animate={{ scale: state === 'success' ? 1 : 0, opacity: state === 'success' ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute text-white"
        >
          <Check className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </div>
  )
}
