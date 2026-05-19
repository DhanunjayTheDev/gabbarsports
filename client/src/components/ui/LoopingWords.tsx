import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoopingWordsProps {
  words: string[]
  className?: string
}

export function LoopingWords({ words, className }: LoopingWordsProps) {
  const wordsRef = useRef<(HTMLLIElement | null)[]>([])
  const [selectorWidth, setSelectorWidth] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const duplicatedWords = [...words, ...words]
  const totalOriginal = words.length
  // percent of total list height each word occupies
  const wordStepPct = 100 / duplicatedWords.length

  // Motion value in percent (numeric, e.g. -8.33)
  const yMotion = useMotionValue(0)
  const yTransform = useTransform(yMotion, (v) => `${v}%`)

  function updateWidth(index: number) {
    const el = wordsRef.current[index]
    if (el) setSelectorWidth(el.offsetWidth)
  }

  // Measure immediately after layout
  useLayoutEffect(() => {
    updateWidth(1)
  }, [])

  // Re-measure once Bebas Neue loads (avoids fallback-font dimension)
  useEffect(() => {
    document.fonts.ready.then(() => updateWidth(1))
  }, [])

  useEffect(() => {
    let step = 0

    const interval = setInterval(async () => {
      // Seamless loop: when we've shown all original words,
      // jump instantly to 0% (duplicate word = same text) then continue
      if (step >= totalOriginal) {
        step = 0
        yMotion.set(0)
      }

      step++

      // Update bracket width to match the word coming into center
      updateWidth((step % totalOriginal) + 1 < duplicatedWords.length
        ? (step % totalOriginal) + 1
        : 1)

      await animate(yMotion, -(step * wordStepPct), {
        duration: 1.2,
        ease: [0.175, 0.885, 0.32, 1.15],
      })
    }, 2200)

    return () => clearInterval(interval)
  }, [totalOriginal, wordStepPct, yMotion, duplicatedWords.length])

  const wordColor = isHovered ? '#FF6B00' : '#111827'

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/*
        Font inline on parent — avoids Tailwind class load-order issues.
        leading-none (line-height:1) → each word exactly 1em tall.
        h-[3em] shows 3 words; center word (1em–2em) is in the visible zone.
      */}
      <div
        className="relative h-[3em] px-[0.2em] text-[14vw] md:text-[9vw] leading-none font-bold uppercase whitespace-nowrap overflow-hidden"
        style={{ fontFamily: '"Bebas Neue", "Arial Narrow", Arial, sans-serif' }}
      >
        <motion.ul
          className="flex flex-col items-center m-0 p-0 list-none"
          style={{ y: yTransform }}
        >
          {duplicatedWords.map((word, i) => (
            <li
              key={i}
              ref={(el) => { wordsRef.current[i] = el }}
              className="tracking-tight flex items-center h-[1em]"
              style={{ color: wordColor, transition: 'color 0.25s ease' }}
            >
              {word}
            </li>
          ))}
        </motion.ul>

        {/* Top + bottom fade — 22%/78% gives center word full visibility */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            backgroundImage:
              'linear-gradient(180deg, #ffffff 0%, transparent 22%, transparent 78%, #ffffff 100%)',
          }}
        />

        {/* Bracket selector — 1em tall, centered on middle word */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[1em] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
          animate={{ width: selectorWidth }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="absolute top-0 left-0 w-[0.14em] h-[0.14em] border-t-[0.045em] border-l-[0.045em] border-brand-orange" />
          <div className="absolute top-0 right-0 w-[0.14em] h-[0.14em] border-t-[0.045em] border-r-[0.045em] border-brand-orange" />
          <div className="absolute bottom-0 left-0 w-[0.14em] h-[0.14em] border-b-[0.045em] border-l-[0.045em] border-brand-orange" />
          <div className="absolute bottom-0 right-0 w-[0.14em] h-[0.14em] border-b-[0.045em] border-r-[0.045em] border-brand-orange" />
        </motion.div>
      </div>
    </div>
  )
}
