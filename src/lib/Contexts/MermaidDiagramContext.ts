import { createContext } from 'react'
import { MermaidDiagramType } from '../utils.mermaid'

export const MermaidDiagramContext = createContext<{
  title: string
  type: MermaidDiagramType
  description: string
  mermaidCode: string
  setMermaidCode: (code: string) => void
  setDiagramType: (type: MermaidDiagramType) => void
  setTitle: (title: string) => void
  setDescription: (description: string) => void
}>({
  title: '',
  type: 'FlowChart',
  description: '',
  mermaidCode: '',
  setMermaidCode: () => {},
  setDiagramType: () => {},
  setTitle: () => {},
  setDescription: () => {},
})
