import React, { useEffect, useRef } from 'react'

export interface InteractiveGridBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  gridSize?: number
  gridColor?: string
  effectColor?: string
  trailLength?: number
  idleSpeed?: number
  glow?: boolean
  glowRadius?: number
  showFade?: boolean
  fadeIntensity?: number
  idleRandomCount?: number
  children?: React.ReactNode
}

const InteractiveGridBackground: React.FC<InteractiveGridBackgroundProps> = ({
  gridSize = 50,
  gridColor = '#E5E7EB',
  effectColor = 'rgba(255, 107, 0, 0.45)',
  trailLength = 5,
  idleSpeed = 0.18,
  glow = true,
  glowRadius = 18,
  children,
  showFade = true,
  fadeIntensity = 15,
  idleRandomCount = 4,
  className,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<{ x: number; y: number }[]>([])
  const idleTargetsRef = useRef<{ x: number; y: number }[]>([])
  const idlePositionsRef = useRef<{ x: number; y: number }[]>([])
  const lastMouseTimeRef = useRef(Date.now())
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resize = () => {
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const rawX = e.clientX - rect.left
      const rawY = e.clientY - rect.top
      if (rawX < 0 || rawY < 0 || rawX > rect.width || rawY > rect.height) return
      lastMouseTimeRef.current = Date.now()
      const sx = Math.floor(rawX / gridSize)
      const sy = Math.floor(rawY / gridSize)
      const last = trailRef.current[0]
      if (!last || last.x !== sx || last.y !== sy) {
        trailRef.current.unshift({ x: sx, y: sy })
        if (trailRef.current.length > trailLength) trailRef.current.pop()
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const ctx = canvas.getContext('2d')!

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      const cols = Math.floor(W / gridSize)
      const rows = Math.floor(H / gridSize)

      // Lazy-init idle positions
      if (idleTargetsRef.current.length !== idleRandomCount) {
        idleTargetsRef.current = Array.from({ length: idleRandomCount }, () => ({
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows),
        }))
        idlePositionsRef.current = idleTargetsRef.current.map((p) => ({ ...p }))
      }

      ctx.clearRect(0, 0, W, H)

      // Grid lines
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 1
      for (let x = 0; x <= W; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y <= H; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // Idle animation after 2s inactivity
      if (Date.now() - lastMouseTimeRef.current > 2000) {
        idlePositionsRef.current.forEach((pos, i) => {
          const target = idleTargetsRef.current[i]
          const dx = target.x - pos.x
          const dy = target.y - pos.y
          if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
            idleTargetsRef.current[i] = {
              x: Math.floor(Math.random() * cols),
              y: Math.floor(Math.random() * rows),
            }
          } else {
            pos.x += dx * idleSpeed
            pos.y += dy * idleSpeed
          }
          const rx = Math.round(pos.x)
          const ry = Math.round(pos.y)
          const last = trailRef.current[0]
          if (!last || last.x !== rx || last.y !== ry) {
            trailRef.current.unshift({ x: rx, y: ry })
            if (trailRef.current.length > trailLength * idleRandomCount) trailRef.current.pop()
          }
        })
      }

      // Draw trail
      ctx.shadowBlur = 0
      trailRef.current.forEach((cell, idx) => {
        const alpha = 1 - idx / (trailLength + 1)
        const color = effectColor.replace(/[\d.]+\)$/, `${alpha})`)
        ctx.fillStyle = color
        if (glow) { ctx.shadowColor = color; ctx.shadowBlur = glowRadius }
        ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize, gridSize)
      })

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      ro.disconnect()
    }
  }, [gridSize, gridColor, effectColor, trailLength, idleSpeed, glow, glowRadius, idleRandomCount])

  return (
    <div
      ref={containerRef}
      className={`relative ${className ?? ''}`}
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {showFade && (
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: 'white',
            maskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, white)`,
            WebkitMaskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, white)`,
          }}
        />
      )}

      <div className="relative z-[2] w-full h-full">{children}</div>
    </div>
  )
}

export default InteractiveGridBackground
