'use client'

import DiagramOrChartView from '@/components/DiagramOrChartView'
import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import PageLoader from '@/components/PageLoader'
import StarRatingInput from '@/components/StarRatingInput'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import {
  cn,
  DiagramOrChartType,
  DiagramType,
  extractParsableJSON,
} from '@/lib/utils'
import {
  ArrowTrendingUpIcon,
  ArrowUpCircleIcon,
  BriefcaseIcon,
  BugAntIcon,
  ChartPieIcon,
  CheckIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  DocumentMagnifyingGlassIcon,
  FireIcon,
  ForwardIcon,
  PresentationChartBarIcon,
  PuzzlePieceIcon,
  SparklesIcon,
  Square2StackIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid'
import { PresentationChartLineIcon } from '@heroicons/react/24/outline'
import { track } from '@vercel/analytics'

import { motion } from 'framer-motion'
import { useContext, useState } from 'react'

enum StepsStatus {
  Complete = 'complete',
  Current = 'current',
  Upcoming = 'upcoming',
}

const steps = [
  {
    id: 1,
    name: 'Choose Diagram Type',
    status: StepsStatus.Current,
  },
  {
    id: 2,
    name: 'Describe Your Diagram',
    status: StepsStatus.Upcoming,
  },
  { id: 3, name: 'Preview & Export', status: StepsStatus.Upcoming },
]

/** export enum DiagramType {
  FlowDiagram = 'Flow Diagram',
  Whiteboard = 'Whiteboard',
  Chart = 'Chart',
  FlowChart = 'flowchart',
  SequenceDiagram = 'sequenceDiagram',
  ClassDiagram = 'classDiagram',
  StateDiagram = 'stateDiagram',
  EntityRelationshipDiagram = 'erDiagram',
  UserJourney = 'userJourney',
  Gantt = 'gantt',
  PieChart = 'pieChart',
  QuadrantChart = 'quadrantChart',
  RequirementDiagram = 'requirementDiagram',
  GitGraph = 'gitGraph',
  Mindmaps = 'mindmaps',
  Timeline = 'timeline',
  ZenUML = 'zenuml',
  Sankey = 'sankey',
} */
const availableDiagrams: {
  title: string
  description: string
  iconBackground: string
  iconForeground: string
  icon: any
  id: DiagramOrChartType | TempMermaidDiagramType
}[] = [
  {
    title: 'Flow Diagram',
    description: 'Create a flow diagram to visualize a process or system.',
    iconBackground: 'bg-indigo-50',
    iconForeground: 'text-indigo-600',
    icon: CheckIcon,
    id: 'Flow Diagram',
  },
  {
    title: 'Chart',
    description: 'Create a chart to visualize data or statistics.',
    iconBackground: 'bg-yellow-50',
    iconForeground: 'text-yellow-600',
    icon: PresentationChartBarIcon,
    id: 'Chart',
  },
  {
    title: 'Flow Chart',
    description: 'Create a flow chart to visualize a process or system.',
    iconBackground: 'bg-green-50',
    iconForeground: 'text-green-600',
    icon: ArrowUpCircleIcon,
    id: 'flowchart',
  },
  {
    title: 'Sequence Diagram',
    description: 'Create a sequence diagram to visualize a process or system.',
    iconBackground: 'bg-blue-50',
    iconForeground: 'text-blue-600',
    icon: ArrowTrendingUpIcon,
    id: 'sequenceDiagram',
  },
  {
    title: 'Class Diagram',
    description: 'Create a class diagram to visualize a process or system.',
    iconBackground: 'bg-purple-50',
    iconForeground: 'text-purple-600',
    icon: DocumentMagnifyingGlassIcon,
    id: 'classDiagram',
  },
  {
    title: 'State Diagram',
    description: 'Create a state diagram to visualize a process or system.',
    iconBackground: 'bg-red-50',
    iconForeground: 'text-red-600',
    icon: PresentationChartLineIcon,
    id: 'stateDiagram',
  },
  {
    title: 'Entity Relationship Diagram',
    description:
      'Create an entity relationship diagram to visualize a process or system.',
    iconBackground: 'bg-indigo-50',
    iconForeground: 'text-indigo-600',
    icon: Square2StackIcon,
    id: 'entityRelationshipDiagram',
  },
  {
    title: 'User Journey',
    description:
      'Create a user journey diagram to visualize a process or system.',
    iconBackground: 'bg-gray-50',
    iconForeground: 'text-gray-500',
    icon: UserGroupIcon,
    id: 'userJourney',
  },
  {
    title: 'Gantt',
    description: 'Create a gantt diagram to visualize a process or system.',
    iconBackground: 'bg-yellow-50',
    iconForeground: 'text-yellow-600',
    icon: BugAntIcon,
    id: 'gantt',
  },
  {
    title: 'Pie Chart',
    description: 'Create a pie chart to visualize a process or system.',
    iconBackground: 'bg-green-50',
    iconForeground: 'text-green-600',
    icon: ChartPieIcon,
    id: 'pieChart',
  },
  {
    title: 'Quadrant Chart',
    description: 'Create a quadrant chart to visualize a process or system.',
    iconBackground: 'bg-blue-50',
    iconForeground: 'text-blue-600',
    icon: PuzzlePieceIcon,
    id: 'quadrantChart',
  },
  {
    title: 'Requirement Diagram',
    description:
      'Create a requirement diagram to visualize a process or system.',
    iconBackground: 'bg-purple-50',
    iconForeground: 'text-purple-600',
    icon: BriefcaseIcon,
    id: 'requirementDiagram',
  },
  {
    title: 'Git Graph',
    description: 'Create a git graph to visualize a process or system.',
    iconBackground: 'bg-red-50',
    iconForeground: 'text-red-600',
    icon: SparklesIcon,
    id: 'gitgraph',
  },
  {
    title: 'Mindmaps',
    description: 'Create a mindmaps diagram to visualize a process or system.',
    iconBackground: 'bg-indigo-50',
    iconForeground: 'text-indigo-600',
    icon: FireIcon,
    id: 'mindmaps',
  },
  {
    title: 'Timeline',
    description: 'Create a timeline diagram to visualize a process or system.',
    iconBackground: 'bg-gray-50',
    iconForeground: 'text-gray-500',
    icon: ClockIcon,
    id: 'timeline',
  },
  {
    title: 'ZenUML',
    description: 'Create a zenuml diagram to visualize a process or system.',
    iconBackground: 'bg-yellow-50',
    iconForeground: 'text-yellow-600',
    icon: DocumentDuplicateIcon,
    id: 'zenuml',
  },
  {
    title: 'Sankey',
    description: 'Create a sankey diagram to visualize a process or system.',
    iconBackground: 'bg-green-50',
    iconForeground: 'text-green-600',
    icon: ForwardIcon,
    id: 'sankey',
  },
]

export default function NewDiagrampage() {
  const context = useContext(DiagramContext)

  const [selectedDiagram, setSelectedDiagram] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<number>(1)

  const [diagramTitle, setDiagramTitle] = useState<string>('')
  const [diagramDescription, setDiagramDescription] = useState<string>('')

  const [error, setError] = useState<string>('')

  const handleDiagramSelection = (diagramType: string) => {
    setSelectedDiagram(diagramType)

    // Set current step's status to complete
    steps[currentStep - 1].status = StepsStatus.Complete
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedDiagram) {
        return
      }

      setCurrentStep((prev) => prev + 1)
    }

    if (currentStep === 2) {
      const title = document.getElementById('diagram-title') as HTMLInputElement
      const description = document.getElementById(
        'diagram-description',
      ) as HTMLTextAreaElement

      setDiagramTitle(title.value)
      setDiagramDescription(description.value)

      if (!title.value || !description.value) {
        return
      }

      steps[currentStep - 1].status = StepsStatus.Complete

      handleSubmit(title.value, description.value)
    }
  }

  const handleSubmit = async (
    title: string,
    description: string,
    trialNumber: number = 0,
  ) => {
    context.setTitle(title)
    context.setDescription(description)
    context.setType(selectedDiagram as any)

    console.log('Title: ', title, 'Description: ', description)

    if (trialNumber > 2) {
      setError(
        'There was an error generating the diagram, please try creating again. We are sorry for the inconvenience.',
      )
      setCurrentStep(2)
      return
    }

    try {
      setError('')
      setCurrentStep(0)
      context.setChartJsData(null)
      context.setMermaidData('')
      context.setNodes([])
      context.setEdges([])

      if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
        track('create', {
          type: selectedDiagram,
          title: title,
        })
      }

      await fetch('/api/generate-diagram', {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          description: description,
          type: selectedDiagram,
        }),
      })
        .catch((e) => {
          console.log('Error generating diagram: ', e)
          setCurrentStep(2)
          setError(
            'There was an error generating the diagram, please try again',
          )
        })
        .then(async (diagram: any) => {
          console.log('Diagram Response: ', diagram)
          if (diagram.status === 401 || diagram.status === 400) {
            setError(
              'You have reached the maximum number of diagrams you can create. Please subscribe to create more diagrams.',
            )
            setCurrentStep(2)
            return
          }

          const diagramJson = await diagram.json()
          console.log('Diagram JSON 2: ', diagramJson)

          if (
            diagramJson.result &&
            selectedDiagram !== 'Chart' &&
            selectedDiagram !== 'Flow Diagram'
          ) {
            console.log('Setting Mermaid Data: ', diagramJson.result)
            // remove the ``` from the start and end of the string

            const cleanedUpMermaidData = diagramJson.result
              .replace('```', '')
              .replace('```', '')
              .trim()

            context.setMermaidData(cleanedUpMermaidData)
            context.setDiagramId(diagramJson.id)
            setCurrentStep(3)
            steps[currentStep].status = StepsStatus.Complete

            // Show the feedback modal after 10 seconds
            setTimeout(() => {
              context.setFeedbackModalOpen(true)
            }, 10000)
            return
          }

          const whatToParse = diagramJson.result
            ? diagramJson.result
            : diagramJson.records

          const parseableJson = extractParsableJSON(whatToParse)

          if (parseableJson === null) {
            setCurrentStep(0)
            handleSubmit(title, description, trialNumber + 1)
            return
          }

          console.log(
            'Diagram JSON: ',
            JSON.parse(parseableJson),
            'Type: ',
            selectedDiagram,
          )

          let diagramResult = JSON.parse(diagramJson.result)
          console.log('Diagram Result: ', diagramResult)

          if (
            diagramResult &&
            diagramResult.nodes &&
            diagramResult.edges &&
            selectedDiagram === 'Flow Diagram'
          ) {
            context.setNodes(diagramResult.nodes)
            context.setEdges(diagramResult.edges)
          } else if (
            diagramResult &&
            diagramResult.data &&
            selectedDiagram === 'Chart'
          ) {
            context.setChartJsData(diagramResult)
          }

          context.setDiagramId(diagramJson.id)
          setCurrentStep(3)
          steps[currentStep].status = StepsStatus.Complete

          // Show the feedback modal after 10 seconds
          setTimeout(() => {
            context.setFeedbackModalOpen(true)
          }, 10000)
        })
    } catch (e) {
      console.log('Error generating diagram: ', e)
      setCurrentStep(2)
      setError(
        'There was an error generating the diagram, please try creating again. We are sorry for the inconvenience.',
      )
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <nav aria-label="Progress">
        <ol
          role="list"
          className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
        >
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative md:flex md:flex-1">
              {step.status === 'complete' ? (
                <motion.div
                  className="group flex w-full items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                      <CheckIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-900">
                      {step.name}
                    </span>
                  </span>
                </motion.div>
              ) : step.status === 'current' ? (
                <motion.div
                  className="flex items-center px-6 py-4 text-sm font-medium"
                  aria-current="step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600">
                    <span className="text-indigo-600">{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-indigo-600">
                    {step.name}
                  </span>
                </motion.div>
              ) : (
                <motion.div className="group flex items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                      <span className="text-gray-500 group-hover:text-gray-900">
                        {step.id}
                      </span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                      {step.name}
                    </span>
                  </span>
                </motion.div>
              )}

              {stepIdx !== steps.length - 1 ? (
                <>
                  {/* Arrow separator for lg screens and up */}
                  <div
                    className="absolute right-0 top-0 hidden h-full w-5 md:block"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>

      <section aria-labelledby="diagram-options" className="mt-8">
        {/** Prev Button */}
        {currentStep > 1 && (
          <div className="flex justify-start">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => {
                setCurrentStep((prev) => prev - 1)
                steps[currentStep - 1].status = StepsStatus.Current
              }}
            >
              Previous
            </button>
          </div>
        )}

        {/** Error Message */}
        {error && (
          <div className="mt-4 border-l-4 border-red-400 bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <BugAntIcon
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/** Next Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={handleNextStep}
          >
            Next
          </button>
        </div>

        {/** Show loader */}
        {currentStep === 0 && <PageLoader />}

        {currentStep === 1 && (
          <div className="overflow-hidden rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3 sm:gap-px">
            {availableDiagrams.map((availableDiagram, diagramIdx) => (
              <motion.div
                onClick={() => handleDiagramSelection(availableDiagram.id)}
                key={availableDiagram.title}
                className={cn(
                  'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500',
                )}
                whileHover={{
                  scale: 1.05,
                  zIndex: 1,
                  transition: { duration: 0.3 },
                  boxShadow:
                    '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <>
                  <span
                    className={cn(
                      availableDiagram.iconBackground,
                      availableDiagram.iconForeground,
                      'inline-flex rounded-lg p-3 ring-4 ring-white',
                    )}
                  >
                    <availableDiagram.icon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </span>
                </>
                <div className="mt-8">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {availableDiagram.title}
                  </h3>
                  <motion.p
                    className="mt-1 text-sm leading-5 text-gray-500"
                    whileHover={{ scale: 1.05 }}
                  >
                    {availableDiagram.description}
                  </motion.p>
                </div>
                <motion.span
                  className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {selectedDiagram === availableDiagram.id ? (
                    <CheckIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                  ) : null}
                </motion.span>
              </motion.div>
            ))}
          </div>
        )}

        {/** Show the diagram title input box and description text area */}
        {currentStep === 2 && (
          <div>
            <>
              <label
                htmlFor="diagram-title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Diagram Title
              </label>
              <div className="my-6">
                <div className="flex rounded-md shadow-md ring-1 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-lg">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    Title:
                  </span>
                  <input
                    type="text"
                    name="diagram-title"
                    id="diagram-title"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Enter a title for your diagram"
                  />
                </div>
              </div>
            </>
            <>
              <label
                htmlFor="diagram-description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  rows={10}
                  name="diagram-description"
                  id="diagram-description"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
            </>
          </div>
        )}

        {currentStep === 3 && (
          <>
            <DiagramOrChartView type={selectedDiagram as any} />
          </>
        )}
      </section>
    </div>
  )
}
