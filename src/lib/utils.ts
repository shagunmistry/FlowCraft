import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type DiagramOrChartType = 'TLDraw' | 'Chart' | 'Flow Diagram'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractJSON(response: string): string | null {
  const match = response.match(/```JSON\n([\s\S]*?)\n```/)
  return match ? match[1] : null
}

export function downloadImage(dataUrl: string) {
  const a = document.createElement('a')

  a.setAttribute('download', 'reactflow.png')
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
action:CREATE shape:ellipse x:200 y:100 width:300 height:150 label:"Evaporation (Water turns into vapor)" id:shape1;
action:CREATE shape:arrow x:350 y:100 endX:550 endY:100 id:shape2 from:shape1;
action:CREATE shape:rectangle x:650 y:100 width:300 height:150 label:"Condensation (Vapor forms clouds)" id:shape3;
action:CREATE shape:arrow x:800 y:100 endX:1000 endY:100 id:shape4 from:shape3;
action:CREATE shape:rectangle x:1100 y:100 width:300 height:150 label:"Precipitation (Clouds release rain)" id:shape5;
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
