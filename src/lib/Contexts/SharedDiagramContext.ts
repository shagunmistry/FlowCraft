import { createContext } from 'react'
import { Edge, Node } from 'reactflow'

export const SharedDiagramContext = createContext<{
  nodes: Node[]
  setNodes: (nodes: Node[]) => void
  edges: Edge[]
  setEdges: (edges: Edge[]) => void
  title: string
  setTitle: (title: string) => void
  description: string
  setDescription: (description: string) => void
}>({
  nodes: [],
  setNodes: () => {},
  edges: [],
  setEdges: () => {},
  title: '',
  setTitle: () => {},
  description: '',
  setDescription: () => {},
})
