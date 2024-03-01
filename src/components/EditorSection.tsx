'use client'

import { DiagramOrChartType } from '@/lib/utils'
import DiagramInputsForm from './DiagramInputsForm'

export function EditorSection({
  type,
  ...props
}: {
  type: DiagramOrChartType
} & React.HTMLProps<HTMLElement>) {
  return (
    <section {...props}>
      <DiagramInputsForm type={type} />
    </section>
  )
}
