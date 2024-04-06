import { createContext } from 'react'
import { Edge, Node } from 'reactflow'
import { DiagramOrChartType } from '../utils'
import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'

export const DiagramContext = createContext<{
  chartJsData: any
  description: string
  diagramId: string
  edges: Edge[]
  loading: boolean
  mermaidData: string
  nodes: Node[]
  setChartJsData: (chartJsData: any) => void
  setDescription: (description: string) => void
  setDiagramId: (diagramId: string) => void
  setEdges: (edges: Edge[]) => void
  setLoading: (loading: boolean) => void
  setMermaidData: (mermaidData: string) => void
  setNodes: (nodes: Node[]) => void
  setTitle: (title: string) => void
  setTlDrawRecords: (tlDrawRecords: any[]) => void
  setType: (type: DiagramOrChartType | TempMermaidDiagramType) => void
  title: string
  tlDrawRecords: any[]
  type: DiagramOrChartType | TempMermaidDiagramType | null
}>({
  chartJsData: {},
  description: '',
  diagramId: '',
  edges: [],
  loading: false,
  mermaidData: '',
  nodes: [],
  setChartJsData: () => {},
  setDescription: () => {},
  setDiagramId: () => {},
  setEdges: () => {},
  setLoading: () => {},
  setMermaidData: () => {},
  setNodes: () => {},
  setTitle: () => {},
  setTlDrawRecords: () => {},
  setType: () => {},
  title: '',
  tlDrawRecords: [],
  type: 'Whiteboard' as DiagramOrChartType,
})
