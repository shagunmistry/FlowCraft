import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const match_documents_for_mermaid_js = 'match_documents_for_mermaid_js'
export const match_documents_for_react_flow = 'match_documents_for_react_flow'
