import { ApifyData, generateEmbeddings } from '@/lib/openai'
import { getReactCodeFlowJSONFile } from '@/lib/supabase'

export async function GET(req: Request) {
  const docs = await getReactCodeFlowJSONFile()

  if (!docs) {
    return {
      status: 500,
      body: JSON.stringify({
        error: 'Could not fetch JSON file data',
      }),
    }
  }

  try {
    await generateEmbeddings(docs as ApifyData[])

    return {
      status: 200,
      body: JSON.stringify({
        message: 'Embeddings generated',
      }),
    }
  } catch (e) {
    console.log('Error generating embeddings: ', e)

    return {
      status: 500,
      body: JSON.stringify({
        error: 'Could not generate embeddings',
      }),
    }
  }
}
