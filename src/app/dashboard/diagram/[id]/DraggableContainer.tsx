'use client'

import { useContext, useEffect, useState, useRef } from 'react'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { useRouter } from 'next/navigation' // ✅ Use App Router version
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
  const router = useRouter() // ✅ App Router hook
  const [imageUrl, setImageUrl] = useState('')
  const [svgCode, setSvgCode] = useState('')
  const [mermaidCode, setMermaidCode] = useState('')
  const mermaidContainerRef = useRef<HTMLDivElement>(null)

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


        if (diagramInfoFromApi.type === 'illustration') {
          const imageUrl = diagramInfoFromApi.image_url as string
          setImageUrl(imageUrl)
          setSvgCode('')
          setMermaidCode('')
          console.log('image Code: ')
        } else if (diagramInfoFromApi.type === 'infographic') {
          let sanitizedSvgCode = sanitizeSVG(diagramInfoFromApi.data)
          console.log('svg Code: ', diagramInfoFromApi.data)
          debugger
          // Set the states with the generated content
          setSvgCode(sanitizedSvgCode.svgContent)
          setMermaidCode('')
          setImageUrl(imageUrl)
        } else {
          // it must be a Mermaid Diagram
          console.log('Mermaid Code: ', diagramInfoFromApi.data)
          let sanitizedMermaidCode = sanitizeMermaid(diagramInfoFromApi.data)
          debugger
  
          console.log('Sanitized Mermaid Code: ', sanitizedMermaidCode)
  
          setMermaidCode(sanitizedMermaidCode)
          setSvgCode('')
          setImageUrl('')
        }



        // if (diagramInfoFromApi.type === 'infographic') {
        //   setSvgContent(diagramInfoFromApi.data)
        // } else if (diagramInfoFromApi.type === 'Flow Diagram') {
        //   let parsedData = diagramInfoFromApi.data
        //   if (typeof parsedData === 'string') {
        //     parsedData = JSON.parse(parsedData)
        //     if (typeof parsedData === 'string') {
        //       parsedData = JSON.parse(parsedData)
        //     }
        //   }

        //   const nodes = parsedData.nodes
        //   const edges = parsedData.edges

        //   diagramContext.setEdges(edges)
        //   diagramContext.setNodes(nodes)
        // } else if (
        //   diagramInfoFromApi.type !== 'Chart' &&
        //   diagramInfoFromApi.type !== 'Whiteboard'
        // ) {
        //   if (diagramInfoFromApi.data.substring(0, 3) === '```') {
        //     const cleanedCode = diagramInfoFromApi.data
        //       .replace(/```/g, '')
        //       .replace(/```/g, '')
        //     diagramContext.setMermaidData(cleanedCode)
        //   } else {
        //     let parsedData = JSON.parse(diagramInfoFromApi.data)
        //     parsedData =
        //       typeof parsedData === 'string' ? JSON.parse(parsedData) : parsedData
        //     diagramContext.setMermaidData(parsedData.mermaid)
        //   }
        // } else if (diagramInfoFromApi.type === 'Chart') {
        //   let parsedData = JSON.parse(diagramInfoFromApi.data)
        //   parsedData =
        //     typeof parsedData === 'string' ? JSON.parse(parsedData) : parsedData
        //   diagramContext.setChartJsData(parsedData)
        // }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching diagram:', error)
        setLoading(false)
        router.push('/dashboard')
      }
    }

    fetchDiagram()
  }, [params.id, diagramContext, router])

  // region Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    })
  }, [])

  // Render mermaid diagram when code changes
  useEffect(() => {
    if (mermaidCode && mermaidContainerRef.current) {
      try {
        mermaidContainerRef.current.innerHTML = ''
        mermaid
          .render('mermaid-diagram', mermaidCode)
          .then(({ svg }) => {
            if (mermaidContainerRef.current) {
              mermaidContainerRef.current.innerHTML = svg
            }
          })
          .catch((error) => {
            console.error('Mermaid rendering error:', error)
            // setError('There was an error rendering the mermaid diagram.')
          })
      } catch (error) {
        console.error('Mermaid error:', error)
        // setError('There was an error processing the mermaid diagram.')
      }
    }
  }, [mermaidCode])

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
      <div
        ref={mermaidContainerRef}
        style={{ width: '100%', height: 'auto' }}
      />
    )
  } else if (imageUrl) {
    return (
      <div className="max-w-full h-auto mx-auto">
        <img src={imageUrl} alt="Diagram" style={{ maxWidth: '100%' }} />
      </div>
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
