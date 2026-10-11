'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import SimpleNotification from '@/components/SimpleNotification'

/* ──────────────────────────────────────────── */
/* Field primitives                             */
/* ──────────────────────────────────────────── */

function FieldRow({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="grid grid-cols-1 gap-3 border-t border-rule px-5 py-6 md:grid-cols-12 md:gap-6 md:px-8">
      <div className="md:col-span-4">
        <div className="text-sm font-medium text-fog">{label}</div>
        {hint && (
          <p className="mt-2 text-xs text-fog/70">
            {hint}
          </p>
        )}
      </div>
      <div className="md:col-span-8">{children}</div>
    </div>
  )
}

const inputClass =
  'block w-full bg-transparent border-0 border-b border-rule px-0 pb-3 pt-1 font-serif text-xl text-paper placeholder:text-fog/60 transition-colors focus:border-signal focus:outline-none focus:ring-0 md:text-2xl'

/* ──────────────────────────────────────────── */
/* Page                                         */
/* ──────────────────────────────────────────── */

export default function SupportPage() {
  const [loading, setLoading] = useState(false)
  const startedAt = useRef(Date.now())
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const [notification, setNotification] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    open: false,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      firstName: formData.get('first-name'),
      lastName: formData.get('last-name'),
      email: formData.get('email'),
      message: formData.get('message'),
      website: formData.get('website'), // honeypot
      startedAt: startedAt.current,
      turnstileToken: formData.get('cf-turnstile-response'),
    }

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to submit')

      setNotification({
        message: 'Transmission received. We will respond shortly.',
        type: 'success',
        open: true,
      })
      form.reset()
      startedAt.current = Date.now()
      ;(window as any).turnstile?.reset()
    } catch (err) {
      console.error('Submission error:', err)
      setNotification({
        message: 'Signal lost. Please try again.',
        type: 'error',
        open: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-paper selection:bg-signal selection:text-ink">
      <SimpleNotification
        message={notification.message}
        type={notification.type}
        open={notification.open}
        setOpen={(open) => setNotification((prev) => ({ ...prev, open }))}
        title="Transmission"
      />

      <main className="relative">
        {/* ═══ HEADER ═══ */}
        <section className="relative overflow-hidden border-b border-rule pb-16 pt-12 lg:pb-24 lg:pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-60"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-[50%] top-[40%] h-[460px] w-[640px] -translate-x-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(196,255,61,0.10), transparent 60%)',
            }}
          />

          <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12"
            >
              <div className="lg:col-span-8">
                <h1 className="font-serif text-[52px] leading-[0.95] tracking-[-0.01em] text-paper md:text-[96px] lg:text-[108px]">
                  <span className="block">Write us</span>
                  <span className="block">
                    <span className="italic text-signal">a sentence</span>
                    <span className="text-fog">.</span>
                  </span>
                </h1>
                <p className="mt-10 max-w-xl text-lg leading-relaxed text-paper/70 md:text-xl">
                  Feature requests, edge cases, questions the docs dodged. The
                  team reads every transmission and replies within a day.
                </p>
              </div>

              <aside className="lg:col-span-4">
                <div className="relative overflow-hidden rounded-sm border border-rule bg-graphite">
                  <CornerTicks />
                  <div className="relative border-b border-rule px-5 py-3 text-sm font-medium text-fog">
                    Channels
                  </div>
                  <dl className="divide-y divide-rule text-sm">
                    <Meta k="Response" v="< 24h" />
                    <Meta k="Hours" v="Mon–Fri" />
                    <Meta k="Preferred" v="This form" />
                    <Meta k="Status" v={<LiveDot label="Staffed" />} />
                  </dl>
                </div>
              </aside>
            </motion.div>
          </div>
        </section>

        {/* ═══ FORM ═══ */}
        <section className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
            <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <h2 className="font-serif text-5xl leading-[0.95] tracking-[-0.01em] text-paper md:text-6xl">
                  Fill the
                  <br />
                  <span className="italic text-signal">slip.</span>
                </h2>
              </div>
              <div className="lg:col-span-6 lg:col-start-7 lg:pt-6">
                <p className="max-w-md text-lg leading-relaxed text-paper/60">
                  Keep it brief or long. Paste logs, screenshots, half-formed
                  ideas. The more detail, the better the reply.
                </p>
              </div>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-sm border border-rule bg-graphite/40"
            >
              <CornerTicks />

              <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-rule">
                <FieldRow label="First name" hint="Given">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    required
                    maxLength={100}
                    placeholder="Jane"
                    className={inputClass}
                  />
                </FieldRow>
                <FieldRow label="Last name" hint="Family">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    required
                    maxLength={100}
                    placeholder="Doe"
                    className={inputClass}
                  />
                </FieldRow>
              </div>

              {/* Honeypot: hidden from people, bots fill it in. */}
              <div
                aria-hidden
                className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
              >
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  name="website"
                  id="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <FieldRow
                label="Email"
                hint="Where the reply lands"
              >
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="you@studio.com"
                  className={inputClass}
                />
              </FieldRow>

              <FieldRow
                label="Message"
                hint="Symptoms, context, hopes"
              >
                <textarea
                  name="message"
                  id="message"
                  rows={5}
                  required
                  minLength={5}
                  maxLength={5000}
                  placeholder="Tell us what's on your mind…"
                  className={clsx(inputClass, 'resize-none')}
                />
              </FieldRow>

              {turnstileSiteKey && (
                <div className="border-t border-rule px-5 py-4 md:px-8">
                  <Script
                    src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                    strategy="afterInteractive"
                  />
                  <div
                    className="cf-turnstile"
                    data-sitekey={turnstileSiteKey}
                    data-theme="dark"
                  />
                </div>
              )}

              <div className="flex flex-col items-stretch gap-6 border-t border-rule px-5 py-6 md:flex-row md:items-center md:justify-between md:px-8">
                <p className="max-w-md text-xs text-fog">
                  By submitting you agree to our{' '}
                  <Link
                    href="/terms"
                    className="text-paper underline underline-offset-[3px] decoration-rule hover:text-signal hover:decoration-signal"
                  >
                    terms
                  </Link>{' '}
                  ·{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-paper underline underline-offset-[3px] decoration-rule hover:text-signal hover:decoration-signal"
                  >
                    privacy
                  </Link>
                </p>
                <SubmitButton loading={loading} />
              </div>
            </motion.form>

            {/* Alternate channels */}
            <div className="mt-16 grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-3">
              {[
                {
                  k: 'Email',
                  v: 'support@flowcraft.app',
                  sub: 'General inquiries',
                },
                {
                  k: 'Enterprise',
                  v: 'sales@flowcraft.app',
                  sub: 'Teams & volume',
                },
                {
                  k: 'Press',
                  v: 'press@flowcraft.app',
                  sub: 'Media & partnerships',
                },
              ].map((c) => (
                <div key={c.k} className="group flex flex-col gap-3 bg-ink p-6">
                  <div className="text-sm font-medium text-fog">{c.k}</div>
                  <div className="font-serif text-xl text-paper">{c.v}</div>
                  <div className="text-xs text-fog">
                    {c.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CLOSING ═══ */}
        <section className="relative overflow-hidden border-t border-rule py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-40"
          />
          <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-end gap-6 text-sm text-fog">
              <Link
                href="/"
                className="group inline-flex items-center gap-3 text-paper transition-colors hover:text-signal"
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                <span>Back to home</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

/* ──────────────────────────────────────────── */
/* Subcomponents                                */
/* ──────────────────────────────────────────── */

function Meta({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <dt className="text-fog">{k}</dt>
      <dd className="text-paper">{v}</dd>
    </div>
  )
}

function LiveDot({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
      <span>{label}</span>
    </span>
  )
}

function CornerTicks() {
  return (
    <>
      <span className="pointer-events-none absolute -left-px -top-px z-20 h-3 w-3 border-l border-t border-signal" />
      <span className="pointer-events-none absolute -right-px -top-px z-20 h-3 w-3 border-r border-t border-signal" />
      <span className="pointer-events-none absolute -bottom-px -left-px z-20 h-3 w-3 border-b border-l border-signal" />
      <span className="pointer-events-none absolute -bottom-px -right-px z-20 h-3 w-3 border-b border-r border-signal" />
    </>
  )
}

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={clsx(
        'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-sm px-8 py-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70',
        loading
          ? 'bg-paper/40 text-ink'
          : 'bg-signal text-ink hover:bg-paper',
      )}
    >
      {loading ? (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              opacity="0.25"
            />
            <path
              d="M22 12a10 10 0 0 0-10-10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span>Sending</span>
        </>
      ) : (
        <>
          <span>Send message</span>
        </>
      )}
    </button>
  )
}
