import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { useContext, useState } from 'react'

import Dropdown from './Dropdown'
import ChartOrDiagramSelection from './ChartOrDiagramSelection'
import {
  chartJsAverageNewYorkWeatherReport,
  chartJsCancerRatesExampleReport,
  chartJsNetflixFinancialExampleReport,
  chartJsTeslaStockPricesExampleReport,
} from '@/lib/chart-js.code'
import { DiagramOrChartType, cn } from '@/lib/utils'
import { track } from '@vercel/analytics'
import ErrorDialog from './ErrorDialog'

export const exampleFlowDiagramPrompts = [
  {
    title: 'What is the house buying process?',
    description: '',
  },
  {
    title: 'How do you make a peanut butter and jelly sandwich?',
    description: '',
  },
  {
    title: 'How to Make a Paper Airplane',
    description: '',
  },
  {
    title: 'Explain the Patient Triaging Process from a Patient Perspective',
    description: '',
  },
]

export const exampleChartDataPrompts = [
  {
    title: 'Average Temperature in NYC',
    description: chartJsAverageNewYorkWeatherReport,
  },
  {
    title: 'Netflix Sales Report',
    description: chartJsNetflixFinancialExampleReport,
  },
  {
    title: 'Tesla Stock Price',
    description: chartJsTeslaStockPricesExampleReport,
  },
  {
    title: 'Annual Cancer Rates',
    description: chartJsCancerRatesExampleReport,
  },
]

export const typeSelectionOptions = [
  {
    id: 1,
    title: 'Flow Diagram',
    description:
      'A flow diagram is a diagram representing some kind of process or workflow.',
    prompts: exampleFlowDiagramPrompts,
  },
  {
    id: 2,
    title: 'Chart',
    description:
      'A chart is a graphical representation of data, in which "the data is represented by symbols, such as bars in a bar chart, lines in a line chart, or slices in a pie chart".',
    prompts: exampleChartDataPrompts,
  },
]

export function StepLine() {
  return (
    <div
      className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-indigo-600"
      aria-hidden="true"
    />
  )
}

export default function TextBox() {
  const [openErrorDialog, setOpenErrorDialog] = useState(false)

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [error, setError] = useState<string | null>('')

  const [selectedType, setSelectedType] = useState(typeSelectionOptions[0])

  const context = useContext(DiagramContext)

  const handleSubmit = async () => {
    const type = selectedType.title as DiagramOrChartType
    context.setLoading(true)

    console.log('--- title', title)
    console.log('---- description', description)
    context.setTitle(title)
    context.setDescription(description)

    if (type === 'Chart' && !description) {
      setError(
        'Please enter the data for your chart in the description field. 🥺',
      )
      setOpenErrorDialog(true)
      context.setLoading(false)
      return
    }

    try {
      setError(null)

      // Submit analytics event
      if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
        track('create', {
          type: type,
          title: title,
        })
      }

      const diagram = await fetch('/api/generate-diagram', {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          description: description,
          type: type,
        }),
      })

      console.log('Diagram Response: ', diagram)

      const diagramJson = await diagram.json()

      console.log('Diagram JSON: ', JSON.parse(diagramJson.result))
      const diagramResult = JSON.parse(diagramJson.result)

      if (
        diagramResult &&
        diagramResult.nodes &&
        diagramResult.edges &&
        type === 'Flow Diagram'
      ) {
        context.setNodes(diagramResult.nodes)
        context.setEdges(diagramResult.edges)
      } else if (diagramResult && diagramResult.data && type === 'Chart') {
        context.setChartJsData(diagramResult)
      }

      context.setLoading(false)
    } catch (e) {
      console.log('Error generating diagram: ', e)
      context.setLoading(false)
      setError('There was an error generating the diagram, please try again')
    }
  }

  if (context.loading) {
    return (
      <>
        <div className="mt-14 h-96 w-full rounded-lg bg-pink-50 shadow-lg">
          <p className="text-md text-center text-pink-900">
            Please be patient while we generate your diagram, it may take a
            couple minutes.
          </p>
          <div className="flex h-full items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-pink-500"></div>
          </div>
        </div>
      </>
    )
  }

  const selectExample = (title: string, description: string) => {
    setTitle(title)
    setDescription(description)
  }

  const selectOption = (option: {
    id: number
    title: string
    description: string
    prompts: { title: string; description: string }[]
  }) => {
    console.log('Selecting option', option)
    setSelectedType(option)
    // selectExample(option.prompts[2].title, option.prompts[2].description)
    context.setType(option.title as DiagramOrChartType)
    context.setTitle(option.prompts[2].title)
    context.setDescription(option.prompts[2].description)
  }

  return (
    <>
      <nav aria-label="Progress">
        <ol role="list" className="overflow-hidden">
          <li key="1" className="relative mt-2">
            <>
              <StepLine />
              <div className="group relative flex items-start">
                <span className="flex h-9 items-center">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                    <p className="text-lg font-semibold text-white">1</p>
                  </span>
                </span>
                <span className="ml-4 flex min-w-0 flex-col">
                  <span className="text-xl font-medium font-semibold">
                    Choose a Type
                  </span>
                  <span className="text-md text-white">
                    <ChartOrDiagramSelection
                      options={typeSelectionOptions}
                      selectedOption={selectedType}
                      setSelectedOption={selectOption}
                    />
                  </span>
                </span>
              </div>
            </>
          </li>
          <li key="2" className="relative mt-2">
            <>
              <StepLine />

              <div className="group relative flex items-start">
                <span className="flex h-9 items-center">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                    <p className="text-lg font-semibold text-white">2</p>
                  </span>
                </span>
                <span className="ml-4 flex min-w-0 flex-col">
                  <span className="text-xl font-medium font-semibold">
                    Diagram Title
                  </span>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="mt-2 block w-96 rounded-lg border-0 pt-2.5 text-lg font-medium text-black placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Diagram Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </span>
              </div>
            </>
          </li>
          <li key="3" className="relative mt-2">
            <>
              <StepLine />

              <div className="group relative flex items-start">
                <span className="flex h-9 items-center">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                    <p className="text-lg font-semibold text-white">3</p>
                  </span>
                </span>
                <span className="ml-4 flex min-w-0 flex-col">
                  <span className="text-xl font-medium font-semibold">
                    {context.type === 'Chart'
                      ? 'Chart Data'
                      : 'Diagram Details'}
                  </span>
                  <textarea
                    rows={5}
                    name="description"
                    id="description"
                    className="mt-2 block w-96 resize-none rounded-lg border-0 py-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder={
                      context.type === 'Chart'
                        ? 'Enter Chart Data'
                        : 'Enter Diagram details here (optional)'
                    }
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </span>
              </div>
            </>
          </li>
          <li key="4" className="relative mt-2">
            <>
              <div className="group relative flex items-start">
                <span className="flex h-9 items-center">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                    <p className="text-lg font-semibold text-white">4</p>
                  </span>
                </span>
                <span className="ml-4 flex min-w-0 flex-col">
                  <span className="text-xl font-medium font-semibold">
                    Generate
                  </span>
                  <button
                    className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-lg hover:bg-indigo-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={handleSubmit}
                  >
                    Create
                  </button>
                </span>
              </div>
            </>
          </li>
        </ol>
      </nav>

      <div className="mt-2">
        <Dropdown values={selectedType.prompts} selectExample={selectExample} />
      </div>

      <ErrorDialog
        title="Error Generating Diagram"
        message={error || ''}
        setOpen={setOpenErrorDialog}
        open={openErrorDialog}
      />
    </>
  )
}
