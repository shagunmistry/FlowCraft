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
  Edge,
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
import CustomEdge from './ReactFlow/CustomEdge'
import SuccessDialog from './SuccessDialog'
import { nodeStyle } from '@/lib/react-flow.code'

const defaultEdgeOptions = {
  animated: true,
  type: ConnectionLineType.SimpleBezier,
}

const nodeTypes = {
  customNode: CustomInputBoxNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

const defaultViewport = { x: 0, y: 0, zoom: 1.5 }

const initialNodes: Node[] = [
  {
    id: '1',
    data: {
      label: 'Start',
    },
    position: {
      x: 300,
      y: -150,
    },
    type: 'input',
    width: 180,
    height: 52,
    selected: true,
    positionAbsolute: {
      x: 300,
      y: -150,
    },
    dragging: false,
    ...nodeStyle,
  },
  {
    id: '2',
    data: {
      label: 'Fold the Paper in Half',
    },
    position: {
      x: 300,
      y: 0,
    },
    width: 180,
    height: 82,
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
    width: 180,
    height: 52,
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
    width: 180,
    height: 112,
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
    width: 180,
    height: 112,
    ...nodeStyle,
  },
  {
    id: '6',
    data: {
      label: 'Fold the Plane in Half',
    },
    position: {
      x: 850,
      y: 50,
    },
    width: 180,
    height: 82,
    selected: false,
    positionAbsolute: {
      x: 850,
      y: 50,
    },
    dragging: false,
    ...nodeStyle,
  },
  {
    id: '7',
    data: {
      label: 'Fold the Wings Down',
    },
    position: {
      x: 850,
      y: 225,
    },
    width: 180,
    height: 82,
    selected: false,
    positionAbsolute: {
      x: 850,
      y: 225,
    },
    dragging: false,
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
    width: 180,
    height: 52,
    ...nodeStyle,
  },
]

const initialEdges = [
  {
    id: '1-2',
    source: '1',
    target: '2',
    data: {
      label: 'Get some paper',
    },
    type: 'custom',
  },
  {
    id: '2-3',
    source: '2',
    target: '3',
    label: 'Step 2',
    type: 'custom',
    data: {
      label: 'Make sure it is aligned',
    },
  },
  {
    id: '3-4',
    source: '3',
    target: '4',
    type: 'custom',
  },
  {
    id: '3-5',
    source: '3',
    target: '5',
    type: 'custom',
  },
  {
    id: '4-6',
    source: '4',
    target: '6',
    type: 'custom',
  },
  {
    id: '5-6',
    source: '5',
    target: '6',
    type: 'custom',
  },
  {
    id: '6-7',
    source: '6',
    target: '7',
    type: 'custom',
    data: {
      label: 'You are almost done!',
    },
  },
  {
    id: '7-8',
    source: '7',
    target: '8',
    type: 'custom',
  },
]

export default function DiagramOrChartView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const [chartCreated, setChartCreated] = useState<boolean>(false)

  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false)

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

      const edgesWithMarkerAndStyle = context.edges.map((edge: Edge) => {
        console.log('Individual edge: ', edge)
        return {
          ...edge,
          type: 'custom',
          data: {
            label: edge.label ? edge.label : '',
          },
        }
      })

      const nodesWithStyle = context.nodes.map((node: Node) => {
        return {
          ...node,
          ...nodeStyle,
        }
      })

      setNodes(nodesWithStyle)
      setEdges(edgesWithMarkerAndStyle as any)

      const fitButton = document.getElementsByClassName(
        '.react-flow__controls-fitview',
      )[0] as HTMLButtonElement
      if (fitButton) {
        fitButton.click()
      }

      setSuccessDialogOpen(true)
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
                  edgeTypes={edgeTypes}
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
              <div className="flex h-screen items-center justify-center rounded-xl bg-white p-10 shadow-lg">
                <canvas id="myChart" className="h-max"></canvas>
              </div>
            )}
          </>
        )}
      </div>
      <SuccessDialog
        buttonText="View Diagram"
        header="Success!"
        message={`Yayy! Your ${context.type} has been generated!`}
        open={successDialogOpen}
        setOpen={setSuccessDialogOpen}
      />
    </>
  )
}
