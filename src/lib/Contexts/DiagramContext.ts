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
  setType: (type: DiagramOrChartType) => void
  title: string
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
  setType: () => {},
  title: '',
  type: 'Flow Diagram',
})
