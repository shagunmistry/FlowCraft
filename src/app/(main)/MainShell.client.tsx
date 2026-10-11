'use client'

import { useEffect, useState } from 'react'

import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { Edge, Node } from 'reactflow'

import { Analytics } from '@vercel/analytics/react'
import { DiagramOrChartType } from '@/lib/utils'
import { exampleChartJsDataForTesla } from '@/lib/chart-js.code'

import NextTopLoader from 'nextjs-toploader'
import { WhiteboardContext } from '@/lib/Contexts/WhiteboardContext'
import { exampleFlowDiagramPrompts } from '@/lib/Examples/ExamplePrompts'
import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import { WhiteboardStarter } from '@/lib/Examples/WhiteboardStarter.whiteboard'

export default function MainShell({
  children,
}: {
  children: React.ReactNode
}) {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>(
    exampleFlowDiagramPrompts[2].description,
  )

  const [type, setType] = useState<DiagramOrChartType | TempMermaidDiagramType>(
    'Whiteboard',
  )
  const [nodes, _setNodes] = useState<Node[]>([])
  const [edges, _setEdges] = useState<Edge[]>([])

  const [tlDrawRecords, setTlDrawRecords] = useState<any>([
    ...WhiteboardStarter,
  ])

  const [loading, _setLoading] = useState<boolean>(false)
  const [chartJsData, setChartJsData] = useState<any>(
    exampleChartJsDataForTesla,
  )

  const [whiteboardInput, setWhiteboardInput] = useState<string>('')
  const [whiteboardEditorRef, setWhiteboardEditorRef] = useState<any>(null)
  const [whiteBoardLoading, setWhiteBoardLoading] = useState<boolean>(false)
  const [mermaidData, setMermaidData] = useState<string>('')
  const [diagramId, setDiagramId] = useState<string>('')
  const [controls, setControls] = useState<any>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('flowcraft.toolDemoSeed')
      if (!raw) return
      const seed = JSON.parse(raw) as {
        prompt?: string
        type?: string
        ts?: number
      }
      sessionStorage.removeItem('flowcraft.toolDemoSeed')
      const fresh = typeof seed.ts === 'number' && Date.now() - seed.ts < 30 * 60 * 1000
      if (!fresh) return
      if (seed.prompt) setDescription(seed.prompt)
      if (seed.type) {
        setType(seed.type as DiagramOrChartType | TempMermaidDiagramType)
      }
    } catch {
      // sessionStorage unavailable or malformed — ignore
    }
  }, [])

  return (
    <WhiteboardContext.Provider
      value={{
        input: whiteboardInput,
        setInput: setWhiteboardInput,
        editorRef: whiteboardEditorRef,
        setEditorRef: setWhiteboardEditorRef,
        controls: controls,
        setControls: setControls,
        loading: whiteBoardLoading,
        setLoading: setWhiteBoardLoading,
      }}
    >
      <DiagramContext.Provider
        value={{
          chartJsData: chartJsData,
          description: description,
          diagramId: diagramId,
          edges: edges,
          loading: loading,
          mermaidData: mermaidData,
          nodes: nodes,
          setChartJsData: setChartJsData,
          setDescription: setDescription,
          setDiagramId: setDiagramId,
          setEdges: _setEdges,
          setLoading: _setLoading,
          setMermaidData: setMermaidData,
          setNodes: _setNodes,
          setTitle: setTitle,
          setTlDrawRecords: setTlDrawRecords,
          setType: setType,
          title: title,
          tlDrawRecords: tlDrawRecords,
          type: type,

          feedbackModalOpen: false,
          setFeedbackModalOpen: () => {},
        }}
      >
        <main>
          <NextTopLoader
            color="#2442E6"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #000000,0 0 5px #000000"
          />
          <div className="relative">{children}</div>
        </main>
        <Analytics />
      </DiagramContext.Provider>
    </WhiteboardContext.Provider>
  )
}
