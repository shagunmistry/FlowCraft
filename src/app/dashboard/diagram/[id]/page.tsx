'use client'

import { useContext, useEffect, useState, use } from 'react'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { sanitizeMermaid, sanitizeSVG } from '@/lib/utils'
import Link from 'next/link'
import { DiagramViewerShell } from '@/components/DiagramViewer'

const CanvasLoader = () => (
  <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-ink text-paper">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-50"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/[0.06] blur-[120px]"
    />
    <div className="relative flex flex-col items-center">
      <p className="font-serif text-4xl italic text-paper/80">
        Drafting canvas<span className="animate-pulse text-signal">.</span>
      </p>
      <div className="mt-6 h-px w-40 overflow-hidden bg-rule">
        <div className="h-full w-1/3 animate-scan bg-signal" />
      </div>
    </div>
  </div>
)

export default function DiagramPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isFinalized = searchParams.get('finalized') === '1'
  const diagramContext = useContext(DiagramContext)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Diagram data
  const [imageUrl, setImageUrl] = useState('')
  const [svgCode, setSvgCode] = useState('')
  const [mermaidCode, setMermaidCode] = useState<string | null>(null)
  const [chartJsData, setChartJsData] = useState<any>(null)
  const [flowData, setFlowData] = useState<{
    nodes: any[]
    edges: any[]
  } | null>(null)
  const [diagramMeta, setDiagramMeta] = useState<{
    title: string
    type: string
    description?: string
    createdAt?: string
  } | null>(null)

  useEffect(() => {
    const fetchDiagram = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/get-diagrams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })

        const { diagram } = await response.json()

        if (!diagram || diagram.length === 0) {
          setError(true)
          return
        }

        const data = diagram[0]
        const type = data.type as string
        const lower = type?.toLowerCase?.() ?? ''
        const isNonMermaid =
          ['illustration', 'generated_image', 'infographic', 'chart'].includes(
            lower,
          ) || lower === 'flow diagram'

        // Mermaid-style diagrams open in the chat workbench so users can
        // iterate on them conversationally. Non-mermaid types (images, flow
        // diagrams, charts, infographics) render here. `?finalized=1` means
        // the user explicitly asked to view the shipped diagram here, so
        // don't bounce back to the workbench.
        if (!isNonMermaid && !isFinalized) {
          router.replace(`/dashboard/diagrams/new?id=${id}`)
          return
        }

        setDiagramMeta({
          title: data.title,
          type: data.type,
          description: data.description,
          createdAt: data.created_at,
        })

        diagramContext.setTitle(data.title)
        diagramContext.setDiagramId(id)
        diagramContext.setType(data.type)

        if (['illustration', 'generated_image'].includes(lower)) {
          setImageUrl(
            lower === 'illustration' ? data.image_url : data.data,
          )
        } else if (lower === 'infographic') {
          setSvgCode(sanitizeSVG(data.data).svgContent)
        } else if (lower === 'flow diagram') {
          const parsedData = JSON.parse(JSON.parse(data.data))
          setFlowData({ nodes: parsedData.nodes, edges: parsedData.edges })
          diagramContext.setEdges(parsedData.edges)
          diagramContext.setNodes(parsedData.nodes)
        } else if (lower === 'chart') {
          setChartJsData(JSON.parse(data.data))
        } else {
          // Fall back to the raw stored content when sanitize can't find a
          // recognizable mermaid header — lets mermaid.parse fail loudly so
          // the viewer's error UI (with raw source + re-open affordance)
          // shows instead of a blank canvas.
          const sanitized = sanitizeMermaid(data.data)
          setMermaidCode(sanitized || data.data || '')
        }
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchDiagram()
  }, [id, isFinalized])

  if (loading) return <CanvasLoader />

  if (error) {
    return (
      <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center text-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-50"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/[0.04] blur-[120px]"
        />
        <div className="relative flex max-w-md flex-col items-center">
          <h2 className="font-serif text-5xl leading-[0.95] tracking-[-0.01em] text-paper">
            <span className="text-paper/70">This sheet has</span>{' '}
            <span className="italic text-signal">gone missing</span>
            <span className="text-paper/70">.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-paper/60">
            The draft you're looking for has been moved, deleted, or never
            existed in this workspace.
          </p>
          <Link
            href="/dashboard"
            className="group mt-8 inline-flex items-center gap-3 rounded-sm bg-signal px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <DiagramViewerShell
      mode="owner"
      onBack={() => router.push('/dashboard')}
      title={diagramMeta?.title || 'Untitled'}
      type={diagramMeta?.type || ''}
      description={diagramMeta?.description}
      createdAt={diagramMeta?.createdAt}
      mermaidCode={mermaidCode}
      svgCode={svgCode || undefined}
      imageUrl={imageUrl || undefined}
      flowDiagramData={flowData}
      chartJsData={chartJsData}
      diagramId={id}
    />
  )
}
