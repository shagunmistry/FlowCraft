'use client'
import { useState } from 'react'
import {
  MermaidDiagramEnums,
  MermaidDiagramType,
  MermaidDiagramTypes,
} from '@/lib/utils.mermaid'
import {
  ArrowLongRightIcon,
  ArrowLongUpIcon,
  BugAntIcon,
  ChartPieIcon,
  ChevronRightIcon,
  ClockIcon,
  ComputerDesktopIcon,
  DocumentCheckIcon,
  DocumentIcon,
  GlobeAltIcon,
  MapIcon,
  PresentationChartBarIcon,
  PresentationChartLineIcon,
  QueueListIcon,
  Square2StackIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid'
import OverviewDialog from '@/components/Mermaid/OverviewDialog.mermaid'
import { Badge } from '@/components/Badge'

const DiagramIcon: React.FC<{ type: string }> = ({ type }) => {
  return (
    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-gray-100">
      {type === 'flowchart' && (
        <ArrowLongUpIcon className="h-6 w-6 text-gray-500" />
      )}
      {type === 'sequenceDiagram' && (
        <ArrowLongRightIcon className="h-6 w-6 text-gray-500" />
      )}
      {type === 'classDiagram' && (
        <DocumentIcon className="h-6 w-6 text-gray-500" />
      )}
      {type === 'stateDiagram' && (
        <PresentationChartLineIcon className="h-6 w-6 text-gray-500" />
      )}
      {type === 'entityRelationshipDiagram' && (
        <PresentationChartBarIcon className="h-6 w-6 text-gray-500" />
      )}
      {type === 'userJourney' && (
        <UserGroupIcon className="h-6 w-6 text-gray-500" />
      )}
      {type === 'gantt' && <BugAntIcon className="h-6 w-6 text-gray-500" />}
      {type === 'pieChart' && (
        <ChartPieIcon className="h-6 w-6 text-gray-500" />
      )}
      {type === 'quadrantChart' && (
        <Square2StackIcon className="h-6 w-6 text-gray-500" />
      )}
      {type === 'requirementDiagram' && (
        <DocumentCheckIcon className="h-6 w-6 text-gray-500" />
      )}
      {type === 'gitgraph' && (
        <ComputerDesktopIcon className="h-6 w-6 text-gray-500" />
      )}
      {type === 'mindmaps' && <MapIcon className="h-6 w-6 text-gray-500" />}
      {type === 'timeline' && <ClockIcon className="h-6 w-6 text-gray-500" />}
      {type === 'zenuml' && <QueueListIcon className="h-6 w-6 text-gray-500" />}
      {type === 'sankey' && <GlobeAltIcon className="h-6 w-6 text-gray-500" />}
    </div>
  )
}

console.log('DiagramTypes:', MermaidDiagramTypes)

const DiagramOptions: {
  [key: string]: {
    title: string
    description: string
    link: string
  }
} = {
  flowchart: {
    title: 'Flowchart',
    description:
      'A flowchart is a type of diagram that represents a workflow or process.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.FlowChart}`,
  },
  sequenceDiagram: {
    title: 'Sequence Diagram',
    description:
      'A sequence diagram shows how objects interact in a particular scenario of a use case.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.SequenceDiagram}`,
  },
  classDiagram: {
    title: 'Class Diagram',
    description:
      'A class diagram is a type of static structure diagram that describes the structure of a system by showing the system’s classes, their attributes, operations (or methods), and the relationships among objects.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.ClassDiagram}`,
  },
  stateDiagram: {
    title: 'State Diagram',
    description:
      'A state diagram is a type of diagram used in computer science and related fields to describe the behavior of systems.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.StateDiagram}`,
  },
  entityRelationshipDiagram: {
    title: 'Entity Relationship Diagram',
    description:
      'An entity-relationship diagram (ERD) is a data modeling technique that graphically illustrates an information system’s entities and the relationships between those entities.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.EntityRelationshipDiagram}`,
  },
  userJourney: {
    title: 'User Journey',
    description:
      'A user journey map is a visualization of the process that a person goes through in order to accomplish a goal.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.UserJourney}`,
  },
  gantt: {
    title: 'Gantt Diagram',
    description:
      'A Gantt chart is a type of bar chart that illustrates a project schedule.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.Gantt}`,
  },
  pieChart: {
    title: 'Pie Chart',
    description:
      'A pie chart is a circular statistical graphic that is divided into slices to illustrate numerical proportions.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.PieChart}`,
  },
  quadrantChart: {
    title: 'Quadrant Chart',
    description:
      'A quadrant chart is a type of chart that is divided into four equal parts.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.QuadrantChart}`,
  },
  requirementDiagram: {
    title: 'Requirement Diagram',
    description:
      'A requirement diagram is a type of diagram that represents the requirements of a system.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.RequirementDiagram}`,
  },
  gitgraph: {
    title: 'Gitgraph Diagram',
    description:
      'A Gitgraph diagram is a type of diagram that represents the history of a Git repository.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.GitgraphDiagram}`,
  },
  mindmaps: {
    title: 'Mindmaps',
    description:
      'A mind map is a diagram used to visually organize information.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.Mindmaps}`,
  },
  timeline: {
    title: 'Timeline',
    description:
      'A timeline is a type of diagram that represents a sequence of events.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.Timeline}`,
  },
  zenuml: {
    title: 'Zenuml',
    description: 'Zenuml is a tool for creating sequence diagrams from text.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.Zenuml}`,
  },
  sankey: {
    title: 'Sankey',
    description:
      'A Sankey diagram is a type of diagram that shows the flow of energy or materials.',
    link: `/dashboard/mermaid/${MermaidDiagramEnums.Sankey}`,
  },
}

export default function ComplexDiagramsPage() {
  const [diagramType, setDiagramType] = useState<any>('flowchart')

  const [openOverview, setOpenOverview] = useState(false)

  return (
    <div className="lg:border-b lg:border-t lg:border-gray-200">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <div className="my-6 ml-4">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Choose a Diagram Type
            <Badge badgeType="experimental" />
          </h3>
        </div>
        <ul
          role="list"
          className="divide-y overflow-hidden border border-gray-200 bg-white shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl"
        >
          {Object.keys(DiagramOptions).map((type) => {
            return (
              <li
                key={type}
                className="relative flex transform justify-between gap-x-6 px-4 py-5 transition duration-300 ease-in-out hover:scale-105 hover:cursor-pointer hover:bg-red-50 hover:shadow-lg sm:px-6"
                onClick={() => {
                  setDiagramType(type as MermaidDiagramType)
                  setOpenOverview(true)
                }}
              >
                <div className="flex min-w-0 gap-x-4">
                  <DiagramIcon type={type} />
                  <div className="min-w-0 flex-auto">
                    <p className="text-lg font-semibold leading-6 text-red-500">
                      <span className="absolute inset-x-0 -top-px bottom-0" />
                      {DiagramOptions[type].title}
                    </p>
                    <p className="mt-1 flex text-sm leading-5 text-gray-500">
                      {DiagramOptions[type].description}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-4">
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    Create
                  </div>
                  <ChevronRightIcon
                    className="h-5 w-5 flex-none text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <OverviewDialog
        type={diagramType}
        open={openOverview}
        setOpen={setOpenOverview}
      />
    </div>
  )
}
