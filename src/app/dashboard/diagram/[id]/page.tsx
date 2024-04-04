'use client'

import { DiagramData } from '@/lib/DiagramType.db'
import { useContext, useEffect, useState } from 'react'

import { motion } from 'framer-motion'
import DiagramOrChartView from '@/components/DiagramOrChartView'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { useRouter } from 'next/router'

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

      console.log('---> data', diagram)
      diagramContext.setTitle(diagramInfoFromApi.title)
      diagramContext.setDescription(diagramInfoFromApi.description)
      diagramContext.setEdges(diagramInfoFromApi.data.edges)
      diagramContext.setNodes(diagramInfoFromApi.data.nodes)
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

      setLoading(false)
    }

    fetchDiagram()
  }, [])

  if (loading) {
    // return loading animation for the whole page
    return (
      <div className="flex h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-gray-200"
            style={{ borderTopColor: '#3498db' }}
          ></motion.div>
        </motion.div>
      </div>
    )
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
