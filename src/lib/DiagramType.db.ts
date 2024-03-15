import { Edge, Node } from 'reactflow'

export interface DiagramData {
  type: string
  data: {
    edges: Edge[]
    nodes: Node[]
  }
  title: string
  user_id: string
  created_at: string
  private: boolean
  description: string
  id: string
}
