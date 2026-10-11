'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface InfoPanelProps {
  open: boolean
  onClose: () => void
  title: string
  type: string
  description?: string
  createdAt?: string
}

export default function InfoPanel({
  open,
  onClose,
  title,
  type,
  description,
  createdAt,
}: InfoPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: 360 }}
            animate={{ x: 0 }}
            exit={{ x: 360 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-[360px] flex-col border-l border-rule bg-graphite text-paper"
          >
            {/* dot grid atmosphere */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-40"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 top-0 h-60 w-60 rounded-full bg-signal/10 blur-3xl"
            />

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-rule px-6 py-5">
              <div>
                <h2 className="font-serif text-2xl leading-none text-paper">
                  Details
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-sm p-1.5 text-fog transition-colors hover:bg-ink hover:text-signal"
                aria-label="Close panel"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="relative flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-7">
                <Field label="Title">
                  <p className="font-serif text-xl leading-tight text-paper">
                    {title || 'Untitled'}
                  </p>
                </Field>

                <Field label="Type">
                  <span className="inline-flex items-center gap-2 border border-rule bg-ink px-2.5 py-1 text-xs capitalize text-signal">
                    <span className="h-1 w-1 rounded-full bg-signal" />
                    {type.replace('_', ' ')}
                  </span>
                </Field>

                {description && (
                  <Field label="Description">
                    <p className="text-sm leading-relaxed text-paper/70">
                      {description}
                    </p>
                  </Field>
                )}

                {createdAt && (
                  <Field label="Created">
                    <p className="text-sm text-paper/80">
                      {new Date(createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </Field>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="relative border-t border-rule px-6 py-5">
              <a
                href="https://flowcraft.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between text-xs text-fog transition-colors hover:text-signal"
              >
                <span>Drafted with FlowCraft</span>
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="text-xs font-medium text-fog">{label}</div>
      <div className="mt-3">{children}</div>
    </div>
  )
}
