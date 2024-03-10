'use client'

import { useContext, useState } from 'react'
import { DiagramOrChartType } from '@/lib/utils'
import ReactFlow, { Controls } from 'reactflow'
import { SharedDiagramContext } from '@/lib/Contexts/SharedDiagramContext'
import {
  defaultEdgeOptions,
  defaultViewport,
  edgeTypes,
} from '@/lib/react-flow.util'
import { motion } from 'framer-motion'

export default function SharedDiagramInviteCodeForm({
  linkId,
}: {
  linkId: string
}) {
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
    if (diagramData.type === 'Flow Diagram') {
      setIsLoading(false)
      setCanAccess(true)
      console.log('setting diagram type as flow diagram')
      const { nodes, edges } = diagramData.data
      sharedDiagramContext.setNodes(nodes)
      sharedDiagramContext.setEdges(edges)
      sharedDiagramContext.setTitle(diagramData.title)
      sharedDiagramContext.setDescription(diagramData.description)
    }
  }

  return (
    <div className="bg-black">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        {!canAccess ? (
          <div className="shadow-4xl relative isolate overflow-hidden bg-black px-6 py-24 text-center shadow-inner shadow-indigo-600 sm:rounded-3xl sm:px-16">
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
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-lg text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    type="text"
                    placeholder="Invite code"
                  />
                  <button
                    type="submit"
                    className="ml-4 inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        {canAccess && sharedDiagramContext.title && (
          <div className="ml-auto mr-auto h-screen w-11/12 rounded-xl bg-gray-100 shadow-lg">
            <ReactFlow
              nodes={sharedDiagramContext.nodes}
              edges={sharedDiagramContext.edges}
              fitView
              className="react-flow__container"
              nodesDraggable={true}
              zoomOnScroll={true}
              attributionPosition="bottom-center"
              nodesConnectable={false}
              elementsSelectable={false}
              defaultEdgeOptions={defaultEdgeOptions}
              //   nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              defaultViewport={defaultViewport}
            >
              <Controls />
            </ReactFlow>
          </div>
        )}
      </div>
    </div>
  )
}
