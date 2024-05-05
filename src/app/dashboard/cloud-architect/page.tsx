'use client'

import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { track } from '@vercel/analytics'
import { useContext, useEffect, useState } from 'react'
import DiagramInputsForm from '@/components/DiagramInputsForm'
import PageLoader from '@/components/PageLoader'

export default function DynamicDiagramPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    track(`dashboard/cloud-architect`, {
      type: 'page-view',
    })

    context.setType('Cloud Architect')
  }, [])

  const context = useContext(DiagramContext)

  useEffect(() => {
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
        window.location.href = `/pricing?sourcePage=dashboard`
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
      <div className="mx-auto max-w-7xl"></div>
    </div>
  )
}
