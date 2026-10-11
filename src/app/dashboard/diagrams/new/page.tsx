'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import toast from 'react-hot-toast'

import { OptionType, sanitizeMermaid } from '@/lib/utils'
import { useStreamingGenerate } from './useStreamingGenerate'
import { useDiagramChat } from './useDiagramChat'
import TypeGrid from './TypeGrid'
import ChatComposer from './ChatComposer'
import Workbench from './Workbench'

const COLOR_PALETTES = [
  'Brand colors (default)',
  'Monochromatic',
  'Complementary',
  'Analogous',
]
const COMPLEXITIES = ['Medium (default)', 'Simple', 'Detailed', 'Complex']

function SectionDot({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-1.5 w-1.5 rounded-full bg-signal" />
      <span className="text-sm text-fog">
        {label}
      </span>
    </div>
  )
}

export default function NewDiagramPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('id')

  // ----- Landing state
  const [selectedType, setSelectedType] = useState<OptionType>('Flowchart')
  const [prompt, setPrompt] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [colorPalette, setColorPalette] = useState(COLOR_PALETTES[0])
  const [complexity, setComplexity] = useState(COMPLEXITIES[0])
  const [showAdvanced, setShowAdvanced] = useState(false)

  // ----- Generated state
  const [mermaidCode, setMermaidCode] = useState('')
  const [title, setTitle] = useState('')
  const [diagramId, setDiagramId] = useState<number | string | null>(null)
  const [phase, setPhase] = useState<'landing' | 'generating' | 'workbench'>(
    'landing',
  )
  const [composerValue, setComposerValue] = useState('')

  const streaming = useStreamingGenerate()
  const chat = useDiagramChat({
    diagramType: String(selectedType ?? 'diagram'),
    onCodeUpdate: (code) => setMermaidCode(sanitizeMermaid(code)),
  })

  // ----- Stream partial code into the preview during first generation.
  useEffect(() => {
    if (streaming.isStreaming && streaming.partialCode) {
      setMermaidCode(sanitizeMermaid(streaming.partialCode))
    }
  }, [streaming.isStreaming, streaming.partialCode])

  // ----- When first generation completes, move to the workbench.
  const seededRef = useRef(false)
  useEffect(() => {
    const result = streaming.finalResult
    if (!result || seededRef.current) return
    seededRef.current = true

    const sanitized = sanitizeMermaid(result.code)
    setMermaidCode(sanitized)
    setTitle(result.title || 'Untitled draft')
    setDiagramId(result.diagramId || null)
    setPhase('workbench')

    // Seed chat thread with the original prompt + assistant ack.
    chat.seedInitial({
      diagramId: result.diagramId || null,
      userPrompt: prompt,
      assistantCode: sanitized,
      assistantTitle: result.title || undefined,
    })

    if (result.diagramId) {
      const url = new URL(window.location.href)
      url.searchParams.set('id', String(result.diagramId))
      window.history.replaceState({}, '', url.toString())
    }
  }, [streaming.finalResult, prompt, chat])

  // ----- Errors from first stream.
  useEffect(() => {
    if (streaming.error) {
      toast.error(streaming.error)
      setPhase('landing')
    }
  }, [streaming.error])

  // ----- Resume an existing diagram from ?id=
  useEffect(() => {
    if (!resumeId || phase !== 'landing') return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/get-diagrams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: resumeId }),
        })
        if (!res.ok) return
        const { diagram } = await res.json()
        const data = Array.isArray(diagram) ? diagram[0] : diagram
        if (!data) return
        if (cancelled) return
        setMermaidCode(sanitizeMermaid(data.data ?? ''))
        setTitle(data.title ?? 'Untitled draft')
        setDiagramId(resumeId)
        if (data.type) setSelectedType(data.type as OptionType)
        setPhase('workbench')
        await chat.loadHistory(resumeId)
      } catch {
        /* swallow */
      }
    })()
    return () => {
      cancelled = true
    }
    // Only run on initial mount / resumeId change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId])

  // ----- Submit landing prompt -> first generation.
  const handleLandingSubmit = useCallback(() => {
    if (!prompt.trim() || !selectedType) return
    seededRef.current = false
    setPhase('generating')
    streaming.generate({
      type: String(selectedType),
      description: prompt,
      isPublic,
      colorPalette,
      complexityLevel: complexity,
    })
  }, [prompt, selectedType, isPublic, colorPalette, complexity, streaming])

  // ----- Send follow-up chat message.
  const handleChatSend = useCallback(() => {
    const msg = composerValue.trim()
    if (!msg) return
    setComposerValue('')
    chat.sendMessage({
      message: msg,
      diagramId,
      currentCode: mermaidCode,
    })
  }, [composerValue, chat, diagramId, mermaidCode])

  const handleNewDraft = useCallback(() => {
    if (streaming.isStreaming) streaming.cancel()
    chat.cancel()
    seededRef.current = false
    streaming.reset()
    setMermaidCode('')
    setTitle('')
    setDiagramId(null)
    setPrompt('')
    setComposerValue('')
    setPhase('landing')
    const url = new URL(window.location.href)
    url.searchParams.delete('id')
    window.history.replaceState({}, '', url.pathname)
  }, [chat, streaming])

  const showGenerating = phase === 'generating' || streaming.isStreaming

  // ---------- Render

  if (phase === 'workbench') {
    return (
      <Workbench
        title={title}
        diagramType={String(selectedType ?? 'Diagram')}
        code={mermaidCode}
        onCodeChange={setMermaidCode}
        messages={chat.messages}
        isStreaming={chat.isStreaming}
        error={chat.error}
        composerValue={composerValue}
        onComposerChange={setComposerValue}
        onSend={handleChatSend}
        onCancel={chat.cancel}
        onNewDraft={handleNewDraft}
        diagramId={diagramId}
      />
    )
  }

  // Landing (and generating state overlays the landing so user sees partial code).
  return (
    <div className="relative min-h-[calc(100dvh-64px)] bg-ink text-paper">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-dot-grid bg-dot-24 opacity-40"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-6 py-16 sm:py-24">
        {/* Hero */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-5xl italic leading-[1.02] tracking-tight text-paper sm:text-6xl"
        >
          Think in diagrams.
          <br />
          <span className="text-fog">Iterate in conversation.</span>
        </motion.h1>
        <p className="mt-4 max-w-xl font-sans text-[15px] leading-relaxed text-fog">
          Pick a form, describe what you want, and keep refining. Your
          conversation stays on the page alongside the code and the live
          preview.
        </p>

        <div className="mt-14 space-y-12">
          {/* Step 1: type */}
          <TypeGrid value={selectedType} onChange={setSelectedType} />

          {/* Step 2: prompt */}
          <div className="space-y-5">
            <div className="text-sm text-fog">Describe your diagram</div>

            <ChatComposer
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleLandingSubmit}
              disabled={showGenerating}
              size="large"
              submitLabel={showGenerating ? 'Drafting…' : 'Draft it'}
              autoFocus
              placeholder={`Describe the ${String(selectedType ?? 'diagram').toLowerCase()} you want, for example "AI staffing agency architecture with tech stack, recruiters, and vertical focus"`}
              footerLeft={
                <span>
                  {selectedType ? `Type · ${selectedType}` : 'Pick a type above'}
                </span>
              }
            />

            {/* Advanced toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="text-sm text-fog hover:text-paper"
              >
                {showAdvanced ? 'Hide advanced options' : '+ Advanced options'}
              </button>
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 grid gap-4 sm:grid-cols-3"
                  >
                    <label className="flex flex-col gap-2">
                      <span className="text-sm text-fog">
                        Palette
                      </span>
                      <select
                        value={colorPalette}
                        onChange={(e) => setColorPalette(e.target.value)}
                        className="rounded-sm border border-rule bg-graphite px-3 py-2 font-sans text-sm text-paper focus:border-signal/70 focus:outline-none"
                      >
                        {COLOR_PALETTES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm text-fog">
                        Complexity
                      </span>
                      <select
                        value={complexity}
                        onChange={(e) => setComplexity(e.target.value)}
                        className="rounded-sm border border-rule bg-graphite px-3 py-2 font-sans text-sm text-paper focus:border-signal/70 focus:outline-none"
                      >
                        {COMPLEXITIES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm text-fog">
                        Visibility
                      </span>
                      <div className="flex rounded-sm border border-rule bg-graphite p-1">
                        {(
                          [
                            { v: true, label: 'Public' },
                            { v: false, label: 'Private' },
                          ] as const
                        ).map((o) => (
                          <button
                            key={o.label}
                            type="button"
                            onClick={() => setIsPublic(o.v)}
                            className={clsx(
                              'flex-1 rounded-[2px] px-3 py-1.5 text-xs transition',
                              isPublic === o.v
                                ? 'bg-paper text-ink'
                                : 'text-fog hover:text-paper',
                            )}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Streaming preview (during first generation, inline) */}
          {showGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 border-t border-rule/60 pt-10"
            >
              <SectionDot
                label={
                  streaming.phase === 'retrying'
                    ? 'Revising'
                    : 'Drafting your diagram'
                }
              />
              <div className="overflow-hidden rounded-md border border-rule/60 bg-graphite/60">
                <div className="flex items-center justify-between border-b border-rule/50 bg-ink/60 px-4 py-2 text-xs text-fog">
                  <span className="text-paper/80">Mermaid · live</span>
                  <span className="inline-flex items-center gap-2 text-signal">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal animate-tick" />
                    streaming
                  </span>
                </div>
                <pre className="max-h-72 overflow-auto p-4 font-mono text-[11px] leading-6 text-paper">
                  {streaming.partialCode || '...'}
                </pre>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
