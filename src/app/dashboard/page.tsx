import Link from 'next/link'
import { GET as _getDiagrams } from '@/app/api/get-diagrams/route'
import { GET as _getShares } from '@/app/api/shares/route'
import { Metadata } from 'next'
import { SharedDiagramResult } from '@/lib/utils'
import { createClient } from '@/lib/supabase-auth/server'
import { redirect } from 'next/navigation'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

const errorMessagePage =
  '/error?message=There was an error getting your user data. Please contact support.'

export const metadata: Metadata = {
  title: 'Dashboard - FlowCraft',
  description: 'Manage your diagrams, creations, and shared projects.',
}

async function getDiagrams() {
  const mockRequest = new Request('http://localhost:3000/api/get-diagrams', {
    method: 'GET',
  })
  const data = await _getDiagrams(mockRequest as any)
  if (data.status === 200) {
    const result = await data.json()
    return { diagrams: result.diagrams }
  }
  return { diagrams: [] }
}

async function getShares() {
  const data = await _getShares()
  if (data.status === 200) {
    const result = await data.json()
    return { shares: result.shares }
  }
  return { shares: [] }
}

async function getUserDataFromTable(userId: string, email: string) {
  const sbClient = await createClient()
  const { data: userData, error } = await sbClient
    .from('users')
    .select('*')
    .eq('user_id', userId)

  if (error || userData.length === 0) {
    const { data: insertedUserData, error: insertError } = await sbClient
      .from('users')
      .insert([
        {
          user_id: userId,
          email,
          plan: '',
          subscribed: false,
          date_subscribed: null,
          date_cancelled: null,
        },
      ])
      .select('*')

    if (insertError || insertedUserData.length === 0) return { user: null }
    return { user: insertedUserData[0] }
  }
  return { user: userData[0] }
}

export default async function Dashboard() {
  const sbClient = await createClient()
  const { data: authData, error } = await sbClient.auth.getUser()

  if (error || authData?.user === null) return redirect('/login')

  if (!authData?.user?.id || !authData?.user?.email) {
    return redirect(errorMessagePage)
  }

  const [diagramsData, sharesData, userDataResult] = await Promise.all([
    getDiagrams(),
    getShares(),
    getUserDataFromTable(authData.user.id, authData.user.email),
  ])

  const { diagrams } = diagramsData
  const { shares } = sharesData
  const { user } = userDataResult

  if (!user) return redirect(errorMessagePage)

  const freeLimit = user.free_limit || 5
  const remaining = user.subscribed
    ? '∞'
    : Math.max(freeLimit - (user.diagrams_created || 0), 0)
  const atLimit = !user.subscribed && remaining === 0
  const lowQuota =
    !user.subscribed && typeof remaining === 'number' && remaining > 0 && remaining <= 1

  const sortedDiagrams = [...diagrams].sort(
    (a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
  const finalizedDiagrams = sortedDiagrams.filter((d: any) => d.finalized)
  const draftDiagrams = sortedDiagrams.filter((d: any) => !d.finalized)

  const stats = [
    { name: 'In draft', value: draftDiagrams.length.toString() },
    { name: 'Finalized', value: finalizedDiagrams.length.toString() },
    { name: 'Active shares', value: shares.length.toString() },
    {
      name: user.subscribed ? 'Diagrams left' : 'Free diagrams left',
      value: remaining.toString(),
    },
  ]

  const displayName =
    (authData.user.user_metadata?.display_name as string | undefined) ||
    authData.user.email?.split('@')[0] ||
    'Drafter'

  return (
    <main className="min-h-screen bg-ink pb-24 pt-12 text-paper">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        {atLimit && (
          <section
            aria-label="Monthly limit reached"
            className="mb-10 rounded-2xl border border-red-500/30 bg-red-500/5 p-6 md:p-8"
          >
            <h2 className="font-serif text-2xl text-paper md:text-3xl">
              You have used all {freeLimit} free diagrams this month
            </h2>
            <p className="mt-3 max-w-[60ch] text-[17px] leading-relaxed text-fog">
              New diagrams are paused until your quota refreshes. Upgrade for
              unlimited diagrams and every export format, or keep browsing your
              existing work below.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Button href="/pricing?sourcePage=dashboard-limit">Upgrade to Pro</Button>
              <Link
                href="/dashboard/diagrams"
                className="text-[15px] text-paper underline decoration-rule underline-offset-[6px] hover:decoration-signal"
              >
                Browse your diagrams
              </Link>
            </div>
          </section>
        )}

        {lowQuota && (
          <section
            aria-label="Low diagram quota"
            className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-4"
          >
            <p className="text-[15px] text-paper">
              {remaining} free diagram{remaining === 1 ? '' : 's'} left before your limit.
            </p>
            <Link
              href="/pricing?sourcePage=dashboard-low-quota"
              className="text-[15px] font-medium text-signal underline underline-offset-4"
            >
              Upgrade to Pro
            </Link>
          </section>
        )}

        <section className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl leading-[1.05] text-paper md:text-6xl">
              Hello, {displayName}
            </h1>
            <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-fog">
              Pick up where you left off, or describe a new diagram in one sentence.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!user.subscribed && (
              <Button href="/pricing?sourcePage=dashboard" variant="secondary">
                Upgrade to Pro
              </Button>
            )}
            <Button href="/dashboard/diagrams/new">New diagram</Button>
          </div>
        </section>

        <section aria-label="Statistics" className="mb-16 grid grid-cols-2 gap-x-8 gap-y-8 border-y border-rule py-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.name}>
              <div className="font-serif text-5xl leading-none text-paper">{s.value}</div>
              <div className="mt-2 text-[15px] text-fog">{s.name}</div>
            </div>
          ))}
        </section>

        <section className="mb-20">
          <DashSectionHeader title="Start something new" />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <QuickActionCard
              href="/dashboard/diagrams/new"
              title="New diagram"
              desc="Start from a sentence. Flowchart, sequence, mind map or knowledge graph."
              primary
            />
            <QuickActionCard
              href="/templates"
              title="Templates"
              desc="Ready to edit starting points, so you can skip the blank canvas."
            />
            <QuickActionCard
              href="/image-studio"
              title="Image studio"
              desc="Generate illustrations and infographic assets with AI."
            />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="space-y-14 lg:col-span-8">
            <div>
              <DashSectionHeader title="Finalized" link="/dashboard/diagrams" linkText="See all" />
              {finalizedDiagrams.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {finalizedDiagrams.slice(0, 4).map((diagram: any) => (
                    <DiagramCard key={diagram.id} diagram={diagram} variant="finalized" />
                  ))}
                </div>
              ) : (
                <p className="mt-8 text-[17px] text-fog">
                  Nothing finalized yet. Finish a draft and it will show up here.
                </p>
              )}
            </div>

            <div>
              <DashSectionHeader title="In draft" link="/dashboard/diagrams" linkText="See all" />
              {draftDiagrams.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {draftDiagrams.slice(0, 4).map((diagram: any) => (
                    <DiagramCard key={diagram.id} diagram={diagram} variant="draft" />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No drafts yet"
                  desc="Your first diagram is one sentence away."
                  cta={{ href: '/dashboard/diagrams/new', label: 'Create your first diagram' }}
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <DashSectionHeader title="Shared with you" link="/dashboard/all-shared" linkText="See all" />
            <div className="mt-8 space-y-4">
              {shares.length > 0 ? (
                shares.slice(0, 3).map((share: SharedDiagramResult) => (
                  <SharedDiagramCard
                    key={share.id}
                    share={share}
                    baseUrl={process.env.NEXT_PUBLIC_BASE_URL || ''}
                  />
                ))
              ) : (
                <p className="text-[17px] text-fog">No shared diagrams yet.</p>
              )}

              <Link
                href="/dashboard/showcase"
                className="block rounded-2xl border border-rule bg-graphite p-6 transition-colors hover:border-signal"
              >
                <h3 className="font-serif text-xl text-paper">See what others are making</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-fog">
                  Browse the community gallery for ideas.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function DashSectionHeader({
  title,
  link,
  linkText = 'See all',
}: {
  title: string
  link?: string
  linkText?: string
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-rule pb-4">
      <h2 className="font-serif text-2xl text-paper md:text-3xl">{title}</h2>
      {link && (
        <Link href={link} className="text-[15px] text-fog transition-colors hover:text-signal">
          {linkText}
        </Link>
      )}
    </div>
  )
}

function QuickActionCard({
  href,
  title,
  desc,
  primary,
}: {
  href: string
  title: string
  desc: string
  primary?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col justify-between gap-12 rounded-2xl border p-7 transition-colors',
        primary
          ? 'border-signal bg-signal text-ink hover:opacity-95'
          : 'border-rule bg-graphite text-paper hover:border-signal',
      )}
    >
      <h3 className="font-serif text-3xl leading-none">{title}</h3>
      <p className={cn('max-w-[34ch] text-[15px] leading-relaxed', primary ? 'text-ink/80' : 'text-fog')}>
        {desc}
      </p>
    </Link>
  )
}

function DiagramCard({
  diagram,
  variant = 'draft',
}: {
  diagram: any
  variant?: 'finalized' | 'draft'
}) {
  const created = new Date(diagram.created_at)
  const href =
    variant === 'finalized'
      ? `/dashboard/diagram/${diagram.id}?finalized=1`
      : `/dashboard/diagrams/new?id=${diagram.id}`
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between gap-8 rounded-2xl border border-rule bg-graphite p-6 transition-colors hover:border-signal"
    >
      <h3 className="line-clamp-2 min-h-[3.5rem] font-serif text-xl leading-snug text-paper">
        {diagram.title}
      </h3>
      <div className="flex items-center justify-between text-[15px]">
        <span className="text-fog transition-colors group-hover:text-signal">
          {variant === 'finalized' ? 'View diagram' : 'Continue editing'}
        </span>
        <time className="text-fog" dateTime={diagram.created_at}>
          {created.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </time>
      </div>
    </Link>
  )
}

function SharedDiagramCard({
  share,
  baseUrl,
}: {
  share: SharedDiagramResult
  baseUrl: string
}) {
  return (
    <Link
      href={`${baseUrl}/share/${share.id}`}
      className="block rounded-2xl border border-rule bg-graphite p-5 transition-colors hover:border-signal"
    >
      <h3 className="font-serif text-lg leading-snug text-paper">{share.title}</h3>
      <div className="mt-4 flex items-center justify-between text-[15px] text-fog">
        <span>
          Invite code{' '}
          <code className="text-paper">{share.invite_code}</code>
        </span>
        <span>
          {new Date(share.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </Link>
  )
}

function EmptyState({
  title,
  desc,
  cta,
}: {
  title: string
  desc: string
  cta: { href: string; label: string }
}) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-rule p-10 text-center">
      <h3 className="font-serif text-2xl text-paper">{title}</h3>
      <p className="mt-2 text-[17px] text-fog">{desc}</p>
      <div className="mt-6">
        <Button href={cta.href}>{cta.label}</Button>
      </div>
    </div>
  )
}
