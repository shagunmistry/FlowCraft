import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import { createContext } from 'react'
import { Edge, Node } from 'reactflow'
import { DiagramOrChartType } from '../utils'

export const SharedDiagramContext = createContext<{
  chartJsData: any
  description: string
  edges: Edge[]
  nodes: Node[]
  setChartJsData: (data: any) => void
  setDescription: (description: string) => void
  setEdges: (edges: Edge[]) => void
  setNodes: (nodes: Node[]) => void
  setTitle: (title: string) => void
  setType: (type: DiagramOrChartType | TempMermaidDiagramType) => void
  title: string
  type: DiagramOrChartType | TempMermaidDiagramType
}>({
  chartJsData: {},
  description: '',
  edges: [],
  nodes: [],
  setChartJsData: () => {},
  setDescription: () => {},
  setEdges: () => {},
  setNodes: () => {},
  setTitle: () => {},
  setType: () => {},
  title: '',
  type: 'Flow Diagram',
})
