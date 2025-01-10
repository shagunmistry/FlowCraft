import { PlayIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

import { DiagramData } from '@/lib/DiagramType.db'

import { GET as _getDiagrams } from '@/app/api/get-diagrams/route'
import { GET as _getShares } from '@/app/api/shares/route'
import { Metadata } from 'next'
import { SharedDiagramResult } from '@/lib/utils'
import { createClient } from '@/lib/supabase-auth/server'
import { redirect } from 'next/navigation'

const errorMessagePage =
  '/error?message=There was an error getting your user data. Please contact support.'

async function getDiagrams() {
  const data = await _getDiagrams()

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

async function getUserDataFromTable(
  userId: string,
  email: string,
): Promise<{
  user: {
    id: number
    user_id: string
    email: string
    created_at: string
    plan: string
    subscribed: boolean
    date_subscribed: string
    date_cancelled: string | null
  } | null
}> {
  const sbClient = createClient()

  const { data: userData, error } = await sbClient
    .from('users')
    .select('*')
    .eq('user_id', userId)

  if (error || userData.length === 0) {
    // Insert the user into the table
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

    console.log('Inserted user data:', insertedUserData, insertError)
    if (insertError || insertedUserData.length === 0) {
      return { user: null }
    }

    return { user: insertedUserData[0] }
  }

  return { user: userData[0] }
}

const SectionHeader = ({ title, link }: { title: string; link: string }) => (
  <div className="flex items-center justify-between py-6">
    <h2 className="text-xl font-medium text-gray-900">{title}</h2>
    <Link
      href={link}
      className="inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
    >
      View All
      <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  </div>
)

// Stats Card Component
const StatsCard = ({
  stat,
}: {
  stat: { id: number; name: string; value: number }
}) => (
  <div className="overflow-hidden rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur-xl">
    <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
    <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
      {stat.value}
    </dd>
  </div>
)

// Diagram Card Component
const DiagramCard = ({ diagram }: { diagram: any }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur-xl transition duration-300 hover:scale-[1.02]">
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{diagram.title}</h3>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {diagram.type}
        </span>
      </div>

      <div className="text-sm text-gray-500">
        <time dateTime={diagram.created_at}>
          {new Date(diagram.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>

      <Link
        href={`/dashboard/diagram/${diagram.id}`}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
      >
        <PlayIcon className="mr-2 h-4 w-4" />
        View Diagram
      </Link>
    </div>
  </div>
)

// Shared Diagram Card Component
const SharedDiagramCard = ({
  share,
  baseUrl,
}: {
  share: SharedDiagramResult
  baseUrl: string
}) => (
  <Link
    href={`${baseUrl}/share/${share.id}`}
    className="group relative overflow-hidden rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur-xl transition duration-300 hover:scale-[1.02]"
  >
    <div className="flex flex-col space-y-2">
      <h3 className="text-lg font-medium text-gray-900">{share.title}</h3>
      <p className="text-sm text-gray-500">
        {new Date(share.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <div className="mt-2 flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-500">Invite Code:</span>
        <code className="rounded-md bg-gray-100 px-2 py-1 font-mono text-sm text-blue-600">
          {share.invite_code}
        </code>
      </div>
    </div>
  </Link>
)

// Metadata
export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Create and manage your diagrams and charts',
}

interface Diagram {
  id: string
  title: string
  type: string
  created_at: string
}

export default async function Dashboard() {
  const sbClient = createClient()

  const { data: userData, error } = await sbClient.auth.getUser()

  if (error || userData?.user === null) {
    return redirect('/login')
  }

  const stats = [
    { id: 1, name: 'Flow Diagrams', value: 0 },
    { id: 2, name: 'Complex Diagrams', value: 0 },
    // { id: 3, name: 'Whiteboards', value: 0 },
    { id: 4, name: 'Charts', value: 0 },
    { id: 5, name: 'Total Shares', value: 0 },
  ]
  const { diagrams } = await getDiagrams()
  const { shares } = await getShares()

  if (!userData.user.id || !userData.user.email) {
    return redirect(errorMessagePage)
  }

  const { user } = await getUserDataFromTable(
    userData.user.id,
    userData.user.email,
  )

  if (diagrams.length > 0) {
    stats[0].value = diagrams.filter(
      (diagram: DiagramData) => diagram.type === 'Flow Diagram',
    ).length

    stats[1].value = diagrams.filter(
      (diagram: DiagramData) =>
        diagram.type !== 'Flow Diagram' &&
        diagram.type !== 'Chart' &&
        diagram.type !== 'Whiteboard',
    ).length

    stats[2].value = diagrams.filter(
      (diagram: DiagramData) => diagram.type === 'Whiteboard',
    ).length

    stats[3].value = diagrams.filter(
      (diagram: DiagramData) => diagram.type === 'Chart',
    ).length
  }

  if (shares.length > 0) {
    stats[1].value = shares.length
  }

  if (user === null) {
    return redirect(errorMessagePage)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 py-12 mt-12">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            Welcome back, {userData.user.email.split('@')[0]}
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            {user.subscribed ? 'Pro Plan' : 'Free Plan'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Create New Section */}
        <div className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Ready to create?</h2>
            <Link
              href="/dashboard/diagrams/new"
              className="rounded-full bg-white px-6 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-gray-100"
            >
              Create Diagram
            </Link>
          </div>
        </div>

        {/* Recent Diagrams */}
        {diagrams && diagrams.length > 0 && (
          <div className="mb-12">
            <SectionHeader title="Recent Diagrams" link="/dashboard/diagrams" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {diagrams
                .sort(
                  (a: Diagram, b: Diagram) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
                )
                .slice(0, 6)
                .map((diagram: Diagram) => (
                  <DiagramCard key={diagram.id} diagram={diagram} />
                ))}
            </div>
          </div>
        )}

        {/* Shared Diagrams */}
        {shares && shares.length > 0 && (
          <div className="mb-12">
            <SectionHeader
              title="Shared Diagrams"
              link="/dashboard/all-shared"
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shares.slice(0, 6).map((share: SharedDiagramResult) => (
                <SharedDiagramCard
                  key={share.id}
                  share={share}
                  baseUrl={process.env.NEXT_PUBLIC_BASE_URL || ''}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
