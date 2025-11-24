'use client'

import React from 'react'
import { motion } from 'framer-motion'

const variants = {
  default: {
    background: 'bg-white',
    shadow: 'shadow-xl',
    hover: 'hover:shadow-2xl hover:shadow-red-100/50',
  },
  gradient: {
    background: 'bg-gradient-to-br from-red-50 to-red-50',
    shadow: 'shadow-xl shadow-red-100/30',
    hover: 'hover:shadow-2xl hover:shadow-red-100/50',
  },
  elevated: {
    background: 'bg-white',
    shadow: 'shadow-2xl shadow-red-100/50',
    hover: 'hover:shadow-2xl hover:shadow-red-100/50',
  },
}

export default function Card({
  children,
  variant = 'default',
  className = '',
  hoverEffect = true,
  animate = true,
  decorativeElement = false,
  padding = 'p-8',
  ...props
}: {
  children: React.ReactNode
  variant?: 'default' | 'gradient' | 'elevated'
  className?: string
  hoverEffect?: boolean
  animate?: boolean
  decorativeElement?: boolean
  padding?: string
  [key: string]: any
}) {
  const cardClasses = `
    rounded-2xl
    overflow-hidden
    ${variants[variant]?.background || variants.default.background}
    ${variants[variant]?.shadow || variants.default.shadow}
    ${hoverEffect ? variants[variant]?.hover || variants.default.hover : ''}
    ${hoverEffect ? 'transition-all duration-300' : ''}
    ${padding}
    ${className}
  `

  const content = (
    <>
      {decorativeElement && (
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-red-50 to-red-50 opacity-0 transition-all duration-500 group-hover:opacity-100"></div>
      )}
      <div className="relative z-10">{children}</div>
    </>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`${cardClasses} ${decorativeElement ? 'group relative' : ''}`}
        {...props}
      >
        {content}
      </motion.div>
    )
  }

  return (
    <div
      className={`${cardClasses} ${decorativeElement ? 'group relative' : ''}`}
      {...props}
    >
      {content}
    </div>
  )
}
