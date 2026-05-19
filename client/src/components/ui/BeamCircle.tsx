import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

interface OrbitConfig {
  id: number
  radiusFactor: number
  speed: number
  icon: React.ReactNode
  iconSize: number
  orbitColor?: string
  orbitThickness?: number
}

interface BeamCircleProps {
  size?: number
  orbits?: OrbitConfig[]
  centerIcon?: React.ReactNode
}

const BeamCircle: React.FC<BeamCircleProps> = ({ size = 300, orbits: customOrbits, centerIcon }) => {
  const orbitsData = useMemo(() => customOrbits || [], [customOrbits])
  const halfSize = size / 2

  const rotationTransition = (duration: number) => ({
    repeat: Infinity,
    duration,
    ease: (t: number) => t,
  })

  const CenterIcon = useMemo(
    () => (
      <motion.div
        className="rounded-full shadow-lg bg-brand-orange grid place-content-center"
        style={{ width: halfSize * 0.28, height: halfSize * 0.28 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' as const }}
      >
        {centerIcon ?? (
          <span
            style={{ fontSize: halfSize * 0.11, color: '#fff', fontWeight: 900, fontFamily: 'Arial Black, Arial' }}
          >
            GS
          </span>
        )}
      </motion.div>
    ),
    [halfSize, centerIcon],
  )

  return (
    <div className="flex justify-center items-center bg-transparent">
      <div className="relative" style={{ width: size, height: size }}>
        {orbitsData.map((orbit) => {
          const orbitDiameter = size * orbit.radiusFactor
          const orbitRadius = orbitDiameter / 2

          return (
            <React.Fragment key={orbit.id}>
              {/* Orbit ring */}
              <div
                className="absolute rounded-full border border-dashed"
                style={{
                  width: orbitDiameter,
                  height: orbitDiameter,
                  top: halfSize - orbitRadius,
                  left: halfSize - orbitRadius,
                  borderColor: orbit.orbitColor || 'rgba(255,107,0,0.25)',
                  borderWidth: orbit.orbitThickness || 1,
                }}
              />

              {/* Rotating wrapper */}
              <motion.div
                className="absolute inset-0"
                style={{ width: size, height: size }}
                animate={{ rotate: 360 }}
                transition={rotationTransition(orbit.speed) as any}
              >
                <div
                  className="absolute"
                  style={{
                    top: halfSize,
                    left: halfSize + orbitRadius,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <motion.div
                    className="rounded-full shadow-md grid place-content-center p-1"
                    style={{
                      width: orbit.iconSize,
                      height: orbit.iconSize,
                      background: orbit.orbitColor
                        ? `${orbit.orbitColor}`
                        : 'rgba(255,107,0,0.15)',
                      border: `1px solid ${orbit.orbitColor || 'rgba(255,107,0,0.3)'}`,
                    }}
                    animate={{ rotate: -360 }}
                    transition={rotationTransition(orbit.speed) as any}
                  >
                    {React.isValidElement(orbit.icon)
                      ? React.cloneElement(orbit.icon as React.ReactElement<any>, {
                          size: orbit.iconSize * 0.55,
                        })
                      : orbit.icon}
                  </motion.div>
                </div>
              </motion.div>
            </React.Fragment>
          )
        })}

        <div className="absolute inset-0 grid place-content-center z-10">{CenterIcon}</div>
      </div>
    </div>
  )
}

export default BeamCircle
