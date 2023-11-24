import { ApifyData, generateEmbeddings } from '@/lib/openai'
import { Container } from '@/components/Container'
import { getAllEpisodes } from '@/lib/episodes'
import { getReactCodeFlowJSONFile } from '@/lib/supabase'
import ChartView from '@/components/ChartView'

const getEmbeddings = async () => {
  const docs = await getReactCodeFlowJSONFile()

  if (!docs) {
    return {
      status: 404,
      body: JSON.stringify({
        error: 'No embeddings found',
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

export default async function Home() {
  const embeddingsLoaded = await getEmbeddings()

  return (
    <div className="pb-12 pt-16 sm:pb-4 lg:pt-12">
      <div className="divide-y divide-pink-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-pink-100">
        <ChartView />
      </div>
    </div>
  )
}

// export const revalidate = 10
