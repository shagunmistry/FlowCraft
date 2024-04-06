import { Edge, Node } from 'reactflow'
import { DiagramOrChartType } from './utils'

export interface DiagramData {
  type: DiagramOrChartType
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
