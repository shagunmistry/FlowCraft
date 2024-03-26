'use client'

import { useState } from 'react'

import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { Edge, Node } from 'reactflow'

import { Analytics } from '@vercel/analytics/react'
import { DiagramOrChartType } from '@/lib/utils'
import { exampleChartJsDataForTesla } from '@/lib/chart-js.code'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhiteboardContext } from '@/lib/Contexts/WhiteboardContext'
import { exampleFlowDiagramPrompts } from '@/lib/Examples/ExamplePrompts'
import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import { WhiteboardStarter } from '@/lib/Examples/WhiteboardStarter.whiteboard'

export default function MainLayout({
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
  const [controls, setControls] = useState<any>(null)

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
          edges: edges,
          mermaidData: mermaidData,
          setMermaidData: setMermaidData,
          loading: loading,
          nodes: nodes,
          setChartJsData: setChartJsData,
          setDescription: setDescription,
          setEdges: _setEdges,
          setLoading: _setLoading,
          setNodes: _setNodes,
          setTitle: setTitle,
          setTlDrawRecords: setTlDrawRecords,
          setType: setType,
          title: title,
          tlDrawRecords: tlDrawRecords,
          type: type,
        }}
      >
        <main>
          <Navbar />
          <div className="relative">{children}</div>
        </main>
        <Footer />

        <Analytics />
      </DiagramContext.Provider>
    </WhiteboardContext.Provider>
  )
}
