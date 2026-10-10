'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import MermaidViewer from '@/components/Templates/MermaidViewer'
import {
  FREE_TASTE_TYPES,
  FreeTasteExpiredError,
  FreeTasteQuotaError,
  FreeTasteUnavailableError,
  fetchChallenge,
  generateFree,
  type FreeTasteType,
} from '@/lib/free-taste/client'
import { getDeviceId } from '@/lib/free-taste/device'
import { solveInWorker } from '@/lib/free-taste/solve'
import { promptLenBucket, trackTryIt } from '@/lib/free-taste/track'

const TYPE_LABELS: Record<FreeTasteType, string> = {
  flowchart: 'Flowchart',
  sequence: 'Sequence',
  class: 'Class',
  state: 'State',
  er: 'ER',
  mindmap: 'Mind map',
}
const EXAMPLES = [
  'User signs up, verifies email, then lands on onboarding',
  'Checkout flow with payment retry and fraud check',
  'CI/CD pipeline from commit to production with rollback',
]
const CHALLENGE_MAX_AGE_MS = 90_000

type Phase = 'checking' | 'unavailable' | 'idle' | 'working' | 'done' | 'quota' | 'error'
type Challenge = { challenge: string; difficulty: number; at: number }

export default function TryItGenerator() {
  const [phase, setPhase] = useState<Phase>('checking')
  const [prompt, setPrompt] = useState('')
  const [type, setType] = useState<FreeTasteType>('flowchart')
  const [code, setCode] = useState('')
  const [remaining, setRemaining] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const challengeRef = useRef<Challenge | null>(null)

  // The generator only appears if the backend answers a challenge request.
  useEffect(() => {
    let alive = true
    fetchChallenge()
      .then((c) => {
        if (!alive) return
        challengeRef.current = { ...c, at: Date.now() }
        setPhase('idle')
        trackTryIt('try_it_shown')
      })
      .catch(() => alive && setPhase('unavailable'))
    return () => {
      alive = false
    }
  }, [])

  async function freshChallenge(force = false): Promise<Challenge> {
    const cur = challengeRef.current
    if (!force && cur && Date.now() - cur.at < CHALLENGE_MAX_AGE_MS) return cur
    const c = { ...(await fetchChallenge()), at: Date.now() }
    challengeRef.current = c
    return c
  }

  async function attempt(force: boolean) {
    const ch = await freshChallenge(force)
    challengeRef.current = null // single use
    const nonce = await solveInWorker(ch.challenge, ch.difficulty)
    if (nonce === null) throw new Error('pow')
    return generateFree({
      prompt: prompt.trim(),
      type,
      challenge: ch.challenge,
      nonce,
      deviceId: getDeviceId(),
    })
  }

  async function onGenerate() {
    if (!prompt.trim() || phase === 'working') return
    setPhase('working')
    setMessage('')
    const t0 = Date.now()
    trackTryIt('try_it_started', {
      type,
      prompt_len: promptLenBucket(prompt.trim().length),
    })
    try {
      let res
      try {
        res = await attempt(false)
      } catch (e) {
        if (!(e instanceof FreeTasteExpiredError)) throw e
        res = await attempt(true)
      }
      setCode(res.mermaidCode)
      setRemaining(res.remaining)
      setPhase('done')
      trackTryIt('try_it_succeeded', {
        type,
        remaining: res.remaining,
        secs: Math.round((Date.now() - t0) / 1000),
      })
      try {
        localStorage.setItem(
          'flowcraft:free-taste:last',
          JSON.stringify({ code: res.mermaidCode, type, prompt: prompt.trim() }),
        )
      } catch {}
    } catch (e) {
      if (e instanceof FreeTasteQuotaError) {
        trackTryIt('try_it_failed', { type, kind: 'quota' })
        setRemaining(0)
        setPhase('quota')
      } else if (e instanceof FreeTasteUnavailableError) {
        trackTryIt('try_it_failed', { type, kind: 'unavailable' })
        setMessage('The generator is temporarily unavailable. Please try again soon.')
        setPhase('error')
      } else {
        trackTryIt('try_it_failed', {
          type,
          kind: e instanceof Error && e.message === 'pow' ? 'pow' : 'generation',
        })
        setMessage('Something went wrong generating that. Try rephrasing and run it again.')
        setPhase('error')
      }
    }
  }

  if (phase === 'checking' || phase === 'unavailable') return null

  const working = phase === 'working'
  return (
    <div className="mt-10 max-w-2xl border border-rule bg-graphite/40 p-4 sm:p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-fog">
        Try it — no account needed
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        maxLength={2000}
        rows={3}
        disabled={working}
        placeholder="Describe a process, system or idea…"
        aria-label="Describe your diagram"
        className="mt-3 w-full resize-none rounded-sm border border-rule bg-ink p-3 text-sm text-paper placeholder:text-fog focus:border-signal focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {EXAMPLES.map((ex, i) => (
          <button
            key={ex}
            type="button"
            disabled={working}
            onClick={() => {
              setPrompt(ex)
              trackTryIt('try_it_example_used', { index: i })
            }}
            className="rounded-sm border border-rule px-2 py-1 text-left text-[11px] text-fog transition-colors hover:border-signal/50 hover:text-signal"
          >
            {ex}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {FREE_TASTE_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            disabled={working}
            aria-pressed={type === t}
            onClick={() => setType(t)}
            className={`rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
              type === t
                ? 'border-signal bg-signal text-ink'
                : 'border-rule text-fog hover:text-paper'
            }`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
        <button
          type="button"
          onClick={onGenerate}
          disabled={!prompt.trim() || working}
          className="ml-auto rounded-sm bg-signal px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          {working ? 'Generating…' : 'Generate →'}
        </button>
      </div>

      {phase === 'error' && (
        <p role="alert" className="mt-3 text-sm text-rose-400">
          {message}
        </p>
      )}

      {phase === 'quota' && (
        <div role="status" className="mt-4 border border-signal/40 p-4 text-sm text-paper">
          You&apos;ve used your free tries.{' '}
          <Link
            href="/sign-up?src=try-it"
            onClick={() => trackTryIt('try_it_cta_clicked', { where: 'quota' })}
            className="text-signal underline"
          >
            Sign up free
          </Link>{' '}
          to keep creating, save and export.
        </div>
      )}

      {phase === 'done' && (
        <div className="mt-4">
          <div className="overflow-auto rounded-sm bg-white">
            <MermaidViewer code={code} />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
              {remaining !== null ? `${remaining} free tries left` : ''}
            </span>
            <Link
              href="/sign-up?src=try-it"
              onClick={() => trackTryIt('try_it_cta_clicked', { where: 'result' })}
              className="rounded-sm border border-signal px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-signal transition-colors hover:bg-signal hover:text-ink"
            >
              Sign up free to save, edit and export →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
