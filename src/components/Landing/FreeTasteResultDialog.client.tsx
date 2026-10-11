'use client'

import Link from 'next/link'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
// Same viewer logged-in users get in the new-diagram workbench: auto-fit, zoom, pan.
import PreviewPane from '@/app/dashboard/diagrams/new/PreviewPane'
import { trackTryIt } from '@/lib/free-taste/track'

type Props = {
  open: boolean
  onClose: () => void
  code: string
  prompt: string
  remaining: number | null
}

// Rendered through a portal by Headless UI, so it sits above the landing page
// (no hero overlay / scroll-reveal fade) and gives the diagram the whole screen.
export default function FreeTasteResultDialog({ open, onClose, code, prompt, remaining }: Props) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[100]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200 data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-6">
        <DialogPanel
          transition
          className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-sm border border-rule bg-ink text-paper shadow-2xl transition duration-200 data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <header className="flex items-start justify-between gap-4 border-b border-rule px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <DialogTitle className="text-sm font-medium text-signal">
                Your diagram
              </DialogTitle>
              <p className="mt-1 truncate text-sm text-fog" title={prompt}>
                {prompt}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 rounded-sm border border-rule px-2.5 py-1 text-xs text-fog transition-colors hover:text-paper"
            >
              Close
            </button>
          </header>

          <div className="h-[min(60vh,640px)] min-h-[220px] shrink-0">
            <PreviewPane code={code} />
          </div>

          <footer className="flex flex-col gap-3 border-t border-rule px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="text-sm text-paper">Love it? Save it, edit it and export it.</p>
              <p className="mt-0.5 text-xs text-fog">
                {remaining !== null
                  ? `${remaining} free ${remaining === 1 ? 'try' : 'tries'} left · `
                  : ''}
                Free account, no credit card
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-sm border border-rule px-4 py-2 text-sm text-fog transition-colors hover:text-paper"
              >
                Try another
              </button>
              <Link
                href="/sign-up?src=try-it"
                onClick={() => trackTryIt('try_it_cta_clicked', { where: 'dialog' })}
                className="rounded-sm bg-signal px-4 py-2 text-sm font-medium text-ink transition-colors hover:opacity-90"
              >
                Sign up free to save and export
              </Link>
            </div>
          </footer>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
