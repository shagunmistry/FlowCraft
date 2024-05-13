import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const OPEN_AI_MODEL = 'gpt-4-0125-preview'

export type SharedDiagramResult = {
  user_id: string
  invite_code: string
  created_at: string
  diagram_id: string
  id: string
  type: string
  data: string
  title: string
}

export type DiagramOrChartType =
  | 'Whiteboard'
  | 'Chart'
  | 'Flow Diagram'
  | 'Mermaid'

export enum DiagramType {
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
}

interface Option {
  title: string
  emoji: string
  link: string // Replace with actual links to corresponding pages
  source: string
  description: string
  badgeType?: 'popular' | 'new' | 'coming-soon' | 'experimental'
}

export const navigationOptions: Option[] = [
  {
    title: 'Flow Diagram',
    emoji: '🔀',
    link: '/dashboard/flow-diagram',
    source:
      'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2Fpexels_diagram.jpg?alt=media&token=779cd4b2-3f5d-43e4-999e-369405c4aeff',
    description:
      'Flow diagrams are a great way to Visually represent processes, workflows, and algorithms with clear steps and decision points.',
    badgeType: 'popular',
  },
  {
    title: 'Complex Diagrams',
    emoji: '🧜‍♂️',
    link: '/dashboard/mermaid',
    source:
      'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMindmap_screenshot.png?alt=media&token=6ba9fbdf-df6e-49b2-bc71-7f9ce55d821d',
    description:
      'Create complex diagrams like sequence diagrams, user journeys, mind maps, and more!',
    badgeType: 'experimental',
  },
  // {
  //   title: 'Whiteboard',
  //   emoji: '🎨',
  //   link: '/dashboard/whiteboard',
  //   source:
  //     'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2Fpexels_whiteboard.jpg?alt=media&token=eb068b8d-bfcf-41bd-9b5d-986ad0ed235f',
  //   description:
  //     'Brainstorm visually using freehand drawing, shapes, and text. This is great for freeform thinking and collaboration.',
  // },
  {
    title: 'Chart',
    emoji: '📊',
    link: '/dashboard/chart',
    source:
      'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2Fpexels_chart.jpg?alt=media&token=6223a617-0ef3-4dd2-8f40-1dfbee282773',
    description:
      'Communicate data insights effectively with various chart types like bar charts, line charts, and pie charts.',
  },
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractJSON(response: string): string | null {
  const match = response.match(/```JSON\n([\s\S]*?)\n```/)
  return match ? match[1] : null
}

export function downloadImage(dataUrl: string, fileName: string) {
  const a = document.createElement('a')

  a.setAttribute('download', `${fileName}.png`)
  a.setAttribute('href', dataUrl)
  a.click()
}

export function extractParsableJSON(inputString: string): string | null {
  // Remove any backticks at the beginning and end of the string
  const trimmedString = inputString.trim()
  const cleanedString =
    trimmedString.startsWith('`') && trimmedString.endsWith('`')
      ? trimmedString.slice(3, -3)
      : trimmedString

  try {
    // Attempt to parse the string as JSON
    const parsedJSON = JSON.parse(cleanedString)
    // If parsed successfully, return the stringified JSON
    return JSON.stringify(parsedJSON)
  } catch (error) {
    // If parsing fails, return null
    console.error('Error parsing JSON:', error)
    return null
  }
}

export function assert(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message ?? 'Assertion error')
  }
}

export function getRandomId(): string {
  return Math.random().toString(36).slice(2)
}

export const sampleProcess = `
\`\`\`SEQUENCE:START
// Diagram illustrating detailed heart function
action:CREATE shape:ellipse x:180 y:150 width:120 height:200 label:"Right Lung" id:shape1;
action:CREATE shape:ellipse x:340 y:150 width:120 height:240 label:"Left Lung" id:shape2;
action:CREATE shape:rectangle x:260 y:400 width:160 height:90 label:"Diaphragm" id:shape3;
action:CREATE shape:arrow x:260 y:80 endX:260 endY:160 id:shape4 from:shape2 to:shape3;
action:CREATE shape:circle x:260 y:90 width:40 height:40 label:"Trachea" id:shape5;
action:CREATE shape:arrow x:200 y:150 endX:180 endY:200 id:shape6 from:shape5 to:shape1;
action:CREATE shape:arrow x:320 y:150 endX:340 endY:200 id:shape7 from:shape5 to:shape2;
// The trachea branches into two main bronchi (arrows from trachea to lungs)
action:CREATE shape:rectangle x:180 y:300 width:60 height:30 label:"Bronchi" id:shape8;
action:CREATE shape:rectangle x:340 y:300 width:60 height:30 label:"Bronchi" id:shape9;
// Alveoli where gas exchange happens
action:CREATE shape:circle x:100 y:320 width:30 height:30 label:"Alveoli" id:shape10;
action:CREATE shape:circle x:260 y:320 width:30 height:30 label:"Alveoli" id:shape11;
action:CREATE shape:arrow x:160 y:300 endX:100 endY:320 id:shape12 from:shape8 to:shape10;
action:CREATE shape:arrow x:320 y:300 endX:260 endY:320 id:shape13 from:shape9 to:shape11;
// Labels to explain the functioning
action:CREATE shape:rectangle x:180 y:500 width:200 height:50 label:"Inhalation: Diaphragm contracts, pulling air in" id:shape14;
action:CREATE shape:rectangle x:480 y:500 width:200 height:50 label:"Exhalation: Diaphragm relaxes, pushing air out" id:shape15;
// Connecting Diaphragm movement to inhalation and exhalation
action:CREATE shape:arrow x:260 y:420 endX:260 endY:490 id:shape16 from:shape3 to:shape14;
action:CREATE shape:arrow x:400 y:420 endX:480 endY:490 id:shape17 from:shape3 to:shape15;
\`\`\`SEQUENCE:END
`

/**
 *
 * @param originalString string in the format 'shape1'
 * @returns
 */
export const getIdForTlDraw = (originalString: string): string => {
  const number = originalString.match(/\d+/)
  return `shape:${number}`
}

export const generateInviteCode = (length: number) => {
  let inviteCode = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    inviteCode += characters.charAt(
      Math.floor(Math.random() * characters.length),
    )
  }

  return inviteCode
}

export const getShareableLinkUrl = (id: string, origin: string) => {
  return `/shared/${id}`
}
