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

export type InputClassification = {
  inputType: string
  suggestedDiagram: OptionType
  confidence: number
  reasoning: string
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
  | 'Git Graph'
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

function extractFromJsonEnvelope(input: string): string {
  let s = input.trim()
  if (!s) return s

  // Peel outer ```json ... ``` (or bare ``` ... ```) fence, greedy to the last ```.
  const outerFence = s.match(/^```(?:json)?\s*([\s\S]*)```\s*$/)
  if (outerFence) s = outerFence[1].trim()

  // Must look like a JSON object to attempt parse.
  if (!s.startsWith('{')) return input.trim()

  // Try strict JSON first, then a lenient pass that escapes raw newlines
  // inside string values (LLMs routinely emit these, which strict JSON rejects).
  const parseAttempts: string[] = [s, escapeControlCharsInJsonStrings(s)]
  for (const attempt of parseAttempts) {
    try {
      const obj = JSON.parse(attempt)
      const code =
        typeof obj?.code === 'string'
          ? obj.code
          : typeof obj?.mermaid === 'string'
            ? obj.mermaid
            : null
      if (code) return code.trim()
    } catch {
      /* try next */
    }
  }
  return input.trim()
}

function escapeControlCharsInJsonStrings(s: string): string {
  let out = ''
  let inString = false
  let escape = false
  for (const ch of s) {
    if (escape) {
      out += ch
      escape = false
      continue
    }
    if (ch === '\\') {
      out += ch
      escape = true
      continue
    }
    if (ch === '"') {
      inString = !inString
      out += ch
      continue
    }
    if (inString && ch === '\n') {
      out += '\\n'
      continue
    }
    if (inString && ch === '\r') {
      out += '\\r'
      continue
    }
    if (inString && ch === '\t') {
      out += '\\t'
      continue
    }
    out += ch
  }
  return out
}

const MERMAID_HEADER_RE =
  /^(?:\s*%%\{[^}]*\}%%\s*\n)?\s*(graph|flowchart|sequenceDiagram|classDiagram(?:-v2)?|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie|mindmap|timeline|quadrantChart|gitGraph|requirementDiagram|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment|xychart(?:-beta)?|sankey(?:-beta)?|block(?:-beta)?|architecture(?:-beta)?|treemap(?:-beta)?|kanban|packet(?:-beta)?|radar(?:-beta)?)\b/m

export function sanitizeMermaid(code: string): string {
  let cleaned = code?.trim() || ''
  if (!cleaned) return ''

  // Recovery path for legacy rows saved before the backend envelope fix:
  // the stored "code" may actually be the whole ```json { "code": ... } ```
  // response from the LLM.
  cleaned = extractFromJsonEnvelope(cleaned)

  // Strip surrounding matching quotes.
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim()
  }

  // Unescape common escape sequences that slip in when mermaid was routed
  // through a JSON string at some point upstream.
  cleaned = cleaned
    .replace(/\\`/g, '`')
    .replace(/\\'/g, "'")
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')

  // If there's a ```mermaid ... ``` fence anywhere, extract its contents.
  // Otherwise, if there's a bare ``` ... ``` fence, extract that.
  const mermaidFence = cleaned.match(/```mermaid\s*\n([\s\S]*?)```/i)
  if (mermaidFence) {
    cleaned = mermaidFence[1].trim()
  } else {
    const bareFence = cleaned.match(/```\s*\n?([\s\S]*?)```/)
    if (bareFence) cleaned = bareFence[1].trim()
  }

  // Drop a leading "mermaid" language marker if it wasn't inside a fence.
  cleaned = cleaned.replace(/^\s*mermaid\s*\n/i, '').trim()

  // Trim non-mermaid preamble: scan for the first mermaid header line and
  // drop everything before it. Preserves optional %%{init}%% directive.
  // A leading YAML frontmatter block (`---\nconfig: ...\n---`) is kept intact
  // and the header is searched for after it, so config keys such as `kanban:`
  // are never mistaken for the diagram type.
  const frontmatter = cleaned.match(/^---[ \t]*\n[\s\S]*?\n---[ \t]*\n/)
  const preamble = frontmatter ? frontmatter[0] : ''
  const body = cleaned.slice(preamble.length)

  const headerMatch = body.match(MERMAID_HEADER_RE)
  if (!headerMatch) {
    // No recognizable mermaid diagram type — let the caller treat this as
    // unparseable instead of shipping garbage to mermaid.parse.
    return ''
  }
  const headerStart = body.indexOf(headerMatch[0])
  cleaned = preamble + (headerStart > 0 ? body.slice(headerStart) : body)

  return cleaned.trim()
}
