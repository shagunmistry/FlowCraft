import { createContext } from 'react'
import { Edge, Node } from 'reactflow'
import { DiagramOrChartType } from '../utils'

export const DiagramContext = createContext<{
  chartJsData: any
  description: string
  edges: Edge[]
  loading: boolean
  nodes: Node[]
  setChartJsData: (chartJsData: any) => void
  setDescription: (description: string) => void
  setEdges: (edges: Edge[]) => void
  setLoading: (loading: boolean) => void
  setNodes: (nodes: Node[]) => void
  setTitle: (title: string) => void
  setTlDrawRecords: (tlDrawRecords: any[]) => void
  setType: (type: DiagramOrChartType) => void
  title: string
  tlDrawRecords: any[]
  type: DiagramOrChartType
}>({
  chartJsData: {},
  description: '',
  edges: [],
  loading: false,
  nodes: [],
  setChartJsData: () => {},
  setDescription: () => {},
  setEdges: () => {},
  setLoading: () => {},
  setNodes: () => {},
  setTitle: () => {},
  setTlDrawRecords: () => {},
  setType: () => {},
  title: '',
  tlDrawRecords: [],
  type: 'TLDraw' as DiagramOrChartType,
})
