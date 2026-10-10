'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-auth/client'
import { BlogPost } from './schema'

/* ──────────────────────────────────────────── */
/* Page                                         */
/* ──────────────────────────────────────────── */

export default function BlogsHomePage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [time, setTime] = useState('')

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()

      const { data: userData } = await supabase.auth.getUser()
      if (
        !!process.env.NEXT_PUBLIC_BLOG_ADMIN_ID &&
        userData?.user?.id !== undefined &&
        userData?.user?.id === process.env.NEXT_PUBLIC_BLOG_ADMIN_ID
      ) {
        setIsAdmin(true)
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false })

      if (!error && data && data.length > 0) {
        setFeaturedPost(data[0] as BlogPost)
        setBlogs(data.slice(1) as BlogPost[])
      }
      setIsLoading(false)
    }
    init()
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
    const i = setInterval(update, 1000 * 30)
    return () => clearInterval(i)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-paper selection:bg-signal selection:text-ink">
      <main className="relative">
        {/* ═══ MASTHEAD ═══ */}
        <section className="relative overflow-hidden border-b border-rule pb-16 pt-12 lg:pb-24 lg:pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-60"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-10%] top-[20%] h-[460px] w-[600px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(196,255,61,0.10), transparent 60%)',
            }}
          />

          <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
            {/* sheet header */}
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-fog">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-signal/60" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-signal" />
                  </span>
                  <span className="text-paper">Field Notes</span>
                </span>
              </div>
              <div className="hidden items-center gap-3 md:flex">
                <span>{time || '—:—'}</span>
                <span className="text-signal">◆</span>
                <span>Editor in</span>
              </div>
            </div>

            <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-8"
              >
                <h1 className="font-serif text-[56px] leading-[0.95] tracking-[-0.01em] text-paper md:text-[96px] lg:text-[112px]">
                  <span className="block">Notes from</span>
                  <span className="block">
                    <span className="italic text-signal">the drafting</span>
                    <span className="text-fog">,</span>
                  </span>
                  <span className="block">room.</span>
                </h1>
                <p className="mt-10 max-w-xl text-lg leading-relaxed text-paper/70 md:text-xl">
                  Essays, process dispatches, and product signals from the team
                  teaching machines to draft beautiful diagrams.
                </p>
              </motion.div>

              <motion.aside
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-4"
              >
                <div className="relative overflow-hidden rounded-sm border border-rule bg-graphite">
                  <CornerTicks />
                  <div className="relative border-b border-rule px-5 py-3 font-mono text-[9px] uppercase tracking-[0.25em] text-fog">
                    <div className="flex items-center justify-between">
                      <span>Title block</span>
                      <span className="text-signal">◆</span>
                    </div>
                  </div>
                  <dl className="divide-y divide-rule font-mono text-[10px] uppercase tracking-[0.22em]">
                    <Meta k="Volume" v="V · 2026" />
                    <Meta k="Contributors" v="04" />
                    <Meta k="Frequency" v="Irregular" />
                    <Meta
                      k="Filed"
                      v={featuredPost ? `${blogs.length + 1} entries` : '—'}
                    />
                  </dl>
                  {isAdmin && (
                    <div className="border-t border-rule p-4">
                      <Link
                        href="/blogs/create"
                        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-signal transition-opacity hover:opacity-80"
                      >
                        <span className="h-px w-6 bg-current" />
                        New entry
                      </Link>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                  <span>Ref. 00</span>
                  <span>Masthead</span>
                </div>
              </motion.aside>
            </div>
          </div>
        </section>

        {/* ═══ FEATURED ═══ */}
        {isLoading ? (
          <LoadingState />
        ) : !featuredPost ? (
          <EmptyState isAdmin={isAdmin} />
        ) : (
          <>
            <section className="relative py-24 lg:py-32">
              <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14"
                >
                  <div className="order-2 lg:order-1 lg:col-span-5">
                    <div className="flex items-baseline gap-4">
                      <time
                        dateTime={featuredPost.published_at}
                        className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog"
                      >
                        {formatDate(featuredPost.published_at)}
                      </time>
                    </div>

                    <h2 className="mt-8 font-serif text-4xl leading-[1.02] tracking-[-0.01em] text-paper md:text-6xl">
                      <Link
                        href={`/blogs/${featuredPost.id}`}
                        className="transition-colors hover:text-signal"
                      >
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="mt-6 max-w-lg text-lg leading-relaxed text-paper/70">
                      {featuredPost.description}
                    </p>

                    <div className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-fog">
                      <span>By</span>
                      <span className="text-paper">
                        {featuredPost.author || 'Flowcraft'}
                      </span>
                    </div>

                    <Link
                      href={`/blogs/${featuredPost.id}`}
                      className="group mt-10 inline-flex items-center gap-3 rounded-sm bg-signal px-6 py-4 font-mono text-[12px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-paper"
                    >
                      <span>Read dispatch</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                        →
                      </span>
                    </Link>
                  </div>

                  <div className="order-1 lg:order-2 lg:col-span-7">
                    <Link
                      href={`/blogs/${featuredPost.id}`}
                      className="group relative block"
                    >
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
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 z-10 opacity-30"
                          style={{
                            backgroundImage:
                              'radial-gradient(rgba(196,255,61,0.12) 1px, transparent 1px)',
                            backgroundSize: '14px 14px',
                          }}
                        />
                        {featuredPost.image_url ? (
                          <Image
                            src={featuredPost.image_url}
                            alt={featuredPost.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <SchematicPlaceholder />
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                        <span>Featured</span>
                      </div>
                    </Link>
                  </div>
                </motion.article>
              </div>
            </section>

            {/* ═══ ARCHIVE GRID ═══ */}
            {blogs.length > 0 && (
              <section className="border-t border-rule bg-graphite/30 py-24 lg:py-32">
                <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                      <h2 className="font-serif text-5xl leading-[0.95] tracking-[-0.01em] text-paper md:text-7xl">
                        Earlier
                        <br />
                        <span className="italic text-signal">entries.</span>
                      </h2>
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
                      <p className="max-w-md text-lg leading-relaxed text-paper/60">
                        Every dispatch filed. Scroll the stack, pull a thread,
                        follow it wherever it goes.
                      </p>
                    </div>
                  </div>

                  <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((post, i) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{
                          delay: (i % 3) * 0.08,
                          duration: 0.6,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="group relative flex flex-col gap-5 bg-ink p-7 transition-colors duration-300 hover:bg-graphite"
                      >
                        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                          <span>Entry {String(i + 2).padStart(2, '0')}</span>
                          <span className="transition-transform duration-500 group-hover:rotate-90">
                            ┼
                          </span>
                        </div>

                        <Link href={`/blogs/${post.id}`} className="block">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-rule bg-graphite">
                            <div
                              aria-hidden
                              className="pointer-events-none absolute inset-0 z-10 opacity-30"
                              style={{
                                backgroundImage:
                                  'radial-gradient(rgba(196,255,61,0.10) 1px, transparent 1px)',
                                backgroundSize: '12px 12px',
                              }}
                            />
                            {post.image_url ? (
                              <Image
                                src={post.image_url}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                              />
                            ) : (
                              <SchematicPlaceholder mini />
                            )}
                            <span className="absolute bottom-2 right-2 z-20 font-mono text-[9px] uppercase tracking-[0.22em] text-fog">
                              Fig. {String(i + 2).padStart(2, '0')}
                            </span>
                          </div>
                        </Link>

                        <time
                          dateTime={post.published_at}
                          className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog"
                        >
                          {formatDate(post.published_at)}
                        </time>

                        <h3 className="font-serif text-2xl leading-[1.1] text-paper transition-colors group-hover:text-signal">
                          <Link href={`/blogs/${post.id}`}>{post.title}</Link>
                        </h3>

                        <p className="line-clamp-3 text-sm leading-relaxed text-paper/60">
                          {post.description}
                        </p>

                        <Link
                          href={`/blogs/${post.id}`}
                          className="mt-auto inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-fog transition-colors hover:text-signal"
                        >
                          <span className="h-px w-6 bg-current" />
                          Read
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* ═══ COLOPHON ═══ */}
        <section className="relative overflow-hidden border-t border-rule py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-40"
          />
          <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-end gap-6 font-mono text-[10px] uppercase tracking-[0.24em] text-fog">
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

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <dt className="text-fog">{k}</dt>
      <dd className="text-paper">{v}</dd>
    </div>
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

function formatDate(iso: string) {
  if (!iso) return '—'
  try {
    return new Date(iso)
      .toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
      .toUpperCase()
  } catch {
    return '—'
  }
}

function SchematicPlaceholder({ mini = false }: { mini?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 150"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <g stroke="rgba(243,239,228,0.25)" strokeWidth="0.8">
        <rect x="20" y="30" width="50" height="24" rx="1" />
        <rect x="130" y="30" width="50" height="24" rx="1" />
        <rect x="75" y="80" width="50" height="24" rx="1" />
      </g>
      <g
        stroke="#C4FF3D"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.7"
      >
        <path d="M70 42 Q 90 42 100 80" />
        <path d="M130 42 Q 110 42 100 80" />
      </g>
      {!mini && (
        <g
          fill="#76766F"
          fontFamily="JetBrains Mono, monospace"
          fontSize="6"
        >
          <text x="26" y="46">NODE · A</text>
          <text x="136" y="46">NODE · B</text>
          <text x="81" y="96">DRAFT</text>
        </g>
      )}
    </svg>
  )
}

function LoadingState() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-4 lg:col-span-5">
            <div className="h-4 w-24 animate-pulse bg-rule" />
            <div className="h-14 w-full animate-pulse bg-rule" />
            <div className="h-14 w-3/4 animate-pulse bg-rule" />
            <div className="h-4 w-full animate-pulse bg-rule" />
            <div className="h-4 w-5/6 animate-pulse bg-rule" />
          </div>
          <div className="lg:col-span-7">
            <div className="aspect-[4/3] w-full animate-pulse border border-rule bg-graphite/50" />
          </div>
        </div>
        <div className="mt-24 grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="space-y-4 bg-ink p-7"
            >
              <div className="aspect-[4/3] animate-pulse bg-graphite/60" />
              <div className="h-4 w-2/3 animate-pulse bg-rule" />
              <div className="h-4 w-full animate-pulse bg-rule" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EmptyState({ isAdmin }: { isAdmin: boolean }) {
  return (
    <section className="py-28 lg:py-40">
      <div className="mx-auto max-w-[720px] px-6 text-center lg:px-8">
        <h2 className="font-serif text-5xl text-paper md:text-6xl">
          No posts yet.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-paper/60">
          Check back soon — new articles are on the way.
        </p>
        {isAdmin && (
          <Link
            href="/blogs/create"
            className="mt-10 inline-flex items-center gap-3 rounded-sm bg-signal px-6 py-4 font-mono text-[12px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-paper"
          >
            <span>File first entry</span>
            <span>→</span>
          </Link>
        )}
      </div>
    </section>
  )
}
