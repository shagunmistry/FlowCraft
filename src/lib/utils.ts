import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractJSON(response: string): string | null {
  const match = response.match(/```JSON\n([\s\S]*?)\n```/)
  return match ? match[1] : null
}

export const sampleFlowchart = `graph LR
A(Steven Paul Jobs)
A --> B(Born on February 24, 1955)
A --> C(Put up for adoption)
C --> D(Adopted by Paul and Clara Jobs)
D --> E(Grew up in Silicon Valley)
E --> F(Met Stephen Wozniak at age 13)
F --> G(Dropped out of Reed College)
G --> H(Moved to hippie commune in Oregon)
H --> I(Returned to California)
I --> J(Hired at Atari)
J --> K(Go to India)
I --> F(Started taking interest in Woz's activities)`
