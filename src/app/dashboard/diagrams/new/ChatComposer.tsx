'use client'

import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'

export default function ChatComposer({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Ask for edits — "make nodes green", "add a review step after start"...',
  submitLabel = 'Send',
  size = 'normal',
  autoFocus = false,
  footerLeft,
  footerRight,
  className,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  disabled?: boolean
  placeholder?: string
  submitLabel?: string
  size?: 'normal' | 'large'
  autoFocus?: boolean
  footerLeft?: React.ReactNode
  footerRight?: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  // Auto-grow.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = '0px'
    const max = size === 'large' ? 260 : 180
    el.style.height = Math.min(el.scrollHeight, max) + 'px'
  }, [value, size])

  useEffect(() => {
    if (autoFocus) ref.current?.focus()
  }, [autoFocus])

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      if (!disabled && value.trim()) onSubmit()
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!disabled && value.trim()) onSubmit()
      }}
      className={clsx(
        'group relative rounded-lg border border-rule bg-graphite/80 transition',
        'focus-within:border-signal/70 focus-within:shadow-[0_0_0_1px_rgb(196_255_61_/_0.35)]',
        className,
      )}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        disabled={disabled}
        rows={size === 'large' ? 3 : 1}
        className={clsx(
          'block w-full resize-none bg-transparent px-5 pb-3 pt-4',
          'font-sans text-paper placeholder:text-fog/80 outline-none',
          size === 'large' ? 'text-[15px] leading-relaxed' : 'text-[13px] leading-6',
          disabled && 'opacity-60',
        )}
      />
      <div className="flex items-center justify-between gap-3 border-t border-rule/50 px-4 py-2">
        <div className="flex min-w-0 items-center gap-3 text-xs text-fog">
          <span className="truncate">
            {footerLeft ?? <span>Enter to send · Shift + Enter for newline</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {footerRight}
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className={clsx(
              'relative inline-flex items-center gap-2 rounded-sm px-3 py-1.5',
              'text-sm font-medium',
              'transition',
              disabled || !value.trim()
                ? 'cursor-not-allowed border border-rule text-fog'
                : 'border border-signal bg-signal text-ink hover:bg-paper hover:text-ink',
            )}
          >
            <span>{submitLabel}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden
            >
              <path
                d="M1 5h8M5 1l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="square"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  )
}
