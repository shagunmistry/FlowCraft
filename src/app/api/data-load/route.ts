import { ApifyData, generateEmbeddings } from '@/lib/openai'
import {
  DOCUMENTS_FOR_REACT_FLOW_TABLE,
  getReactCodeFlowJSONFile,
} from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const docs = await getReactCodeFlowJSONFile()

  if (!docs) {
    return NextResponse.json(
      { error: 'Could not fetch JSON file data' },
      { status: 500 }
    )
  }

  try {
    await generateEmbeddings(
      docs as ApifyData[],
      DOCUMENTS_FOR_REACT_FLOW_TABLE,
    )
    return NextResponse.json(
      { message: 'Embeddings generated' },
      { status: 200 }
    )
  } catch (e) {
    console.log('Error generating embeddings: ', e)

    return NextResponse.json(
      { error: 'Could not generate embeddings' },
      { status: 500 }
    )
  }
}
