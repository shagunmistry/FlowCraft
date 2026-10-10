import Link from 'next/link'
import Footer from './Footer'
import Navbar from './Navbar'

export function ReleaseNotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-paper selection:bg-signal selection:text-ink">
      <Navbar />

      <main className="relative pt-20 lg:pt-[84px]">
        {/* ═══ MASTHEAD ═══ */}
        <section className="relative overflow-hidden border-b border-rule pb-16 pt-12 lg:pb-24 lg:pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-60"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-[30%] top-[30%] h-[460px] w-[640px] -translate-x-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(196,255,61,0.10), transparent 60%)',
            }}
          />

          <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-fog">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-signal/60" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-signal" />
                  </span>
                  <span className="text-paper">Sheet 12</span>
                </span>
                <span>/</span>
                <span>Changelog · Field log</span>
                <span>/</span>
                <span className="hidden sm:inline">Ongoing</span>
              </div>
              <div className="hidden items-center gap-3 md:flex">
                <span className="text-signal">◆</span>
                <span>Log open</span>
              </div>
            </div>

            <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <h1 className="font-serif text-[52px] leading-[0.95] tracking-[-0.01em] text-paper md:text-[96px] lg:text-[108px]">
                  <span className="block">The field</span>
                  <span className="block">
                    <span className="italic text-signal">log</span>
                    <span className="text-fog">,</span>{' '}
                    <span className="text-paper">kept</span>
                  </span>
                  <span className="block">honest.</span>
                </h1>
                <p className="mt-10 max-w-xl text-lg leading-relaxed text-paper/70 md:text-xl">
                  Every release we've cut, every feature filed, every bug
                  crossed out. Read from the top — newest first.
                </p>
              </div>

              <aside className="lg:col-span-4">
                <div className="relative overflow-hidden rounded-sm border border-rule bg-graphite">
                  <CornerTicks />
                  <div className="relative border-b border-rule px-5 py-3 font-mono text-[9px] uppercase tracking-[0.25em] text-fog">
                    <div className="flex items-center justify-between">
                      <span>Index</span>
                      <span className="text-signal">◆</span>
                    </div>
                  </div>
                  <dl className="divide-y divide-rule font-mono text-[10px] uppercase tracking-[0.22em]">
                    <Meta k="Format" v="Chronological" />
                    <Meta k="Latest" v="V · 5.0.0" />
                    <Meta k="Cadence" v="Irregular" />
                    <Meta k="Maintainer" v="Flowcraft" />
                  </dl>
                </div>
                <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                  <span>Ref. 00</span>
                  <span>Log index</span>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ═══ LOG BODY ═══ */}
        <section className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-[960px] px-6 lg:px-8">
            <article
              className={[
                'prose prose-invert max-w-none',
                // Layout rhythm
                'prose-headings:font-serif prose-headings:tracking-[-0.01em] prose-headings:text-paper',
                'prose-p:text-paper/75 prose-p:leading-relaxed',
                // H1: title of each release (the doc already starts with a big H1 we override out)
                'prose-h1:hidden',
                // H2: version / release title
                'prose-h2:mt-24 prose-h2:mb-10 prose-h2:text-4xl md:prose-h2:text-6xl',
                'prose-h2:leading-[0.98] prose-h2:border-b prose-h2:border-rule prose-h2:pb-6',
                'prose-h2:font-normal',
                // H3
                'prose-h3:mt-14 prose-h3:mb-5 prose-h3:text-2xl md:prose-h3:text-3xl',
                'prose-h3:text-paper prose-h3:italic',
                'prose-h3:font-normal',
                // H4
                'prose-h4:mt-10 prose-h4:text-xl prose-h4:text-signal prose-h4:font-normal',
                // Strong / emphasis
                'prose-strong:text-paper prose-strong:font-medium',
                'prose-em:text-signal',
                // Links
                'prose-a:text-signal prose-a:no-underline hover:prose-a:text-paper',
                'prose-a:border-b prose-a:border-signal/40 hover:prose-a:border-paper',
                // Lists
                'prose-ul:my-6 prose-ul:space-y-2 prose-ul:pl-0 prose-ul:list-none',
                'prose-li:pl-6 prose-li:relative prose-li:text-paper/75 prose-li:leading-relaxed',
                'marker:text-signal',
                // HR
                'prose-hr:my-20 prose-hr:border-rule',
                // Images — styled as schematic frames
                'prose-img:my-10 prose-img:w-full prose-img:max-w-none',
                'prose-img:rounded-sm prose-img:border prose-img:border-rule',
                'prose-img:bg-graphite prose-img:shadow-none',
                // Blockquote
                'prose-blockquote:border-l-signal prose-blockquote:text-paper/70',
                'prose-blockquote:not-italic prose-blockquote:font-serif',
                // Code
                'prose-code:text-signal prose-code:bg-graphite prose-code:px-1.5 prose-code:py-0.5',
                'prose-code:rounded-sm prose-code:font-mono prose-code:text-[0.9em]',
                'prose-code:before:content-none prose-code:after:content-none',
              ].join(' ')}
            >
              {children}
            </article>
          </div>

          {/* Custom list bullet — can't easily target pure-prose li::before from here,
              so we add a scoped stylesheet below. */}
          <style>{`
            .prose ul li::before {
              content: '';
              position: absolute;
              left: 0;
              top: 0.75em;
              width: 0.75rem;
              height: 1px;
              background: #C4FF3D;
            }
            .prose h2::before {
              content: '◆ Release';
              font-family: 'JetBrains Mono', monospace;
              font-size: 10px;
              letter-spacing: 0.24em;
              text-transform: uppercase;
              color: #C4FF3D;
              display: block;
              margin-bottom: 18px;
            }
            .prose h3::before {
              content: '';
              display: inline-block;
              width: 1.5rem;
              height: 1px;
              background: #76766F;
              margin-right: 0.75rem;
              vertical-align: middle;
            }
          `}</style>
        </section>

        {/* ═══ CLOSING ═══ */}
        <section className="relative overflow-hidden border-t border-rule py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-40"
          />
          <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-end gap-6 font-mono text-[10px] uppercase tracking-[0.24em] text-fog">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-3 rounded-sm border border-rule px-5 py-3 text-paper transition-colors hover:border-signal/50 hover:text-signal"
                >
                  <span className="transition-transform duration-300 group-hover:-translate-x-1">
                    ←
                  </span>
                  <span>Back to home</span>
                </Link>
                <Link
                  href="/support"
                  className="group inline-flex items-center gap-3 rounded-sm bg-signal px-5 py-3 text-ink transition-colors hover:bg-paper"
                >
                  <span>Send feedback</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Meta({ k, v }: { k: string; v: React.ReactNode }) {
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
