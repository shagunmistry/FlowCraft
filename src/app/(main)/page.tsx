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
  // if (embeddingsLoaded.status !== 200) {
  //   return (
  //     <div className="pb-12 pt-16 sm:pb-4 lg:pt-12">
  //       <Container>
  //         <h1 className="text-2xl font-bold leading-7 text-slate-900">
  //           Diagram
  //         </h1>
  //       </Container>
  //       <div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
  //         <p className="text-slate-900">Error loading embeddings</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="pb-12 pt-16 sm:pb-4 lg:pt-12">
      <Container>
        <h1 className="text-2xl font-bold leading-7 text-slate-900">Diagram</h1>
      </Container>
      <div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
        <ChartView />
        {/* {episodes.map((episode) => (
          <EpisodeEntry key={episode.id} episode={episode} />
        ))} */}
      </div>
    </div>
  )
}

// export const revalidate = 10
