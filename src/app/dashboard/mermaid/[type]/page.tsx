'use client'
import DiagramOrChartView from '@/components/DiagramOrChartView'
import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import Link from 'next/link'
import { ArrowLeftCircleIcon } from '@heroicons/react/20/solid'
import DiagramInputsForm from '@/components/DiagramInputsForm'
import { useEffect, useState } from 'react'
import PageLoader from '@/components/PageLoader'

export default function DynamicMermaidDiagramPage({
  params,
}: {
  params: { type: TempMermaidDiagramType }
}) {
  const { type } = params

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if the user is subscribed
    // If not, redirect to the pricing page
    const checkSubscription = async () => {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      setLoading(false)
      if (data && data.user.subscribed === false) {
        window.location.href = '/pricing?sourcePage=mermaid'
      }
    }

    checkSubscription()
  }, [])

  if (loading) return <PageLoader />

  return (
    <div className="bg-gray-100 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Link
          className="transform rounded-xl bg-blue-500 px-4 py-2 font-bold text-white transition-colors duration-300 ease-in-out hover:-translate-y-1 hover:bg-blue-700"
          href={`/dashboard/mermaid`}
        >
          <ArrowLeftCircleIcon className="inline-block h-6 w-6" />
        </Link>
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <DiagramInputsForm type={type} />
        </div>
      </div>
      <div className="mx-auto max-w-7xl">
        <DiagramOrChartView type={type} />
      </div>
    </div>
  )
}
