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

const allowedTypes = ['whiteboard', 'chart', 'flow-diagram', 'mermaid']

export default function DynamicDiagramPage({
  params,
}: {
  params: { type: 'whiteboard' | 'chart' | 'flow-diagram' | 'mermaid' }
}) {
  if (!allowedTypes.includes(params.type) || !params.type) {
    return redirect('/dashboard')
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
    console.log('Type: ', type)
    switch (type) {
      case 'whiteboard':
        context.setType('Whiteboard')
        break
      case 'chart':
        context.setType('Chart')
        break
      case 'mermaid':
        context.setType('Mermaid')
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
    <div className="bg-gray-100 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <ChartDescriptionInput type={context.type} />
        </div>
      </div>
      <div className="mx-auto max-w-7xl">
        <DiagramOrChartView type={context.type} />
      </div>
    </div>
  )
}
