'use client'

import { useState } from 'react'

import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { Edge, Node } from 'reactflow'

import { Analytics } from '@vercel/analytics/react'
import { exampleFlowDiagramPrompts } from '@/components/TextBox'
import { DiagramOrChartType } from '@/lib/utils'
import { exampleChartJsDataForTesla } from '@/lib/chart-js.code'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhiteboardContext } from '@/lib/Contexts/WhiteboardContext'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [title, setTitle] = useState<string>('Sample Process')
  const [description, setDescription] = useState<string>(
    exampleFlowDiagramPrompts[2].description,
  )

  const [type, setType] = useState<DiagramOrChartType>('TLDraw')
  const [nodes, _setNodes] = useState<Node[]>([])
  const [edges, _setEdges] = useState<Edge[]>([])

  const [tlDrawRecords, setTlDrawRecords] = useState<any>([
    {
      x: 200,
      y: 100,
      rotation: 0,
      opacity: 1,
      id: 'shape:1',
      type: 'geo',
      props: {
        w: 500,
        h: 100,
        geo: 'rectangle',
        color: 'light-green',
        labelColor: 'black',
        fill: 'none',
        dash: 'draw',
        size: 'm',
        font: 'draw',
        text: 'Idea Generation',
        align: 'middle',
        verticalAlign: 'middle',
        url: '',
      },
      index: 'a1',
      typeName: 'shape',
    },
    {
      x: 200,
      y: 300,
      rotation: 0,
      opacity: 1,
      id: 'shape:2',
      type: 'geo',
      props: {
        w: 500,
        h: 100,
        geo: 'rectangle',
        color: 'light-blue',
        labelColor: 'black',
        fill: 'none',
        dash: 'draw',
        size: 'm',
        font: 'draw',
        text: 'Market Research',
        align: 'middle',
        verticalAlign: 'middle',
        url: '',
      },
      index: 'a2',
      typeName: 'shape',
    },
    {
      x: 200,
      y: 500,
      rotation: 0,
      opacity: 1,
      id: 'shape:3',
      type: 'geo',
      props: {
        w: 500,
        h: 100,
        geo: 'rectangle',
        color: 'light-violet',
        labelColor: 'black',
        fill: 'none',
        dash: 'draw',
        size: 'm',
        font: 'draw',
        text: 'Planning and Design',
        align: 'middle',
        verticalAlign: 'middle',
        url: '',
      },
      index: 'a3',
      typeName: 'shape',
    },
    {
      x: 200,
      y: 700,
      rotation: 0,
      opacity: 1,
      id: 'shape:4',
      type: 'geo',
      props: {
        w: 500,
        h: 100,
        geo: 'rectangle',
        color: 'yellow',
        labelColor: 'black',
        fill: 'none',
        dash: 'draw',
        size: 'm',
        font: 'draw',
        text: 'Development',
        align: 'middle',
        verticalAlign: 'middle',
        url: '',
      },
      index: 'a4',
      typeName: 'shape',
    },
    {
      x: 200,
      y: 900,
      rotation: 0,
      opacity: 1,
      id: 'shape:5',
      type: 'geo',
      props: {
        w: 500,
        h: 100,
        geo: 'rectangle',
        color: 'light-red',
        labelColor: 'black',
        fill: 'none',
        dash: 'draw',
        size: 'm',
        font: 'draw',
        text: 'Testing and Deployment',
        align: 'middle',
        verticalAlign: 'middle',
        url: '',
      },
      index: 'a5',
      typeName: 'shape',
    },
    {
      x: 450,
      y: 200,
      rotation: 0,
      opacity: 1,
      id: 'shape:1-2',
      type: 'arrow',
      index: 'a6',
      props: {
        dash: 'draw',
        size: 'm',
        fill: 'none',
        color: 'black',
        labelColor: 'black',
        bend: 0,
        start: {
          type: 'binding',
          boundShapeId: 'shape:1',
          normalizedAnchor: {
            x: 0.5,
            y: 1,
          },
          isPrecise: true,
          isExact: false,
        },
        end: {
          type: 'binding',
          boundShapeId: 'shape:2',
          normalizedAnchor: {
            x: 0.5,
            y: 0,
          },
          isPrecise: true,
          isExact: false,
        },
        arrowheadStart: 'none',
        arrowheadEnd: 'arrow',
        text: '',
        font: 'draw',
      },
      typeName: 'shape',
    },
    {
      x: 450,
      y: 400,
      rotation: 0,
      opacity: 1,
      id: 'shape:2-3',
      type: 'arrow',
      index: 'a7',
      props: {
        dash: 'draw',
        size: 'm',
        fill: 'none',
        color: 'black',
        labelColor: 'black',
        bend: 0,
        start: {
          type: 'binding',
          boundShapeId: 'shape:2',
          normalizedAnchor: {
            x: 0.5,
            y: 1,
          },
          isPrecise: true,
          isExact: false,
        },
        end: {
          type: 'binding',
          boundShapeId: 'shape:3',
          normalizedAnchor: {
            x: 0.5,
            y: 0,
          },
          isPrecise: true,
          isExact: false,
        },
        arrowheadStart: 'none',
        arrowheadEnd: 'arrow',
        text: '',
        font: 'draw',
      },
      typeName: 'shape',
    },
    {
      x: 450,
      y: 600,
      rotation: 0,
      opacity: 1,
      id: 'shape:3-4',
      type: 'arrow',
      index: 'a8',
      props: {
        dash: 'draw',
        size: 'm',
        fill: 'none',
        color: 'black',
        labelColor: 'black',
        bend: 0,
        start: {
          type: 'binding',
          boundShapeId: 'shape:3',
          normalizedAnchor: {
            x: 0.5,
            y: 1,
          },
          isPrecise: true,
          isExact: false,
        },
        end: {
          type: 'binding',
          boundShapeId: 'shape:4',
          normalizedAnchor: {
            x: 0.5,
            y: 0,
          },
          isPrecise: true,
          isExact: false,
        },
        arrowheadStart: 'none',
        arrowheadEnd: 'arrow',
        text: '',
        font: 'draw',
      },
      typeName: 'shape',
    },
    {
      x: 450,
      y: 800,
      rotation: 0,
      opacity: 1,
      id: 'shape:4-5',
      type: 'arrow',
      index: 'a9',
      props: {
        dash: 'draw',
        size: 'm',
        fill: 'none',
        color: 'black',
        labelColor: 'black',
        bend: 0,
        start: {
          type: 'binding',
          boundShapeId: 'shape:4',
          normalizedAnchor: {
            x: 0.5,
            y: 1,
          },
          isPrecise: true,
          isExact: false,
        },
        end: {
          type: 'binding',
          boundShapeId: 'shape:5',
          normalizedAnchor: {
            x: 0.5,
            y: 0,
          },
          isPrecise: true,
          isExact: false,
        },
        arrowheadStart: 'none',
        arrowheadEnd: 'arrow',
        text: '',
        font: 'draw',
      },
      typeName: 'shape',
    },
  ])

  const [loading, _setLoading] = useState<boolean>(false)
  const [chartJsData, setChartJsData] = useState<any>(
    exampleChartJsDataForTesla,
  )

  const [whiteboardInput, setWhiteboardInput] = useState<string>('')
  const [whiteboardEditorRef, setWhiteboardEditorRef] = useState<any>(null)
  const [controls, setControls] = useState<any>(null)

  return (
    <WhiteboardContext.Provider
      value={{
        input: whiteboardInput,
        setInput: setWhiteboardInput,
        editorRef: whiteboardEditorRef,
        setEditorRef: setWhiteboardEditorRef,
        controls: controls,
        setControls: setControls,
      }}
    >
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
          setTlDrawRecords: setTlDrawRecords,
          setType: setType,
          title: title,
          tlDrawRecords: tlDrawRecords,
          type: type,
        }}
      >
        <main>
          <Navbar />
          <div className="relative">{children}</div>
        </main>
        <Footer />

        <Analytics />
      </DiagramContext.Provider>
    </WhiteboardContext.Provider>
  )
}
