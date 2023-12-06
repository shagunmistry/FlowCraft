'use client'

import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { useCallback, useContext, useEffect, useState } from 'react'
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  Edge,
  Node,
  addEdge,
} from 'reactflow'

import 'reactflow/dist/style.css'
import Lottie from 'lottie-react'
import Script from 'next/script'
import LottieAnimation from '@/lib/LoaderAnimation.json'

import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import ReactMarkdown from 'react-markdown'

import mermaid from 'mermaid'
//@ts-ignore
import { saveAsPng } from 'save-html-as-image'

// @ts-ignore
import factory from '@/lib/mxgraphlib'

// Get XML from example.xml
import { exampleXML } from './Example'
import { sampleFlowchart } from '@/lib/utils'

const initialNodes: Node[] = [
  {
    id: '1',
    data: {
      label: 'Start',
    },
    position: {
      x: 100,
      y: 100,
    },
    type: 'input',
  },
  {
    id: '2',
    data: {
      label: 'Fold the Paper in Half',
    },
    position: {
      x: 300,
      y: 100,
    },
  },
  {
    id: '3',
    data: {
      label: 'Unfold the Paper',
    },
    position: {
      x: 300,
      y: 200,
    },
  },
  {
    id: '4',
    data: {
      label: 'Fold the Top Corners to the Center',
    },
    position: {
      x: 500,
      y: 100,
    },
  },
  {
    id: '5',
    data: {
      label: 'Fold the Top Edges to the Center',
    },
    position: {
      x: 500,
      y: 200,
    },
  },
  {
    id: '6',
    data: {
      label: 'Fold the Plane in Half',
    },
    position: {
      x: 700,
      y: 100,
    },
  },
  {
    id: '7',
    data: {
      label: 'Fold the Wings Down',
    },
    position: {
      x: 900,
      y: 100,
    },
  },
  {
    id: '8',
    data: {
      label: 'Finish',
    },
    position: {
      x: 1100,
      y: 100,
    },
    type: 'output',
  },
]

const initialEdges = [
  {
    id: '1-2',
    source: '1',
    target: '2',
  },
  {
    id: '2-3',
    source: '2',
    target: '3',
  },
  {
    id: '3-4',
    source: '3',
    target: '4',
  },
  {
    id: '3-5',
    source: '3',
    target: '5',
  },
  {
    id: '4-6',
    source: '4',
    target: '6',
  },
  {
    id: '5-6',
    source: '5',
    target: '6',
  },
  {
    id: '6-7',
    source: '6',
    target: '7',
  },
  {
    id: '7-8',
    source: '7',
    target: '8',
  },
]

export default function ChartView() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [diagramCode, setDiagramCode] = useState(sampleFlowchart)

  const context = useContext(DiagramContext)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'forest',
    })

    mermaid.contentLoaded()
    renderDiagram(diagramCode)
  })

  const renderDiagram = (parsedData: string) => {
    const diagramContainer = document.getElementById(
      'diagram_view',
    ) as HTMLElement
    mermaid
      .render('div', parsedData, diagramContainer)
      .then((value) => {
        console.log('Diagram generate: ', value)
        const svgCode = value.svg

        const svgImage = document.createElement('img')
        svgImage.src = 'data:image/svg+xml;base64,' + btoa(svgCode)
        svgImage.className = 'w-full'
        diagramContainer.innerHTML = ''
        diagramContainer.appendChild(svgImage)

        showDiagramCode(parsedData)
      })
      .catch((err) => {
        console.log('Error generating diagram', err)
      })
  }

  const showDiagramCode = (parsedData: string) => {
    setDiagramCode(parsedData)
  }

  useEffect(() => {
    if (!context.nodes || !context.edges) return
    if (context.nodes.length === 0 || context.edges.length === 0) return

    console.log('context.nodes', context.nodes)
    console.log('context.edges', context.edges)

    setNodes(context.nodes)
    setEdges(context.edges)

    console.log('mermaid', mermaid)

    mermaid.initialize({
      darkMode: true,
      startOnLoad: true,
      theme: 'dark',
    })

    mermaid.contentLoaded()
    const graphDefinition = 'graph TB\na-->b'
    const container = document.querySelector('#graphDiv') as HTMLElement
    mermaid.render('graphDiv', graphDefinition).then((result) => {
      console.log('---------- result', result)
      const { svg, bindFunctions } = result
      container.innerHTML = svg
    })
  }, [context.nodes, context.edges])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => {
        console.log('New Edges: ', edges)
        return applyEdgeChanges(changes, eds)
      }),
    [],
  )

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [],
  )

  const downloadPng = () => {
    // fit the graph to the screen
    const fitView = document.querySelector(
      '.react-flow__controls-fitview',
    ) as HTMLElement
    if (fitView) {
      fitView.click()
    }

    const graph = document.querySelector('.react-flow__renderer')

    if (!graph) return

    saveAsPng(graph, {
      fileName: 'diagram',
      scale: 2,
      backgroundColor: '#fff',
      width: 2000,
      height: 2000,
    })
  }

  return (
    <>
      <Script
        type="module"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
        import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.esm.min.mjs";
        mermaid.initialize({startOnLoad: true});
        mermaid.contentLoaded();
`,
        }}
      />
      <h1 className="ml-5 mt-7 text-2xl font-bold leading-7 text-pink-700">
        {context.title}
      </h1>

      <div className="ml-5 mt-14 h-96 w-11/12 rounded-lg bg-pink-50 shadow-lg">
        {context.loading ? (
          <>
            <div className="text-md flex items-center justify-center text-center text-pink-500">
              Please be patient while we generate your diagram, it may take a
              couple minutes.
            </div>
            <Lottie animationData={LottieAnimation} loop={true} />
          </>
        ) : (
          <>
            <div id="diagram_view" className="w-full"></div>
            {/** Display zoom in and zoomout buttons */}
            <div className="flex justify-center">
              <button
                className="rounded bg-pink-500 px-4 py-2 font-bold text-white hover:bg-pink-700"
                onClick={() => {
                  // Zoom into the diagram
                }}
              >
                Zoom In
              </button>
              <button
                className="ml-5 rounded bg-pink-500 px-4 py-2 font-bold text-white hover:bg-pink-700"
                onClick={() => {
                  // Zoom out of the diagram
                }}
              >
                Zoom Out
              </button>
            </div>
          </>
        )}
        <div className="mt-4 flex justify-center">
          {/* <button
            className="rounded bg-pink-500 px-4 py-2 font-bold text-white hover:bg-pink-700"
            onClick={() => {
              setNodes((nodes) => [
                ...nodes,
                {
                  id: (nodes.length + 1).toString(),
                  data: { label: (nodes.length + 1).toString() },
                  position: { x: 0, y: 0 },
                },
              ])
            }}
          >
            Add Box
          </button> */}
          <button
            className="ml-5 rounded bg-pink-500 px-4 py-2 font-bold text-white hover:bg-pink-700"
            onClick={downloadPng}
            disabled={context.loading}
          >
            Share/Download
          </button>
        </div>
      </div>
    </>
  )
}
