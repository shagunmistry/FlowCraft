import React from 'react'
import clsx from 'clsx'
import UiButton from '@/components/ui/Button'

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
      <h3 className="px-4 pb-2 text-sm font-semibold text-fog">
        {title}
      </h3>
    )}
    <div className="divide-y divide-rule overflow-hidden rounded-xl border border-rule bg-graphite">
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
      {Icon && <Icon className="h-5 w-5 text-fog" />}
      <span className="text-sm font-medium text-paper">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      {value && <span className="text-sm text-fog">{value}</span>}
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
}) => (
  <UiButton
    onClick={onClick}
    disabled={disabled}
    variant={variant}
    size="sm"
    className={className}
  >
    {children}
  </UiButton>
)
