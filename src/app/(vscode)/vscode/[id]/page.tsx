'use client'

import mermaid from 'mermaid'
import { useEffect, useState } from 'react'
import PageLoader from '@/components/PageLoader'
import { XCircleIcon } from '@heroicons/react/24/outline'
import FeedbackDialog from '@/components/FeedbackDialog'
import {
  ArrowDownTrayIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  CheckIcon,
  ClipboardIcon,
} from '@heroicons/react/20/solid'

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

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    const getDiagram = async () => {
      setLoading(true)
      const API_URL = process.env.NEXT_PUBLIC_FLOWCRAFT_API
      const res = await fetch(`${API_URL}/supabase/diagram/${params.id}`, {
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

      const mermaid_code = diagramData.mermaid_code.replace(/```/g, '')

      const isValid = await mermaid.parse(mermaid_code).catch((err) => {
        console.error('Error parsing Mermaid code:', err)
        return false
      })

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

      diagramData.mermaid_code = svg

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

  const copyMermaidCode = () => {
    console.log('Diagram data:', diagramdata)
    const code = diagramdata.mermaid_code

    navigator.clipboard.writeText(code).then(
      function () {
        console.log('Async: Copying to clipboard was successful!')
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 3000)
      },
      function (err) {
        console.error('Async: Could not copy text: ', err)
        setIsCopied(false)
      },
    )
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100">
      <div className="px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {title}
          </h2>
          <span className="text-md inline-flex items-center rounded-md bg-green-50 px-2 py-1 font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
            Difficulty Level: {diagramdata.difficulty.toUpperCase()}
          </span>
        </div>
      </div>

      <span className="isolate inline-flex rounded-md shadow-sm">
        <button
          className="mx-4 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-lg font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          onClick={() => {
            const svg = diagramdata.mermaid_code
            const blob = new Blob([svg], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${diagramdata.title}.svg`
            a.click()
          }}
          disabled={isError}
        >
          <ArrowDownTrayIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Download SVG
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={copyMermaidCode}
        >
          <ClipboardIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Copy Code
          {isCopied ? (
            <CheckCircleIcon
              className="-mr-0.5 h-5 w-5 text-green-500"
              aria-hidden="true"
            />
          ) : null}
        </button>
      </span>
      {isError && (
        <div className="my-12 rounded-xl bg-red-50 p-4 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-12 w-12 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">
                There was an error rendering the diagram
              </h3>
              <div className="mt-2 text-lg text-red-700">
                <ul role="list" className="list-disc space-y-1 pl-5">
                  <li>Please try again or contact support</li>
                  <li>
                    Copy the Mermaid code and try to render it in
                    <a
                      href="https://mermaid.live/edit"
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      {' '}
                      Mermaid Live Editor
                      <ArrowUpRightIcon
                        className="inline-block h-4 w-4"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                </ul>
              </div>

              {/** Code Block to Show the mermaid code */}
              <div className="mt-4">
                <pre className="prose prose-neutral prose-lg max-w-lg overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm text-gray-900 shadow-lg">
                  <h3 className="text-lg font-medium text-gray-800">
                    Mermaid Code
                  </h3>
                  <code>{diagramdata.mermaid_code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isError && (
        <div
          className="mermaid mx-auto mb-8 w-3/4 rounded-lg p-4"
          dangerouslySetInnerHTML={{ __html: diagramdata.mermaid_code }}
        ></div>
      )}

      <FeedbackDialog
        header="Code Diagram Feedback"
        message="We would love to hear your thoughts on the FlowCraft VS Code extension. What do you like? What can we improve?"
        setOpen={setIsFeedbackOpen}
        open={isFeedbackOpen}
      />
    </div>
  )
}
