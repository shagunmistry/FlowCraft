import { ApifyData, generateEmbeddings } from '@/lib/openai'
import {
  DOCUMENTS_FOR_CHARTJS_TABLE,
  DOCUMENTS_FOR_REACT_FLOW_TABLE,
  getChartJsJSONFile,
  getReactCodeFlowJSONFile,
} from '@/lib/supabase'

import MainLanding from '@/components/Landing/Main.landing'
import { Metadata } from 'next'
import MaintenancePage from '@/components/MaintenancePage'

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

export const metadata: Metadata = {
  title: 'FlowCraft',
  description:
    'FlowCraft is a diagramming tool that helps you create flowcharts, process maps, and system diagrams with AI and with ease. Some diagram types include Flowcharts, sequence diagrams, User journey maps, mind maps, knowledge graphs, and more.',
}

export default async function Home() {
  await getEmbeddings()

  return <MainLanding />
  return (
    <>
      <MaintenancePage />
    </>
  )
}
