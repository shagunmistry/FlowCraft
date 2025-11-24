'use client'

import { useContext, useState } from 'react'
import { DiagramOrChartType } from '@/lib/utils'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
} from 'reactflow'
import { SharedDiagramContext } from '@/lib/Contexts/SharedDiagramContext'
import {
  defaultEdgeOptions,
  defaultViewport,
  edgeTypes,
  nodeTypes,
} from '@/lib/react-flow.util'
import { motion } from 'framer-motion'
import { initialNodes } from '@/lib/react-flow.code'
import { Chart, registerables } from 'chart.js'

import mermaid from 'mermaid'
import ChartJsComponent from '../ChartJsComponents'

export default function SharedDiagramInviteCodeForm({
  linkId,
}: {
  linkId: string
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [mermaidSVG, setMermaidSVG] = useState('' as string)

  const [canAccess, setCanAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const sharedDiagramContext = useContext(SharedDiagramContext)

  const hnadleSubmit = async (e: any) => {
    e.preventDefault()
    console.log('Form submitted')

    const inviteCode = e.target[0].value
    // Reach out to the PUT request : /api/generate-link
    const body = {
      inviteCode: inviteCode,
      linkId: linkId,
    }

    setIsLoading(true)

    const res = await fetch('/api/generate-link', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (res && res.status !== 200) {
      console.log('Error:', res)
      setIsLoading(false)
      return
    }

    const data = (await res.json()) as {
      diagramData: {
        title: string
        data: any
        type: DiagramOrChartType
        description: string
      }
    }

    console.log('Data:', data)
    const { diagramData } = data
    sharedDiagramContext.setTitle(diagramData.title)
    sharedDiagramContext.setDescription(diagramData.description)
    sharedDiagramContext.setType(diagramData.type)

    if (diagramData.type === 'Flow Diagram') {
      setIsLoading(false)
      setCanAccess(true)
      console.log(
        'setting diagram type as flow diagram',
        JSON.parse(diagramData.data),
      )
      const { nodes, edges } = JSON.parse(diagramData.data)
      sharedDiagramContext.setNodes(nodes)
      sharedDiagramContext.setEdges(edges)
      setNodes(nodes)
    } else if (diagramData.type === 'Chart') {
      Chart.register(...registerables)
      setCanAccess(true)

      const chartData = JSON.parse(diagramData.data)
      // let ctx = document.getElementById('myChart') as HTMLCanvasElement

      // console.log(
      //   'Chart data Type: ',
      //   chartData.type,
      //   'Data: ',
      //   chartData.data,
      //   'Options: ',
      //   chartData.options,
      // )

      // if (ctx === null) {
      //   console.log('Creating new canvas element')
      //   // Create a new canvas element with the id 'myChart' and append it to the body, with a width of 400 and height of 400
      //   ctx = document.createElement('canvas')
      //   ctx.id = 'myChart'
      //   ctx.width = 400
      //   ctx.height = 400

      //   document.getElementById('myChartContainer')?.appendChild(ctx)
      // }

      // console.log('Chart context:', ctx)

      // const myChart = new Chart(ctx, {
      //   type: chartData.type || 'bar',
      //   ...chartData,
      // }).update()

      sharedDiagramContext.setChartJsData(chartData)

      setIsLoading(false)
    } else if (diagramData.type === 'Whiteboard') {
    } else {
      const { svg } = await mermaid.render(
        'mermaid',
        JSON.parse(diagramData.data),
      )

      if (svg === undefined) {
        console.error('SVG from Mermaid API is undefined')
        return
      }

      setMermaidSVG(svg)
      setCanAccess(true)

      mermaid.initialize({
        startOnLoad: false,
        theme: 'forest',
      })
    }
  }

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        {!canAccess ? (
          <div className="shadow-4xl relative isolate overflow-hidden bg-black px-6 py-24 text-center shadow-inner shadow-red-600 sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              You have been invited to view a FlowCraft document! 🎉
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              To access it, please enter the invite code provided by the person
              who shared it with you.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <form className="w-full max-w-lg" onSubmit={hnadleSubmit}>
                <div className="flex items-center py-2">
                  <input
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-lg text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                    type="text"
                    placeholder="Invite code"
                  />
                  <button
                    type="submit"
                    className="ml-4 inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Access'}
                  </button>
                </div>
              </form>
            </div>
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-12 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle
                cx={512}
                cy={512}
                r={512}
                fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
                fillOpacity="0.7"
              />
              <defs>
                <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                  <stop stopColor="#FFF" />
                  <stop offset={1} stopColor="#6366F1" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        ) : null}
        {canAccess && sharedDiagramContext.title && (
          <motion.h1
            initial={{ opacity: 0, y: 20, scale: 5, color: '#6366F1' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1 }}
            className="my-4 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
          >
            {sharedDiagramContext.title}
          </motion.h1>
        )}
        {canAccess &&
          sharedDiagramContext.title &&
          sharedDiagramContext.type === 'Flow Diagram' && (
            <div className="ml-auto mr-auto h-screen w-11/12 rounded-xl bg-gray-100 shadow-lg">
              <ReactFlow
                attributionPosition="bottom-center"
                className="react-flow__container"
                defaultEdgeOptions={defaultEdgeOptions}
                defaultViewport={defaultViewport}
                edges={sharedDiagramContext.edges}
                edgeTypes={edgeTypes}
                fitView
                nodes={nodes}
                nodeTypes={nodeTypes}
                nodesConnectable={false}
                zoomOnScroll={true}
                snapGrid={[25, 25]}
                snapToGrid={false}
                onNodesChange={onNodesChange}
              >
                <Controls />
                <Background
                  color="#808080"
                  gap={40}
                  variant={BackgroundVariant.Cross}
                />
              </ReactFlow>
            </div>
          )}

        {sharedDiagramContext.title &&
          sharedDiagramContext.type === 'Chart' && (
            <ChartJsComponent data={sharedDiagramContext.chartJsData} />
          )}

        {canAccess &&
          sharedDiagramContext.type !== 'Flow Diagram' &&
          sharedDiagramContext.type !== 'Chart' &&
          sharedDiagramContext.type !== 'Whiteboard' && (
            <div
              className="mermaid mx-auto h-full w-full p-4 text-center"
              dangerouslySetInnerHTML={{ __html: mermaidSVG }}
            ></div>
          )}
      </div>
    </div>
  )
}
