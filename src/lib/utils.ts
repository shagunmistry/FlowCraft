import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const OPEN_AI_MODEL = 'gpt-4o'

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

export const EXAMPLES = [
  {
    title: 'Order fulfillment Process Flow',
    source: 'https://tailwindui.com/img/ecommerce-images/home-page-01-hero.jpg',
    description:
      'A flow diagram showing steps like order received, order processed, order shipped, and order delivered.',
    markdown: `

      # Order fulfillment Process Flow
      The order fulfillment process is the backbone of any e-commerce business. It's the sequence of steps involved in receiving, processing, and delivering a customer's order. A well-optimized fulfillment process is crucial for customer satisfaction, operational efficiency, and overall business success.

      ## Why is the order fulfillment process important?
      1. **Visualization**: A flowchart provides a clear visual representation of the entire process, making it easy to understand the flow of activities and identify potential bottlenecks.
      2. **Communication**: It serves as a common reference for all teams involved in the process (sales, inventory, shipping, customer service), ensuring everyone is on the same page.
      3. **Optimization**: By analyzing the flowchart, you can identify areas for improvement, streamline operations, and reduce errors.
      4. **Training**: It's a valuable tool for training new employees, helping them quickly grasp the steps involved in fulfilling orders.

      ## Prompt Used
      Create a flow diagram showing the steps involved in the order fulfillment process. The diagram should include the following steps:
      - Receive Order (Online or Offline)
      - Check Inventory Availability
      - Process Payment
      - Pack Order
      - Ship Order
      - Deliver Order
      `,
    id: 1,
  },
]

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

// export type OptionType = 'Illustration' | 'Infographic' | 'Diagram' | null
export type OptionType =
  | 'Illustration'
  | 'Infographic'
  | 'Flowchart'
  | 'Sequence Diagram'
  | 'Class Diagram'
  | 'State Diagram'
  | 'Entity Relationship Diagram'
  | 'User Journey'
  | 'Gantt'
  | 'Pie Chart'
  | 'Quadrant Chart'
  | 'Requirement Diagram'
  | 'Gitgraph Diagram'
  | 'C4 Diagram'
  | 'Mindmaps'
  | 'Timeline'
  | 'ZenUML'
  | 'Sankey'
  | 'XY Chart'
  | 'Block Diagram'
  | 'Packet'
  | 'Kanban'
  | 'Architecture'
  | 'Radar'
  | 'Treemap'
  | null

export function sanitizeSVG(svgString: string): {
  svgContent: string
  svgUrl: string
} {
  // 1. Remove any leading/trailing quotes and whitespace
  let cleaned = svgString.trim()
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1)
  }

  // 2. Unescape escaped characters
  cleaned = cleaned
    .replace(/\\"/g, '"') // Replace \" with "
    .replace(/\\'/g, "'") // Replace \' with '
    .replace(/\\\\/g, '\\') // Replace \\ with \
    .replace(/\\n/g, '\n') // Replace \n with newline
    .replace(/\\t/g, '\t') // Replace \t with tab

  // 3. Decode any HTML entities
  cleaned = cleaned
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

  // 4. Ensure proper XML formatting (for SVG)
  // Check if we have XML declaration and add if missing
  if (!cleaned.includes('<?xml')) {
    // Only add if this is a complete SVG
    if (cleaned.includes('<svg') && !cleaned.startsWith('<svg')) {
      cleaned = '<?xml version="1.0" encoding="UTF-8"?>\n' + cleaned
    }
  }

  // 5. Create a safe data URL for rendering
  const svgBlob = new Blob([cleaned], { type: 'image/svg+xml' })
  const svgUrl = URL.createObjectURL(svgBlob)

  return {
    svgContent: cleaned,
    svgUrl: svgUrl,
  }
}

export function sanitizeMermaid(code: string): string {
  // Remove leading/trailing whitespace and backticks
  let cleaned = code?.trim() || ''

  // Remove surrounding quotes if present
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1)
  }

  // Remove code block markers if present
  if (cleaned.startsWith('```')) {
    const firstLineEnd = cleaned.indexOf('\n')
    const firstLine = cleaned.substring(3, firstLineEnd).trim()

    // Check if the first line is 'mermaid' or contains 'mermaid'
    if (firstLine === 'mermaid' || firstLine.includes('mermaid')) {
      // Remove the first line completely
      cleaned = cleaned.substring(firstLineEnd + 1)
    } else {
      // Just remove the backticks
      cleaned = cleaned.slice(3)
    }

    // Remove ending backticks if present
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3)
    }
  } else {
    // No code block markers, but check if it starts with 'mermaid'
    if (cleaned.startsWith('mermaid')) {
      // Find the first newline
      const firstLineEnd = cleaned.indexOf('\n')
      if (firstLineEnd !== -1) {
        cleaned = cleaned.substring(firstLineEnd + 1)
      }
    }
  }

  // Replace escaped characters
  cleaned = cleaned
    .replace(/\\`/g, '`') // Replace \` with `
    .replace(/\\'/g, "'") // Replace \' with '
    .replace(/\\\\/g, '\\') // Replace \\ with \
    .replace(/\\n/g, '\n') // Replace \n with newline
    .trim() // Final trim to remove any extra whitespace

  return cleaned
}
