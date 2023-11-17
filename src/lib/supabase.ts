import { createClient } from '@supabase/supabase-js'
import { ApifyData } from './openai'

const privateKey = process.env.SUPABASE_PRIVATE_KEY || 'secret-key'
const supabase_url = process.env.SUPABASE_URL || 'http://localhost:8000'
const supabaseClient = createClient(supabase_url, privateKey)

export const supabase = supabaseClient

export interface Metadata {
  canonicalUrl: string
  title: string
  description: string
  author: null
  keywords: null
  languageCode: string
}

export interface ApifyUscisData {
  markdown: string
  url: string
  metadata: Metadata
  pageContent: string
}

export const checkIfEmbeddingsExist = async (
  tableToCheck: string,
): Promise<boolean> => {
  // Check if data exists in the table
  const { data, error } = await supabase.from(tableToCheck).select('embedding')

  if (error) {
    console.log('Error checking checkIfEmbeddingsExist : ', error)
    return false
  }

  if (data && data.length > 0) {
    return true
  }

  return false
}

/**
 * Get the React Code Flow JSON file from Supabase
 * @returns {ApifyData[] | null} - The JSON file from Supabase
 */
export const getReactCodeFlowJSONFile = async (): Promise<
  ApifyData[] | null
> => {
  if (process.env.REACT_FLOW_SUPABASE_FILE) {
    console.log('Checking React Code Flow JSON file')
    const response = await fetch(process.env.REACT_FLOW_SUPABASE_FILE, {
      method: 'GET',
    })

    if (!response.status || response.status !== 200) {
      return null
    }

    const json = await response.json()

    if (!json) {
      return null
    }

    return json
  }

  return null
}
