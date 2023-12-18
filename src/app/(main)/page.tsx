import { ApifyData, generateEmbeddings } from '@/lib/openai'
import {
  DOCUMENTS_FOR_CHARTJS_TABLE,
  DOCUMENTS_FOR_REACT_FLOW_TABLE,
  getChartJsJSONFile,
  getReactCodeFlowJSONFile,
} from '@/lib/supabase'
import DiagramOrChartView from '@/components/DiagramOrChartView'
import ChartDescriptionInput from '@/components/ChartDescriptionInput'
import PricingTier from '@/components/PricingTier'
import Whiteboard from '@/components/Whiteboard/Whiteboard'

const getEmbeddings = async () => {
  const reactFlowCodeDocs = await getReactCodeFlowJSONFile()
  const chartJsDocs = await getChartJsJSONFile()

  if (!reactFlowCodeDocs || !chartJsDocs) {
    return {
      status: 404,
      body: JSON.stringify({
        error: 'No embeddings found',
      }),
    }
  }

  try {
    await generateEmbeddings(
      reactFlowCodeDocs as ApifyData[],
      DOCUMENTS_FOR_REACT_FLOW_TABLE,
    )

    await generateEmbeddings(
      chartJsDocs as ApifyData[],
      DOCUMENTS_FOR_CHARTJS_TABLE,
    )

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
  await getEmbeddings()

  return (
    <div className="bg-gradient-to-r from-gray-200 via-pink-500 to-pink-700 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <p className="text-semibold text-xl text-indigo-700">FlowCraft</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-indigo-700 sm:text-4xl">
            Text to Diagrams: Your ideas, visualized.
          </h1>
          <p className="text-md font-semibold leading-7 text-white">
            Diagram smarter, not harder. 🧠
          </p>
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
              <p className="mt-8 text-sm font-semibold">More coming soon!</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <DiagramOrChartView />
        {/* <Whiteboard /> */}
        {/** Only show when not in production */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="mt-10">
            <PricingTier />
          </div>
        )}
      </div>
    </div>
  )
}

// export const revalidate = 10
