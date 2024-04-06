'use client'

import { DiagramData } from '@/lib/DiagramType.db'
import { useContext, useEffect, useState } from 'react'

import { motion } from 'framer-motion'
import DiagramOrChartView from '@/components/DiagramOrChartView'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { useRouter } from 'next/router'
import PageLoader from '@/components/PageLoader'

export default function DiagramPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)

  const diagramContext = useContext(DiagramContext)

  useEffect(() => {
    const fetchDiagram = async () => {
      setLoading(true)
      const diagramData = await fetch(`/api/get-diagrams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: params.id }),
      })

      const { diagram } = await diagramData.json()

      if (!diagram || diagram.length === 0) {
        setLoading(false)
        window.location.href = '/dashboard'
        return
      }

      const diagramInfoFromApi = diagram[0] as DiagramData

      console.log('----- Diagram Info From API -----')
      console.log(diagramInfoFromApi)
      diagramContext.setTitle(diagramInfoFromApi.title)
      diagramContext.setDescription(diagramInfoFromApi.description)
      diagramContext.setNodes(diagramInfoFromApi.data.nodes)
      diagramContext.setEdges(diagramInfoFromApi.data.edges)
      diagramContext.setType(diagramInfoFromApi.type)

      if (
        typeof diagramInfoFromApi.data === 'string' &&
        diagramInfoFromApi.type === 'Flow Diagram'
      ) {
        let parsedData = JSON.parse(diagramInfoFromApi.data)
        if (typeof parsedData === 'string') {
          parsedData = JSON.parse(parsedData)
        }
        const nodes = parsedData.nodes
        const edges = parsedData.edges

        diagramContext.setEdges(edges)
        diagramContext.setNodes(nodes)
      }

      console.log('Setting Diagram ID:', params.id)
      diagramContext.setDiagramId(params.id)
      setLoading(false)
    }

    fetchDiagram()
  }, [])

  if (loading) {
    // return loading animation for the whole page
    return <PageLoader />
  }

  console.log('Type: ', diagramContext.type, diagramContext.title)
  if (!loading && !!diagramContext.title && !!diagramContext.type) {
    console.log('diagramContext', diagramContext)
    return (
      <div className="">
        <DiagramOrChartView type={diagramContext.type} />
      </div>
    )
  }
}
