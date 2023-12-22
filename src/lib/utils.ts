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
