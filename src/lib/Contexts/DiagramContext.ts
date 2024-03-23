import { createContext } from 'react'
import { Edge, Node } from 'reactflow'
import { DiagramOrChartType } from '../utils'

export const DiagramContext = createContext<{
  chartJsData: any
  description: string
  edges: Edge[]
  loading: boolean
  mermaidData: string
  nodes: Node[]
  setChartJsData: (chartJsData: any) => void
  setDescription: (description: string) => void
  setEdges: (edges: Edge[]) => void
  setLoading: (loading: boolean) => void
  setMermaidData: (mermaidData: string) => void
  setNodes: (nodes: Node[]) => void
  setTitle: (title: string) => void
  setTlDrawRecords: (tlDrawRecords: any[]) => void
  setType: (type: DiagramOrChartType) => void
  title: string
  tlDrawRecords: any[]
  type: DiagramOrChartType | null
}>({
  chartJsData: {},
  description: '',
  edges: [],
  loading: false,
  mermaidData: '',
  nodes: [],
  setChartJsData: () => {},
  setDescription: () => {},
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
