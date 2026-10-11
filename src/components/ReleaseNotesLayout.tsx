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
                'radial-gradient(circle, rgb(var(--color-signal) / 0.10), transparent 60%)',
            }}
          />

          <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
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
                  <dl className="divide-y divide-rule text-sm">
                    <Meta k="Format" v="Chronological" />
                    <Meta k="Latest" v="V · 5.0.0" />
                    <Meta k="Cadence" v="Irregular" />
                    <Meta k="Maintainer" v="Flowcraft" />
                  </dl>
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
              background: rgb(var(--color-signal));
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
            <div className="flex flex-wrap items-end justify-end gap-6 text-sm text-fog">
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
    </>
  )
}
