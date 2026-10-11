'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import FreeTasteResultDialog from './FreeTasteResultDialog.client'
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
  const [resultOpen, setResultOpen] = useState(false)
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
      setResultOpen(true)
      trackTryIt('try_it_result_opened', { type })
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
        setMessage('The free generator is busy right now. Try again in a moment, or sign up to keep creating.')
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

  if (phase === 'unavailable') {
    return (
      <div className="mt-10 max-w-3xl rounded-2xl border border-rule bg-graphite p-6 shadow-[0_24px_60px_-30px_rgba(16,18,22,0.25)] sm:p-8">
        <p className="text-lg text-paper">
          Describe a process, system or idea and get a diagram in seconds.
        </p>
        <Link
          href="/sign-up?src=hero"
          onClick={() => trackTryIt('try_it_cta_clicked', { where: 'hero_fallback' })}
          className="mt-5 inline-flex rounded-full bg-signal px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:opacity-90"
        >
          Create a free account
        </Link>
      </div>
    )
  }

  const working = phase === 'working'
  return (
    <div className="mt-10 max-w-3xl">
      <div className="rounded-2xl border border-rule bg-graphite p-3 shadow-[0_24px_60px_-30px_rgba(16,18,22,0.25)] focus-within:border-signal sm:p-4">
        <label htmlFor="hero-prompt" className="sr-only">
          Describe your diagram
        </label>
        <textarea
          id="hero-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={1500}
          rows={3}
          disabled={working}
          placeholder="Describe a process, system or idea"
          className="w-full resize-none border-0 bg-transparent p-2 text-lg leading-snug text-paper placeholder:text-fog focus:outline-none focus:ring-0"
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule px-1 pt-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1" role="group" aria-label="Diagram type">
            {FREE_TASTE_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                disabled={working}
                aria-pressed={type === t}
                onClick={() => setType(t)}
                className={`border-b-2 pb-0.5 text-sm transition-colors ${
                  type === t
                    ? 'border-signal text-paper'
                    : 'border-transparent text-fog hover:text-paper'
                }`}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onGenerate}
            disabled={!prompt.trim() || working}
            className="ml-auto rounded-full bg-signal px-6 py-2.5 text-[15px] font-medium text-ink transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {working ? 'Drawing your diagram' : 'Generate diagram'}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="text-fog">No account needed. Try one of these:</span>
        {EXAMPLES.map((ex, i) => (
          <button
            key={ex}
            type="button"
            disabled={working}
            onClick={() => {
              setPrompt(ex)
              trackTryIt('try_it_example_used', { index: i })
            }}
            className="text-left text-paper underline decoration-rule underline-offset-4 transition-colors hover:decoration-signal"
          >
            {ex}
          </button>
        ))}
      </div>

      {phase === 'error' && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {message}
        </p>
      )}

      {phase === 'quota' && (
        <div role="status" className="mt-4 rounded-xl border border-signal/40 bg-graphite p-4 text-sm text-paper">
          You have used your free tries.{' '}
          <Link
            href="/sign-up?src=try-it"
            onClick={() => trackTryIt('try_it_cta_clicked', { where: 'quota' })}
            className="text-signal underline underline-offset-4"
          >
            Sign up free
          </Link>{' '}
          to keep creating, save and export.
        </div>
      )}

      {phase === 'done' && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-signal/40 bg-graphite p-3 pl-4">
          <span className="text-sm text-fog">
            Your diagram is ready.
            {remaining !== null ? ` ${remaining} free ${remaining === 1 ? 'try' : 'tries'} left.` : ''}
          </span>
          <button
            type="button"
            onClick={() => {
              setResultOpen(true)
              trackTryIt('try_it_result_opened', { type, reopen: true })
            }}
            className="rounded-full border border-signal px-5 py-2 text-sm text-signal transition-colors hover:bg-signal hover:text-ink"
          >
            View diagram
          </button>
        </div>
      )}

      <FreeTasteResultDialog
        open={resultOpen}
        onClose={() => {
          setResultOpen(false)
          trackTryIt('try_it_result_closed')
        }}
        code={code}
        prompt={prompt.trim()}
        remaining={remaining}
      />
    </div>
  )
}
