import { createClient } from '@supabase/supabase-js'
import {
  ApifyData,
  inputForChartJsContext,
  inputForReactFlowContext,
  openAiModel,
} from './openai'
import GPT3Tokenizer from 'gpt3-tokenizer'
import { DiagramOrChartType } from './utils'
import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'

const privateKey = process.env.SUPABASE_PRIVATE_KEY || 'secret-key'
const supabase_url = process.env.SUPABASE_URL || 'http://localhost:8000'

const supabaseClient = createClient(supabase_url, privateKey)

export const supabase = supabaseClient

export const DOCUMENTS_FOR_REACT_FLOW_TABLE = 'documents_for_react_flow'
export const MATCH_DOCUMENTS_FOR_REACT_FLOW_TABLE =
  'match_documents_for_react_flow'

export const DOCUMENTS_FOR_D2_TABLE = 'documents_for_d2'
export const MATCH_DOCUMENTS_FOR_D2_TABLE = 'match_documents_for_d2'

export const DOCUMENTS_FOR_CHARTJS_TABLE = 'documents_for_chartjs'
export const MATCH_DOCUMENTS_FOR_CHARTJS_TABLE = 'match_documents_for_chartjs'

export const DOCUMENTS_FOR_DIAGRAMS_LIBRARY_TABLE = 'documents_for_diagrams_library'
export const MATCH_DOCUMENTS_FOR_DIAGRAMS_LIBRARY_TABLE = 'match_documents_for_diagrams_library'

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

  const { data, error } = await supabase.from(tableToCheck).select('*')

  if (error) {
    console.log('Error checking checkIfEmbeddingsExist : ', error)
    return false
  }

  console.log('data: ', data, ' Error: ', error)

  return true
  // if (tableToCheck === DOCUMENTS_FOR_REACT_FLOW_TABLE) {
  //   return true
  // }

  // if (data && data.length > 0 && data[0].embedding) {
  //   return true
  // }

  // return false
}

/** ReactFlow */

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

export const getDiagramsJSONFile = async (): Promise<ApifyData[] | null> => {
  if (process.env.DIAGRAMS_SUPABASE_FILE) {
    console.log('Checking Diagrams JSON file')
    const response = await fetch(process.env.DIAGRAMS_SUPABASE_FILE, {
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

export const loadChartJsData = async (): Promise<boolean> => {
  // Make a request to the API to trigger data load into the DB
  const response = await fetch('/api/chartjs-data-load', {
    method: 'GET',
  })

  if (!response.status || response.status !== 200) {
    return false
  }

  if (response.status === 200) {
    console.log('Successfully loaded Chart.js data into the DB')
    return true
  }

  return false
}

export const getChartJsJSONFile = async (): Promise<ApifyData[] | null> => {
  // if (process.env.CHARTJS_SUPABASE_FILE) {
  //   console.log('Checking Chart.js JSON file')
  //   const response = await fetch(process.env.CHARTJS_SUPABASE_FILE, {
  //     method: 'GET',
  //   })

  //   if (!response.status || response.status !== 200) {
  //     return null
  //   }

  //   const json = await response.json()

  //   if (!json) {
  //     return null
  //   }

  //   return json
  // }

  return null
}

export const getEmbeddingForContext = async (
  type: DiagramOrChartType | TempMermaidDiagramType,
  contextText: string,
) => {
  const inputToUse =
    type === 'Flow Diagram'
      ? inputForReactFlowContext
      : type === 'Chart'
        ? inputForChartJsContext
        : ''
  const matchFunctionToUse =
    type === 'Flow Diagram'
      ? MATCH_DOCUMENTS_FOR_REACT_FLOW_TABLE
      : MATCH_DOCUMENTS_FOR_CHARTJS_TABLE

  let inputEmbedding = null

  inputEmbedding = await openAiModel.embeddings.create({
    input: inputToUse,
    model: 'text-embedding-ada-002',
  })

  if (!inputEmbedding) {
    console.error(
      'Failed to create embeddings for the diagram description or type',
    )
  }

  const diagramTypeEmbeddings =
    inputEmbedding?.data.map((embedding) => embedding.embedding) ?? []

  console.log('Diagram Type Embeddings: ', diagramTypeEmbeddings[0])

  const { error: matchError, data } = await supabase.rpc(matchFunctionToUse, {
    query_embedding: diagramTypeEmbeddings[0],
    match_count: 5,
  })

  if (matchError) {
    throw new Error(matchError.message)
  }

  const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
  let tokenCount = 0

  for (let i = 0; i < 2; i++) {
    const pageSection = data[i]
    const content = pageSection.content
    const encoded = tokenizer.encode(content)
    tokenCount += encoded.text.length

    if (tokenCount >= 1500) {
      break
    }

    contextText += `${content.trim()}\n---\n`
  }
  return contextText
}

export const createPost = async (post: any) => {
  const { data, error } = await supabase.from('posts').insert([post])

  if (error) {
    throw error
  }

  return data
}
