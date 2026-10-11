import React from 'react'
import clsx from 'clsx'

export const Section = ({
  title,
  children,
  className,
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) => (
  <section className={clsx('mb-8', className)}>
    {title && (
      <h3 className="px-4 pb-2 text-sm font-semibold text-zinc-500">
        {title}
      </h3>
    )}
    <div className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      {children}
    </div>
  </section>
)

export const Row = ({
  label,
  value,
  icon: Icon,
  action,
  className,
}: {
  label: string
  value?: string | React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  action?: React.ReactNode
  className?: string
}) => (
  <div
    className={clsx(
      'flex min-h-[3.5rem] items-center justify-between p-4',
      className,
    )}
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon className="h-5 w-5 text-zinc-400" />}
      <span className="text-sm font-medium text-zinc-900">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      {value && <span className="text-sm text-zinc-500">{value}</span>}
      {action}
    </div>
  </div>
)

export const Button = ({
  children,
  onClick,
  variant = 'secondary',
  disabled,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  disabled?: boolean
  className?: string
}) => {
  const base =
    'px-4 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 disabled:opacity-50'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    outline: 'border border-zinc-200 text-zinc-600 hover:bg-zinc-50',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(base, variants[variant], className)}
    >
      {children}
    </button>
  )
}
