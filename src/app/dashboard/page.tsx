import {
  PlayIcon,
  PlusIcon,
  SparklesIcon,
  DocumentDuplicateIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { GET as _getDiagrams } from '@/app/api/get-diagrams/route'
import { GET as _getShares } from '@/app/api/shares/route'
import { Metadata } from 'next'
import { SharedDiagramResult } from '@/lib/utils'
import { createClient } from '@/lib/supabase-auth/server'
import { redirect } from 'next/navigation'
import { cn } from '@/lib/utils'

const errorMessagePage =
  '/error?message=There was an error getting your user data. Please contact support.'

export const metadata: Metadata = {
  title: 'Dashboard - FlowCraft',
  description: 'Manage your diagrams, creations, and shared projects.',
}

// --- Data Fetching Logic (Unchanged) ---
async function getDiagrams() {
  // Create a mock NextRequest for server-side call
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
          email: email,
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

// --- UI Components ---

const SectionHeader = ({
  title,
  link,
  linkText = 'View All',
}: {
  title: string
  link?: string
  linkText?: string
}) => (
  <div className="mb-6 flex items-end justify-between border-b border-gray-200 pb-4">
    <h2 className="text-xl font-semibold tracking-tight text-gray-900">
      {title}
    </h2>
    {link && (
      <Link
        href={link}
        className="group flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        {linkText}
        <ArrowRightIcon className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    )}
  </div>
)

const StatsCard = ({
  stat,
}: {
  stat: { id: number; name: string; value: number }
}) => (
  <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
    <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
    <dd className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
      {stat.value}
    </dd>
  </div>
)

const CreateCard = ({
  title,
  description,
  href,
  icon: Icon,
  primary = false,
}: {
  title: string
  description: string
  href: string
  icon: any
  primary?: boolean
}) => (
  <Link
    href={href}
    className={cn(
      'group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]',
      primary
        ? 'bg-black text-white shadow-lg hover:bg-gray-900 hover:shadow-xl'
        : 'border border-gray-200 bg-white text-gray-900 shadow-sm hover:border-gray-300 hover:shadow-md',
    )}
  >
    <div className="flex items-start justify-between">
      <div
        className={cn(
          'rounded-lg p-2',
          primary ? 'bg-white/10' : 'bg-gray-100',
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <ArrowRightIcon
        className={cn(
          'h-5 w-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100',
          primary ? 'text-white' : 'text-gray-900',
        )}
      />
    </div>
    <div className="mt-8">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p
        className={cn(
          'mt-1 text-sm',
          primary ? 'text-gray-400' : 'text-gray-500',
        )}
      >
        {description}
      </p>
    </div>
  </Link>
)

const DiagramCard = ({ diagram }: { diagram: any }) => (
  <article className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md">
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          {diagram.type}
        </span>
        <time className="text-xs text-gray-400" dateTime={diagram.created_at}>
          {new Date(diagram.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </div>
      <h3 className="line-clamp-2 min-h-[3rem] text-base font-semibold leading-6 text-gray-900 group-hover:text-gray-700">
        <Link href={`/dashboard/diagram/${diagram.id}`}>
          <span className="absolute inset-0" />
          {diagram.title}
        </Link>
      </h3>
    </div>
    <div className="mt-4 flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-900">
      <PlayIcon className="mr-2 h-4 w-4" />
      Open Project
    </div>
  </article>
)

const SharedDiagramCard = ({
  share,
  baseUrl,
}: {
  share: SharedDiagramResult
  baseUrl: string
}) => (
  <article className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md">
    <div className="flex-1">
      <h3 className="text-base font-semibold leading-6 text-gray-900 group-hover:text-gray-700">
        <Link href={`${baseUrl}/share/${share.id}`}>
          <span className="absolute inset-0" />
          {share.title}
        </Link>
      </h3>
      <p className="mt-2 text-xs text-gray-500">
        Shared on{' '}
        {new Date(share.created_at).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </div>
    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
      <span className="text-xs font-medium text-gray-500">Invite Code</span>
      <code className="rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-700 ring-1 ring-inset ring-gray-500/10">
        {share.invite_code}
      </code>
    </div>
  </article>
)

// --- Main Page Component ---

export default async function Dashboard() {
  const sbClient = await createClient()
  const { data: authData, error } = await sbClient.auth.getUser()

  if (error || authData?.user === null) return redirect('/login')

  // FIRE ALL REQUESTS AT ONCE
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

  // Calculate Stats
  const stats = [
    { id: 1, name: 'Total Diagrams', value: diagrams.length },
    { id: 2, name: 'Active Shares', value: shares.length },
    {
      id: 3,
      name: 'Flow Charts',
      value: diagrams.filter((d: any) => d.type === 'Flow Diagram').length,
    },
    { id: 4, name: 'Creations Left', value: 0 }, // Placeholder until user data loaded
  ]

  if (!user) return redirect(errorMessagePage)

  // Update logic for free/pro stats
  stats[3].value = user.subscribed
    ? 999
    : (user.free_limit || 5) - (user.diagrams_created || 0)
  if (user.subscribed) {
    stats[3].name = 'Pro Access'
  } else {
    stats[3].name = 'Left This Month'
  }

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20 pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-base text-gray-500">
              Welcome back. Here's what's happening with your projects.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!user.subscribed && (
              <Link
                href="/pricing"
                className="mr-2 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Upgrade Plan
              </Link>
            )}
            <span
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset',
                user.subscribed
                  ? 'bg-black/5 text-gray-900 ring-gray-900/10'
                  : 'bg-gray-100 text-gray-600 ring-gray-500/10',
              )}
            >
              {user.subscribed ? 'Pro Plan' : 'Free Plan'}
            </span>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <section
          className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Quick Actions"
        >
          <CreateCard
            title="New Diagram"
            description="Create a flow chart, sequence, or mind map."
            href="/dashboard/diagrams/new"
            icon={PlusIcon}
            primary={true}
          />
          <CreateCard
            title="AI Image Studio"
            description="Generate assets using artificial intelligence."
            href="/image-studio"
            icon={SparklesIcon}
          />
          {/* <CreateCard
            title="Templates"
            description="Start from a pre-built structure."
            href="/templates"
            icon={DocumentDuplicateIcon}
          /> */}
        </section>

        {/* Stats Row */}
        <section
          className="mb-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
          aria-label="Statistics"
        >
          {stats.map((stat) => (
            <StatsCard key={stat.id} stat={stat} />
          ))}
        </section>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Recent Diagrams Column (Takes up 2/3 on large screens) */}
          <div className="lg:col-span-2">
            <SectionHeader title="Recent Projects" link="/dashboard/diagrams" />

            {diagrams.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {diagrams
                  .sort(
                    (a: any, b: any) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime(),
                  )
                  .slice(0, 4)
                  .map((diagram: any) => (
                    <DiagramCard key={diagram.id} diagram={diagram} />
                  ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No diagrams yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new diagram.
                </p>
              </div>
            )}
          </div>

          {/* Shared / Activity Column (Takes up 1/3 on large screens) */}
          <div>
            <SectionHeader
              title="Shared with You"
              link="/dashboard/all-shared"
            />

            <div className="space-y-6">
              {shares.length > 0 ? (
                shares
                  .slice(0, 3)
                  .map((share: SharedDiagramResult) => (
                    <SharedDiagramCard
                      key={share.id}
                      share={share}
                      baseUrl={process.env.NEXT_PUBLIC_BASE_URL || ''}
                    />
                  ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-500">
                    No shared diagrams found.
                  </p>
                </div>
              )}

              {/* Mini Promo Card for empty space */}
              <div className="mt-6 rounded-2xl bg-gray-900 p-6 text-white shadow-md">
                <h3 className="font-semibold">Explore the Showcase</h3>
                <p className="mt-2 text-sm text-gray-400">
                  See what others are building in the community.
                </p>
                <Link
                  href="/showcase"
                  className="mt-4 inline-block text-sm font-medium text-white underline decoration-gray-500 underline-offset-4 transition-all hover:decoration-white"
                >
                  Browse Gallery &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
