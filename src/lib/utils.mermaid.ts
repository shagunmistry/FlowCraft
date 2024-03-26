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
