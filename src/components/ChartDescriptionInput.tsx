'use client'
import Link from 'next/link'

import { EditorSection } from './EditorSection'
import { TinyWaveFormIcon } from './TinyWaveFormIcon'
import { DiagramOrChartType } from '@/lib/utils'
import FeedbackButton from './FeedbackButton'
import { TempMermaidDiagramType } from './Mermaid/OverviewDialog.mermaid'

export default function ChartDescriptionInput({
  type,
}: {
  type: DiagramOrChartType | TempMermaidDiagramType
}) {
  return (
    <div>
      <EditorSection type={type} />
      <FeedbackButton />
    </div>
  )
}
