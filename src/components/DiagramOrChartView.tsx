'use client'

import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { useCallback, useContext, useEffect, useState } from 'react'
import ReactFlow, {
  Controls,
  Background,
  Node,
  addEdge,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  updateEdge,
  MarkerType,
} from 'reactflow'

import 'reactflow/dist/style.css'
import Lottie from 'lottie-react'
import LottieAnimation from '@/lib/LoaderAnimation.json'
//@ts-ignore
import { ArrowDownIcon } from '@heroicons/react/20/solid'
import DownloadButton from './DownloadImageButton'

import Chart from 'chart.js/auto'
import CustomInputBoxNode from './ReactFlow/CustomInputBoxNode'
import EditableTableForDiagram from './ReactFlow/EditableTableForDiagram'
import Whiteboard from './Whiteboard/Whiteboard'
import { initialNodes } from '@/lib/react-flow.code'
import hey from '@/components/Whiteboard/hey.json'

const defaultEdgeOptions = {
  animated: true,
  type: ConnectionLineType.SimpleBezier,
}

const nodeTypes = {
  customNode: CustomInputBoxNode,
}

const defaultViewport = { x: 0, y: 0, zoom: 1.5 }

const initialEdges = [
  {
    id: '1-2',
    source: '1',
    markerEnd: { type: MarkerType.Arrow },
    target: '2',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
  },
  {
    id: '2-3',
    source: '2',
    markerEnd: { type: MarkerType.Arrow },
    target: '3',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
  },
  {
    id: '3-4',
    source: '3',
    markerEnd: { type: MarkerType.Arrow },
    target: '4',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
  },
  {
    id: '3-5',
    source: '3',
    markerEnd: { type: MarkerType.Arrow },
    target: '5',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
  },
  {
    id: '4-6',
    source: '4',
    markerEnd: { type: MarkerType.Arrow },
    target: '6',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
  },
  {
    id: '5-6',
    source: '5',
    markerEnd: { type: MarkerType.Arrow },
    target: '6',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
  },
  {
    id: '6-7',
    source: '6',
    markerEnd: { type: MarkerType.Arrow },
    target: '7',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
  },
  {
    id: '7-8',
    source: '7',
    markerEnd: { type: MarkerType.Arrow },
    target: '8',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
  },
]

export default function DiagramOrChartView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const [tlDrawInputJson, setTlDrawInputJson] = useState<string>(
    JSON.stringify(hey),
  )

  const [chartCreated, setChartCreated] = useState<boolean>(false)

  const context = useContext(DiagramContext)

  useEffect(() => {
    if (context.type === 'Flow Diagram') {
      console.log('we are in the TLDraw')
      console.log('Edges: ', context.edges)
      console.log('Nodes: ', context.nodes)
      if (!context.nodes && !context.edges) return
      if (context.nodes.length === 0 || context.edges.length === 0) return

      console.log('context.nodes --> ', context.nodes)
      console.log('context.edges -->', context.edges)

      const edgesWithMarkerAndStyle = context.edges.map((edge) => {
        return {
          ...edge,
          markerEnd: { type: MarkerType.Arrow },
          style: {
            stroke: '#FF69B4',
            strokeWidth: 2,
          },
        }
      })

      setNodes(context.nodes)
      setEdges(edgesWithMarkerAndStyle)
    } else if (context.type === 'Chart') {
      console.log('context.chartJsData', context.chartJsData)
      const ctx = document.getElementById('myChart') as HTMLCanvasElement

      // if a chart was already created, destroy it
      if (chartCreated) {
        Chart.getChart(ctx)?.destroy()
      }

      const myChart = new Chart(ctx, {
        type: context.chartJsData.type || 'bar',
        ...context.chartJsData,
      })

      setChartCreated(true)
    } else if (context.type === 'TLDraw') {
      console.log('context.tlDrawRecords: ', context.tlDrawRecords)
      if (!context.tlDrawRecords || context.tlDrawRecords.length === 0) {
        return
      }
      hey.records = context.tlDrawRecords
      setTlDrawInputJson(JSON.stringify(hey))
    }
  }, [
    context.nodes,
    context.edges,
    context.loading,
    context.chartJsData,
    context.type,
  ])

  const onConnect = useCallback(
    (params: any) => {
      console.log('onConnect params', params)
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges],
  )

  const onEdgeUpdate = useCallback(
    (oldEdge: any, newConnection: any) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    [],
  )

  const addNode = useCallback(() => {
    const copyOfSecondNode = nodes[1]
    setNodes((ns) => [
      ...ns,
      {
        ...copyOfSecondNode,
        id: `${ns.length + 1}`,
        data: {
          ...copyOfSecondNode.data,
          label: `Node ${ns.length + 1}`,
        },
        position: {
          x: 100,
          y: 200,
        },
      },
    ])
  }, [nodes])

  const updateNodeLabel = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((ns) => {
        const nodeIndex = ns.findIndex((n) => n.id === nodeId)
        const node = ns[nodeIndex]
        const newNode = {
          ...node,
          data: {
            ...node.data,
            label: newLabel,
          },
        }
        ns[nodeIndex] = newNode
        return ns
      })
    },
    [nodes],
  )

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((ns) => {
        const nodeIndex = ns.findIndex((n) => n.id === nodeId)
        ns.splice(nodeIndex, 1)
        return ns
      })
    },
    [nodes],
  )

  return (
    <>
      <div className="mr-5 mt-7 flex items-center justify-between">
        <h1 className="text-2xl font-bold leading-7 text-indigo-900 sm:truncate sm:text-3xl">
          {context.title}
        </h1>
        <div className="animate-bounce font-bold text-white">
          Scroll Down
          <ArrowDownIcon className="h-10 w-10" />
        </div>
      </div>

      <div className="mt-14 h-screen rounded-xl bg-black shadow-lg">
        {context.loading ? (
          <>
            <div className="text-md flex items-center justify-center text-center text-pink-500">
              Please be patient while we generate your diagram, it may take a
              couple minutes.
            </div>
            <Lottie animationData={LottieAnimation} loop={true} />
          </>
        ) : (
          <>
            {context.type === 'Flow Diagram' ? (
              <>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onEdgeUpdate={onEdgeUpdate}
                  onConnect={onConnect}
                  connectionLineType={ConnectionLineType.SimpleBezier}
                  snapToGrid={true}
                  snapGrid={[25, 25]}
                  defaultViewport={defaultViewport}
                  fitView
                  attributionPosition="bottom-left"
                  defaultEdgeOptions={defaultEdgeOptions}
                  nodeTypes={nodeTypes}
                  onClick={() => {
                    console.log('Nodes: ', nodes)
                    console.log('Edges: ', edges)
                  }}
                >
                  <Controls />
                  {/* <Background color="#000000" gap={16} /> */}
                  <MiniMap />
                  <DownloadButton />
                </ReactFlow>
              </>
            ) : context.type === 'Chart' ? (
              <div className="flex items-center justify-center">
                <canvas id="myChart" className="h-max"></canvas>
              </div>
            ) : context.type === 'TLDraw' ? (
              <Whiteboard inputJson={tlDrawInputJson} />
            ) : (
              'Please select an option'
            )}
          </>
        )}
      </div>
      {context.type === 'TLDraw' && !context.loading ? (
        <>
          <EditableTableForDiagram
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            deleteNode={deleteNode}
            onNodesChange={onNodesChange}
            addNode={addNode}
            updateNodeLabel={updateNodeLabel}
          />
        </>
      ) : null}
    </>
  )
}
