import { DiagramOrChartType } from './utils'
import {
  ChartBarIcon,
  CloudIcon,
  ComputerDesktopIcon,
  PencilIcon,
} from '@heroicons/react/20/solid'
import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import {
  cloudArchitectPrompts,
  exampleChartDataPrompts,
  exampleFlowDiagramPrompts,
  exampleMermaidDiagramPrompts,
  exampleWhiteboardPrompts,
} from './Examples/ExamplePrompts'

export const DiagramSelectionOptionsAndExamples: {
  id: DiagramOrChartType | TempMermaidDiagramType
  title: string
  description: string
  prompts: { title: string; description: string }[]
  icon: React.FC
}[] = [
  {
    id: 'Flow Diagram' as DiagramOrChartType,
    title: 'Flow Diagram',
    description:
      'Flow diagrams are a great way to Visually represent processes, workflows, and algorithms with clear steps and decision points.',
    prompts: exampleFlowDiagramPrompts,
    icon: PencilIcon,
  },
  {
    id: 'Chart' as DiagramOrChartType,
    title: 'Chart',
    description:
      'Communicate data insights effectively with various chart types like bar charts, line charts, and pie charts.',
    prompts: exampleChartDataPrompts,
    icon: ChartBarIcon,
  },
  {
    id: 'Whiteboard' as DiagramOrChartType,
    title: 'Whiteboard',
    description:
      'Brainstorm visually using freehand drawing, shapes, and text. This is great for freeform thinking and collaboration.',
    prompts: exampleWhiteboardPrompts,
    icon: ComputerDesktopIcon,
  },
  {
    id: 'flowchart' as TempMermaidDiagramType,
    title: 'Flowchart',
    description:
      'Flowcharts are used to visualize the steps of a process or algorithm.',
    prompts: exampleMermaidDiagramPrompts.flowchart,
    icon: PencilIcon,
  },
  {
    id: 'classDiagram' as TempMermaidDiagramType,
    title: 'Class Diagram',
    description:
      'Class diagrams are the backbone of almost every object-oriented method, including UML. They describe the static structure of a system.',
    prompts: exampleMermaidDiagramPrompts.classDiagram,
    icon: PencilIcon,
  },
  {
    id: 'sequenceDiagram' as TempMermaidDiagramType,
    title: 'Sequence Diagram',
    description:
      'A sequence diagram is a type of interaction diagram that shows how processes operate with one another and in what order.',
    prompts: exampleMermaidDiagramPrompts.sequenceDiagram,
    icon: PencilIcon,
  },
  {
    id: 'stateDiagram' as TempMermaidDiagramType,
    title: 'State Diagram',
    description:
      'State diagrams are used to give an abstract description of the behavior of a system.',
    prompts: exampleMermaidDiagramPrompts.stateDiagram,
    icon: PencilIcon,
  },
  {
    id: 'entityRelationshipDiagram' as TempMermaidDiagramType,
    title: 'Entity Relationship Diagram',
    description:
      'Entity-relationship diagrams are used to model the structure of a database.',
    prompts: exampleMermaidDiagramPrompts.entityRelationshipDiagram,
    icon: PencilIcon,
  },
  {
    id: 'userJourney' as TempMermaidDiagramType,
    title: 'User Journey',
    description:
      'User journey diagrams are used to map out the steps a user takes to complete a task.',
    prompts: exampleMermaidDiagramPrompts.userJourney,
    icon: PencilIcon,
  },
  {
    id: 'gantt' as TempMermaidDiagramType,
    title: 'Gantt Chart',
    description:
      'Gantt charts are used to visualize the start and finish dates of the elements of a project.',
    prompts: exampleMermaidDiagramPrompts.gantt,
    icon: PencilIcon,
  },
  {
    id: 'pieChart' as TempMermaidDiagramType,
    title: 'Pie Chart',
    description:
      'Pie charts are used to show the proportion of different categories in a dataset.',
    prompts: exampleMermaidDiagramPrompts.pieChart,
    icon: PencilIcon,
  },
  {
    id: 'quadrantChart' as TempMermaidDiagramType,
    title: 'Quadrant Chart',
    description:
      "Quadrant charts, also known as quad charts, are visual tools that divide data into four quadrants to help identify trends and patterns in data. The chart's x-axis represents one variable, and the y-axis represents another. The quadrants are based on a criteria specific to the data being analyzed",
    prompts: exampleMermaidDiagramPrompts.quadrantChart,
    icon: PencilIcon,
  },
  {
    id: 'requirementDiagram' as TempMermaidDiagramType,
    title: 'Requirement Diagram',
    description:
      'Requirement diagrams are used to visualize the requirements of a system.',
    prompts: exampleMermaidDiagramPrompts.requirementDiagram,
    icon: PencilIcon,
  },
  {
    id: 'gitgraph' as TempMermaidDiagramType,
    title: 'Gitgraph',
    description:
      'Gitgraph diagrams are used to visualize the history of a Git repository.',
    prompts: exampleMermaidDiagramPrompts.gitgraph,
    icon: PencilIcon,
  },
  {
    id: 'mindmaps' as TempMermaidDiagramType,
    title: 'Mindmaps',
    description:
      'Mindmaps are used to visually organize information and ideas. They are great for brainstorming, note-taking, and problem-solving.',
    prompts: exampleMermaidDiagramPrompts.mindmaps,
    icon: PencilIcon,
  },
  {
    id: 'timeline' as TempMermaidDiagramType,
    title: 'Timeline',
    description:
      'Timelines are used to visualize events in chronological order.',
    prompts: exampleMermaidDiagramPrompts.timeline,
    icon: PencilIcon,
  },
  {
    id: 'zenuml' as TempMermaidDiagramType,
    title: 'ZenUML',
    description: 'ZenUML is a simple and intuitive way to create UML diagrams.',
    prompts: exampleMermaidDiagramPrompts.zenuml,
    icon: PencilIcon,
  },
  {
    id: 'sankey' as TempMermaidDiagramType,
    title: 'Sankey Diagram',
    description:
      'A Sankey diagram is a visualization technique that shows the flow of values from one set to another. The entities being connected are called nodes, and the connections are called links. Sankey diagrams use rectangles or text to represent nodes, and arrows or arcs to represent links. The width of the links is proportional to the importance of the flow. ',
    prompts: exampleMermaidDiagramPrompts.sankey,
    icon: PencilIcon,
  },
  {
    id: 'Cloud Architect' as DiagramOrChartType,
    title: 'Cloud Architect',
    description:
      'Cloud architects design and implement cloud-based solutions for businesses. They work with cloud technologies like AWS, Azure, and Google Cloud Platform.',
    prompts: cloudArchitectPrompts,
    icon: CloudIcon,
  },
]
