import { motion } from 'framer-motion'
import React from 'react'

interface AnimatedCircleProps {
  children: React.ReactNode
  color?: string
  strokeWidth?: number
  duration?: number
  className?: string
}

export default function AnimatedCircle({
  children,
  color = '#FF6B00',
  strokeWidth = 3,
  duration = 1.25,
  className = '',
}: AnimatedCircleProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg
        viewBox="0 0 286 73"
        fill="none"
        className="absolute pointer-events-none"
        style={{
          left: '-6px',
          right: '-6px',
          top: '-4px',
          bottom: 0,
          width: 'calc(100% + 12px)',
          height: 'auto',
          transform: 'translateY(6px)',
        }}
        aria-hidden
      >
        <motion.path
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration, ease: 'easeInOut' }}
          d="M142.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 73.2652 122.688 71.7518C215.814 70.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
