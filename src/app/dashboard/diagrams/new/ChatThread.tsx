'use client'

import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import type { ChatMessage } from './useDiagramChat'

export default function ChatThread({
  messages,
  className,
}: {
  messages: ChatMessage[]
  className?: string
}) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  return (
    <div
      className={clsx(
        'relative flex-1 overflow-y-auto px-5 py-6',
        className,
      )}
    >
      {messages.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <p className="font-serif text-lg italic text-fog">
            Your conversation will live here.
          </p>
        </div>
      )}

      <ol className="space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.15) }}
              className={clsx(
                'flex flex-col gap-1.5',
                m.role === 'user' ? 'items-end' : 'items-start',
              )}
            >
              <div className="flex items-center gap-2 text-xs text-fog">
                {m.role === 'user' ? (
                  <>
                    <span className="h-px w-6 bg-rule" />
                    <span>You</span>
                  </>
                ) : (
                  <>
                    <span>Assistant</span>
                    <span className="h-px w-6 bg-signal/60" />
                    {m.streaming && (
                      <span className="inline-flex items-center gap-1 text-signal">
                        <span className="h-1 w-1 rounded-full bg-signal animate-tick" />
                        drafting
                      </span>
                    )}
                  </>
                )}
              </div>

              <div
                className={clsx(
                  'max-w-[90%] rounded-lg px-4 py-3 text-[13px] leading-relaxed',
                  m.role === 'user'
                    ? 'bg-paper text-ink shadow-[0_1px_0_rgb(0_0_0_/_0.06)]'
                    : 'border border-rule/60 bg-graphite text-paper',
                )}
              >
                {m.streaming && !m.content ? (
                  <span className="inline-flex gap-1 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-fog animate-tick" />
                    <span className="h-1.5 w-1.5 rounded-full bg-fog animate-tick [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-fog animate-tick [animation-delay:240ms]" />
                  </span>
                ) : (
                  <p className="whitespace-pre-wrap font-sans">{m.content}</p>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      <div ref={endRef} />
    </div>
  )
}
