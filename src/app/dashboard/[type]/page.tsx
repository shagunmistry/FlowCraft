'use client'

import { createClient } from '@/lib/supabase-auth/client'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { redirect } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import ChartDescriptionInput from '@/components/ChartDescriptionInput'
import DiagramOrChartView from '@/components/DiagramOrChartView'
import Lottie from 'lottie-react'
import LottieAnimation from '@/lib/LoaderAnimation.json'
import PricingTier from '@/components/PricingTier'
import Link from 'next/link'

const allowedTypes = ['whiteboard', 'chart', 'flow-diagram']

export default function DynamicDiagramPage({
  params,
}: {
  params: { type: 'whiteboard' | 'chart' | 'flow-diagram' }
}) {
  if (!allowedTypes.includes(params.type) || !params.type) {
    return redirect('/dashboard/whiteboard')
  }
  const [username, setUsername] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        return redirect('/login')
      }

      const username = data.user.email?.split('@')[0] ?? ''
      setUsername(username)
    }

    fetchUser()
  }, [])

  const type = params.type
  const context = useContext(DiagramContext)

  useEffect(() => {
    switch (type) {
      case 'whiteboard':
        context.setType('Whiteboard')
        break
      case 'chart':
        context.setType('Chart')
        break
      case 'flow-diagram':
        context.setType('Flow Diagram')
        break
    }
  }, [type])

  if (context.type === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-gray-200 via-pink-500 to-pink-700 p-4 text-5xl sm:py-12">
        Loading... Plese Wait
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-gray-200 via-pink-500 to-pink-700 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          {/** Button to go back and choose a different type of diagram */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="mb-4 flex transform items-center space-x-2 rounded-lg bg-white px-3 py-2 text-indigo-700 shadow-md transition-colors duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-indigo-100 hover:text-indigo-900 hover:shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
              <span>Back</span>
            </Link>
          </div>
          <p className="text-semibold text-xl text-indigo-700">FlowCraft</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-indigo-700 sm:text-4xl">
            Welcome back! 🎉
          </h1>

          <div className="mt-10 grid max-w-xl grid-cols-1 gap-8 text-xl leading-7 text-gray-700 text-white lg:max-w-none lg:grid-cols-2">
            <ChartDescriptionInput type={context.type} />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl">
        <DiagramOrChartView type={context.type} />
      </div>
    </div>
  )
}
