'use client'
import { Analytics } from '@vercel/analytics/react'
import Navbar from '@/components/Navbar'

import Footer from '@/components/Footer'
import { useState } from 'react'

import { VSCodeDiagramsContext } from '@/lib/Contexts/VSCodeContext'

import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import { DiagramOrChartType } from '@/lib/utils'

export default function VSCodeDiagramsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [title, setTitle] = useState<string>('')

  const [type, setType] = useState<DiagramOrChartType | TempMermaidDiagramType>(
    'Flow Diagram',
  )

  return (
    <>
      <VSCodeDiagramsContext.Provider
        value={{
          title,
          setTitle,
          type,
          setType,
        }}
      >
        <main>
          <div className="relative">{children}</div>
        </main>
        <Analytics />
      </VSCodeDiagramsContext.Provider>
    </>
  )
}
