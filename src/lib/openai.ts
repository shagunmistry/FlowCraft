import { Configuration, OpenAIApi } from 'openai-edge'

import OpenAI from 'openai'

import { supabase, checkIfEmbeddingsExist } from '@/lib/supabase'

export interface ApifyData {
  markdown: string
  url: string
  metadata: Metadata
  pageContent: string
}
export interface Metadata {
  canonicalUrl: string
  title: string
  description: string
  author: null
  keywords: null
  languageCode: string
}

export const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export const OpenAiApiEdge = new OpenAIApi(configuration)

export const openAiModel = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export const generateEmbeddings = async (data: ApifyData[]) => {
  const _openAiModel = openAiModel
  const tableToSaveTo = 'documents_for_react_flow'

  const embeddingsExist = await checkIfEmbeddingsExist(tableToSaveTo)
  if (embeddingsExist) {
    console.log('Embeddings already exist for this table')
    return
  }

  console.log('tableToSaveTo: ', tableToSaveTo)

  // Split up the data into chunks of 50
  const chunks = data.reduce((resultArray: ApifyData[][], item, index) => {
    const chunkIndex = Math.floor(index / 50)

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

  // For each chunk, generate embeddings every 5 seconds
  chunks.forEach(async (chunk, index) => {
    setTimeout(async () => {
      const dataToSendToSupabase: {
        content: string
        metadata: any
        embedding: number[]
      } = {
        content: '',
        metadata: {},
        embedding: [],
      }

      console.log('Chunk: ', chunk.length, ' All Chunks: ', chunks.length)
      chunk.forEach(async (law, lawIndex) => {
        try {
          const contentToEmbed = law.pageContent
            ? law.pageContent
            : law.markdown
          if (contentToEmbed.length > 8191) {
            // Split the content into chunks of 8191
            const contentChunks = contentToEmbed.match(/.{1,8191}/g)
            if (contentChunks) {
              // Add to the current loop and continue
              contentChunks.forEach(async (contentChunk) => {
                chunk.push({
                  ...law,
                  pageContent: contentChunk,
                })
              })
            }
          } else {
            const embeddings = await _openAiModel.embeddings.create({
              input: law.pageContent ? law.pageContent : law.markdown,
              model: 'text-embedding-ada-002',
            })

            dataToSendToSupabase.content = contentToEmbed
            dataToSendToSupabase.metadata = { ...law.metadata }
            dataToSendToSupabase.embedding = embeddings.data[0].embedding

            // Send the data to Supabase
            const { data, error } = await supabase
              .from(tableToSaveTo)
              .insert(dataToSendToSupabase)

            if (error) {
              console.error('Error inserting data into Supabase: ', error)
            }

            console.log(
              'Data inserted into Supabase: ',
              lawIndex,
              ' of ',
              chunk.length,
              ' of ',
              index,
              ' of ',
              chunks.length,
            )
          }
        } catch (e) {
          console.error('Error generating embeddings: ', e)
        }
      })
    }, 5000)
  })
}
