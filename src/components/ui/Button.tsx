import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const buttonStyles = {
  base: 'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[opacity,background-color,border-color] disabled:cursor-not-allowed disabled:opacity-50',
  variant: {
    primary: 'bg-signal text-ink hover:opacity-90',
    secondary: 'border border-rule bg-graphite text-paper hover:border-signal',
    outline: 'border border-rule bg-graphite text-paper hover:border-signal',
    quiet: 'text-paper hover:bg-graphite',
    danger: 'border border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/15 dark:text-red-400',
  },
  size: {
    sm: 'px-4 py-2 text-[13px]',
    md: 'px-6 py-3 text-[15px]',
    lg: 'px-8 py-4 text-base',
  },
}

type Props = {
  children: React.ReactNode
  href?: string
  variant?: keyof typeof buttonStyles.variant
  size?: keyof typeof buttonStyles.size
  icon?: React.ReactNode
  fullWidth?: boolean
  className?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  className,
  ...props
}: Props) {
  const classes = cn(
    buttonStyles.base,
    buttonStyles.variant[variant],
    buttonStyles.size[size],
    fullWidth && 'w-full',
    className,
  )
  const content = (
    <>
      {children}
      {icon}
    </>
  )
  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }
  return (
    <button className={classes} {...props}>
      {content}
    </button>
  )
}
