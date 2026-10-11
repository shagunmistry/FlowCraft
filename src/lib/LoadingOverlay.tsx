// LoadingOverlay.jsx
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type ColorOptions =
  | 'red'
  | 'blue'
  | 'teal'
  | 'purple'
  | 'pink'
  | 'green'
  | 'orange'
  | 'signal'

const LoadingOverlay = ({
  isLoading = false,
  text = 'Loading',
  color = 'signal' as ColorOptions,
  backgroundColor = 'ink',
  fullScreen = false,
  zIndex = 50,
}) => {
  const [dots, setDots] = useState('')

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 400)

    return () => clearInterval(interval)
  }, [isLoading])

  if (!isLoading) return null

  const bgClass =
    backgroundColor === 'transparent' ? 'bg-transparent' : 'bg-ink/90'
  const positionClass = fullScreen ? 'fixed inset-0' : 'absolute inset-0'

  return (
    <motion.div
      className={`${positionClass} ${bgClass} flex flex-col items-center justify-center backdrop-blur-sm z-${zIndex}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* dot grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(rgba(196,255,61,0.1) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative flex flex-col items-center gap-5">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <motion.svg
            viewBox="0 0 64 64"
            className="h-16 w-16"
            fill="none"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <circle
              cx="32"
              cy="32"
              r="29"
              stroke="#C4FF3D"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <circle cx="32" cy="3" r="2.5" fill="#C4FF3D" />
          </motion.svg>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex h-2 w-2 animate-tick rounded-full bg-signal" />
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-paper">
          <span>
            {text}
            {dots}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default LoadingOverlay
