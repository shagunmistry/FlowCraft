'use client'

import { useContext, useEffect, useState, useRef } from 'react'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { useRouter } from 'next/navigation'
import PageLoader from '@/components/PageLoader'
import dynamic from 'next/dynamic'
import { OptionType, sanitizeMermaid, sanitizeSVG } from '@/lib/utils'
import mermaid from 'mermaid'

const DiagramOrChartView = dynamic(() => import('@/components/DiagramOrChartView'), {
  ssr: false,
})

export default function DiagramPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const diagramContext = useContext(DiagramContext)
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState('')
  const [svgCode, setSvgCode] = useState('')
  const [mermaidCode, setMermaidCode] = useState('')
  const mermaidContainerRef = useRef<HTMLDivElement>(null)
  const [mermaidInitialized, setMermaidInitialized] = useState(false)

  // Initialize Mermaid once
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    })
    setMermaidInitialized(true)
  }, [])

  // Render Mermaid diagram when code changes
  useEffect(() => {
    if (mermaidInitialized && mermaidCode && mermaidContainerRef.current) {
      const container = mermaidContainerRef.current
      container.innerHTML = '' // Clear previous content
      
      try {
        mermaid
          .render('mermaid-diagram', mermaidCode)
          .then(({ svg }) => {
            container.innerHTML = svg
          })
          .catch((error) => {
            console.error('Mermaid rendering error:', error)
            container.innerHTML = `<div class="text-red-500">Error rendering Mermaid diagram</div>`
          })
      } catch (error) {
        console.error('Mermaid error:', error)
        container.innerHTML = `<div class="text-red-500">Error processing Mermaid diagram</div>`
      }
    }
  }, [mermaidCode, mermaidInitialized])

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
        router.push('/dashboard')
        return
      }

      const diagramInfoFromApi = diagram[0]

      diagramContext.setTitle(diagramInfoFromApi.title)
      diagramContext.setDescription(diagramInfoFromApi.description)
      diagramContext.setType(diagramInfoFromApi.type)
      diagramContext.setDiagramId(params.id)

      if (diagramInfoFromApi.type === 'illustration') {
        setImageUrl(diagramInfoFromApi.image_url)
        setSvgCode('')
        setMermaidCode('')
      } else if (diagramInfoFromApi.type === 'infographic') {
        const sanitizedSvgCode = sanitizeSVG(diagramInfoFromApi.data)
        setSvgCode(sanitizedSvgCode.svgContent)
        setMermaidCode('')
        setImageUrl('')
      } else {
        const sanitizedMermaidCode = sanitizeMermaid(diagramInfoFromApi.data)
        setMermaidCode(sanitizedMermaidCode)
        setSvgCode('')
        setImageUrl('')
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching diagram:', error)
      setLoading(false)
      router.push('/dashboard')
    }
  }

  useEffect(() => {
    fetchDiagram()
  }, [params.id])

  if (loading) {
    return <PageLoader />
  }

  if (svgCode) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: svgCode }}
        style={{ width: '100%', height: 'auto' }}
      />
    )
  } else if (mermaidCode) {
    return (
      <div className="w-full h-full p-4">
        <div
          ref={mermaidContainerRef}
          className="mermaid"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    )
  } else if (imageUrl) {
    return (
      <div className="max-w-full h-auto mx-auto">
        <img src={imageUrl} alt="Diagram" style={{ maxWidth: '100%' }} />
      </div>
    )
  }

  if (diagramContext.title && diagramContext.type) {
    return (
      <div>
        <DiagramOrChartView type={diagramContext.type} />
      </div>
    )
  }

  return null
}