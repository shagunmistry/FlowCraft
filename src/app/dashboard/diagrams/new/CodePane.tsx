'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

/**
 * Simple editable Mermaid code pane.
 *
 * Deliberately not pulling in CodeMirror/Monaco — a styled textarea with
 * JetBrains Mono, line numbers, and a debounced onChange is fast,
 * dependency-free, and keeps the editorial aesthetic of the app.
 */
export default function CodePane({
  value,
  onChange,
  readOnly = false,
  streaming = false,
  debounceMs = 300,
  className,
  onCollapse,
}: {
  value: string
  onChange: (v: string) => void
  readOnly?: boolean
  streaming?: boolean
  debounceMs?: number
  className?: string
  onCollapse?: () => void
}) {
  const [local, setLocal] = useState(value)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Accept upstream changes (streaming deltas, AI replacements).
  useEffect(() => {
    setLocal(value)
  }, [value])

  const lineNumbers = useMemo(() => {
    const count = Math.max(1, local.split('\n').length)
    return Array.from({ length: count }, (_, i) => i + 1)
  }, [local])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value
    setLocal(next)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onChange(next), debounceMs)
  }

  const syncScroll = () => {
    if (gutterRef.current && textRef.current) {
      gutterRef.current.scrollTop = textRef.current.scrollTop
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(local)
    } catch {
      /* noop */
    }
  }

  return (
    <div
      className={clsx(
        'relative flex h-full flex-col overflow-hidden border-r border-rule/60 bg-graphite',
        className,
      )}
    >
      {/* Header rail */}
      <div className="flex items-center justify-between border-b border-rule/60 bg-ink/70 px-5 py-3">
        <div className="flex items-center gap-3 text-xs text-fog">
          <span className="text-paper/80">Mermaid</span>
          <span className={streaming ? 'text-signal' : 'text-fog'}>
            {streaming ? 'Receiving' : readOnly ? 'Read only' : 'Editable'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-sm border border-rule/60 px-2 py-1 text-fog hover:border-signal/60 hover:text-paper"
          >
            Copy
          </button>
          {onCollapse && (
            <button
              type="button"
              onClick={onCollapse}
              aria-label="Collapse code pane"
              title="Collapse"
              className="rounded-sm border border-rule/60 px-2 py-1 text-fog hover:border-signal/60 hover:text-paper"
            >
              ⟨
            </button>
          )}
        </div>
      </div>

      {/* Editor body */}
      <div ref={wrapRef} className="relative flex min-h-0 flex-1">
        <div
          ref={gutterRef}
          className="select-none overflow-hidden border-r border-rule/40 bg-ink/40 px-3 py-4 font-mono text-[11px] leading-6 text-fog/70"
          aria-hidden
        >
          {lineNumbers.map((n) => (
            <div key={n} className="text-right tabular-nums">
              {n}
            </div>
          ))}
        </div>

        <textarea
          ref={textRef}
          value={local}
          spellCheck={false}
          readOnly={readOnly || streaming}
          onChange={handleChange}
          onScroll={syncScroll}
          className={clsx(
            'block h-full min-h-0 flex-1 resize-none bg-transparent px-4 py-4',
            'font-mono text-[12px] leading-6 text-paper',
            'outline-none',
            'placeholder:text-fog/60',
          )}
          placeholder="Your Mermaid code will appear here..."
        />

        {streaming && (
          <div className="pointer-events-none absolute bottom-3 right-4 text-xs text-signal">
            <span className="inline-block h-2 w-2 rounded-full bg-signal animate-tick align-middle" />
            <span className="ml-2 align-middle">writing</span>
          </div>
        )}
      </div>
    </div>
  )
}
