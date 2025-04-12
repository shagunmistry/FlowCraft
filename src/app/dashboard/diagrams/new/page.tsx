'use client'

import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { OptionType, sanitizeMermaid, sanitizeSVG } from '@/lib/utils'
import { BugAntIcon } from '@heroicons/react/20/solid'
import { LinkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useContext, useState, useEffect, useRef } from 'react'
import DiagramSelectionGrid from './DiagramSelectionGrid'
import Button from '@/components/ui/Button'

import { ZoomInIcon, ZoomOutIcon } from 'lucide-react'
import { useLoading } from '@/lib/LoadingProvider'
import mermaid from 'mermaid'

export default function NewDiagramPage() {
  const { showLoading, hideLoading } = useLoading()

  const context = useContext(DiagramContext)
  const router = useRouter()
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const mermaidContainerRef = useRef<HTMLDivElement>(null)

  const [selectedOption, _setSelectedOption] =
    useState<OptionType>('Infographic')
  const [visionDescription, setVisionDescription] = useState('')
  const [colorPalette, setColorPalette] = useState('Brand colors (default)')
  const [complexityLevel, setComplexityLevel] = useState('Medium (default)')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // New states for the generated content
  const [svgCode, setSvgCode] = useState('')
  const [mermaidCode, setMermaidCode] = useState('')
  const [visualPlan, setVisualPlan] = useState('')
  const [diagramId, setDiagramId] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isGenerated, setIsGenerated] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  // Initialize mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    })
  }, [])

  // Render mermaid diagram when code changes
  useEffect(() => {
    if (mermaidCode && mermaidContainerRef.current) {
      try {
        mermaidContainerRef.current.innerHTML = ''
        mermaid
          .render('mermaid-diagram', mermaidCode)
          .then(({ svg }) => {
            if (mermaidContainerRef.current) {
              mermaidContainerRef.current.innerHTML = svg
            }
          })
          .catch((error) => {
            console.error('Mermaid rendering error:', error)
            setError('There was an error rendering the mermaid diagram.')
          })
      } catch (error) {
        console.error('Mermaid error:', error)
        setError('There was an error processing the mermaid diagram.')
      }
    }
  }, [mermaidCode, zoomLevel])

  // Update URL when diagram is generated
  useEffect(() => {
    if (diagramId) {
      // Update URL without refreshing the page
      window.history.pushState(
        { diagramId: diagramId },
        '',
        `/diagram/${diagramId}`,
      )
    }
  }, [diagramId])

  // Copy link to clipboard
  const copyLinkToClipboard = () => {
    const url = window.location.href
    navigator.clipboard
      .writeText(url)
      .then(() => {
        // You could add a toast notification here
        console.log('Link copied to clipboard')
      })
      .catch((err) => {
        console.error('Could not copy link: ', err)
      })
  }

  // Zoom in/out functions
  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3))
  }

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleOptionTypeChange = (option: OptionType) => {
    _setSelectedOption(option)
  }

  const handleVisionDescriptionChange = (description: string) => {
    setVisionDescription(description)
  }

  const handleColorPaletteChange = (palette: string) => {
    setColorPalette(palette)
  }

  const handleComplexityLevelChange = (level: string) => {
    setComplexityLevel(level)
  }

  const handleSubmit = async () => {
    if (!visionDescription.trim()) {
      setError('Please provide a description of your vision')
      // Smooth scroll to the description input div
      const descriptionInput = document.getElementById('vision-description')
      if (descriptionInput) {
        // Add highlight class
        descriptionInput.classList.add('border-2', 'border-red-500')

        // Scroll to the element
        descriptionInput.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })

        // Remove highlight class after 2 seconds
        setTimeout(() => {
          descriptionInput.classList.remove('border-2', 'border-red-500')
        }, 2000)
      }
      return
    }

    try {
      showLoading('Generating your diagram...', 'indigo')
      setIsLoading(true)
      setError('')
      context.setChartJsData(null)
      context.setMermaidData('')
      context.setNodes([])
      context.setEdges([])

      console.log('Vision Description: ', visionDescription)
      console.log('Selected Option: ', selectedOption)
      console.log('Color Palette: ', colorPalette)
      console.log('Complexity Level: ', complexityLevel)

      const response = await fetch('/api/generate-visual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedOption,
          description: visionDescription,
          colorPalette: colorPalette,
          complexityLevel: complexityLevel,
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError('Your session has expired. Please log in again.')
          router.push('/login')
          return
        }
        throw new Error(`API returned status: ${response.status}`)
      }

      const data = await response.json()

      console.log('Generate Visual API Response: ', data)

      if (!!data.error) {
        setError(data.error)
        return
      }

      const diagram_id = data.diagram_id as string

      if (selectedOption === 'Illustration') {
        const imageUrl = data.image_url as string
        setImageUrl(imageUrl)
        setSvgCode('')
        setMermaidCode('')
      } else if (selectedOption === 'Infographic') {
        const code = data.code as string
        let sanitizedSvgCode = sanitizeSVG(code)

        // Set the states with the generated content
        setSvgCode(sanitizedSvgCode.svgContent)
        setMermaidCode('')
      } else {
        // it must be a Mermaid Diagram
        const code = data.code as string
        let sanitizedMermaidCode = sanitizeMermaid(code)

        setMermaidCode(sanitizedMermaidCode)
        setSvgCode('')
        setImageUrl('')
      }

      setDiagramId(diagram_id)
      setIsGenerated(true)
    } catch (e) {
      console.log('Error generating visual: ', e)
      setError(
        'There was an error generating the diagram, please try creating again. We are sorry for the inconvenience.',
      )
    } finally {
      setIsLoading(false)
      hideLoading()
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/** Error Message */}
      {error && (
        <div className="mt-4 border-l-4 border-red-400 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <BugAntIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isGenerated ? (
        <div className="mt-6 space-y-8">
          {/* Generated content section */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Your {selectedOption}
            </h2>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                onClick={() => {
                  // Create a new illustration
                  setIsGenerated(false)
                  setVisionDescription('')
                  setSvgCode('')
                  setMermaidCode('')
                  setVisualPlan('')
                  setDiagramId(null)
                  setColorPalette('Brand colors (default)')
                  setComplexityLevel('Medium (default)')
                  // Update URL back to the create page
                  window.history.pushState({}, '', '/illustrations/new')
                }}
                variant="secondary"
                className="text-sm"
              >
                Create New
              </Button>
            </div>
          </div>

          {/* SVG/Mermaid Display with controls */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="flex items-center justify-between border-b bg-gray-50 p-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={zoomOut}
                  className="rounded-full p-1 transition-colors hover:bg-gray-200"
                  title="Zoom out"
                >
                  <ZoomOutIcon className="h-5 w-5 text-gray-700" />
                </button>
                <span className="text-sm text-gray-600">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  className="rounded-full p-1 transition-colors hover:bg-gray-200"
                  title="Zoom in"
                >
                  <ZoomInIcon className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={copyLinkToClipboard}
                  className="ml-2 rounded-full p-1 transition-colors hover:bg-gray-200"
                  title="Copy link"
                >
                  <LinkIcon className="h-5 w-5 text-gray-700" />
                </button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Color: {colorPalette}</span>
                <span>Complexity: {complexityLevel}</span>
              </div>
            </div>
            <div
              className="flex justify-center overflow-auto p-8"
              style={{
                maxHeight: '100vh',
                maxWidth: '100vw',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              {svgCode && (
                <div
                  ref={svgContainerRef}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s ease-in-out',
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                  dangerouslySetInnerHTML={{ __html: svgCode }}
                />
              )}
              {mermaidCode && (
                <div
                  ref={mermaidContainerRef}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s ease-in-out',
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              )}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Generated Illustration"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s ease-in-out',
                    width: '100%',
                    height: 'auto',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <Button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Create Illustration'}
            </Button>
          </div>

          <DiagramSelectionGrid
            setSelectedOption={handleOptionTypeChange}
            setVisionDescription={handleVisionDescriptionChange}
            setColorPalette={handleColorPaletteChange}
            setComplexityLevel={handleComplexityLevelChange}
          />
        </>
      )}
    </div>
  )
}
