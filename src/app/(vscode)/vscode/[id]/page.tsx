'use client'

import mermaid from 'mermaid'
import { useEffect, useState } from 'react'
import PageLoader from '@/components/PageLoader'
import { XCircleIcon } from '@heroicons/react/24/outline'

type DiagramData = {
  description: string
  difficulty: string
  id: number
  mermaid_code: string
  title: string
  type: string
}

export default function VSCodeDiagramPage({
  params,
}: {
  params: { id: string }
}) {
  const [diagramdata, setDiagramData] = useState<DiagramData>({
    description: '',
    difficulty: '',
    id: 0,
    mermaid_code: '',
    title: '',
    type: '',
  })
  const [found, setFound] = useState(true)
  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const getDiagram = async () => {
      setLoading(true)
      const API_URL = process.env.NEXT_PUBLIC_FLOWCRAFT_API
      const res = await fetch(`${API_URL}/supabase/diagram/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })

      const data = await res.json()

      console.log('data:', data)

      if (!data || !data.response) {
        console.error('No diagram data found')
        setFound(false)
        setLoading(false)
        return
      }

      const diagramData = data.response as DiagramData

      const mermaid_code = diagramData.mermaid_code.replace(/```/g, '')

      console.log('mermaid_code:', mermaid_code)
      const isValid = await mermaid.parse(mermaid_code).catch((err) => {
        console.error('Error parsing Mermaid code:', err)
        return false
      })

      if (isValid === undefined || !isValid || isValid === null) {
        console.error('Invalid Mermaid code')
        setDiagramData(diagramData)
        setLoading(false)
        setIsError(true)
        return
      }

      const { svg } = await mermaid.render('mermaid', mermaid_code)

      if (svg === undefined) {
        console.error('SVG from Mermaid API is undefined')
        setDiagramData(diagramData)
        setFound(false)
        setLoading(false)
        return
      }

      mermaid.initialize({
        startOnLoad: false,
        theme: 'forest',
      })

      diagramData.mermaid_code = svg

      setDiagramData(diagramData)
      setLoading(false)
    }

    getDiagram()
  }, [])

  if (loading) {
    return <PageLoader />
  }

  if (!found) {
    window.location.replace(`/error?message=Diagram not found`)
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100">
      <div className="px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {diagramdata.title.length > 20
              ? `${diagramdata.title.slice(0, 20)}...`
              : diagramdata.title}
          </h2>
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
            LEVEL: {diagramdata.difficulty.toUpperCase()}
          </span>
        </div>
      </div>

      <button
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-400"
        onClick={() => {
          const svg = diagramdata.mermaid_code
          const blob = new Blob([svg], { type: 'image/svg+xml' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${diagramdata.title}.svg`
          a.click()
        }}
        disabled={isError}
      >
        Download SVG
      </button>
      {isError && (
        <div className="my-12 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                There was an error rendering the diagram
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul role="list" className="list-disc space-y-1 pl-5">
                  <li>Please try again or contact support</li>
                  <li>
                    If you are the owner of this diagram, please try again or
                    contact support to resolve the issue
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isError && (
        <div
          className="mermaid mx-auto mb-8 w-3/4 rounded-lg p-4"
          dangerouslySetInnerHTML={{ __html: diagramdata.mermaid_code }}
        ></div>
      )}
    </div>
  )
}
