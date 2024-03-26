'use client'

import { DiagramOrChartType } from '@/lib/utils'
import DiagramInputsForm from './DiagramInputsForm'
import { TempMermaidDiagramType } from './Mermaid/OverviewDialog.mermaid'

export function EditorSection({
  type,
  ...props
}: {
  type: DiagramOrChartType | TempMermaidDiagramType
} & React.HTMLProps<HTMLElement>) {
  return (
    <section {...props}>
      <DiagramInputsForm type={type} />
    </section>
  )
}
