import { createContext } from 'react'
import { Edge, Node } from 'reactflow'

export const DiagramContext = createContext<{
  nodes: Node[]
  setNodes: (nodes: Node[]) => void
  edges: Edge[]
  setEdges: (edges: Edge[]) => void
  title: string
  description: string
  loading: boolean
  setLoading: (loading: boolean) => void
  setTitle: (title: string) => void
  setDescription: (description: string) => void
}>({
  nodes: [],
  setNodes: () => {},
  edges: [],
  setEdges: () => {},
  title: '',
  description: '',
  loading: false,
  setLoading: () => {},
  setTitle: () => {},
  setDescription: () => {},
})
