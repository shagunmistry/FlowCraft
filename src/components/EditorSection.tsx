'use client'

import DiagramInputsForm from './DiagramInputsForm'

export function EditorSection(
  props: React.ComponentPropsWithoutRef<'section'>,
) {
  return (
    <section {...props}>
      <DiagramInputsForm />
    </section>
  )
}
