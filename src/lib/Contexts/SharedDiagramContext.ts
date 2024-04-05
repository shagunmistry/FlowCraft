import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import { createContext } from 'react'
import { Edge, Node } from 'reactflow'
import { DiagramOrChartType } from '../utils'

export const SharedDiagramContext = createContext<{
  nodes: Node[]
  setNodes: (nodes: Node[]) => void
  edges: Edge[]
  setEdges: (edges: Edge[]) => void
  title: string
  setTitle: (title: string) => void
  description: string
  setDescription: (description: string) => void
  type: DiagramOrChartType | TempMermaidDiagramType
  setType: (type: DiagramOrChartType | TempMermaidDiagramType) => void
}>({
  nodes: [],
  setNodes: () => {},
  edges: [],
  setEdges: () => {},
  title: '',
  setTitle: () => {},
  description: '',
  setDescription: () => {},
  type: 'Flow Diagram',
  setType: () => {},
})
