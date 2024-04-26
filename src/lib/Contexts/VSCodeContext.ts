import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import { createContext } from 'react'
import { DiagramOrChartType } from '../utils'

export const VSCodeDiagramsContext = createContext<{
  setTitle: (title: string) => void
  setType: (type: DiagramOrChartType | TempMermaidDiagramType) => void
  title: string
  type: DiagramOrChartType | TempMermaidDiagramType
}>({
  setTitle: () => {},
  setType: () => {},
  title: '',
  type: 'sequenceDiagram',
})
