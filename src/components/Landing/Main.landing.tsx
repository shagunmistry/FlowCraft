'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-auth/client'
import Navbar from '../Navbar'
import Footer from '../Footer'
import TryItGenerator from './TryItGenerator.client'

const rotatingWords = [
  'flowcharts',
  'mind maps',
  'knowledge graphs',
  'sequence diagrams',
  'illustrations',
  'infographics',
]

const specimens = [
  {
    title: 'Flowcharts',
    desc: 'Decision trees, pipelines, and control flow mapped without dragging a single box.',
    preview: <FlowchartPreview />,
  },
  {
    title: 'Mind maps',
    desc: 'Central ideas branching to detail, arranged with balanced negative space.',
    preview: <MindmapPreview />,
  },
  {
    title: 'Sequence',
    desc: 'Lifelines, activations, and messages between actors in chronological order.',
    preview: <SequencePreview />,
  },
  {
    title: 'Knowledge',
    desc: 'Entities and relationships across a domain, rendered as a walkable graph.',
    preview: <GraphPreview />,
  },
  {
    title: 'Illustrations',
    desc: 'Editorial visuals for stories, posts, and decks. Yours, rendered in minutes.',
    preview: <IllustrationPreview />,
  },
  {
    title: 'Infographics',
    desc: 'Data tables transformed into visual stories with clear hierarchy.',
    preview: <InfographicPreview />,
  },
]

const useCases = [
  {
    title: 'Knowledge sharing',
    desc: 'Explain algorithms or system interactions visually for onboarding and training.',
  },
  {
    title: 'Process mapping',
    desc: 'Visualize and optimize workflows. Identify bottlenecks. Improve efficiency.',
  },
  {
    title: 'Stakeholder decks',
    desc: 'Communicate ideas and complex concepts to clients and team members.',
  },
  {
    title: 'Data visualization',
    desc: 'Turn raw data into pie charts, bar graphs, and visualizations that drive decisions.',
  },
  {
    title: 'User flow',
    desc: 'Visualize user journeys and wireframes. Accelerate ideation and testing.',
  },
  {
    title: 'System architecture',
    desc: 'Plan and communicate the structure of complex systems at a glance.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function MainLanding() {
  const [authenticated, setAuthenticated] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [time, setTime] = useState('')

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data, error }) => {
      setAuthenticated(!!data?.user && !error)
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((p) => (p + 1) % rotatingWords.length)
    }, 2600)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const update = () => {
      const d = new Date()
      setTime(
        `${d.getUTCHours().toString().padStart(2, '0')}:${d
          .getUTCMinutes()
          .toString()
          .padStart(2, '0')} UTC`,
      )
    }
    update()
    const interval = setInterval(update, 1000 * 30)
    return () => clearInterval(interval)
  }, [])

  const primaryCta = authenticated ? '/dashboard' : '/login'
  const primaryLabel = authenticated ? 'Open dashboard' : 'Start drafting'

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-paper selection:bg-signal selection:text-ink">
      <Navbar />

      <main className="relative pt-20 lg:pt-[84px]">
        {/* ═══ HERO ═══ */}
        <section
          ref={heroRef}
          className="relative overflow-hidden pb-24 pt-16 lg:pb-36 lg:pt-24"
        >
          {/* ambient grid + radial glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-80"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(196,255,61,0.10), transparent 60%)',
            }}
          />

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative mx-auto max-w-[1280px] px-6 lg:px-8"
          >
            {/* sheet header */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-fog"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-signal/60" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-signal" />
                  </span>
                  <span className="text-paper">FlowCraft</span>
                </span>
              </div>
              <div className="hidden items-center gap-3 md:flex">
                <span>{time || '—:—'}</span>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-12"
            >
              {/* Headline column */}
              <div className="lg:col-span-8">
                <motion.h1
                  variants={itemVariants}
                  className="font-serif text-[52px] leading-[0.95] tracking-[-0.01em] text-paper md:text-[88px] lg:text-[108px]"
                >
                  <span className="block">Every shape</span>
                  <span className="block">
                    <span className="italic text-signal">of thinking</span>
                    <span className="text-fog">,</span>
                  </span>
                  <span className="block">drafted.</span>
                </motion.h1>

                <motion.div
                  variants={itemVariants}
                  className="mt-10 flex max-w-xl flex-col gap-6"
                >
                  <p className="text-lg leading-relaxed text-paper/70 md:text-xl">
                    Flowcraft turns a sentence into the diagram, chart, or
                    illustration you were about to draw by hand. Describe it.
                    It's drafted.
                  </p>

                  <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
                    <span className="text-signal">▸</span>
                    <span>Drafting</span>
                    <span className="relative inline-flex min-w-[180px] items-baseline overflow-hidden text-paper md:min-w-[240px]">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={wordIndex}
                          initial={{ y: 14, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -14, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute left-0 top-0 whitespace-nowrap"
                        >
                          {rotatingWords[wordIndex]}
                        </motion.span>
                      </AnimatePresence>
                      <span className="invisible">{rotatingWords[0]}</span>
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="mt-12 flex flex-wrap items-center gap-3"
                >
                  <Link
                    href={primaryCta}
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-sm bg-signal px-6 py-4 font-mono text-[12px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-paper"
                  >
                    <span className="relative z-10">{primaryLabel}</span>
                    <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </Link>
                  <Link
                    href="/gallery"
                    className="group inline-flex items-center gap-3 rounded-sm border border-rule px-6 py-4 font-mono text-[12px] uppercase tracking-[0.22em] text-paper transition-colors hover:border-signal/50 hover:text-signal"
                  >
                    <span>View gallery</span>
                    <span className="transition-transform duration-300 group-hover:rotate-45">
                      ↗
                    </span>
                  </Link>
                </motion.div>

                {!authenticated && <TryItGenerator />}
              </div>

              {/* Drafter's card */}
              <motion.aside
                variants={itemVariants}
                className="relative hidden lg:col-span-4 lg:block"
              >
                <div className="relative overflow-hidden rounded-sm border border-rule bg-graphite">
                  {/* corner ticks */}
                  <CornerTicks />
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        'radial-gradient(rgba(196,255,61,0.12) 1px, transparent 1px)',
                      backgroundSize: '14px 14px',
                    }}
                  />

                  <div className="relative flex items-center justify-between border-b border-rule px-5 py-3 font-mono text-[9px] uppercase tracking-[0.25em] text-fog">
                    <span>Title Block</span>
                    <span className="text-signal">◆</span>
                  </div>

                  <div className="relative p-5">
                    <LiveSchematic />
                  </div>

                  <div className="relative grid grid-cols-2 border-t border-rule font-mono text-[10px] uppercase tracking-[0.2em]">
                    <div className="border-r border-rule p-4">
                      <div className="text-fog">Scale</div>
                      <div className="mt-1 text-paper">1 : ∞</div>
                    </div>
                    <div className="p-4">
                      <div className="text-fog">Drafter</div>
                      <div className="mt-1 text-paper">Flowcraft AI</div>
                    </div>
                    <div className="border-r border-t border-rule p-4">
                      <div className="text-fog">Nodes</div>
                      <div className="mt-1 text-paper">
                        <AnimatedCount from={12} to={47} />
                      </div>
                    </div>
                    <div className="border-t border-rule p-4">
                      <div className="text-fog">Status</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
                        <span className="text-paper">Live</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                  <span>Fig. 01</span>
                  <span>Reference draft</span>
                </div>
              </motion.aside>
            </motion.div>
          </motion.div>
        </section>

        {/* ═══ INSTRUMENTS STRIP ═══ */}
        <section className="border-y border-rule bg-graphite/40">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="grid grid-cols-2 divide-rule lg:grid-cols-4 lg:divide-x">
              {[
                { k: 'Visuals drafted', v: '10,043' },
                { k: 'Styles', v: '48' },
                { k: 'Avg. render', v: '4.2s' },
                { k: 'Creators', v: '1,204' },
              ].map((s, i) => (
                <motion.div
                  key={s.k}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="flex flex-col gap-2 py-8 lg:px-8"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-fog">
                    ▸ {s.k}
                  </span>
                  <span className="font-serif text-4xl text-paper md:text-5xl">
                    {s.v}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SPECIMENS ═══ */}
        <section className="relative py-24 lg:py-36">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <SectionHeader
              kicker="Specimen catalogue"
              title={
                <>
                  Six instruments for
                  <br />
                  <span className="italic text-signal">one visual mind.</span>
                </>
              }
              description="Every diagram type, illustration format, and chart style you'd reach for — drafted from a sentence."
            />

            <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
              {specimens.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    delay: (i % 3) * 0.08,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative flex flex-col gap-6 bg-ink p-8 transition-colors duration-300 hover:bg-graphite"
                >
                  <div className="flex items-center justify-end font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                    <span className="transition-transform duration-500 group-hover:rotate-90">
                      ┼
                    </span>
                  </div>

                  <div className="relative h-36 overflow-hidden rounded-sm border border-rule bg-ink">
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          'radial-gradient(rgba(196,255,61,0.10) 1px, transparent 1px)',
                        backgroundSize: '12px 12px',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {s.preview}
                    </div>
                    <span className="absolute bottom-2 right-2 font-mono text-[9px] uppercase tracking-[0.22em] text-fog">
                      Fig. {i + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-3xl text-paper">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-paper/60">
                      {s.desc}
                    </p>
                  </div>

                  <Link
                    href={primaryCta}
                    className="mt-auto inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-fog transition-colors hover:text-signal"
                  >
                    <span className="h-px w-6 bg-current" />
                    Draft one
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ METHOD / HOW IT WORKS ═══ */}
        <section className="relative border-t border-rule bg-graphite/30 py-24 lg:py-36">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <SectionHeader
              kicker="Method"
              title={
                <>
                  From thought to
                  <br />
                  <span className="italic text-signal">finished sheet.</span>
                </>
              }
              description="Three movements. No dragging, no snapping to grids, no toolbar archaeology."
            />

            <div className="mt-20 space-y-24 lg:space-y-32">
              {[
                {
                  step: '01',
                  title: 'Describe',
                  desc: 'Type a sentence or paste a doc. Flowcraft reads the structure of what you mean.',
                  media:
                    'https://fllqlodhrvmnynkffoss.supabase.co/storage/v1/object/public/flowcraft-data//DescribeYourVision.gif',
                },
                {
                  step: '02',
                  title: 'Style',
                  desc: 'Pick an aesthetic — editorial, technical, hand-drawn, corporate. It commits to one voice.',
                  media:
                    'https://fllqlodhrvmnynkffoss.supabase.co/storage/v1/object/public/flowcraft-data//ColorOptions.gif',
                },
                {
                  step: '03',
                  title: 'Refine',
                  desc: 'Watch the draft render. Nudge any element. Export at any resolution.',
                  media:
                    'https://fllqlodhrvmnynkffoss.supabase.co/storage/v1/object/public/flowcraft-data//Review.gif',
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-120px' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12"
                >
                  <div
                    className={`order-1 lg:col-span-5 ${
                      idx % 2 === 1 ? 'lg:order-2' : ''
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal">
                        Movement
                      </span>
                      <span className="h-px flex-1 bg-rule" />
                    </div>

                    <div className="mt-4 font-serif text-[140px] leading-[0.85] text-paper/10 md:text-[200px]">
                      /{item.step}
                    </div>

                    <h3 className="-mt-10 font-serif text-5xl text-paper md:text-6xl">
                      {item.title}
                      <span className="italic text-signal">.</span>
                    </h3>

                    <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/60">
                      {item.desc}
                    </p>
                  </div>

                  <div
                    className={`order-2 lg:col-span-7 ${
                      idx % 2 === 1 ? 'lg:order-1' : ''
                    }`}
                  >
                    <div className="relative">
                      <CornerTicks />
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-rule bg-graphite">
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 z-10 opacity-30 mix-blend-overlay"
                          style={{
                            backgroundImage:
                              'linear-gradient(135deg, transparent 45%, rgba(196,255,61,0.25) 50%, transparent 55%)',
                          }}
                        />
                        <Image
                          src={item.media}
                          alt={`${item.title} interface demonstration`}
                          width={860}
                          height={645}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                        <span>Fig. {idx + 2}</span>
                        <span>
                          {item.title} · {item.step}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ USE CASES / CANVAS ═══ */}
        <section className="relative py-24 lg:py-36">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <SectionHeader
              kicker="Canvas"
              title={
                <>
                  Built for people who
                  <br />
                  <span className="italic text-signal">
                    draw to understand.
                  </span>
                </>
              }
              description="Engineers, educators, analysts, founders — anyone whose thoughts need a shape."
            />

            <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((u, i) => (
                <motion.div
                  key={u.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    delay: (i % 3) * 0.05,
                    duration: 0.6,
                  }}
                  className="group flex flex-col gap-4 bg-ink p-8 transition-colors duration-300 hover:bg-graphite"
                >
                  <div className="flex items-center justify-end font-mono text-[10px] uppercase tracking-[0.22em]">
                    <span className="text-fog transition-transform duration-300 group-hover:translate-x-1 group-hover:text-signal">
                      →
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-paper">{u.title}</h3>
                  <p className="text-sm leading-relaxed text-paper/60">
                    {u.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section className="relative overflow-hidden border-t border-rule py-28 lg:py-40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-60"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(196,255,61,0.14), transparent 70%)',
            }}
          />

          <div className="relative mx-auto max-w-[1100px] px-6 text-center lg:px-8">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-fog">
              <span className="h-px w-8 bg-fog" />
              <span>Final sheet</span>
              <span className="h-px w-8 bg-fog" />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-8 max-w-4xl font-serif text-[56px] leading-[0.95] tracking-[-0.01em] md:text-[96px]"
            >
              Draft what you're
              <br />
              <span className="italic text-signal">thinking</span>
              <span className="text-paper">.</span>{' '}
              <span className="text-paper/60">Now.</span>
            </motion.h2>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={primaryCta}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-sm bg-signal px-8 py-4 font-mono text-[12px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-paper"
              >
                <span className="relative z-10">{primaryLabel}</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-3 rounded-sm border border-rule px-8 py-4 font-mono text-[12px] uppercase tracking-[0.22em] text-paper transition-colors hover:border-signal/50 hover:text-signal"
              >
                See pricing
              </Link>
            </div>

            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-fog">
              <span className="text-signal">◆</span> Free tier · No credit card
              · Exports in PNG / SVG / PDF
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

/* ──────────────────────────────────────────── */
/* Subcomponents                                */
/* ──────────────────────────────────────────── */

function SectionHeader({
  kicker,
  title,
  description,
}: {
  kicker: string
  title: React.ReactNode
  description: string
}) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-signal">
          <span className="h-px w-12 bg-signal/50" />
          <span className="text-fog">{kicker}</span>
        </div>
        <h2 className="mt-6 font-serif text-5xl leading-[0.95] tracking-[-0.01em] text-paper md:text-7xl">
          {title}
        </h2>
      </div>
      <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
        <p className="max-w-md text-lg leading-relaxed text-paper/60">
          {description}
        </p>
      </div>
    </div>
  )
}

function CornerTicks() {
  return (
    <>
      <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-signal" />
      <span className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r border-t border-signal" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b border-l border-signal" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-signal" />
    </>
  )
}

function AnimatedCount({ from, to }: { from: number; to: number }) {
  const [v, setV] = useState(from)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const dur = 1400
    const loop = (t: number) => {
      const p = Math.min((t - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setV(Math.round(from + (to - from) * eased))
      if (p < 1) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [from, to])
  return <>{v}</>
}

function LiveSchematic() {
  return (
    <svg
      viewBox="0 0 300 200"
      className="w-full"
      fill="none"
      stroke="currentColor"
    >
      {/* frame lines */}
      <g className="text-rule" stroke="currentColor" strokeWidth="0.5">
        <path d="M0 40h300M0 80h300M0 120h300M0 160h300" />
      </g>

      {/* nodes */}
      <g className="text-paper" stroke="currentColor" strokeWidth="1">
        <rect x="20" y="30" width="60" height="28" rx="1" />
        <rect x="120" y="60" width="60" height="28" rx="1" />
        <rect x="220" y="30" width="60" height="28" rx="1" />
        <rect x="70" y="130" width="60" height="28" rx="1" />
        <rect x="170" y="130" width="60" height="28" rx="1" />
      </g>

      {/* edges */}
      <g className="text-signal" stroke="currentColor" strokeWidth="1.2">
        <path d="M80 44 Q 100 44 120 74" strokeDasharray="3 3">
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-12"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
        <path d="M180 74 Q 200 74 220 44" strokeDasharray="3 3">
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-12"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </path>
        <path d="M150 88 L 150 130" strokeDasharray="3 3">
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-12"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </path>
        <path d="M130 144 L 170 144" strokeDasharray="3 3">
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-12"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* node labels */}
      <g className="fill-fog" fontFamily="JetBrains Mono, monospace" fontSize="7">
        <text x="26" y="47">PROMPT</text>
        <text x="126" y="77">MODEL</text>
        <text x="226" y="47">STYLE</text>
        <text x="78" y="148">RENDER</text>
        <text x="178" y="148">EXPORT</text>
      </g>

      {/* signal dot */}
      <circle cx="150" cy="74" r="2.5" className="fill-signal">
        <animate
          attributeName="r"
          values="2.5;3.5;2.5"
          dur="1.4s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}

/* ── Specimen previews ── */

function FlowchartPreview() {
  return (
    <svg viewBox="0 0 160 90" className="h-full w-full p-4" fill="none">
      <g stroke="#F3EFE4" strokeWidth="1">
        <rect x="10" y="10" width="34" height="18" rx="1" />
        <rect x="62" y="36" width="34" height="18" rx="1" />
        <rect x="116" y="10" width="34" height="18" rx="1" />
        <rect x="36" y="62" width="34" height="18" rx="1" />
        <rect x="90" y="62" width="34" height="18" rx="1" />
      </g>
      <g stroke="#C4FF3D" strokeWidth="0.8" strokeDasharray="2 2">
        <path d="M44 19 L 79 45" />
        <path d="M116 19 L 79 45" />
        <path d="M79 54 L 53 62" />
        <path d="M79 54 L 107 62" />
      </g>
    </svg>
  )
}

function MindmapPreview() {
  return (
    <svg viewBox="0 0 160 90" className="h-full w-full p-4" fill="none">
      <circle cx="80" cy="45" r="10" stroke="#C4FF3D" strokeWidth="1" />
      <g stroke="#F3EFE4" strokeWidth="0.8">
        <circle cx="22" cy="20" r="6" />
        <circle cx="22" cy="70" r="6" />
        <circle cx="138" cy="20" r="6" />
        <circle cx="138" cy="70" r="6" />
        <circle cx="80" cy="10" r="5" />
        <circle cx="80" cy="80" r="5" />
      </g>
      <g stroke="#76766F" strokeWidth="0.6">
        <path d="M70 42 L 28 22" />
        <path d="M70 48 L 28 68" />
        <path d="M90 42 L 132 22" />
        <path d="M90 48 L 132 68" />
        <path d="M80 35 L 80 14" />
        <path d="M80 55 L 80 75" />
      </g>
    </svg>
  )
}

function SequencePreview() {
  return (
    <svg viewBox="0 0 160 90" className="h-full w-full p-4" fill="none">
      <g stroke="#F3EFE4" strokeWidth="1">
        <rect x="10" y="8" width="30" height="12" />
        <rect x="65" y="8" width="30" height="12" />
        <rect x="120" y="8" width="30" height="12" />
      </g>
      <g stroke="#76766F" strokeWidth="0.6" strokeDasharray="2 3">
        <path d="M25 22 V 82" />
        <path d="M80 22 V 82" />
        <path d="M135 22 V 82" />
      </g>
      <g stroke="#C4FF3D" strokeWidth="1">
        <path d="M25 34 L 80 34" markerEnd="url(#arr)" />
        <path d="M80 50 L 135 50" markerEnd="url(#arr)" />
        <path d="M135 66 L 25 66" markerEnd="url(#arr)" />
      </g>
      <defs>
        <marker
          id="arr"
          markerWidth="4"
          markerHeight="4"
          refX="3"
          refY="2"
          orient="auto"
        >
          <path d="M0 0 L 4 2 L 0 4 z" fill="#C4FF3D" />
        </marker>
      </defs>
    </svg>
  )
}

function GraphPreview() {
  return (
    <svg viewBox="0 0 160 90" className="h-full w-full p-4" fill="none">
      <g stroke="#76766F" strokeWidth="0.5">
        <path d="M30 25 L 70 45 L 30 70" />
        <path d="M70 45 L 115 20" />
        <path d="M70 45 L 125 55" />
        <path d="M115 20 L 125 55" />
        <path d="M30 70 L 125 55" />
      </g>
      <g fill="#0B0B0C" stroke="#F3EFE4" strokeWidth="1">
        <circle cx="30" cy="25" r="5" />
        <circle cx="30" cy="70" r="5" />
        <circle cx="115" cy="20" r="5" />
        <circle cx="125" cy="55" r="5" />
      </g>
      <circle cx="70" cy="45" r="6" fill="#C4FF3D" />
    </svg>
  )
}

function IllustrationPreview() {
  return (
    <svg viewBox="0 0 160 90" className="h-full w-full p-4" fill="none">
      <g stroke="#F3EFE4" strokeWidth="1" strokeLinecap="round">
        <path d="M30 70 Q 50 30, 80 55 T 130 50" />
        <path d="M25 60 L 35 60" />
        <path d="M120 40 L 135 40" />
      </g>
      <g fill="#C4FF3D" stroke="none">
        <circle cx="55" cy="40" r="3" />
      </g>
      <g stroke="#76766F" strokeWidth="0.6" strokeDasharray="1 2">
        <circle cx="80" cy="55" r="18" />
      </g>
    </svg>
  )
}

function InfographicPreview() {
  return (
    <svg viewBox="0 0 160 90" className="h-full w-full p-4" fill="none">
      <g stroke="#F3EFE4" strokeWidth="1">
        <rect x="20" y="55" width="14" height="25" />
        <rect x="45" y="40" width="14" height="40" />
        <rect x="70" y="25" width="14" height="55" />
        <rect x="95" y="45" width="14" height="35" />
        <rect x="120" y="35" width="14" height="45" />
      </g>
      <path
        d="M27 55 L 52 40 L 77 25 L 102 45 L 127 35"
        stroke="#C4FF3D"
        strokeWidth="1"
        fill="none"
      />
      <g fill="#C4FF3D">
        <circle cx="27" cy="55" r="1.8" />
        <circle cx="52" cy="40" r="1.8" />
        <circle cx="77" cy="25" r="1.8" />
        <circle cx="102" cy="45" r="1.8" />
        <circle cx="127" cy="35" r="1.8" />
      </g>
    </svg>
  )
}
