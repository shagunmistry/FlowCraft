import { createContext } from 'react'

export type TypeNode = {
  id: string
  data: {
    label?: string
    color?: string
  }
  position: {
    x: number
    y: number
  }
  type?: string
}

// example edge
// const edges = [{ id: '1-2', source: '1', target: '2' }];
export type TypeEdge = {
  id: string
  source: string
  target: string
}

export const DiagramContext = createContext<{
  nodes: TypeNode[]
  setNodes: (nodes: TypeNode[]) => void
  edges: TypeEdge[]
  setEdges: (edges: TypeEdge[]) => void
  title: string
  description: string
  loading: boolean
}>({
  nodes: [],
  setNodes: () => {},
  edges: [],
  setEdges: () => {},
  title: '',
  description: '',
  loading: false,
})
