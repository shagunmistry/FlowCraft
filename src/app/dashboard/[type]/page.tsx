'use client'

import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { redirect } from 'next/navigation'
import { track } from '@vercel/analytics'
import { useContext, useEffect, useState } from 'react'
import DiagramInputsForm from '@/components/DiagramInputsForm'
import DiagramOrChartView from '@/components/DiagramOrChartView'
import PageLoader from '@/components/PageLoader'
import FeedbackDialog from '@/components/FeedbackDialog'

const allowedTypes = ['whiteboard', 'chart', 'flow-diagram', 'mermaid']

export default function DynamicDiagramPage({
  params,
}: {
  params: { type: 'whiteboard' | 'chart' | 'flow-diagram' | 'mermaid' }
}) {
  if (!allowedTypes.includes(params.type) || !params.type) {
    return redirect('/dashboard')
  }

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    track(`dashboard/${params.type}`)
  }, [params.type])

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

  useEffect(() => {
    // Check if the user is subscribed
    // If not, redirect to the pricing page
    const checkSubscription = async () => {
      setLoading(true)
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      setLoading(false)
      if (data && data.user.subscribed === false) {
        window.location.href = `/pricing?sourcePage=${type}`
      }
    }

    checkSubscription()
  }, [])

  if (loading) {
    return <PageLoader />
  }

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
          <DiagramInputsForm type={context.type} />
        </div>
      </div>
      <div className="mx-auto max-w-7xl">
        <DiagramOrChartView type={context.type} />
      </div>
    </div>
  )
}
