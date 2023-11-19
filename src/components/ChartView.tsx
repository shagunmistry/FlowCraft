'use client'

import {
  DiagramContext,
} from '@/lib/Contexts/DiagramContext'
import { useCallback, useContext, useEffect, useState } from 'react'
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  getRectOfNodes,
  useReactFlow,
  Panel,
  getTransformForBounds,
  Edge,
  Node
} from 'reactflow'

import 'reactflow/dist/style.css'

import { toPng } from 'html-to-image'

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
  },
]
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

function downloadImage(dataUrl: string) {
  const a = document.createElement('a')

  a.setAttribute('download', 'reactflow.png')
  a.setAttribute('href', dataUrl)
  a.click()
}

const imageWidth = 1024
const imageHeight = 768

export default function ChartView() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
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

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  )

  return (
    <div className="mt-14 h-96 w-full rounded-lg bg-pink-50 shadow-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
      <div className="mt-4 flex justify-center">
        <button
          className="rounded bg-pink-500 px-4 py-2 font-bold text-white hover:bg-pink-700"
          onClick={() => {
            setNodes((nodes) => [
              ...nodes,
              {
                id: (nodes.length + 1).toString(),
                data: { label: (nodes.length + 1).toString() },
                position: { x: 0, y: 0 },
              },
            ])
          }}
        >
          Add Box
        </button>
        <button
          className="ml-4 rounded bg-pink-500 px-4 py-2 font-bold text-white hover:bg-pink-700"
          onClick={() => {
          console.log('nodes', nodes)
          }}
        >
          Download Diagram
        </button>
      </div>
    </div>
  )
}
