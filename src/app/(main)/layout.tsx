'use client'

import { Fragment, useState } from 'react'

import { EditorSection } from '@/components/EditorSection'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { Edge, Node } from 'reactflow'

import { Analytics } from '@vercel/analytics/react'
import { exampleFlowDiagramPrompts } from '@/components/TextBox'
import { DiagramOrChartType } from '@/lib/utils'
import { exampleChartJsDataForTesla } from '@/lib/chart-js.code'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [title, setTitle] = useState<string>(exampleFlowDiagramPrompts[2].title)
  const [description, setDescription] = useState<string>(
    exampleFlowDiagramPrompts[2].description,
  )

  const [type, setType] = useState<DiagramOrChartType>('Flow Diagram')
  const [nodes, _setNodes] = useState<Node[]>([])
  const [edges, _setEdges] = useState<Edge[]>([])
  const [loading, _setLoading] = useState<boolean>(false)
  const [chartJsData, setChartJsData] = useState<any>(
    exampleChartJsDataForTesla,
  )

  return (
    <DiagramContext.Provider
      value={{
        chartJsData: chartJsData,
        description: description,
        edges: edges,
        loading: loading,
        nodes: nodes,
        setChartJsData: setChartJsData,
        setDescription: setDescription,
        setEdges: _setEdges,
        setLoading: _setLoading,
        setNodes: _setNodes,
        setTitle: setTitle,
        setType: setType,
        title: title,
        type: type,
      }}
    >
      <main>
        <Navbar />
        <div className="relative">{children}</div>
      </main>
      <Footer />

      <Analytics />
    </DiagramContext.Provider>
  )
}
