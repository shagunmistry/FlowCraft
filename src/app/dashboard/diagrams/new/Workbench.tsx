'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import ChatThread from './ChatThread'
import ChatComposer from './ChatComposer'
import CodePane from './CodePane'
import PreviewPane from './PreviewPane'
import type { ChatMessage } from './useDiagramChat'
import { sanitizeMermaid } from '@/lib/utils'

const NON_MERMAID_TYPES = new Set([
  'illustration',
  'generated_image',
  'infographic',
  'chart',
  'flow diagram',
])

type Pane = 'chat' | 'code' | 'preview'

const COLLAPSE_STORAGE_KEY = 'flowcraft:workbench:collapsed'

export default function Workbench({
  title,
  diagramType,
  code,
  onCodeChange,
  messages,
  isStreaming,
  error,
  composerValue,
  onComposerChange,
  onSend,
  onCancel,
  onNewDraft,
  diagramId,
}: {
  title: string
  diagramType: string
  code: string
  onCodeChange: (v: string) => void
  messages: ChatMessage[]
  isStreaming: boolean
  error: string | null
  composerValue: string
  onComposerChange: (v: string) => void
  onSend: () => void
  onCancel: () => void
  onNewDraft: () => void
  diagramId: number | string | null
}) {
  const router = useRouter()

  // ---- layout state
  const [chatWidth, setChatWidth] = useState(380)
  const [codeWidth, setCodeWidth] = useState(460)
  const [mobilePane, setMobilePane] = useState<Pane>('chat')
  const [collapsed, setCollapsed] = useState<{ chat: boolean; code: boolean }>({
    chat: false,
    code: false,
  })
  const rootRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    kind: 'chat' | 'code'
    startX: number
    startWidth: number
  } | null>(null)

  // Hydrate collapse state from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(COLLAPSE_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      setCollapsed({
        chat: !!parsed?.chat,
        code: !!parsed?.code,
      })
    } catch {
      /* noop */
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_STORAGE_KEY, JSON.stringify(collapsed))
    } catch {
      /* noop */
    }
  }, [collapsed])

  // ---- subscription / paid-plan detection
  const [isPaid, setIsPaid] = useState(false)
  const [keepPrivate, setKeepPrivate] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/subscription')
        if (!res.ok) return
        const json = await res.json()
        if (cancelled) return
        // `/api/subscription` returns a populated `subscription` object for
        // paid users (see src/app/api/subscription/route.ts). Treat any
        // truthy, active-ish status as paid.
        const sub = json?.subscription
        if (sub && sub.status && sub.status !== 'canceled') {
          setIsPaid(true)
        }
      } catch {
        /* noop */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // ---- finalize
  const [finalizing, setFinalizing] = useState(false)
  const handleFinalize = useCallback(async () => {
    if (!diagramId || finalizing) return
    setFinalizing(true)
    try {
      // Mermaid-style diagrams get sanitized so we don't persist streamed
      // artifacts like ```mermaid fences or LLM preamble — those cause the
      // finalized viewer to render a blank canvas.
      const isMermaidType = !NON_MERMAID_TYPES.has(
        (diagramType || '').toLowerCase(),
      )
      let payloadData = code
      if (isMermaidType) {
        const sanitized = sanitizeMermaid(code)
        if (!sanitized) {
          toast.error(
            'This draft does not contain a recognizable Mermaid diagram yet.',
          )
          return
        }
        payloadData = sanitized
      }

      const res = await fetch('/api/update-diagram', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagramId,
          data: payloadData,
          is_public: isPaid ? !keepPrivate : true,
          finalized: true,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        toast.error(body?.error || 'Could not finalize draft')
        return
      }
      router.push(`/dashboard/diagram/${diagramId}?finalized=1`)
    } catch {
      toast.error('Could not finalize draft')
    } finally {
      setFinalizing(false)
    }
  }, [diagramId, code, diagramType, isPaid, keepPrivate, finalizing, router])

  // ---- divider drag
  const beginDrag = (kind: 'chat' | 'code') => (e: React.MouseEvent) => {
    dragRef.current = {
      kind,
      startX: e.clientX,
      startWidth: kind === 'chat' ? chatWidth : codeWidth,
    }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const d = dragRef.current
      if (!d) return
      const delta = e.clientX - d.startX
      if (d.kind === 'chat') {
        setChatWidth(Math.max(280, Math.min(560, d.startWidth + delta)))
      } else {
        setCodeWidth(Math.max(320, Math.min(720, d.startWidth + delta)))
      }
    }
    const up = () => {
      dragRef.current = null
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
  }, [])

  const Divider = ({ kind }: { kind: 'chat' | 'code' }) => (
    <div
      onMouseDown={beginDrag(kind)}
      className="group relative hidden w-px shrink-0 cursor-col-resize bg-rule md:block"
      role="separator"
      aria-orientation="vertical"
    >
      <div className="absolute inset-y-0 -left-1 -right-1" />
      <div className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rule transition group-hover:bg-signal/60" />
    </div>
  )

  // Slim rail shown in place of a collapsed pane. Click to expand.
  const CollapsedRail = ({
    label,
    onExpand,
  }: {
    label: string
    onExpand: () => void
  }) => (
    <button
      type="button"
      onClick={onExpand}
      aria-label={`Expand ${label} pane`}
      title={`Expand ${label}`}
      className="hidden h-full w-8 shrink-0 flex-col items-center justify-between border-r border-rule/60 bg-graphite/60 py-4 transition hover:bg-graphite md:flex"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-fog">
        ⟩
      </span>
      <span
        className="font-mono text-[10px] uppercase tracking-[0.28em] text-fog"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
        }}
      >
        {label}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-fog">
        ⟩
      </span>
    </button>
  )

  return (
    <div
      ref={rootRef}
      className="relative flex h-[calc(100dvh-64px)] min-h-[560px] w-full flex-col bg-ink text-paper"
    >
      {/* Top crossbar */}
      <div className="relative flex items-center justify-between gap-3 border-b border-rule/60 bg-ink/90 px-6 py-3 backdrop-blur">
        <div className="flex min-w-0 items-center gap-4">
          <h1 className="truncate font-serif text-xl italic text-paper">
            {title || 'Untitled draft'}
          </h1>
          {isStreaming && (
            <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-signal sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-signal animate-tick" />
              streaming
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile pane switcher */}
          <div className="flex rounded-sm border border-rule md:hidden">
            {(['chat', 'code', 'preview'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setMobilePane(p)}
                className={clsx(
                  'px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em]',
                  mobilePane === p
                    ? 'bg-paper text-ink'
                    : 'text-fog hover:text-paper',
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Paid-only privacy toggle */}
          {isPaid && diagramId && (
            <label className="hidden cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fog hover:text-paper sm:flex">
              <input
                type="checkbox"
                checked={keepPrivate}
                onChange={(e) => setKeepPrivate(e.target.checked)}
                className="h-3 w-3 cursor-pointer accent-signal"
              />
              Keep private
            </label>
          )}

          <button
            onClick={onNewDraft}
            className="rounded-sm border border-rule px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fog hover:border-signal/60 hover:text-paper"
          >
            New draft
          </button>

          <button
            onClick={handleFinalize}
            disabled={!diagramId || finalizing || !code}
            className={clsx(
              'rounded-sm px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition',
              'bg-signal text-ink hover:bg-paper',
              'disabled:cursor-not-allowed disabled:bg-rule disabled:text-fog',
            )}
          >
            {finalizing ? 'Finalizing…' : 'Finalize & view'}
          </button>
        </div>
      </div>

      {/* Split body */}
      <div className="relative flex min-h-0 flex-1">
        {/* Chat pane or rail */}
        {collapsed.chat ? (
          <CollapsedRail
            label="Chat"
            onExpand={() => setCollapsed((c) => ({ ...c, chat: false }))}
          />
        ) : (
          <>
            <section
              className={clsx(
                'flex min-h-0 flex-col border-r border-rule/40 bg-ink',
                'md:shrink-0',
                mobilePane === 'chat' ? 'flex' : 'hidden md:flex',
              )}
              style={{
                width:
                  typeof window !== 'undefined' && window.innerWidth >= 768
                    ? chatWidth
                    : undefined,
              }}
            >
              <div className="flex items-center justify-between border-b border-rule/60 bg-ink/70 px-5 py-3">
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-fog">
                  <span className="text-paper/80">Chat</span>
                  <span className="h-px w-8 bg-signal/50" />
                  <span className="text-fog">thread</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCollapsed((c) => ({ ...c, chat: true }))}
                  aria-label="Collapse chat pane"
                  title="Collapse"
                  className="hidden rounded-sm border border-rule/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fog hover:border-signal/60 hover:text-paper md:inline-block"
                >
                  ⟨
                </button>
              </div>
              <ChatThread messages={messages} />
              <div className="border-t border-rule/60 bg-ink/90 p-4">
                {error && (
                  <div className="mb-3 rounded-sm border border-red-400/30 bg-red-500/10 px-3 py-2 font-mono text-[11px] text-red-300">
                    {error}
                  </div>
                )}
                <ChatComposer
                  value={composerValue}
                  onChange={onComposerChange}
                  onSubmit={onSend}
                  disabled={isStreaming}
                  footerRight={
                    isStreaming && (
                      <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-sm border border-rule px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fog hover:border-red-400/60 hover:text-red-300"
                      >
                        Stop
                      </button>
                    )
                  }
                />
              </div>
            </section>

            <Divider kind="chat" />
          </>
        )}

        {/* Code pane or rail */}
        {collapsed.code ? (
          <CollapsedRail
            label="Code"
            onExpand={() => setCollapsed((c) => ({ ...c, code: false }))}
          />
        ) : (
          <>
            <section
              className={clsx(
                'flex min-h-0 flex-col',
                'md:shrink-0',
                mobilePane === 'code' ? 'flex' : 'hidden md:flex',
              )}
              style={{
                width:
                  typeof window !== 'undefined' && window.innerWidth >= 768
                    ? codeWidth
                    : undefined,
              }}
            >
              <CodePane
                value={code}
                onChange={onCodeChange}
                streaming={isStreaming}
                onCollapse={() =>
                  setCollapsed((c) => ({ ...c, code: true }))
                }
              />
            </section>

            <Divider kind="code" />
          </>
        )}

        {/* Preview pane (flex-1) */}
        <section
          className={clsx(
            'flex min-h-0 flex-1 flex-col',
            mobilePane === 'preview' ? 'flex' : 'hidden md:flex',
          )}
        >
          <PreviewPane code={code} streaming={isStreaming} />
        </section>
      </div>
    </div>
  )
}
