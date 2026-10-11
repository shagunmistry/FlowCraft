import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroGenerator from '@/components/Landing/HeroGenerator.client'
import DiagramViewer from '@/components/Landing/DiagramViewer.client'
import AuthCta from '@/components/Landing/AuthCta.client'
import LandingFaq from '@/components/Landing/LandingFaq'
import { fetchPricingTiers, staticTiers, type PricingTier } from '@/lib/pricing'
import { SITE_URL, buildCanonical } from '@/lib/seo'

export const revalidate = 3600

const title = 'AI Diagram Generator for Flowcharts, Mind Maps and More | FlowCraft'
const description =
  'Describe a process or system in plain language and FlowCraft draws the flowchart, mind map, sequence diagram or database schema in seconds. Try it free, no account needed.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    'ai diagram generator',
    'ai flowchart generator',
    'text to diagram',
    'mind map generator',
    'sequence diagram generator',
    'mermaid diagram generator',
    'flowcraft',
  ],
  alternates: { canonical: buildCanonical('/') },
  openGraph: {
    title,
    description,
    url: buildCanonical('/'),
    siteName: 'FlowCraft',
    type: 'website',
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: 'FlowCraft AI diagram generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${SITE_URL}/opengraph-image`],
    creator: '@flowcraftapp',
  },
}

const diagramTypes = [
  { name: 'Flowcharts', text: 'Map decisions, pipelines and approval paths without dragging a single box.' },
  { name: 'Mind maps', text: 'Start from one idea and branch out to the details, balanced on the page.' },
  { name: 'Sequence diagrams', text: 'Show how services, people and systems talk to each other, in order.' },
  { name: 'Database schemas', text: 'Describe your tables in words and get an entity relationship diagram.' },
  { name: 'State machines', text: 'Lay out every state an order, ticket or user can be in, and what moves it.' },
  { name: 'Class diagrams', text: 'Document types, members and inheritance for design reviews and onboarding.' },
]

const steps = [
  {
    title: 'Describe it',
    text: 'Type a sentence or paste a document. FlowCraft reads the structure of what you mean.',
    media: 'https://fllqlodhrvmnynkffoss.supabase.co/storage/v1/object/public/flowcraft-data//DescribeYourVision.gif',
  },
  {
    title: 'Pick a style',
    text: 'Choose the diagram type and a color treatment that fits your deck or doc.',
    media: 'https://fllqlodhrvmnynkffoss.supabase.co/storage/v1/object/public/flowcraft-data//ColorOptions.gif',
  },
  {
    title: 'Refine and export',
    text: 'Adjust with a follow up instruction, then export PNG, SVG or PDF, or share a link.',
    media: 'https://fllqlodhrvmnynkffoss.supabase.co/storage/v1/object/public/flowcraft-data//Review.gif',
  },
]

const useCases = [
  { who: 'Engineers', what: 'System architecture, API sequences and database schemas for design reviews.' },
  { who: 'Product teams', what: 'User flows and journey maps that explain a feature before it is built.' },
  { who: 'Educators', what: 'Mind maps and process diagrams that make a lesson easy to follow.' },
  { who: 'Analysts', what: 'Charts and Sankey diagrams that turn raw numbers into a story.' },
  { who: 'Operations', what: 'Process maps that expose bottlenecks and handoffs.' },
  { who: 'Founders', what: 'Clear visuals for pitch decks, docs and stakeholder updates.' },
]

async function loadTiers(): Promise<PricingTier[]> {
  try {
    return await fetchPricingTiers()
  } catch {
    return staticTiers
  }
}

function priceNumber(p: string) {
  const n = parseFloat(p.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : undefined
}

export default async function Home() {
  const tiers = await loadTiers()

  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FlowCraft',
    url: SITE_URL,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    description,
    offers: tiers
      .filter((t) => priceNumber(t.price.monthly) !== undefined)
      .map((t) => ({
        '@type': 'Offer',
        name: t.name,
        price: priceNumber(t.price.monthly),
        priceCurrency: 'USD',
      })),
  }

  return (
    <div className="lp min-h-screen overflow-x-hidden selection:bg-signal selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <Navbar />

      <main className="pt-[68px] lg:pt-[76px]">
        <section className="mx-auto max-w-[1200px] px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
          <h1 className="max-w-[16ch] font-serif text-[clamp(2.75rem,8vw,5.5rem)] leading-[1.02] text-paper">
            Describe it. Get the diagram.
          </h1>
          <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-fog md:text-xl">
            FlowCraft is an AI diagram generator. Turn a sentence into a flowchart, mind map,
            sequence diagram or database schema, then edit it, export it and share it.
          </p>

          <HeroGenerator />

          <div className="mt-20">
            <DiagramViewer />
          </div>
        </section>

        <section aria-labelledby="types-heading" className="border-t border-rule">
          <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-8 lg:py-32">
            <h2 id="types-heading" className="max-w-[20ch] font-serif text-4xl leading-[1.05] text-paper md:text-5xl">
              One sentence, any kind of diagram
            </h2>
            <dl className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {diagramTypes.map((d) => (
                <div key={d.name}>
                  <dt className="text-xl text-paper">{d.name}</dt>
                  <dd className="mt-2 max-w-[40ch] text-[17px] leading-relaxed text-fog">{d.text}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-14 text-[17px] text-fog">
              Start from a ready made{' '}
              <Link href="/templates" className="text-paper underline decoration-rule underline-offset-4 hover:decoration-signal">
                template
              </Link>
              , browse the{' '}
              <Link href="/gallery" className="text-paper underline decoration-rule underline-offset-4 hover:decoration-signal">
                gallery
              </Link>
              , or try a free{' '}
              <Link href="/tools" className="text-paper underline decoration-rule underline-offset-4 hover:decoration-signal">
                diagram tool
              </Link>
              .
            </p>
          </div>
        </section>

        <section aria-labelledby="how-heading" className="border-t border-rule">
          <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-8 lg:py-32">
            <h2 id="how-heading" className="max-w-[20ch] font-serif text-4xl leading-[1.05] text-paper md:text-5xl">
              From idea to finished diagram in three steps
            </h2>
            <ol className="mt-14 grid gap-12 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <div className="aspect-[4/3] overflow-hidden rounded-xl border border-rule bg-graphite">
                    <Image
                      src={s.media}
                      alt={`${s.title}: FlowCraft interface demonstration`}
                      width={860}
                      height={645}
                      sizes="(min-width: 768px) 360px, 100vw"
                      loading="lazy"
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-6 text-xl text-paper">
                    <span className="text-fog">{i + 1}. </span>
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-[40ch] text-[17px] leading-relaxed text-fog">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="use-heading" className="border-t border-rule">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-24 lg:grid-cols-12 lg:px-8 lg:py-32">
            <h2 id="use-heading" className="font-serif text-4xl leading-[1.05] text-paper md:text-5xl lg:col-span-4">
              Made for people who draw to understand
            </h2>
            <ul className="lg:col-span-8">
              {useCases.map((u) => (
                <li key={u.who} className="grid gap-1 border-b border-rule py-5 first:pt-0 sm:grid-cols-3 sm:gap-6">
                  <span className="text-lg text-paper">{u.who}</span>
                  <span className="text-[17px] leading-relaxed text-fog sm:col-span-2">{u.what}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="pricing-heading" className="border-t border-rule">
          <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-8 lg:py-32">
            <h2 id="pricing-heading" className="max-w-[20ch] font-serif text-4xl leading-[1.05] text-paper md:text-5xl">
              Simple pricing that grows with you
            </h2>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {tiers.map((t) => (
                <div
                  key={t.id}
                  className={`flex flex-col rounded-2xl border p-8 ${
                    t.featured ? 'border-signal bg-graphite shadow-[0_24px_60px_-30px_rgba(36,66,230,0.35)]' : 'border-rule bg-graphite'
                  }`}
                >
                  <h3 className="text-xl text-paper">{t.name}</h3>
                  <p className="mt-1 text-[15px] text-fog">{t.description}</p>
                  <p className="mt-6 text-paper">
                    <span className="font-serif text-5xl">{t.price.monthly}</span>
                    <span className="text-fog"> per month</span>
                  </p>
                  <ul className="mt-6 flex-1 space-y-2 text-[15px] text-paper">
                    {t.mainFeatures.slice(0, 4).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Link
                    href={t.id === 'tier-teams' ? '/support' : `/sign-up?src=pricing_${t.id}`}
                    className={`mt-8 inline-flex justify-center rounded-full px-6 py-3 text-[15px] font-medium transition-colors ${
                      t.featured
                        ? 'bg-signal text-white hover:bg-paper'
                        : 'border border-rule text-paper hover:border-signal'
                    }`}
                  >
                    {t.cta}
                  </Link>
                </div>
              ))}
            </div>
            <p className="mt-8 text-[17px] text-fog">
              Compare every feature on the{' '}
              <Link href="/pricing" className="text-paper underline decoration-rule underline-offset-4 hover:decoration-signal">
                pricing page
              </Link>
              .
            </p>
          </div>
        </section>

        <LandingFaq />

        <section aria-labelledby="cta-heading" className="border-t border-rule">
          <div className="mx-auto max-w-[1200px] px-6 py-28 lg:px-8 lg:py-40">
            <h2
              id="cta-heading"
              className="max-w-[14ch] font-serif text-[clamp(2.75rem,7vw,5rem)] leading-[1.02] text-paper"
            >
              Your next diagram takes one sentence
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
              <AuthCta placement="final">Create your first diagram</AuthCta>
              <AuthCta placement="final_examples" variant="quiet" signedOutHref="/gallery" signedInHref="/gallery" signedInLabel="Browse the gallery">
                See examples
              </AuthCta>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
