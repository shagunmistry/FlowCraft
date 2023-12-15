'use client'

import { Fragment, useState } from 'react'

import { EditorSection } from '@/components/EditorSection'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { Edge, Node } from 'reactflow'

import { Analytics } from '@vercel/analytics/react'
import { exampleFlowDiagramPrompts } from '@/components/TextBox'
import { DiagramOrChartType } from '@/lib/utils'
import { exampleChartJsDataForTesla } from '@/lib/chart-js.code'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let hosts = ['Shagun Mistry']

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
        <div className="relative">{children}</div>
      </main>
      <footer className="bg-pink-50 py-10 pb-40 sm:py-16 sm:pb-32 lg:hidden">
        <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4">
          {/* <EditorSection /> */}
          <h2 className="mt-8 flex items-center font-mono text-sm font-medium leading-7 text-pink-900">
            <span className="ml-2.5">Hosted by</span>
          </h2>
          <div className="mt-2 flex gap-6 text-sm font-bold leading-7 text-pink-900">
            {hosts.map((host, hostIndex) => (
              <Fragment key={host}>
                {hostIndex !== 0 && (
                  <span aria-hidden="true" className="text-pink-400">
                    /
                  </span>
                )}
                {host}
              </Fragment>
            ))}
          </div>
        </div>
      </footer>

      <Analytics />
    </DiagramContext.Provider>
  )
}
