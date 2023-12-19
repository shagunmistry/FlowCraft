'use client'

import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { createRef, useCallback, useContext, useEffect, useState } from 'react'
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
  BackgroundVariant,
  EdgeTypes,
  useReactFlow,
} from 'reactflow'

import 'reactflow/dist/style.css'
import Lottie from 'lottie-react'
import LottieAnimation from '@/lib/LoaderAnimation.json'
//@ts-ignore
import { ArrowDownIcon } from '@heroicons/react/20/solid'
import DownloadButton from './DownloadImageButton'

import Chart from 'chart.js/auto'
import CustomInputBoxNode from './ReactFlow/CustomInputBoxNode'
import EditDiagramButton from './EditDiagramButton'
// import CustomEdge from './ReactFlow/CustomEdge'

const defaultEdgeOptions = {
  animated: true,
  type: ConnectionLineType.SimpleBezier,
}

const nodeTypes = {
  customNode: CustomInputBoxNode,
}

// const edgeTypes: EdgeTypes = {
//   custom: CustomEdge,
// }

const nodeStyle = {
  style: {
    background: '#FFD1DC',
    color: '#00000',
    border: '1px solid #FF69B4',
    width: 180,
    borderRadius: 10,
    fontSize: 20,
  },
}

const defaultViewport = { x: 0, y: 0, zoom: 1.5 }

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
    ...nodeStyle,
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
    ...nodeStyle,
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
    ...nodeStyle,
  },
  {
    id: '4',
    data: {
      label: 'Fold the Top Corners to the Center',
    },
    position: {
      x: 500,
      y: 50,
    },
    ...nodeStyle,
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
    ...nodeStyle,
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
    ...nodeStyle,
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
    ...nodeStyle,
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
    ...nodeStyle,
  },
]

const initialEdges = [
  {
    id: '1-2',
    source: '1',
    markerEnd: { type: MarkerType.ArrowClosed },
    target: '2',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
    // type: 'custom',
  },
  {
    id: '2-3',
    source: '2',
    markerEnd: { type: MarkerType.ArrowClosed },
    target: '3',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
    // type: 'custom',
  },
  {
    id: '3-4',
    source: '3',
    markerEnd: { type: MarkerType.ArrowClosed },
    target: '4',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
    // type: 'custom',
  },
  {
    id: '3-5',
    source: '3',
    markerEnd: { type: MarkerType.ArrowClosed },
    target: '5',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
    // type: 'custom',
  },
  {
    id: '4-6',
    source: '4',
    markerEnd: { type: MarkerType.ArrowClosed },
    target: '6',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
    // type: 'custom',
  },
  {
    id: '5-6',
    source: '5',
    markerEnd: { type: MarkerType.ArrowClosed },
    target: '6',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
    // type: 'custom',
  },
  {
    id: '6-7',
    source: '6',
    markerEnd: { type: MarkerType.ArrowClosed },
    target: '7',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
    // type: 'custom',
  },
  {
    id: '7-8',
    source: '7',
    markerEnd: { type: MarkerType.ArrowClosed },
    target: '8',
    style: {
      stroke: '#FF69B4',
      strokeWidth: 2,
    },
    // type: 'custom',
  },
]

export default function DiagramOrChartView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const [chartCreated, setChartCreated] = useState<boolean>(false)

  const context = useContext(DiagramContext)

  useEffect(() => {
    if (context.type === 'Flow Diagram') {
      console.log('we are in the flow diagram')
      console.log('Edges: ', context.edges)
      console.log('Nodes: ', context.nodes)
      if (!context.nodes && !context.edges) return
      if (context.nodes.length === 0 || context.edges.length === 0) return

      console.log('context.nodes --> ', context.nodes)
      console.log('context.edges -->', context.edges)

      const edgesWithMarkerAndStyle = context.edges.map((edge) => {
        return {
          ...edge,
          // // type: 'custom',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: {
            stroke: '#FF69B4',
            strokeWidth: 2,
          },
        }
      })

      const nodesWithStyle = context.nodes.map((node) => {
        return {
          ...node,
          style: {
            background: '#FFD1DC',
            color: '#00000',
            border: '1px solid #FF69B4',
            width: 180,
            borderRadius: 10,
            fontSize: 20,
          },
        }
      })

      setNodes(nodesWithStyle)
      setEdges(edgesWithMarkerAndStyle)

      const fitButton = document.getElementsByClassName(
        '.react-flow__controls-fitview',
      )[0] as HTMLButtonElement
      if (fitButton) {
        fitButton.click()
      }
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
        <div className="-mt-96 animate-bounce font-bold text-white">
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
                  // edgeTypes={edgeTypes}
                >
                  <Controls />
                  <Background
                    color="#808080"
                    gap={40}
                    variant={BackgroundVariant.Lines}
                  />
                  <MiniMap />

                  <DownloadButton />
                  <EditDiagramButton
                    nodes={nodes}
                    edges={edges}
                    setNodes={setNodes}
                    deleteNode={deleteNode}
                    onNodesChange={onNodesChange}
                    addNode={addNode}
                    updateNodeLabel={updateNodeLabel}
                  />
                </ReactFlow>
              </>
            ) : (
              <div className="flex items-center justify-center">
                <canvas id="myChart" className="h-max"></canvas>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
