'use client'

import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { useCallback, useContext, useEffect, useState } from 'react'
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  Edge,
  Node,
  addEdge,
  MiniMap,
} from 'reactflow'

import 'reactflow/dist/style.css'
import Lottie from 'lottie-react'
import LottieAnimation from '@/lib/LoaderAnimation.json'
//@ts-ignore
import { saveAsPng } from 'save-html-as-image'
import Link from 'next/link'

const initialNodes: Node[] = [
  {
    id: '1',
    data: {
      label: 'Start',
    },
    position: {
      x: 100,
      y: 100,
    },
    type: 'input',
  },
  {
    id: '2',
    data: {
      label: 'Fold the Paper in Half',
    },
    position: {
      x: 300,
      y: 100,
    },
  },
  {
    id: '3',
    data: {
      label: 'Unfold the Paper',
    },
    position: {
      x: 300,
      y: 200,
    },
  },
  {
    id: '4',
    data: {
      label: 'Fold the Top Corners to the Center',
    },
    position: {
      x: 500,
      y: 100,
    },
  },
  {
    id: '5',
    data: {
      label: 'Fold the Top Edges to the Center',
    },
    position: {
      x: 500,
      y: 200,
    },
  },
  {
    id: '6',
    data: {
      label: 'Fold the Plane in Half',
    },
    position: {
      x: 700,
      y: 100,
    },
  },
  {
    id: '7',
    data: {
      label: 'Fold the Wings Down',
    },
    position: {
      x: 900,
      y: 100,
    },
  },
  {
    id: '8',
    data: {
      label: 'Finish',
    },
    position: {
      x: 1100,
      y: 100,
    },
    type: 'output',
  },
]

const initialEdges = [
  {
    id: '1-2',
    source: '1',
    target: '2',
  },
  {
    id: '2-3',
    source: '2',
    target: '3',
  },
  {
    id: '3-4',
    source: '3',
    target: '4',
  },
  {
    id: '3-5',
    source: '3',
    target: '5',
  },
  {
    id: '4-6',
    source: '4',
    target: '6',
  },
  {
    id: '5-6',
    source: '5',
    target: '6',
  },
  {
    id: '6-7',
    source: '6',
    target: '7',
  },
  {
    id: '7-8',
    source: '7',
    target: '8',
  },
]

export default function ChartView() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const context = useContext(DiagramContext)

  useEffect(() => {
    if (!context.nodes || !context.edges) return
    if (context.nodes.length === 0 || context.edges.length === 0) return

    console.log('context.nodes', context.nodes)
    console.log('context.edges', context.edges)

    setNodes(context.nodes)
    setEdges(context.edges)
  }, [context.nodes, context.edges])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => {
        console.log('New Edges: ', edges)
        return applyEdgeChanges(changes, eds)
      }),
    [],
  )

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [],
  )

  const downloadPng = () => {
    // fit the graph to the screen
    const fitView = document.querySelector(
      '.react-flow__controls-fitview',
    ) as HTMLElement
    if (fitView) {
      fitView.click()
    }

    const graph = document.querySelector('.react-flow__renderer')

    if (!graph) return

    saveAsPng(graph, {
      fileName: 'diagram',
      scale: 2,
      backgroundColor: '#fff',
      width: 2000,
      height: 2000,
    })
  }

  const showHowToUse = () => {
    // Take them to the how to use page
  }

  return (
    <>
      <div className="ml-5 mr-5 mt-7 flex items-center justify-between">
        <h1 className="text-black-900 text-2xl font-bold leading-7 sm:truncate sm:text-3xl">
          {context.title}
        </h1>
        {/* <Link
          className="rounded-lg bg-green-500 px-4 py-2 font-bold text-white hover:bg-pink-700"
          href={'/howto'}
        >
          How to use
        </Link> */}
      </div>

      <div className="ml-5 mt-14 h-screen w-11/12 rounded-xl bg-pink-50 shadow-lg">
        {context.loading ? (
          <>
            <div className="text-md flex items-center justify-center text-center text-pink-500">
              Please be patient while we generate your diagram, it may take a
              couple minutes.
            </div>
            <Lottie animationData={LottieAnimation} loop={true} />
          </>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView={true}
          >
            <Controls />
            <Background color="#aaa" gap={16} />
            <MiniMap />
          </ReactFlow>
        )}
        <div className="mt-4 flex justify-center">
          {!context.loading ? (
            <button
              className="ml-5 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
              onClick={downloadPng}
              disabled={context.loading}
            >
              Download as PNG
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
