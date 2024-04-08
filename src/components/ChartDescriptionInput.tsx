'use client'

import { EditorSection } from './EditorSection'
import { DiagramOrChartType } from '@/lib/utils'
import { TempMermaidDiagramType } from './Mermaid/OverviewDialog.mermaid'
import StarRatingInput from './StarRatingInput'

export default function ChartDescriptionInput({
  type,
}: {
  type: DiagramOrChartType | TempMermaidDiagramType
}) {
  return (
    <div>
      <EditorSection type={type} />
    </div>
  )
}
