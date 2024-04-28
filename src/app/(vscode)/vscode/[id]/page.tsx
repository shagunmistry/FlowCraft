'use client'

import mermaid from 'mermaid'
import { useEffect, useState } from 'react'
import PageLoader from '@/components/PageLoader'

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
        window.location.replace(`/error?message=Diagram data is invalid`)
      }

      const { svg } = await mermaid.render('mermaid', mermaid_code)

      if (svg === undefined) {
        console.error('SVG from Mermaid API is undefined')
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
            {diagramdata.title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {diagramdata.difficulty}
          </p>
        </div>
      </div>
      <div
        className="mermaid mx-auto mb-8 w-3/4 rounded-lg p-4"
        dangerouslySetInnerHTML={{ __html: diagramdata.mermaid_code }}
      ></div>
    </div>
  )
}
