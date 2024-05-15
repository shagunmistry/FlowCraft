import { Edge, Node } from 'reactflow'
import { DiagramOrChartType } from './utils'
import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'

export interface DiagramData {
  type: DiagramOrChartType | TempMermaidDiagramType
  data: {
    edges: Edge[]
    nodes: Node[]
  } | any
  title: string
  user_id: string
  created_at: string
  private: boolean
  description: string
  id: string
}
