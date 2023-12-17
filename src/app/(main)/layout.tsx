'use client'

import { Fragment, useState } from 'react'

import { EditorSection } from '@/components/EditorSection'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { Edge, Node } from 'reactflow'

import { Analytics } from '@vercel/analytics/react'
import { exampleFlowDiagramPrompts } from '@/components/TextBox'
import { DiagramOrChartType } from '@/lib/utils'
import { exampleChartJsDataForTesla } from '@/lib/chart-js.code'
import Navbar from '@/components/Navbar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [title, setTitle] = useState<string>(exampleFlowDiagramPrompts[2].title)
  const [description, setDescription] = useState<string>(
    exampleFlowDiagramPrompts[2].description,
  )

  const [type, setType] = useState<DiagramOrChartType>('Flow Diagram')
  const [nodes, _setNodes] = useState<Node[]>([])
  const [edges, _setEdges] = useState<Edge[]>([])
  const [loading, _setLoading] = useState<boolean>(false)
  const [chartJsData, setChartJsData] = useState<any>(
    exampleChartJsDataForTesla,
  )

  return (
    <DiagramContext.Provider
      value={{
        chartJsData: chartJsData,
        description: description,
        edges: edges,
        loading: loading,
        nodes: nodes,
        setChartJsData: setChartJsData,
        setDescription: setDescription,
        setEdges: _setEdges,
        setLoading: _setLoading,
        setNodes: _setNodes,
        setTitle: setTitle,
        setType: setType,
        title: title,
        type: type,
      }}
    >
      <main>
        <Navbar />
        <div className="relative">{children}</div>
      </main>
      <footer>
        <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4">
          <h2 className="flex items-center font-mono text-sm font-medium leading-7 text-pink-900">
            <span className="ml-2.5">Created by</span>
            <a
              href="https://twitter.com/mistry_shagun"
              className="ml-1 text-pink-500 hover:text-pink-600"
            >
              @ShagunMistry
            </a>
          </h2>
        </div>
      </footer>

      <Analytics />
    </DiagramContext.Provider>
  )
}
