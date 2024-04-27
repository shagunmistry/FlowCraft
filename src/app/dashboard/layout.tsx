'use client'

import 'reactflow/dist/style.css'

import DashboardNavbar from '@/components/Dashboard/Navbar.dashboard'
import { Footer } from '@/components/Footer'
import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { WhiteboardContext } from '@/lib/Contexts/WhiteboardContext'
import { exampleFlowDiagramPrompts } from '@/lib/Examples/ExamplePrompts'
import { DiagramOrChartType } from '@/lib/utils'
import { useState } from 'react'
import { Edge, Node } from 'reactflow'

export default function DashboardLayout({
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

  const [chartJsData, setChartJsData] = useState<any>()
  const [controls, setControls] = useState<any>(null)
  const [diagramId, setDiagramId] = useState<string>('')
  const [edges, _setEdges] = useState<Edge[]>([])
  const [loading, _setLoading] = useState<boolean>(false)
  const [mermaidData, setMermaidData] = useState<string>('')
  const [nodes, _setNodes] = useState<Node[]>([])
  const [tlDrawRecords, setTlDrawRecords] = useState<any>([])
  const [whiteboardEditorRef, setWhiteboardEditorRef] = useState<any>(null)
  const [whiteboardInput, setWhiteboardInput] = useState<string>('')
  const [whiteBoardLoading, setWhiteBoardLoading] = useState<boolean>(false)

  return (
    <>
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
          }}
        >
          <main>
            <DashboardNavbar />
            <div className="relative">{children}</div>
            <Footer />
          </main>
        </DiagramContext.Provider>
      </WhiteboardContext.Provider>
    </>
  )
}
