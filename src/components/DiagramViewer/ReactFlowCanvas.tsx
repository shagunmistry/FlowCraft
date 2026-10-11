'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  Node,
  Edge,
  NodeChange,
  addEdge,
  updateEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import {
  defaultEdgeOptions,
  defaultViewport,
  edgeTypes,
  nodeTypes,
} from '@/lib/react-flow.util'
import { nodeStyle } from '@/lib/react-flow.code'
import ConnectionLineComponent from '@/components/ReactFlow/ConnectionLineComponent'
import EditorToolbar from '@/components/ReactFlow/EditorToolbar'
import { useUndoRedo } from '@/hooks/useUndoRedo'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useIsMobile } from '@/hooks/useIsMobile'
import { getLayoutedElements } from '@/lib/dagre-layout'
import { exportAsPng, exportAsSvg, exportAsPdf } from '@/lib/export-utils'
import 'reactflow/dist/style.css'

interface ReactFlowCanvasProps {
  nodes: Node[]
  edges: Edge[]
  editable?: boolean
  diagramId?: string
  title?: string
}

export default function ReactFlowCanvas({
  nodes: initialNodes,
  edges: initialEdges,
  editable = false,
  diagramId,
  title,
}: ReactFlowCanvasProps) {
  const isMobile = useIsMobile()
  const isEditable = editable && !isMobile

  if (!isEditable) {
    return (
      <ReadOnlyFlow nodes={initialNodes} edges={initialEdges} />
    )
  }

  return (
    <EditableFlow
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      diagramId={diagramId}
      title={title}
    />
  )
}

function ReadOnlyFlow({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      defaultViewport={defaultViewport}
      nodesConnectable={false}
      nodesDraggable={false}
      fitView
      zoomOnScroll
      panOnScroll={false}
      attributionPosition="bottom-right"
    >
      <Controls
        position="bottom-left"
        className="!rounded-lg !border-rule !bg-graphite/90 !shadow-lg !shadow-black/5 !backdrop-blur-xl"
      />
      <Background
        color="#d1d5db"
        gap={20}
        variant={BackgroundVariant.Dots}
        size={1}
      />
    </ReactFlow>
  )
}

function styleNodes(nodes: Node[]): Node[] {
  return nodes.map((node) => ({
    ...node,
    ...nodeStyle,
    type: node.type || 'customNode',
    data: {
      ...node.data,
      readOnly: false,
    },
  }))
}

function styleEdges(edges: Edge[]): Edge[] {
  return edges.map((edge) => ({
    ...edge,
    type: edge.type || 'floating',
    data: { ...(edge.data || {}), label: edge.label || edge.data?.label || '' },
  }))
}

function EditableFlow({
  initialNodes,
  initialEdges,
  diagramId,
  title,
}: {
  initialNodes: Node[]
  initialEdges: Edge[]
  diagramId?: string
  title?: string
}) {
  const initialStyledNodes = useMemo(() => styleNodes(initialNodes), [initialNodes])
  const initialStyledEdges = useMemo(() => styleEdges(initialEdges), [initialEdges])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialStyledNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialStyledEdges)
  const [gridEnabled, setGridEnabled] = useState(true)

  const { takeSnapshot, undo, redo, canUndo, canRedo } = useUndoRedo()
  const { status: saveStatus } = useAutoSave(diagramId || '', nodes, edges, !!diagramId)

  const isDraggingRef = useRef(false)

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      for (const change of changes) {
        if (change.type === 'position' && change.dragging && !isDraggingRef.current) {
          isDraggingRef.current = true
          takeSnapshot(nodes, edges)
        }
        if (change.type === 'position' && !change.dragging && isDraggingRef.current) {
          isDraggingRef.current = false
        }
        if (change.type === 'remove') {
          takeSnapshot(nodes, edges)
        }
      }
      onNodesChange(changes)
    },
    [nodes, edges, onNodesChange, takeSnapshot],
  )

  const handleEdgesChange = useCallback(
    (changes: any[]) => {
      for (const change of changes) {
        if (change.type === 'remove') {
          takeSnapshot(nodes, edges)
        }
      }
      onEdgesChange(changes)
    },
    [nodes, edges, onEdgesChange, takeSnapshot],
  )

  const onConnect = useCallback(
    (params: any) => {
      takeSnapshot(nodes, edges)
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'floating',
            markerEnd: { type: MarkerType.Arrow },
          },
          eds,
        ),
      )
    },
    [setEdges, nodes, edges, takeSnapshot],
  )

  const onEdgeUpdate = useCallback(
    (oldEdge: any, newConnection: any) => {
      takeSnapshot(nodes, edges)
      setEdges((els) => updateEdge(oldEdge, newConnection, els))
    },
    [nodes, edges, takeSnapshot, setEdges],
  )

  const handleAddNode = useCallback(() => {
    takeSnapshot(nodes, edges)
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'customNode',
      position: {
        x: 250 + Math.random() * 200,
        y: 250 + Math.random() * 200,
      },
      data: { label: 'New Node', autoEdit: true },
      ...nodeStyle,
    }
    setNodes((nds) => [...nds, newNode])
  }, [nodes, edges, takeSnapshot, setNodes])

  const handleAutoLayout = useCallback(() => {
    takeSnapshot(nodes, edges)
    const { nodes: laidOutNodes, edges: laidOutEdges } = getLayoutedElements(
      nodes,
      edges,
    )
    setNodes(laidOutNodes)
    setEdges(laidOutEdges)
    setTimeout(() => {
      const fitBtn = document.querySelector(
        '.react-flow__controls-fitview',
      ) as HTMLElement | null
      fitBtn?.click()
    }, 50)
  }, [nodes, edges, takeSnapshot, setNodes, setEdges])

  const handleUndo = useCallback(() => {
    const snapshot = undo(nodes, edges)
    if (snapshot) {
      setNodes(snapshot.nodes)
      setEdges(snapshot.edges)
    }
  }, [nodes, edges, undo, setNodes, setEdges])

  const handleRedo = useCallback(() => {
    const snapshot = redo(nodes, edges)
    if (snapshot) {
      setNodes(snapshot.nodes)
      setEdges(snapshot.edges)
    }
  }, [nodes, edges, redo, setNodes, setEdges])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) handleRedo()
        else handleUndo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleUndo, handleRedo])

  const getViewport = () =>
    document.querySelector('.react-flow__viewport') as HTMLElement | null

  const fileBase = (title || 'diagram').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'diagram'

  const handleExportPng = useCallback(() => {
    const el = getViewport()
    if (el) exportAsPng(el, `${fileBase}.png`)
  }, [fileBase])

  const handleExportSvg = useCallback(() => {
    const el = getViewport()
    if (el) exportAsSvg(el, `${fileBase}.svg`)
  }, [fileBase])

  const handleExportPdf = useCallback(() => {
    const el = getViewport()
    if (el) exportAsPdf(el, `${fileBase}.pdf`)
  }, [fileBase])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      onConnect={onConnect}
      onEdgeUpdate={onEdgeUpdate}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      connectionLineComponent={ConnectionLineComponent}
      defaultEdgeOptions={defaultEdgeOptions}
      defaultViewport={defaultViewport}
      snapGrid={[25, 25]}
      snapToGrid
      nodesDraggable
      nodesConnectable
      elementsSelectable
      fitView
      attributionPosition="bottom-right"
    >
      <Controls
        position="bottom-left"
        className="!rounded-lg !border-rule !bg-graphite/90 !shadow-lg !shadow-black/5 !backdrop-blur-xl"
      />
      {gridEnabled && (
        <Background
          color="#d1d5db"
          gap={20}
          variant={BackgroundVariant.Dots}
          size={1}
        />
      )}
      <EditorToolbar
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onAddNode={handleAddNode}
        onAutoLayout={handleAutoLayout}
        gridEnabled={gridEnabled}
        onToggleGrid={() => setGridEnabled((v) => !v)}
        onExportPng={handleExportPng}
        onExportSvg={handleExportSvg}
        onExportPdf={handleExportPdf}
        saveStatus={saveStatus}
      />
    </ReactFlow>
  )
}
