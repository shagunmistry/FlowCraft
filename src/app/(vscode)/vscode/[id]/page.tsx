'use client'

import mermaid from 'mermaid'
import { useEffect, useState, useMemo } from 'react'
import PageLoader from '@/components/PageLoader'
import {
  XCircleIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  BugAntIcon,
} from '@heroicons/react/24/outline'
import { ArrowUpRightIcon } from '@heroicons/react/20/solid'
import FeedbackDialog from '@/components/FeedbackDialog'
import VisualizationContainer from '@/components/VisualizationContainer'
import { CodeFrame } from 'lumina-code-frame'

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
  const [isCopied, setIsCopied] = useState(false)

  // Memoized context for the container
  const contextData = useMemo(
    () => ({
      type: 'flowchart',
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
    a.download = `${diagramdata.title.replace(/\s+/g, '_')}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(diagramdata.mermaid_code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // --- Data Fetching Logic (Kept mostly identical to preserve logic) ---
  useEffect(() => {
    const getDiagram = async () => {
      setLoading(true)
      const API_URL = process.env.NEXT_PUBLIC_FLOWCRAFT_API
      try {
        const res = await fetch(`${API_URL}/v2/vscode/diagram/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await res.json()

        if (!data || !data.response) {
          setFound(false)
          setLoading(false)
          return
        }

        const diagramData = data.response as DiagramData

        // Clean code
        const mermaid_code = diagramData.mermaid_code
          .replace(/```/g, '')
          .replace(/mermaid/g, '')
          .trim()

        const isValid = await mermaid.parse(mermaid_code).catch((err) => false)

        if (!isValid) {
          setDiagramData(diagramData)
          setLoading(false)
          setIsError(true)
          return
        }

        // Initialize Mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base', // Using base for a cleaner look, 'forest' is too colorful for Apple style
          themeVariables: {
            primaryColor: '#fafafa',
            primaryTextColor: '#18181b',
            lineColor: '#52525b',
            secondaryColor: '#f4f4f5',
            tertiaryColor: '#fff',
          },
        })

        const { svg } = await mermaid.render('mermaid', mermaid_code)

        // Title parsing logic
        const processTitle = (t: string) => {
          if (t.length > 20) {
            if (t.includes('/')) return t.split('/').pop() || t
            if (t.includes('\\')) return t.split('\\').pop() || t
            return t.slice(0, 20) + '...'
          }
          return t
        }

        setTitle(processTitle(diagramData.title))

        if (svg) {
          setMermaidSVG(svg)
          setDiagramData({ ...diagramData, mermaid_code }) // Update with cleaned code but preserve structure
        } else {
          setIsError(true)
        }

        setTimeout(() => setIsFeedbackOpen(true), 10000)
        setLoading(false)
      } catch (error) {
        console.error('Fetch error', error)
        setFound(false)
        setLoading(false)
      }
    }

    getDiagram()
  }, [params.id])

  if (loading) return <PageLoader />

  if (!found) {
    // In a real app, use router.push, but adhering to existing logic
    if (typeof window !== 'undefined')
      window.location.replace(`/error?message=Diagram not found`)
    return null
  }

  return (
    <main className="min-h-screen w-full bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        {/* SEO-Friendly Header Section */}
        <header className="mb-12 flex flex-col items-center space-y-4 text-center">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
              {diagramdata.difficulty || 'Diagram'}
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            {title}
          </h1>

          {diagramdata.description && (
            <p className="max-w-2xl text-lg text-zinc-500">
              {diagramdata.description}
            </p>
          )}
        </header>

        {/* Content Article */}
        <article className="w-full">
          {!loading && !isError && (
            <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              {/* Toolbar - UX enhancement */}
              <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center space-x-2 text-xs font-medium text-zinc-400">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <span>Rendered Successfully</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    title="Copy Mermaid Code"
                  >
                    {isCopied ? (
                      <CheckIcon className="mr-1.5 h-4 w-4 text-emerald-600" />
                    ) : (
                      <ClipboardDocumentIcon className="mr-1.5 h-4 w-4" />
                    )}
                    {isCopied ? 'Copied' : 'Copy Code'}
                  </button>

                  <button
                    onClick={handleDownloadSVG}
                    className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                    title="Download SVG"
                  >
                    <ArrowDownTrayIcon className="mr-1.5 h-4 w-4" />
                    Download SVG
                  </button>
                </div>
              </div>

              {/* Main Visualization Area */}
              <div className="h-[600px] w-full bg-white">
                <VisualizationContainer
                  type="flowchart"
                  context={contextData}
                  nodes={[]} // Passing empty arrays as this seems to be Mermaid-only view
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
            </section>
          )}

          {/* Minimalist Error State */}
          {isError && (
            <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-zinc-200 bg-white p-1">
              <div className="rounded-xl bg-zinc-50/50 p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-zinc-100 p-3">
                    <BugAntIcon
                      className="h-6 w-6 text-zinc-900"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    Visualization Error
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-zinc-500">
                    We couldn't render this diagram automatically. You can
                    inspect the code below or debug it using the Mermaid Live
                    Editor.
                  </p>

                  <div className="mb-8 mt-6">
                    <a
                      href="[https://mermaid.live/edit](https://mermaid.live/edit)"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-all hover:decoration-zinc-900"
                    >
                      Open in Mermaid Live Editor
                      <ArrowUpRightIcon className="ml-1 h-3 w-3 text-zinc-400" />
                    </a>
                  </div>
                </div>

                <div className="overflow-hidden">
                  <CodeFrame
                    code={diagramdata.mermaid_code}
                    language="mermaid"
                    showLineNumbers={true}
                    wrapLongLines={true}
                    theme="graphite"
                    title={`Mermaid Code ${title ? `- ${title}` : ''}`}
                  />
                </div>
              </div>
            </div>
          )}
        </article>
      </div>

      <FeedbackDialog
        header="Feedback"
        message="Help us improve your diagramming experience."
        setOpen={setIsFeedbackOpen}
        open={isFeedbackOpen}
      />
    </main>
  )
}
