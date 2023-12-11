import { ApifyData, generateEmbeddings } from '@/lib/openai'
import { Container } from '@/components/Container'
import { getAllEpisodes } from '@/lib/episodes'
import { getReactCodeFlowJSONFile } from '@/lib/supabase'
import ChartView from '@/components/ChartView'
import ChartDescriptionInput from '@/components/ChartDescriptionInput'

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
    <div className="bg-gradient-to-r from-gray-200 via-pink-500 to-pink-700 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <p className="text-md font-semibold leading-7 text-white">
            Diagram smarter, not harder
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Text to Diagrams: Your ideas, visualized.
          </h1>
          <div className="mt-10 grid max-w-xl grid-cols-1 gap-8 text-xl leading-7 text-gray-700 text-white lg:max-w-none lg:grid-cols-2">
            <ChartDescriptionInput />
            <div>
              <p>
                We use the power of AI to help you create beautiful diagrams.
              </p>
              <p className="mt-8">
                Stop struggling with complex diagramming tools and let AI do the
                work for you. Our intuitive platform takes your plain text
                descriptions and transforms them into professional diagrams in
                just minutes. No diagramming expertise required! Simply type in
                your ideas, and our AI engine will translate them into clear,
                visually appealing diagrams that communicate your concepts with
                ease.
              </p>
              <p className="mt-8">
                As this is still a work in progress, we would love to hear your
                feedback on how we can improve. Please click on the Feedback
                button to give us your thoughts.
              </p>
              // add a subtitle here for "coming soon features"
              <p className="mt-8 text-sm font-semibold">
                Editing features coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative pt-16 lg:pt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ChartView />
        </div>
      </div>
    </div>
  )
}

// export const revalidate = 10
