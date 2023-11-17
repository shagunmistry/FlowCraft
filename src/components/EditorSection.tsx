'use client'

import TextBox from './TextBox'

export function EditorSection(
  props: React.ComponentPropsWithoutRef<'section'>,
) {
  return (
    <section {...props}>
      <TextBox />
    </section>
  )
}
