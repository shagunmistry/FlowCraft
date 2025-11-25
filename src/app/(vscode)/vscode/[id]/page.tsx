'use client'

import mermaid from 'mermaid'
import { useEffect, useState, useMemo } from 'react'
import PageLoader from '@/components/PageLoader'
import {
  XCircleIcon,
  ClipboardIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import FeedbackDialog from '@/components/FeedbackDialog'
import VisualizationContainer from '@/components/VisualizationContainer'
import { ArrowUpRightIcon } from '@heroicons/react/20/solid'

type DiagramData = {
  description: string
  difficulty: string
  id: number
  mermaid_code: string
  title: string
  type: string
}

export default function VSCodeDiagramPage({
  params,
}: {
  params: { id: string }
}) {
  const [diagramdata, setDiagramData] = useState<DiagramData>({
    description: '',
    difficulty: '',
    id: 0,
    mermaid_code: '',
    title: '',
    type: '',
  })
  const [found, setFound] = useState(true)
  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [title, setTitle] = useState('')
  const [mermaidSVG, setMermaidSVG] = useState<string | null>(null)

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  // State for copy button feedback
  const [isCopied, setIsCopied] = useState(false)

  // Create a context-like object for VisualizationContainer
  const contextData = useMemo(
    () => ({
      type: 'flowchart', // Mermaid diagram type
      title: title || diagramdata.title,
      description: diagramdata.description,
      loading: loading,
      mermaidData: diagramdata.mermaid_code,
    }),
    [title, diagramdata, loading],
  )

  const checkIfMermaidDiagram = (type: string | null) => {
    return (
      type === 'flowchart' ||
      type === 'classDiagram' ||
      type === 'sequenceDiagram'
    )
  }

  const handleDownloadSVG = () => {
    if (!mermaidSVG) return
    const blob = new Blob([mermaidSVG], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${diagramdata.title}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(diagramdata.mermaid_code)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000) // Reset status after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  useEffect(() => {
    const getDiagram = async () => {
      setLoading(true)
      const API_URL = process.env.NEXT_PUBLIC_FLOWCRAFT_API
      const res = await fetch(`${API_URL}/v2/vscode/diagram/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })

      const data = await res.json()

      if (!data || !data.response) {
        console.error('No diagram data found')
        setFound(false)
        setLoading(false)
        return
      }

      const diagramData = data.response as DiagramData

      console.log('Fetched diagram data:', diagramData)

      const mermaid_code = diagramData.mermaid_code
        .replace(/```/g, '')
        .replace(/mermaid/g, '')
        .trim()

      console.log('Mermaid code to be parsed:', mermaid_code)

      const isValid = await mermaid.parse(mermaid_code).catch((err) => {
        console.error('Error parsing Mermaid code:', err)
        return false
      })

      console.log('Mermaid code validity:', isValid)

      if (isValid === undefined || !isValid || isValid === null) {
        console.error('Invalid Mermaid code')
        setDiagramData(diagramData)
        setLoading(false)
        setIsError(true)
        return
      }

      const { svg } = await mermaid.render('mermaid', mermaid_code)

      if (svg === undefined) {
        console.error('SVG from Mermaid API is undefined')
        const _title = diagramData.title
        if (_title.length > 20) {
          // Check if they have "/" or "\" in the title
          if (_title.includes('/')) {
            setTitle(_title.split('/')[0])
          } else if (_title.includes('\\')) {
            setTitle(_title.split('\\')[0])
          } else {
            setTitle(_title.slice(0, 20).concat('...'))
          }
        } else {
          setTitle(_title)
        }
        setDiagramData(diagramData)
        setFound(false)
        setLoading(false)
        return
      }

      mermaid.initialize({
        startOnLoad: false,
        theme: 'forest',
      })

      // Store original mermaid code separately
      const originalMermaidCode = diagramData.mermaid_code
      diagramData.mermaid_code = originalMermaidCode

      setMermaidSVG(svg)
      setDiagramData(diagramData)

      const title = diagramData.title
      if (title.length > 10) {
        if (title.includes('/')) {
          setTitle(title.split('/')[title.split('/').length - 1])
        } else if (title.includes('\\')) {
          setTitle(title.split('\\')[title.split('\\').length - 1])
        } else {
          setTitle(title.slice(0, 20).concat('...'))
        }
      } else {
        setTitle(title)
      }

      setTimeout(() => {
        setIsFeedbackOpen(true)
      }, 10000)

      setLoading(false)
    }

    getDiagram()
  }, [])

  if (loading) {
    return <PageLoader />
  }

  if (!found) {
    window.location.replace(`/error?message=Diagram not found`)
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-white text-zinc-900 selection:bg-black selection:text-white">
      {/* Header Section */}
      <header className="w-full max-w-5xl px-6 py-16 text-center lg:px-8">
        <div className="mx-auto flex flex-col items-center justify-center space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-zinc-600 shadow-sm">
              Difficulty: {diagramdata.difficulty}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <article className="w-full flex-1 px-4 pb-20 lg:px-8">
        {!loading && !isError && (
          <div className="mx-auto h-[600px] w-full max-w-7xl overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/30 shadow-sm transition-all duration-300 hover:shadow-md">
            <VisualizationContainer
              type="flowchart"
              context={contextData}
              nodes={[]}
              edges={[]}
              onNodesChange={() => {}}
              onEdgesChange={() => {}}
              onConnect={() => {}}
              onEdgeUpdate={() => {}}
              defaultEdgeOptions={{}}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              nodeTypes={{}}
              edgeTypes={{}}
              ConnectionLineComponent={null}
              toggleReactFlowGird={false}
              tlDrawInputJson=""
              donwloadChart={() => {}}
              createShareableLink={() => {}}
              mermaidSVG={mermaidSVG}
              isMermaidError={isError}
              downloadMermaidDiagramAsPng={handleDownloadSVG}
              copyMermaidDiagramAsPng={() => {}}
              editMermaidDiagramCode={() => {}}
              checkIfMermaidDiagram={checkIfMermaidDiagram}
              Whiteboard={null}
            />
          </div>
        )}

        {/* Error State - Minimalist Design */}
        {isError && (
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
              <div className="flex-shrink-0">
                <XCircleIcon
                  className="h-10 w-10 text-zinc-400"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-4 w-full sm:ml-6 sm:mt-0">
                <h3 className="text-lg font-semibold text-zinc-900">
                  Rendering Error
                </h3>
                <div className="mt-2 text-sm text-zinc-600">
                  <p>We encountered an issue visualizing this diagram.</p>
                  <ul
                    role="list"
                    className="mt-2 list-inside list-disc space-y-1"
                  >
                    <li>Please refresh or contact support.</li>
                    <li>
                      <a
                        href="https://mermaid.live/edit"
                        target="_blank"
                        className="inline-flex items-center font-medium text-black underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-black"
                      >
                        Debug in Mermaid Live Editor
                        <ArrowUpRightIcon
                          className="ml-1 h-3 w-3"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  </ul>
                </div>

                {/** Code Block with Copy Button */}
                <div className="mt-6">
                  <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-inner">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Raw Source
                      </h4>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:text-black focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                      >
                        {isCopied ? (
                          <>
                            <CheckIcon
                              className="mr-1.5 h-3.5 w-3.5 text-green-600"
                              aria-hidden="true"
                            />
                            Copied!
                          </>
                        ) : (
                          <>
                            <ClipboardIcon
                              className="mr-1.5 h-3.5 w-3.5 text-zinc-400"
                              aria-hidden="true"
                            />
                            Copy Code
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="overflow-x-auto rounded-lg border border-zinc-100 bg-zinc-50 p-3 font-mono text-xs text-zinc-600">
                      <code>{diagramdata.mermaid_code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </article>

      <FeedbackDialog
        header="Code Diagram Feedback"
        message="We would love to hear your thoughts on the FlowCraft VS Code extension. What do you like? What can we improve?"
        setOpen={setIsFeedbackOpen}
        open={isFeedbackOpen}
      />
    </main>
  )
}
