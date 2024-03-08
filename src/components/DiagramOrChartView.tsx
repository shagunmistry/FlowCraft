'use client'

import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import {
  use,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
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
  BackgroundVariant,
  EdgeTypes,
  Edge,
  MarkerType,
} from 'reactflow'

import 'reactflow/dist/style.css'
import Lottie from 'lottie-react'
import LottieAnimation from '@/lib/LoaderAnimation.json'
//@ts-ignore
import DownloadFlowDiagramButton from './DownloadImageButton'

import Chart from 'chart.js/auto'
import CustomInputBoxNode from './ReactFlow/CustomInputBoxNode'
import { initialEdges, initialNodes } from '@/lib/react-flow.code'
import EditDiagramButton from './ReactFlow/EditDiagramButton'
import CustomEdge from './ReactFlow/CustomEdge'
import SuccessDialog from './SuccessDialog'
import { nodeStyle } from '@/lib/react-flow.code'
import Whiteboard from './Whiteboard/Whiteboard'
import { scenarios } from '@/components/Whiteboard/scenarios'
import { CompletionCommandsAssistant } from './Whiteboard/CompletionCommandsAssistant'
import { DiagramOrChartType } from '@/lib/utils'
import { autoArrangeNodesAndEdges } from '@/lib/react-flow.util'
import SimpleFloatingEdge from './ReactFlow/SimpleFloatingEdge'
import ReactFlowHelperButton from './ReactFlow/ReactFlowHelperButton'
import DiagramSettingsBar from './ReactFlow/DiagramSettingsBar'

const defaultEdgeOptions = {
  animated: true,
  type: ConnectionLineType.Step,
}

const nodeTypes = {
  customNode: CustomInputBoxNode,
}

const edgeTypes: EdgeTypes = {
  // custom: CustomEdge,
  floating: SimpleFloatingEdge,
}

const defaultViewport = { x: 0, y: 0, zoom: 1.5 }

const Loader = () => {
  return (
    <>
      <div className="text-md flex items-center justify-center text-center text-pink-500">
        Please be patient while we generate your diagram, it may take a couple
        minutes.
      </div>
      <Lottie animationData={LottieAnimation} loop={true} />
    </>
  )
}

export default function DiagramOrChartView({
  type,
}: {
  type: DiagramOrChartType
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const assistant = useMemo(() => new CompletionCommandsAssistant(), [])

  const [tlDrawInputJson, setTlDrawInputJson] = useState<string>(
    JSON.stringify(scenarios.house_buying_process),
  )

  const [chartCreated, setChartCreated] = useState<boolean>(false)

  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false)

  const context = useContext(DiagramContext)

  useEffect(() => {
    console.log('context.type: ', context.type)
    if (context.type === 'Flow Diagram') {
      console.log('we are in the Flow Diagram context!')
      if (!context.nodes && !context.edges) return
      if (context.nodes.length === 0 || context.edges.length === 0) return

      const edgesWithMarkerAndStyle = context.edges.map((edge: Edge) => {
        console.log('Individual edge: ', edge)
        return {
          ...edge,
          type: 'floating',
          data: {
            label: edge.label ? edge.label : '',
          },
        }
      })

      const nodesWithStyle = context.nodes.map((node: Node) => {
        return {
          ...node,
          ...nodeStyle,
          type: 'customNode',
        }
      })

      // const { nodes: arrangedNodes, edges: arrangedEdges } =
      //   autoArrangeNodesAndEdges(nodesWithStyle, edgesWithMarkerAndStyle)
      // console.log('arrangedNodes', arrangedNodes)

      setNodes(nodesWithStyle)
      setEdges(edgesWithMarkerAndStyle as Edge[])

      const fitButton = document.getElementsByClassName(
        '.react-flow__controls-fitview',
      )[0] as HTMLButtonElement
      if (fitButton) {
        fitButton.click()
      }

      console.log('Setting success dialog open to true', nodesWithStyle.length)
      setSuccessDialogOpen(true && !context.loading)
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
    } else if (context.type === 'Whiteboard') {
      console.log('context.tlDrawRecords: ', context.tlDrawRecords)
      if (!context.tlDrawRecords || context.tlDrawRecords.length === 0) {
        return
      }

      const recordsWithNecessaryFields = context.tlDrawRecords.map(
        (record: any) => {
          return {
            ...record,
            parentId: 'page:page',
            isLocked: false,
            meta: {},
            opacity: 1,
            props: {
              ...record.props,
              [record.type === 'geo' ? 'url' : 'font']:
                record.type === 'geo' ? '' : 'draw',
              [record.type === 'geo' ? 'growY' : 'dash']:
                record.type === 'geo' ? 0 : 'draw',
            },
          }
        },
      )

      scenarios.house_buying_process.records = recordsWithNecessaryFields
      setTlDrawInputJson(JSON.stringify(scenarios.house_buying_process))
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
      console.log('Connecting: ', params)
      setEdges((eds) => {
        context.setEdges(
          eds.map((edge) => {
            if (
              edge.source === params.source &&
              edge.target === params.target
            ) {
              return {
                ...edge,
                data: {
                  ...edge.data,
                  label: params.label,
                },
              }
            }
            return edge
          }),
        )
        return addEdge(
          {
            ...params,
            type: 'floating',
            markerEnd: { type: MarkerType.Arrow },
          },
          eds,
        )
      })
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

  const updateEdgeLabel = useCallback(
    (id: string, newValue: string) => {
      setEdges((es) => {
        const edgeIndex = es.findIndex((e) => e.id === id)
        const edge = es[edgeIndex]
        const newEdge = {
          ...edge,
          data: {
            ...edge.data,
            label: newValue,
          },
        }
        es[edgeIndex] = newEdge
        return es
      })
    },
    [edges],
  )

  const donwloadChart = () => {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement
    const image = canvas.toDataURL('image/png', 1.0)
    const link = document.createElement('a')
    link.download = 'chart.png'
    link.href = image
    link.click()
  }

  if (type === 'Chart') {
    if (context.loading) {
      return <Loader />
    }
    return (
      <div className="ml-auto mr-auto mt-14 w-5/6 rounded-xl bg-white p-5 shadow-lg">
        {/** A button to download the chart */}
        <button
          className="rounded-md bg-indigo-700 p-2 text-white"
          onClick={donwloadChart}
        >
          Download Chart
        </button>
        <canvas id="myChart"></canvas>
      </div>
    )
  }

  return (
    <>
      <div className="mt-4">
        <DiagramSettingsBar />
      </div>

      <div className="ml-auto mr-auto h-screen w-11/12 rounded-xl bg-gray-100 shadow-lg">
        {context.loading ? (
          <Loader />
        ) : (
          <>
            {context.type === 'Flow Diagram' && (
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
                  className="react-flow__container"
                >
                  <Controls />
                  <Background
                    color="#808080"
                    gap={40}
                    variant={BackgroundVariant.Lines}
                  />

                  <DownloadFlowDiagramButton />
                  <EditDiagramButton
                    nodes={nodes}
                    edges={edges}
                    deleteNode={deleteNode}
                    addNode={addNode}
                    updateNodeLabel={updateNodeLabel}
                    updateEdgeLabel={updateEdgeLabel}
                  />
                  <ReactFlowHelperButton />
                </ReactFlow>
              </>
            )}
            {type === 'Whiteboard' && (
              <Whiteboard inputJson={tlDrawInputJson} />
            )}
          </>
        )}
      </div>
      <SuccessDialog
        buttonText="View Diagram"
        header="Success!"
        message={`Yayy! Your ${type} has been generated! ${
          type === 'Flow Diagram'
            ? 'Scroll down and try clicking on the labels to move them around!'
            : ''
        }'`}
        open={successDialogOpen}
        setOpen={setSuccessDialogOpen}
      />
    </>
  )
}
