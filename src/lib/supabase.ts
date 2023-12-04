import { createClient } from '@supabase/supabase-js'
import { ApifyData } from './openai'

const privateKey = process.env.SUPABASE_PRIVATE_KEY || 'secret-key'
const supabase_url = process.env.SUPABASE_URL || 'http://localhost:8000'

const supabaseClient = createClient(supabase_url, privateKey)

export const supabase = supabaseClient

export const DOCUMENTS_FOR_REACT_FLOW_TABLE = 'documents_for_react_flow'
export const MATCH_DOCUMENTS_FOR_REACT_FLOW_TABLE =
  'match_documents_for_react_flow'

export const DOCUMENTS_FOR_D2_TABLE = 'documents_for_d2'
export const MATCH_DOCUMENTS_FOR_D2_TABLE = 'match_documents_for_d2'


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
  console.log('Checking if embeddings exist for table: ', tableToCheck)

  const { data, error } = await supabase
    .from('documents_for_react_flow')
    .select('*')

  if (error) {
    console.log('Error checking checkIfEmbeddingsExist : ', error)
    return false
  }

  console.log('data: ', data, ' Error: ', error)

  return true

  // if (data && data.length > 0 && data[0].embedding) {
  //   return true
  // }

  // return false
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

export const loadReactFlowData = async (): Promise<boolean> => {
  // Make a request to the API to trigger data load into the DB
  const response = await fetch('/api/data-load', {
    method: 'GET',
  })

  if (!response.status || response.status !== 200) {
    return false
  }

  if (response.status === 200) {
    console.log('Successfully loaded data into the DB')
    return true
  }

  return false
}
