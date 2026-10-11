'use client'

import { track } from '@/lib/analytics'
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import {
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
  MarkerType,
  Edge,
  Node,
  NodeChange,
} from 'reactflow'
import mermaid from 'mermaid'
import 'reactflow/dist/style.css'
import Chart from 'chart.js/auto'
import { toPng } from 'html-to-image'
import clsx from 'clsx'

// Icons
import {
  ShareIcon,
  Square2StackIcon,
  TableCellsIcon,
  CommandLineIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

// Internal Components
import SuccessDialog from './SuccessDialog'
import { nodeStyle } from '@/lib/react-flow.code'
import { DiagramOrChartType } from '@/lib/utils'
import ShareableLinksModal from './ShareableLinkModal'
import SimpleNotification from './SimpleNotification'
import {
  defaultEdgeOptions,
  defaultViewport,
  edgeTypes,
  nodeTypes,
} from '@/lib/react-flow.util'
import { TempMermaidDiagramType } from './Mermaid/OverviewDialog.mermaid'
import StarRatingInput from './StarRatingInput'
import ConnectionLineComponent from './ReactFlow/ConnectionLineComponent'
import CodeEditorDialog from './Mermaid/CodeEditorDialog.mermaid'
import VisualizationContainer from './VisualizationContainer'

// Editor features
import { useUndoRedo } from '@/hooks/useUndoRedo'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useIsMobile } from '@/hooks/useIsMobile'
import { getLayoutedElements } from '@/lib/dagre-layout'
import { exportAsPng, exportAsSvg, exportAsPdf } from '@/lib/export-utils'

// --- Utility: Apple Design System Primitives ---
const Button = ({
  children,
  onClick,
  variant = 'secondary',
  className,
  icon: Icon,
}: any) => {
  const baseStyle =
    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-50'
  const variants = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm',
    secondary:
      'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 shadow-sm',
    ghost: 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100',
  }

  return (
    <button
      onClick={onClick}
      className={clsx(
        baseStyle,
        variants[variant as keyof typeof variants],
        className,
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  )
}

const LoadingState = () => (
  <div className="flex h-96 w-full animate-pulse flex-col items-center justify-center space-y-4">
    <div className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-800" />
    <p className="text-sm font-medium text-zinc-400">
      Generating visualization...
    </p>
  </div>
)

// --- Logic Helpers ---
const checkIfMermaidDiagram = (type: string | null) => {
  const mermaidTypes = [
    'classDiagram',
    'flowchart',
    'sequenceDiagram',
    'stateDiagram',
    'entityRelationshipDiagram',
    'userJourney',
    'gantt',
    'pieChart',
    'quadrantChart',
    'requirementDiagram',
    'gitgraph',
    'mindmaps',
    'sankey',
    'timeline',
    'zenuml',
  ]
  return mermaidTypes.includes(type || '')
}

// --- Main Component ---
export default function DiagramOrChartView({
  type,
}: {
  type: DiagramOrChartType | TempMermaidDiagramType
}) {
  const context = useContext(DiagramContext)

  // State
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [toggleReactFlowGrid, setToggleReactFlowGrid] = useState<boolean>(true)
  const [mermaidSVG, setMermaidSVG] = useState<string | null>('')
  const [openShareableLinkModal, setOpenShareableLinkModal] =
    useState<boolean>(false)
  const [shareableLink, setShareableLink] = useState({
    link: '',
    inviteCode: '',
  })
  const [tlDrawInputJson, setTlDrawInputJson] = useState<string>('')
  const [chartCreated, setChartCreated] = useState<boolean>(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false)
  const [openMermaidEditor, setOpenMermaidEditor] = useState<boolean>(false)
  const [isMermaidError, setIsMermaidError] = useState<boolean>(false)
  const [openNotification, setOpenNotification] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    title: string
    type: 'success' | 'error'
  }>({
    message: '',
    title: '',
    type: 'success',
  })
  const [copied, setCopied] = useState<boolean>(false)

  // Editor hooks
  const { takeSnapshot, undo, redo, canUndo, canRedo } = useUndoRedo()
  const isMobile = useIsMobile()
  const { status: saveStatus } = useAutoSave(
    context.diagramId,
    nodes,
    edges,
    context.type === 'Flow Diagram' && !isMobile,
  )

  // Track drag state to snapshot only on drag start
  const isDraggingRef = useRef(false)

  // Wrap onNodesChange to capture undo snapshots on drag start and deletions
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

  // Wrap onEdgesChange to capture undo snapshots on deletions
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

  // --- Optimization: Memoize JSON-LD for SEO ---
  const jsonLd = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'VisualArtwork',
      name: context.title || 'Generated Diagram',
      description:
        context.description || `A ${type} generated by Deep Change Labs`,
      artMedium: 'Digital',
      creator: {
        '@type': 'Organization',
        name: 'Deep Change Labs',
      },
    }
  }, [context.title, context.description, type])

  // --- Logic: Layout & Initialization ---

  // Handlers for ReactFlow
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

  // Add node handler
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

  // Auto-layout handler
  const handleAutoLayout = useCallback(() => {
    takeSnapshot(nodes, edges)
    const { nodes: layoutedNodes, edges: layoutedEdges } =
      getLayoutedElements(nodes, edges)
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
    // Trigger fitView after layout
    setTimeout(() => {
      const fitBtn = document.querySelector(
        '.react-flow__controls-fitview',
      ) as HTMLElement
      if (fitBtn) fitBtn.click()
    }, 50)
  }, [nodes, edges, takeSnapshot, setNodes, setEdges])

  // Undo/Redo handlers
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

  // Export handlers
  const getFlowViewportElement = () =>
    document.querySelector('.react-flow__viewport') as HTMLElement | null

  const handleExportPng = useCallback(() => {
    const el = getFlowViewportElement()
    if (el) exportAsPng(el, `${context.title || 'diagram'}.png`)
  }, [context.title])

  const handleExportSvg = useCallback(() => {
    const el = getFlowViewportElement()
    if (el) exportAsSvg(el, `${context.title || 'diagram'}.svg`)
  }, [context.title])

  const handleExportPdf = useCallback(() => {
    const el = getFlowViewportElement()
    if (el) exportAsPdf(el, `${context.title || 'diagram'}.pdf`)
  }, [context.title])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          handleRedo()
        } else {
          handleUndo()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleUndo, handleRedo])

  // Consolidate Initialization Logic
  useEffect(() => {
    if (!context.type) return

    const handleFlowDiagram = () => {
      if (!context.nodes?.length || !context.edges?.length) return

      const styledEdges = context.edges.map((edge: Edge) => ({
        ...edge,
        type: 'floating',
        data: { label: edge.label || '' },
      }))

      const styledNodes = context.nodes.map((node: Node) => ({
        ...node,
        ...nodeStyle,
        type: 'customNode',
      }))

      setNodes(styledNodes)
      setEdges(styledEdges as Edge[])

      // Auto-fit view after a short delay to ensure DOM is ready
      setTimeout(() => {
        const fitBtn = document.querySelector(
          '.react-flow__controls-fitview',
        ) as HTMLElement
        if (fitBtn) fitBtn.click()
      }, 100)

      setSuccessDialogOpen(!context.loading)
    }

    const handleChart = () => {
      if (!context.chartJsData) return
      const ctx = document.getElementById('myChart') as HTMLCanvasElement
      if (chartCreated && ctx) Chart.getChart(ctx)?.destroy()

      if (ctx) {
        new Chart(ctx, {
          type: context.chartJsData.type || 'bar',
          ...context.chartJsData,
        })
        setChartCreated(true)
      }
    }

    const handleMermaid = () => {
      if (context.mermaidData && !context.loading) {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose',
        })
        renderMermaidDiagramFromCode(context.mermaidData)
      }
    }

    switch (context.type) {
      case 'Flow Diagram':
        handleFlowDiagram()
        break
      case 'Chart':
        handleChart()
        break
      default:
        if (checkIfMermaidDiagram(context.type)) handleMermaid()
    }
  }, [
    context.type,
    context.nodes,
    context.edges,
    context.loading,
    context.chartJsData,
    context.mermaidData,
  ])

  // --- Logic: Operations (Download, Copy, Share) ---

  const renderMermaidDiagramFromCode = async (code: string) => {
    try {
      setMermaidSVG(null)
      const { svg } = await mermaid.render('mermaid', code)
      setMermaidSVG(svg)
      setIsMermaidError(false)
    } catch (err) {
      console.error('Mermaid Render Error', err)
      setIsMermaidError(true)
    }
  }

  const handleCreateShareLink = async () => {
    const payload = {
      type: context.type,
      diagramData:
        context.type === 'Flow Diagram'
          ? { nodes, edges }
          : context.type === 'Chart'
            ? context.chartJsData
            : context.mermaidData,
      title: context.title,
      description: context.description,
      diagramId: context.diagramId,
    }

    try {
      const res = await fetch('/api/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.result) {
        track('share_created', { surface: 'editor' })
        setShareableLink({
          link: data.result.link,
          inviteCode: data.result.inviteCode,
        })
        setOpenShareableLinkModal(true)
      } else {
        throw new Error('No result')
      }
    } catch (e) {
      setNotification({
        message: 'Failed to create link',
        title: 'Error',
        type: 'error',
      })
      setOpenNotification(true)
    }
  }

  // Generic Copy Image Function
  const handleCopyImage = async () => {
    try {
      let dataUrl = ''
      if (context.type === 'Flow Diagram') {
        const el = document.querySelector(
          '.react-flow__viewport',
        ) as HTMLElement
        dataUrl = await toPng(el, {
          backgroundColor: '#ffffff',
          width: 1024,
          height: 768,
        })
      } else if (checkIfMermaidDiagram(context.type)) {
        const el = document.querySelector('.mermaid') as HTMLElement
        dataUrl = await toPng(el, { backgroundColor: '#ffffff' })
      } else if (context.type === 'Chart') {
        const canvas = document.getElementById('myChart') as HTMLCanvasElement
        dataUrl = canvas.toDataURL('image/png', 1.0)
      }

      if (dataUrl) {
        const blob = await fetch(dataUrl).then((r) => r.blob())
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        setNotification({
          message: 'Copied to clipboard',
          title: 'Success',
          type: 'success',
        })
        setOpenNotification(true)
      }
    } catch (e) {
      console.error('Copy failed', e)
      setNotification({
        message: 'Failed to copy image',
        title: 'Error',
        type: 'error',
      })
      setOpenNotification(true)
    }
  }

  // Toolbar props for Flow Diagram editor
  const toolbarProps = useMemo(
    () => ({
      canUndo,
      canRedo,
      onUndo: handleUndo,
      onRedo: handleRedo,
      onAddNode: handleAddNode,
      onAutoLayout: handleAutoLayout,
      gridEnabled: toggleReactFlowGrid,
      onToggleGrid: () => setToggleReactFlowGrid((v) => !v),
      onExportPng: handleExportPng,
      onExportSvg: handleExportSvg,
      onExportPdf: handleExportPdf,
      saveStatus: saveStatus,
    }),
    [
      canUndo,
      canRedo,
      handleUndo,
      handleRedo,
      handleAddNode,
      handleAutoLayout,
      toggleReactFlowGrid,
      handleExportPng,
      handleExportSvg,
      handleExportPdf,
      saveStatus,
    ],
  )

  return (
    <article className="flex h-full min-h-[80vh] w-full flex-col bg-zinc-50/50">
      {/* SEO Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SimpleNotification
        {...notification}
        open={openNotification}
        setOpen={setOpenNotification}
      />

      {/* --- Apple Style Toolbar --- */}
      <header className="sticky top-0 z-20 mb-4 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur-md">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
            {context.title || 'Untitled Diagram'}
          </h1>
          <p className="text-xs capitalize text-zinc-500">
            {type.replace(/([A-Z])/g, ' $1').trim()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Contextual Actions */}
          <div className="mr-1 flex items-center gap-2 border-r border-zinc-200 pr-3">
            <StarRatingInput type={type} />
            {checkIfMermaidDiagram(type) && (
              <Button
                onClick={() => setOpenMermaidEditor(true)}
                variant="ghost"
                icon={CommandLineIcon}
              >
                Code
              </Button>
            )}
          </div>

          {/* Primary Actions */}
          <Button
            onClick={handleCopyImage}
            variant="secondary"
            icon={copied ? CheckCircleIcon : Square2StackIcon}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            onClick={handleCreateShareLink}
            variant="primary"
            icon={ShareIcon}
          >
            Share
          </Button>
        </div>
      </header>

      {/* --- Main Canvas Area --- */}
      <main className="relative flex-1 overflow-hidden px-6 pb-6">
        <figure className="group relative h-full w-full overflow-scroll rounded-2xl border border-zinc-200 bg-white shadow-sm">
          {/* Accessbility Label */}
          <figcaption className="sr-only">
            Interactive diagram showing {context.title}. Generated by AI.
          </figcaption>

          {context.loading ? (
            <LoadingState />
          ) : (
            <VisualizationContainer
              type={type}
              context={context}
              nodes={nodes}
              edges={edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
              onConnect={onConnect}
              onEdgeUpdate={onEdgeUpdate}
              defaultEdgeOptions={defaultEdgeOptions}
              defaultViewport={defaultViewport}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              ConnectionLineComponent={ConnectionLineComponent}
              toggleReactFlowGird={toggleReactFlowGrid}
              tlDrawInputJson={tlDrawInputJson}
              donwloadChart={() => {}}
              createShareableLink={handleCreateShareLink}
              mermaidSVG={mermaidSVG}
              isMermaidError={isMermaidError}
              downloadMermaidDiagramAsPng={() => {}}
              copyMermaidDiagramAsPng={handleCopyImage}
              editMermaidDiagramCode={() => setOpenMermaidEditor(true)}
              checkIfMermaidDiagram={checkIfMermaidDiagram}
              Whiteboard={null}
              isMobile={isMobile}
              toolbarProps={context.type === 'Flow Diagram' ? toolbarProps : undefined}
            />
          )}

          {isMermaidError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm">
              <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
                <ExclamationTriangleIcon className="mx-auto mb-2 h-10 w-10 text-red-500" />
                <p className="font-medium text-red-700">Render Error</p>
                <p className="mt-1 text-sm text-red-500">
                  Please check the code editor.
                </p>
              </div>
            </div>
          )}
        </figure>
      </main>

      {/* --- Modals & Dialogs --- */}
      <SuccessDialog
        buttonText="Dismiss"
        header="Ready"
        message="Your diagram has been successfully generated."
        open={successDialogOpen}
        setOpen={setSuccessDialogOpen}
      />
      <CodeEditorDialog
        open={openMermaidEditor}
        setOpen={setOpenMermaidEditor}
        code={context.mermaidData}
      />
      <ShareableLinksModal
        isOpen={openShareableLinkModal}
        onClose={() => setOpenShareableLinkModal(false)}
        shareableLink={shareableLink?.link}
        inviteCode={shareableLink?.inviteCode}
      />
    </article>
  )
}
