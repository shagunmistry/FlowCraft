'use client'

import 'reactflow/dist/style.css'

export default function SharedDiagramsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="h-screen w-full">{children}</main>
      {/* Analytics is mounted in the root layout to avoid double-counting page views. */}
    </>
  )
}
