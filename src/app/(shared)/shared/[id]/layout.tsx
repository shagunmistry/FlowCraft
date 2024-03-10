'use client'
import { Analytics } from '@vercel/analytics/react'
import Navbar from '@/components/Navbar'

import { Footer } from '@/components/Footer'
import { useState } from 'react'
import { DiagramOrChartType } from '@/lib/utils'
import { Edge, Node } from 'reactflow'
import { exampleFlowDiagramPrompts } from '@/components/DiagramInputsForm'
import { exampleChartJsDataForTesla } from '@/lib/chart-js.code'
import { WhiteboardContext } from '@/lib/Contexts/WhiteboardContext'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { SharedDiagramContext } from '@/lib/Contexts/SharedDiagramContext'

import 'reactflow/dist/style.css'

export default function SharedDiagramsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const [nodes, _setNodes] = useState<Node[]>([])
  const [edges, _setEdges] = useState<Edge[]>([])

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
