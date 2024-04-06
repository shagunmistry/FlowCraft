'use client'
import { Analytics } from '@vercel/analytics/react'
import Navbar from '@/components/Navbar'

import { Footer } from '@/components/Footer'
import { useState } from 'react'
import { Edge, Node } from 'reactflow'

import { SharedDiagramContext } from '@/lib/Contexts/SharedDiagramContext'

import 'reactflow/dist/style.css'
import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import { DiagramOrChartType } from '@/lib/utils'

export default function SharedDiagramsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const [nodes, _setNodes] = useState<Node[]>([])
  const [edges, _setEdges] = useState<Edge[]>([])

  const [chartJsData, setChartJsData] = useState<any>({})

  const [type, setType] = useState<DiagramOrChartType | TempMermaidDiagramType>(
    'Flow Diagram',
  )

  return (
    <>
      <SharedDiagramContext.Provider
        value={{
          title,
          setTitle,
          description,
          setDescription,
          nodes,
          setNodes: (nodes: Node[]) => {
            _setNodes(nodes)
          },
          edges,
          setEdges: (edges: Edge[]) => {
            _setEdges(edges)
          },
          type,
          setType,
          chartJsData,
          setChartJsData,
        }}
      >
        <main>
          <Navbar />
          <div className="relative">{children}</div>
        </main>
        <Footer />
        <Analytics />
      </SharedDiagramContext.Provider>
    </>
  )
}
