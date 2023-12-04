import { Configuration, OpenAIApi } from 'openai-edge'

import OpenAI from 'openai'

import {
  supabase,
  checkIfEmbeddingsExist,
  DOCUMENTS_FOR_REACT_FLOW_TABLE,
} from '@/lib/supabase'

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
  const tableToSaveTo = DOCUMENTS_FOR_REACT_FLOW_TABLE

  const embeddingsExist = await checkIfEmbeddingsExist(tableToSaveTo)

  console.log('embeddingsExist: ', embeddingsExist)
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

export const promptForDiagram = `Given the following diagram description and title, your task is to generate an explainable Diagram Code Flow based on the description and title. If needed, you can summarize the description and title in your own words to make the diagram more user-friendly and UNDERSTANDABLE. BE AS DESCRIPTIVE AS POSSBILE IN THE EDGES AND NODES AND LABELS USED. Use your knowledge based on the context of the description to generate the diagram. \n\n`

export const promptForDiagramDescription = (diagramDescription: string) => {
  return `Diagram Description: ${diagramDescription}`
}

export const promptForDiagramTitle = (diagramTitle: string) => {
  return `Diagram Title: ${diagramTitle}`
}

export const promptForReactFlowContext = (context: string) => {
  return `ReactFlow Context: \n ${context}`
}

export const promptForUserMessage = (
  diagramTitle: string,
  diagramDescription: string,
) => {
  return `${promptForDiagram}  \n\nDiagram Title: ${diagramTitle}\nDiagram Description: ${diagramDescription}
  \n PLEASE RESPOND IN JSON INCLUDING VALID REACTFLOW NODE AND EDGE ARRAY.`
}

export const promptForResponse = `The response MUST ONLY be in JSON BODY including valid ReactFlow Node and Edge array. The response will be validated and if it is not valid, you will be asked to try again.
\n Example Response: \n
\`\`\`JSON
{
  "nodes": [
    {
      "id": "A",
      "position": { "x": 20, "y": 20 },
      "data": { "label": "A" }
    },
    {
      "id": "B",
      "position": { "x": 100, "y": 200 },
      "data": { "label": "B" }
    },
    {
      "id": "C",
      "position": { "x": 300, "y": 20 },
      "data": { "label": "C" }
    },
    {
      "id": "D",
      "position": { "x": 300, "y": 170 },
      "data": { "label": "D" }
    },
    {
      "id": "E",
      "position": { "x": 250, "y": 300 },
      "data": { "label": "E" }
    },
    {
      "id": "F",
      "position": { "x": 250, "y": 450 },
      "data": { "label": "F" }
    },
    {
      "id": "G",
      "position": { "x": 20, "y": 450 },
      "data": { "label": "G" }
    }
  ],
  "edges": [
    {
      "id": "A->B",
      "source": "A",
      "target": "B",
      "markerEnd": {
        "type": "Arrow"
      },
      "label": "default arrow"
    },
    {
      "id": "C->D",
      "source": "C",
      "target": "D",
      "markerEnd": {
        "type": "ArrowClosed"
      },
      "label": "default closed arrow"
    },
    {
      "id": "D->E",
      "source": "D",
      "target": "E",
      "markerEnd": {
        "type": "ArrowClosed"
      },
      "markerStart": {
        "type": "ArrowClosed",
        "orient": "auto-start-reverse"
      },
      "label": "marker start and marker end"
    },
    {
      "id": "E->F",
      "source": "E",
      "target": "F",
      "markerEnd": "logo",
      "label": "custom marker"
    },
    {
      "id": "B->G",
      "source": "B",
      "target": "G",
      "markerEnd": {
        "type": "ArrowClosed",
        "width": 20,
        "height": 20,
        "color": "#FF0072"
      },
      "label": "marker size and color",
      "style": {
        "strokeWidth": 2,
        "stroke": "#FF0072"
      }
    }
  ]
}
\`\`\`
`

export const promptForExampleCode = `Here is an example of a valid ReactFlow Node and Edge array:
\`\`\`javascript
const nodes = [
  {
    id: 'A',
    position: { x: 20, y: 20 },
    data: { label: 'A' },
  },
  {
    id: 'B',
    position: { x: 100, y: 200 },
    data: { label: 'B' },
  },
  {
    id: 'C',
    position: { x: 300, y: 20 },
    data: { label: 'C' },
  },
  {
    id: 'D',
    position: { x: 300, y: 170 },
    data: { label: 'D' },
  },
  {
    id: 'E',
    position: { x: 250, y: 300 },
    data: { label: 'E' },
  },
  {
    id: 'F',
    position: { x: 250, y: 450 },
    data: { label: 'F' },
  },
  {
    id: 'G',
    position: { x: 20, y: 450 },
    data: { label: 'G' },
  },
];

const edges = [
  {
    id: 'A->B',
    source: 'A',
    target: 'B',
    markerEnd: {
      type: MarkerType.Arrow,
    },
    label: 'default arrow',
  },
  {
    id: 'C->D',
    source: 'C',
    target: 'D',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    label: 'default closed arrow',
  },
  {
    id: 'D->E',
    source: 'D',
    target: 'E',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    markerStart: {
      type: MarkerType.ArrowClosed,
      orient: 'auto-start-reverse',
    },
    label: 'marker start and marker end',
  },
  {
    id: 'E->F',
    source: 'E',
    target: 'F',
    markerEnd: 'logo',
    label: 'custom marker',
  },
  {
    id: 'B->G',
    source: 'B',
    target: 'G',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#FF0072',
    },
    label: 'marker size and color',
    style: {
      strokeWidth: 2,
      stroke: '#FF0072',
    },
  },
];
\`\`\`
`
