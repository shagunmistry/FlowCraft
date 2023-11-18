'use client'

import {
  DiagramContext,
  TypeEdge,
  TypeNode,
} from '@/lib/Contexts/DiagramContext'
import { useContext, useEffect, useState } from 'react'
import ReactFlow, { Controls, Background } from 'reactflow'

import 'reactflow/dist/style.css'

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
]
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

export default function ChartView() {
  const [nodes, setNodes] = useState<TypeNode[]>(initialNodes)
  const [edges, setEdges] = useState<TypeEdge[]>(initialEdges)
  const [loading, setLoading] = useState<boolean>(false)

  const context = useContext(DiagramContext)

  useEffect(() => {
    if (!context.nodes || !context.edges) return
    setNodes(context.nodes)
    setEdges(context.edges)
  }, [context.nodes, context.edges])

  useEffect(() => {
    if (!context.loading) {
      setLoading(false)
    }

    if (context.loading) {
      setLoading(true)
    }
  }, [context.loading])

  if (loading) {
    return (
      <div className="mt-14 h-96 w-full rounded-lg bg-pink-50 shadow-lg">
        <div className="flex h-full items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-pink-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-14 h-96 w-full rounded-lg bg-pink-50 shadow-lg">
      <ReactFlow nodes={nodes} edges={edges}>
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  )
}
