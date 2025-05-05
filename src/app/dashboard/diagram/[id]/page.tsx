'use client'

import { useContext, useEffect, useState } from 'react'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { useRouter } from 'next/navigation' // ✅ Use App Router version
import PageLoader from '@/components/PageLoader'
import dynamic from 'next/dynamic'

const DiagramOrChartView = dynamic(() => import('@/components/DiagramOrChartView'), {
  ssr: false,
})

export default function DiagramPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const diagramContext = useContext(DiagramContext)
  const router = useRouter() // ✅ App Router hook

  useEffect(() => {
    const fetchDiagram = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/get-diagrams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: params.id }),
        })

        const { diagram } = await response.json()

        if (!diagram || diagram.length === 0) {
          setLoading(false)
          router.push('/dashboard') // ✅ Still works with App Router's useRouter
          return
        }

        const diagramInfoFromApi = diagram[0]

        diagramContext.setTitle(diagramInfoFromApi.title)
        diagramContext.setDescription(diagramInfoFromApi.description)
        diagramContext.setType(diagramInfoFromApi.type)
        diagramContext.setDiagramId(params.id)

        if (diagramInfoFromApi.type === 'infographic') {
          setSvgContent(diagramInfoFromApi.data)
        } else if (diagramInfoFromApi.type === 'Flow Diagram') {
          let parsedData = diagramInfoFromApi.data
          if (typeof parsedData === 'string') {
            parsedData = JSON.parse(parsedData)
            if (typeof parsedData === 'string') {
              parsedData = JSON.parse(parsedData)
            }
          }

          const nodes = parsedData.nodes
          const edges = parsedData.edges

          diagramContext.setEdges(edges)
          diagramContext.setNodes(nodes)
        } else if (
          diagramInfoFromApi.type !== 'Chart' &&
          diagramInfoFromApi.type !== 'Whiteboard'
        ) {
          if (diagramInfoFromApi.data.substring(0, 3) === '```') {
            const cleanedCode = diagramInfoFromApi.data
              .replace(/```/g, '')
              .replace(/```/g, '')
            diagramContext.setMermaidData(cleanedCode)
          } else {
            let parsedData = JSON.parse(diagramInfoFromApi.data)
            parsedData =
              typeof parsedData === 'string' ? JSON.parse(parsedData) : parsedData
            diagramContext.setMermaidData(parsedData.mermaid)
          }
        } else if (diagramInfoFromApi.type === 'Chart') {
          let parsedData = JSON.parse(diagramInfoFromApi.data)
          parsedData =
            typeof parsedData === 'string' ? JSON.parse(parsedData) : parsedData
          diagramContext.setChartJsData(parsedData)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching diagram:', error)
        setLoading(false)
        router.push('/dashboard')
      }
    }

    fetchDiagram()
  }, [params.id, diagramContext, router])

  if (loading) {
    return <PageLoader />
  }

  if (svgContent) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{ width: '100%', height: 'auto' }}
      />
    )
  }

  if (!!diagramContext.title && !!diagramContext.type) {
    return (
      <div>
        <DiagramOrChartView type={diagramContext.type} />
      </div>
    )
  }

  return null
}
