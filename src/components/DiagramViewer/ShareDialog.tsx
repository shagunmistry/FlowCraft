'use client'

import { track } from '@/lib/analytics'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  ClipboardDocumentIcon,
  CheckIcon,
  XMarkIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'

interface ShareDialogProps {
  open: boolean
  onClose: () => void
  mode: 'owner' | 'viewer'
  diagramId?: string
}

export default function ShareDialog({
  open,
  onClose,
  mode,
  diagramId,
}: ShareDialogProps) {
  const [copied, setCopied] = useState<'current' | 'share' | null>(null)
  const [generatingLink, setGeneratingLink] = useState(false)
  const [shareableLink, setShareableLink] = useState<string | null>(null)

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopy = async (url: string, which: 'current' | 'share') => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(which)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(which)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  const handleGenerateLink = async () => {
    if (!diagramId) return
    setGeneratingLink(true)
    try {
      const res = await fetch('/api/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagramId }),
      })
      const data = await res.json()
      if (data.result?.link) {
        track('share_created', { surface: 'viewer' })
        setShareableLink(data.result.link)
      }
    } catch (err) {
      console.error('Failed to generate link:', err)
    } finally {
      setGeneratingLink(false)
    }
  }

  const handleClose = () => {
    setCopied(null)
    setShareableLink(null)
    onClose()
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md overflow-hidden rounded-sm border border-rule bg-graphite text-paper shadow-2xl shadow-black/60">
                {/* atmosphere */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-30"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-signal/10 blur-3xl"
                />

                <div className="relative border-b border-rule px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <Dialog.Title className="font-serif text-2xl leading-none text-paper">
                        Share this diagram
                      </Dialog.Title>
                    </div>
                    <button
                      onClick={handleClose}
                      className="rounded-sm p-1.5 text-fog hover:bg-ink hover:text-signal"
                      aria-label="Close"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="relative space-y-5 px-6 py-6">
                  {/* Current URL */}
                  <div>
                    <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-fog">
                      <span className="h-px w-4 bg-fog/60" />
                      Page link
                    </label>
                    <div className="mt-3 flex items-center gap-2 border border-rule bg-ink px-3 py-2.5">
                      <LinkIcon className="h-4 w-4 flex-shrink-0 text-fog" />
                      <span className="flex-1 truncate font-mono text-xs text-paper/80">
                        {currentUrl}
                      </span>
                      <button
                        onClick={() => handleCopy(currentUrl, 'current')}
                        className="flex-shrink-0 rounded-sm p-1 text-fog transition-colors hover:bg-graphite hover:text-signal"
                        aria-label="Copy page link"
                      >
                        {copied === 'current' ? (
                          <CheckIcon className="h-4 w-4 text-signal" />
                        ) : (
                          <ClipboardDocumentIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Shareable link (owner only) */}
                  {mode === 'owner' && diagramId && (
                    <div>
                      {shareableLink ? (
                        <div>
                          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-signal">
                            <span className="h-px w-4 bg-signal/60" />
                            Public shareable link
                          </label>
                          <div className="mt-3 flex items-center gap-2 border border-signal/40 bg-signal/5 px-3 py-2.5">
                            <LinkIcon className="h-4 w-4 flex-shrink-0 text-signal" />
                            <span className="flex-1 truncate font-mono text-xs text-signal">
                              {shareableLink}
                            </span>
                            <button
                              onClick={() => handleCopy(shareableLink, 'share')}
                              className="flex-shrink-0 rounded-sm p-1 text-signal transition-colors hover:bg-signal/10"
                              aria-label="Copy shareable link"
                            >
                              {copied === 'share' ? (
                                <CheckIcon className="h-4 w-4" />
                              ) : (
                                <ClipboardDocumentIcon className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={handleGenerateLink}
                          disabled={generatingLink}
                          className="group flex w-full items-center justify-between gap-3 rounded-sm bg-signal px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-paper disabled:opacity-50"
                        >
                          <span>
                            {generatingLink
                              ? 'Generating…'
                              : '+ Generate shareable link'}
                          </span>
                          <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                            →
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative border-t border-rule px-6 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                  ▸ Anyone with the link can read this draft
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
