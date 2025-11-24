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

const LoadingOverlay = ({
  isLoading = false,
  text = 'Loading',
  color = 'red' as ColorOptions,
  backgroundColor = 'white',
  fullScreen = false,
  zIndex = 50,
}) => {
  const [dots, setDots] = useState('')

  // Animated dots effect
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

  // Color mapping for Tailwind classes
  const colorMap = {
    red: 'bg-red-600',
    blue: 'bg-blue-600',
    teal: 'bg-teal-600',
    purple: 'bg-purple-600',
    pink: 'bg-pink-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
  }
  const colorClass = colorMap[color as ColorOptions] || 'bg-red-600'

  const bgClass =
    backgroundColor === 'transparent' ? 'bg-transparent' : 'bg-white'
  const positionClass = fullScreen ? 'fixed inset-0' : 'absolute inset-0'

  return (
    <motion.div
      className={`${positionClass} ${bgClass} flex flex-col items-center justify-center bg-opacity-80 z-${zIndex}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center">
        {/* Canva-inspired loader animation */}
        <div className="mb-4 flex items-center justify-center">
          <motion.div
            className={`h-4 w-4 rounded-full ${colorClass} mr-1`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0,
            }}
          />
          <motion.div
            className={`h-4 w-4 rounded-full ${colorClass} mr-1`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
          />
          <motion.div
            className={`h-4 w-4 rounded-full ${colorClass}`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
          />
        </div>

        {/* Text with animated dots */}
        <motion.div
          className="text-sm font-medium text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
          {dots}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LoadingOverlay
