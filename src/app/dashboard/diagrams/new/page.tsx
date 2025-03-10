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
  OptionType,
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
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import FormStep from './FormStep'
import DiagramSelectionGrid from './DiagramSelectionGrid'
import ProgressStepper from './ProgressStepper'
import Button from '@/components/ui/Button'

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
    description:
      'A visual representation of the steps in a process. It helps to show how different parts of a task or project connect and flow together. Think of it like a map for a complex activity.',
    iconBackground: 'bg-indigo-50',
    iconForeground: 'text-indigo-600',
    icon: CheckIcon,
    id: 'Flow Diagram',
  },
  {
    title: 'Chart',
    description:
      'A general term for visual representations of data, using bars, lines, points, or other shapes. Charts make data easier to understand and analyze.',
    iconBackground: 'bg-yellow-50',
    iconForeground: 'text-yellow-600',
    icon: PresentationChartBarIcon,
    id: 'Chart',
  },
  {
    title: 'Flow Chart',
    description:
      'Very similar to a flow diagram, it uses specific symbols (rectangles, diamonds, etc.) to represent different types of actions in a process (decisions, tasks, inputs, outputs).',
    iconBackground: 'bg-green-50',
    iconForeground: 'text-green-600',
    icon: ArrowUpCircleIcon,
    id: 'flowchart',
  },
  {
    title: 'Sequence Diagram',
    description:
      "Shows how different parts of a system interact with each other over time. It's like a comic strip for software, illustrating the order of messages or actions between components.",
    iconBackground: 'bg-blue-50',
    iconForeground: 'text-blue-600',
    icon: ArrowTrendingUpIcon,
    id: 'sequenceDiagram',
  },
  {
    title: 'Class Diagram',
    description:
      'Used in software development, it provides a blueprint for the structure of a program. It defines the classes (types of objects), their properties, and how they relate to each other.',
    iconBackground: 'bg-purple-50',
    iconForeground: 'text-purple-600',
    icon: DocumentMagnifyingGlassIcon,
    id: 'classDiagram',
  },
  {
    title: 'State Diagram',
    description:
      'Illustrates the different states an object can be in and how it transitions between those states. For instance, a traffic light might have states like "red," "yellow," and "green."',
    iconBackground: 'bg-red-50',
    iconForeground: 'text-red-600',
    icon: PresentationChartLineIcon,
    id: 'stateDiagram',
  },
  {
    title: 'Entity Relationship Diagram',
    description:
      'Used in database design, it maps out the relationships between different entities (people, objects, concepts). It helps to define how data should be organized and stored.',
    iconBackground: 'bg-indigo-50',
    iconForeground: 'text-indigo-600',
    icon: Square2StackIcon,
    id: 'entityRelationshipDiagram',
  },
  {
    title: 'User Journey',
    description:
      "A visual story of a user's experience interacting with a product or service. It highlights touchpoints, pain points, and opportunities for improvement.",
    iconBackground: 'bg-gray-50',
    iconForeground: 'text-gray-500',
    icon: UserGroupIcon,
    id: 'userJourney',
  },
  {
    title: 'Gantt',
    description:
      "A horizontal bar chart that shows a project timeline. Each bar represents a task, and its length indicates the task's duration. It's helpful for planning and tracking project schedules.",
    iconBackground: 'bg-yellow-50',
    iconForeground: 'text-yellow-600',
    icon: BugAntIcon,
    id: 'gantt',
  },
  {
    title: 'Pie Chart',
    description:
      'A circular chart divided into slices. Each slice represents a portion of a whole. Pie charts are used to show percentages or proportions.',
    iconBackground: 'bg-green-50',
    iconForeground: 'text-green-600',
    icon: ChartPieIcon,
    id: 'pieChart',
  },
  {
    title: 'Quadrant Chart',
    description:
      "A grid divided into four sections. It's used to categorize items based on two criteria. For example, a quadrant chart might plot products based on their market share and growth rate.",
    iconBackground: 'bg-blue-50',
    iconForeground: 'text-blue-600',
    icon: PuzzlePieceIcon,
    id: 'quadrantChart',
  },
  {
    title: 'Requirement Diagram',
    description:
      'Used to capture and organize the functional and non-functional requirements of a project. It helps to ensure that everyone has a clear understanding of what needs to be built.',
    iconBackground: 'bg-purple-50',
    iconForeground: 'text-purple-600',
    icon: BriefcaseIcon,
    id: 'requirementDiagram',
  },
  {
    title: 'Git Graph',
    description:
      'Visualizes the history of a project in a version control system like Git. It shows branches, commits, merges, and other changes over time.',
    iconBackground: 'bg-red-50',
    iconForeground: 'text-red-600',
    icon: SparklesIcon,
    id: 'gitgraph',
  },
  {
    title: 'Mindmaps',
    description:
      'A diagram used to visually organize information. It starts with a central idea and branches out into related concepts and subtopics. Great for brainstorming and note-taking.',
    iconBackground: 'bg-indigo-50',
    iconForeground: 'text-indigo-600',
    icon: FireIcon,
    id: 'mindmaps',
  },
  {
    title: 'Timeline',
    description:
      'A visual representation of events in chronological order. It helps to understand the sequence of historical events or the steps in a project plan.',
    iconBackground: 'bg-gray-50',
    iconForeground: 'text-gray-500',
    icon: ClockIcon,
    id: 'timeline',
  },
  {
    title: 'ZenUML',
    description:
      'A text-based way to create UML diagrams. You write simple descriptions, and ZenUML generates the corresponding diagram.',
    iconBackground: 'bg-yellow-50',
    iconForeground: 'text-yellow-600',
    icon: DocumentDuplicateIcon,
    id: 'zenuml',
  },
  {
    title: 'Sankey',
    description:
      'Shows flows or transfers between different entities. The width of the arrows or bands indicates the magnitude of the flow. Often used to visualize energy flows or financial transactions.',
    iconBackground: 'bg-green-50',
    iconForeground: 'text-green-600',
    icon: ForwardIcon,
    id: 'sankey',
  },
]

export default function NewDiagramPage() {
  const context = useContext(DiagramContext)

  const [selectedDiagram, setSelectedDiagram] = useState<string | null>(null)
  const [selectedOption, _setSelectedOption] =
    useState<OptionType>('Infographic')

  const [diagramTitle, setDiagramTitle] = useState<string>('')
  const [diagramDescription, setDiagramDescription] = useState<string>('')

  const [error, setError] = useState<string>('')

  const handleDiagramSelection = (diagramType: string) => {
    setSelectedDiagram(diagramType)
  }

  const handleNextStep = () => {
    const title = document.getElementById('diagram-title') as HTMLInputElement
    const description = document.getElementById(
      'diagram-description',
    ) as HTMLTextAreaElement

    setDiagramTitle(title.value)
    setDiagramDescription(description.value)

    if (!title.value || !description.value) {
      return
    }

    handleSubmit(title.value, description.value)
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
      return
    }

    try {
      setError('')
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

          // Show the feedback modal after 10 seconds
          setTimeout(() => {
            context.setFeedbackModalOpen(true)
          }, 10000)
        })
    } catch (e) {
      console.log('Error generating diagram: ', e)
      setError(
        'There was an error generating the diagram, please try creating again. We are sorry for the inconvenience.',
      )
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* <ProgressStepper steps={steps} /> */}

      <section aria-labelledby="diagram-options" className="mt-8">
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

        <div className="flex justify-end">
          <Button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={handleNextStep}
          >
            Submit
          </Button>
        </div>

        <DiagramSelectionGrid
          availableDiagrams={availableDiagrams}
          handleDiagramSelection={handleDiagramSelection}
          selectedDiagram={selectedDiagram}
          _setSelectedOption={_setSelectedOption}
        />

        {/* {currentStep === 3 && (
          <>
            <DiagramOrChartView type={selectedDiagram as any} />
          </>
        )} */}
      </section>
    </div>
  )
}
