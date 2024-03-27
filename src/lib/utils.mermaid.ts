import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'

export const MermaidDiagramTypes = [
  'FlowChart',
  'Sequence Diagram',
  'Class Diagram',
  'State Diagram',
  'Entity Relationship Diagram',
  'User Journey',
  'Gantt',
  'Pie Chart',
  'Quadrant Chart',
  'Requirement Diagram',
  'Gitgraph (Git) Diagram',
  'Mindmaps',
  'Timeline',
  'Zenuml',
  'Sankey',
]

export type MermaidDiagramType =
  | 'FlowChart'
  | 'Sequence Diagram'
  | 'Class Diagram'
  | 'State Diagram'
  | 'Entity Relationship Diagram'
  | 'User Journey'
  | 'Gantt'
  | 'Pie Chart'
  | 'Quadrant Chart'
  | 'Requirement Diagram'
  | 'Gitgraph (Git) Diagram'
  | 'Mindmaps'
  | 'Timeline'
  | 'Zenuml'
  | 'Sankey'

export enum MermaidDiagramEnums {
  FlowChart = 'Flowchart',
  SequenceDiagram = 'sequence-diagram',
  ClassDiagram = 'class-diagram',
  StateDiagram = 'state-diagram',
  EntityRelationshipDiagram = 'entity-relationship-diagram',
  UserJourney = 'user-journey',
  Gantt = 'gantt-diagram',
  PieChart = 'pie-chart',
  QuadrantChart = 'quadrant-chart',
  RequirementDiagram = 'requirement-diagram',
  GitgraphDiagram = 'gitgraph-diagram',
  Mindmaps = 'mindmaps',
  Timeline = 'timeline',
  Zenuml = 'zenuml',
  Sankey = 'sankey',
}

export const getMermaidDiagramTitle = (type: TempMermaidDiagramType) => {
  switch (type) {
    case 'flowchart':
      return 'Flowchart'
    case 'sequenceDiagram':
      return 'Sequence Diagram'
    case 'classDiagram':
      return 'Class Diagram'
    case 'stateDiagram':
      return 'State Diagram'
    case 'entityRelationshipDiagram':
      return 'Entity Relationship Diagram'
    case 'userJourney':
      return 'User Journey'
    case 'gantt':
      return 'Gantt Chart'
    case 'pieChart':
      return 'Pie Chart'
    case 'quadrantChart':
      return 'Quadrant Chart'
    case 'requirementDiagram':
      return 'Requirement Diagram'
    case 'gitgraph':
      return 'Git Graph'
    case 'mindmaps':
      return 'Mind Maps'
    case 'timeline':
      return 'Timeline'
    case 'zenuml':
      return 'ZenUML'
    case 'sankey':
      return 'Sankey Diagram'
    default:
      return 'Diagram'
  }
}
