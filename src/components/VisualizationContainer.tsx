'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  ConnectionMode,
} from 'reactflow'
import { ArrowDownIcon, ShareIcon } from 'lucide-react'
import MermaidViewer from './MermaidChartViewer'
import { DiagramOrChartType } from '@/lib/utils'
import { TempMermaidDiagramType } from './Mermaid/OverviewDialog.mermaid'

const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.2 },
  },
}

const Loader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex h-full items-center justify-center"
  >
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
  </motion.div>
)

const ActionButton = ({
  onClick,
  disabled,
  icon: Icon,
  label,
}: {
  onClick: () => void
  disabled: boolean
  icon: any
  label: string
}) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative m-1 inline-flex items-center rounded-lg bg-gray-50 p-2 text-gray-900 shadow-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
    title={label}
  >
    <Icon className="h-5 w-5" />
  </motion.button>
)

const FlowDiagram = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onEdgeUpdate,
  defaultEdgeOptions,
  defaultViewport,
  nodeTypes,
  edgeTypes,
  ConnectionLineComponent,
  toggleReactFlowGird,
}: {
  nodes: any[]
  edges: any[]
  onNodesChange: (nodes: any[]) => void
  onEdgesChange: (edges: any[]) => void
  onConnect: (params: any) => void
  onEdgeUpdate: (oldEdge: any, newConnection: any) => void
  defaultEdgeOptions: any
  defaultViewport: any
  nodeTypes: any
  edgeTypes: any
  ConnectionLineComponent: any
  toggleReactFlowGird: boolean
}) => (
  <ReactFlow
    attributionPosition="bottom-left"
    className="react-flow__container"
    connectionLineComponent={ConnectionLineComponent}
    connectionMode={ConnectionMode.Loose}
    defaultEdgeOptions={defaultEdgeOptions}
    defaultViewport={defaultViewport}
    edges={edges}
    edgeTypes={edgeTypes}
    fitView
    nodes={nodes}
    nodeTypes={nodeTypes}
    onConnect={onConnect}
    onEdgesChange={onEdgesChange}
    onEdgeUpdate={onEdgeUpdate}
    onNodesChange={onNodesChange}
    snapGrid={[25, 25]}
    snapToGrid={true}
  >
    <Controls />
    {toggleReactFlowGird && (
      <Background color="#808080" gap={40} variant={BackgroundVariant.Cross} />
    )}
  </ReactFlow>
)

const ChartView = ({
  context,
  donwloadChart,
  createShareableLink,
}: {
  context: any
  donwloadChart: () => void
  createShareableLink: () => void
}) => (
  <div className="flex h-full flex-col space-y-4 p-6">
    <div className="flex items-center justify-end space-x-2">
      <ActionButton
        onClick={donwloadChart}
        disabled={
          context.loading || (context.chartJsData && !context.chartJsData.type)
        }
        icon={ArrowDownIcon}
        label="Download Chart"
      />
      <ActionButton
        onClick={createShareableLink}
        disabled={
          context.loading || (context.chartJsData && !context.chartJsData.type)
        }
        icon={ShareIcon}
        label="Share Chart"
      />
    </div>
    <div className="flex-1">
      <canvas
        id="myChart"
        className="mx-auto h-full w-full rounded-lg object-contain"
      />
    </div>
  </div>
)

const VisualizationContainer = ({
  type,
  context,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onEdgeUpdate,
  defaultEdgeOptions,
  defaultViewport,
  nodeTypes,
  edgeTypes,
  ConnectionLineComponent,
  toggleReactFlowGird,
  tlDrawInputJson,
  donwloadChart,
  createShareableLink,
  mermaidSVG,
  isMermaidError,
  downloadMermaidDiagramAsPng,
  copyMermaidDiagramAsPng,
  editMermaidDiagramCode,
  checkIfMermaidDiagram,
  Whiteboard,
}: {
  type: DiagramOrChartType | TempMermaidDiagramType | null
  context: any
  nodes: any[]
  edges: any[]
  onNodesChange: (nodes: any[]) => void
  onEdgesChange: (edges: any[]) => void
  onConnect: (params: any) => void
  onEdgeUpdate: (oldEdge: any, newConnection: any) => void
  defaultEdgeOptions: any
  defaultViewport: any
  nodeTypes: any
  edgeTypes: any
  ConnectionLineComponent: any
  toggleReactFlowGird: boolean
  tlDrawInputJson: any
  donwloadChart: () => void
  createShareableLink: () => void
  mermaidSVG: string | null
  isMermaidError: boolean
  downloadMermaidDiagramAsPng: any
  copyMermaidDiagramAsPng: () => void
  editMermaidDiagramCode: () => void
  checkIfMermaidDiagram: (
    type: DiagramOrChartType | TempMermaidDiagramType | null,
  ) => boolean
  Whiteboard: any
}) => {
  const renderContent = () => {
    if (context.loading) {
      return <Loader />
    }

    console.log('Context...', context);

    if (context.type === 'Flow Diagram') {
      return (
        <FlowDiagram
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeUpdate={onEdgeUpdate}
          defaultEdgeOptions={defaultEdgeOptions}
          defaultViewport={defaultViewport}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          ConnectionLineComponent={ConnectionLineComponent}
          toggleReactFlowGird={toggleReactFlowGird}
        />
      )
    }

    if (type === 'Whiteboard') {
      return <Whiteboard inputJson={tlDrawInputJson} />
    }

    if (type === 'Chart') {
      return (
        <ChartView
          context={context}
          donwloadChart={donwloadChart}
          createShareableLink={createShareableLink}
        />
      )
    }

    // if (checkIfMermaidDiagram(type)) {
    //   return (
    //     <MermaidViewer
    //       title={context.title}
    //       mermaidSVG={mermaidSVG}
    //       isMermaidError={isMermaidError}
    //       isLoading={context.loading}
    //       onDownload={downloadMermaidDiagramAsPng}
    //       onCopy={copyMermaidDiagramAsPng}
    //       onShare={createShareableLink}
    //       onEdit={editMermaidDiagramCode}
    //     />
    //   )
    // }

    return null
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={type}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="mx-auto h-screen w-11/12 overflow-hidden rounded-2xl bg-white shadow-lg"
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  )
}

export default VisualizationContainer
