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
    <h2 className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text font-serif text-2xl font-medium text-transparent">
      {title}
    </h2>
    <a
      href={link}
      className="inline-flex items-center text-sm font-medium text-indigo-600 transition-all duration-300 hover:translate-x-1 hover:text-fuchsia-600"
    >
      View All
      <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </a>
  </div>
)

// Stats Card Component
const StatsCard = ({
  stat,
}: {
  stat: { id: number; name: string; value: number }
}) => (
  <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl">
    <dt className="text-sm font-medium text-indigo-500">{stat.name}</dt>
    <dd className="mt-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text font-serif text-4xl font-semibold tracking-tight text-transparent">
      {stat.value}
    </dd>
  </div>
)

// Floating decorative elements component
const DecorativeElements = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <div className="animate-float-slow absolute right-20 top-20 h-32 w-32 rounded-full bg-gradient-to-r from-fuchsia-400/20 to-indigo-400/20"></div>
    <div className="animate-float absolute left-10 top-60 h-20 w-20 rounded-full bg-gradient-to-r from-purple-400/20 to-fuchsia-400/20"></div>
    <div className="animate-float-slow absolute bottom-40 right-40 h-40 w-40 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20"></div>
    <div className="animate-float-reverse absolute bottom-20 left-20 h-24 w-24 rounded-full bg-gradient-to-r from-fuchsia-400/20 to-purple-400/20"></div>
  </div>
)

// Diagram Card Component
const DiagramCard = ({ diagram }: { diagram: any }) => (
  <div className="group relative overflow-hidden rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-xl">
    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    <div className="relative z-10 flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-medium text-indigo-900 transition-colors duration-300 group-hover:text-fuchsia-700">
          {diagram.title}
        </h3>
        <span className="rounded-full bg-gradient-to-r from-fuchsia-100 to-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
          {diagram.type}
        </span>
      </div>

      <div className="text-sm text-indigo-500">
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
        className="mt-4 inline-flex transform items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:from-fuchsia-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-purple-300/40 group-hover:translate-y-[-2px]"
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
    className="group relative overflow-hidden rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-fuchsia-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    <div className="relative z-10 flex flex-col space-y-3">
      <h3 className="font-serif text-xl font-medium text-indigo-900 transition-colors duration-300 group-hover:text-fuchsia-700">
        {share.title}
      </h3>
      <p className="text-sm text-indigo-500">
        {new Date(share.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <div className="mt-2 flex items-center space-x-2">
        <span className="text-sm font-medium text-indigo-600">
          Invite Code:
        </span>
        <code className="rounded-md border border-purple-100 bg-gradient-to-r from-fuchsia-50 to-indigo-50 px-3 py-1.5 font-mono text-sm text-indigo-600">
          {share.invite_code}
        </code>
      </div>
    </div>
  </Link>
)

// Metadata
export const metadata: Metadata = {
  title: 'FlowCraft - Dashboard',
  description: 'Transform your ideas into stunning visual content',
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
    { id: 3, name: 'Charts', value: 0 },
    { id: 4, name: 'Total Shares', value: 0 },
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
      (diagram: DiagramData) => diagram.type === 'Chart',
    ).length
  }

  if (shares.length > 0) {
    stats[3].value = shares.length
  }

  if (user === null) {
    return redirect(errorMessagePage)
  }

  return (
    <div className="relative mt-12 min-h-screen overflow-hidden bg-gradient-to-b from-purple-50 via-white to-fuchsia-50 px-6 py-12">
      <DecorativeElements />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h1 className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text font-serif text-5xl font-semibold tracking-tight text-transparent">
            Welcome to FlowCraft
          </h1>
          <p className="mt-4 text-xl font-medium text-indigo-700">
            {user.subscribed ? (
              <span className="inline-flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-fuchsia-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Pro Creator
              </span>
            ) : (
              'Free Creator'
            )}
          </p>
          <p className="mt-3 text-lg text-indigo-500">
            Hi {userData.user.email.split('@')[0]}, transform your ideas into
            visual masterpieces
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Create New Section */}
        <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 p-8 text-white shadow-xl">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white"></div>
            <div className="absolute -left-10 bottom-5 h-40 w-40 rounded-full bg-white"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 md:mb-0">
              <h2 className="font-serif text-3xl font-semibold">
                Ready to create?
              </h2>
              <p className="mt-2 text-fuchsia-100">
                Transform your ideas into visual magic
              </p>
            </div>
            <a
              href="/dashboard/diagrams/new"
              className="transform rounded-full bg-white px-8 py-3 text-base font-medium text-indigo-600 transition-all duration-300 hover:scale-105 hover:bg-fuchsia-50 hover:shadow-lg hover:shadow-purple-700/30"
            >
              Create New Diagram
            </a>
          </div>
        </div>

        {/* Recent Diagrams */}
        {diagrams && diagrams.length > 0 && (
          <div className="mb-16">
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
          <div className="mb-16">
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

        {/* Inspiration Section */}
        <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white/90 p-8 shadow-lg backdrop-blur-xl">
          <h2 className="mb-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text font-serif text-2xl font-medium text-transparent">
            Get Inspired
          </h2>
          <p className="mb-6 text-indigo-700">
            Discover creative ways to transform your ideas into visual content
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-gradient-to-r from-fuchsia-50 to-indigo-50 p-5 transition-all duration-300 hover:shadow-md">
              <h3 className="mb-2 font-serif text-lg font-medium text-indigo-700">
                Visualization Tips
              </h3>
              <p className="text-sm text-indigo-600">
                Learn the best practices for effective visual storytelling
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-5 transition-all duration-300 hover:shadow-md">
              <h3 className="mb-2 font-serif text-lg font-medium text-indigo-700">
                Template Gallery
              </h3>
              <p className="text-sm text-indigo-600">
                Explore pre-made templates to jumpstart your projects
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-fuchsia-50 p-5 transition-all duration-300 hover:shadow-md">
              <h3 className="mb-2 font-serif text-lg font-medium text-indigo-700">
                Community Showcase
              </h3>
              <p className="text-sm text-indigo-600">
                See what other creators are building with FlowCraft
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add these animations to your global CSS file
/*
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

@keyframes float-slow {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

@keyframes float-reverse {
  0% { transform: translateY(0px); }
  50% { transform: translateY(20px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-reverse {
  animation: float-reverse 7s ease-in-out infinite;
}
*/
