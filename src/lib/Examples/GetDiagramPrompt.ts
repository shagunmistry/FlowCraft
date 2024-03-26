import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import { DiagramOrChartType } from '../utils'
import { promptForChartJsContext, promptForReactFlowContext } from '../openai'
import {
  classDiagramCommandsPrompt,
  flowchartCommandsPrompt,
  sequenceDiagramCommandsPrompt,
  stateDiagramCommandsPrompt,
} from '../completions-prompt.mermaid'
import { EntityRelationshipMermaidPrompt } from './EntityRelationship.mermaid'
import { GanttMermaidPrompt } from './Gantt.mermaid'
import { GitflowMermaidPrompt } from './Gitflow.mermaid'
import { MindmapsMermaidPrompt } from './Mindmaps.mermaid'
import { PieChartMermaidPrompt } from './PieChart.mermaid'
import { QuadrantChartMermaidPrompt } from './QuadrantChart.mermaid'
import { RequirementsDiagramMermaidPrompt } from './RequirementsDiagram.mermaid'
import { SankeyMermaidPrompt } from './Sankey.mermaid'
import { TimelineMermaidPrompt } from './Timeline.mermaid'
import { UserJourneyMermaidPrompt } from './UserJourney.mermaid'
import { ZenumlMermaidPrompt } from './Zenuml.mermaid'

export const getDiagramPrompt = (
  type: DiagramOrChartType | TempMermaidDiagramType,
  contextText: string,
) => {
  switch (type) {
    case 'Flow Diagram':
      return promptForReactFlowContext(contextText)
    case 'Chart':
      return promptForChartJsContext(contextText)
    case 'classDiagram':
      return classDiagramCommandsPrompt
    case 'entityRelationshipDiagram':
      return EntityRelationshipMermaidPrompt
    case 'sequenceDiagram':
      return sequenceDiagramCommandsPrompt
    case 'stateDiagram':
      return stateDiagramCommandsPrompt
    case 'flowchart':
      return flowchartCommandsPrompt
    case 'gantt':
      return GanttMermaidPrompt
    case 'gitgraph':
      return GitflowMermaidPrompt
    case 'mindmaps':
      return MindmapsMermaidPrompt
    case 'pieChart':
      return PieChartMermaidPrompt
    case 'quadrantChart':
      return QuadrantChartMermaidPrompt
    case 'requirementDiagram':
      return RequirementsDiagramMermaidPrompt
    case 'sankey':
      return SankeyMermaidPrompt
    case 'timeline':
      return TimelineMermaidPrompt
    case 'userJourney':
      return UserJourneyMermaidPrompt
    case 'zenuml':
      return ZenumlMermaidPrompt
    default:
      return ''
  }
}
