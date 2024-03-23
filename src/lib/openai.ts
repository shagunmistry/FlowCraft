import { Configuration, OpenAIApi } from 'openai-edge'

import OpenAI from 'openai'

import { supabase, checkIfEmbeddingsExist } from '@/lib/supabase'
import { allCombinedCodeExample } from './react-flow.code'
import { chartJsAllCombinedBasicCode } from './chart-js.code'

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

export const generateEmbeddings = async (
  data: ApifyData[],
  tableToSaveTo: string,
) => {
  const _openAiModel = openAiModel

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

export const promptForDiagramDescription = (diagramDescription: string) => {
  return `Diagram Description: ${diagramDescription}`
}

export const promptForDiagramTitle = (diagramTitle: string) => {
  return `Diagram Title: ${diagramTitle}`
}

/** React Flow */
export const promptForDiagram = `Given the following diagram description and title, your task is to generate an explainable Diagram Code Flow based on the description and title. The diagram MUST be user-friendly and UNDERSTANDABLE. BE AS DESCRIPTIVE AS POSSBILE IN THE EDGES AND NODES AND LABELS USED. Use your knowledge based on the context of the description to generate the diagram. 

\n
The nodes are used to denote an entity or object, also referred to as a vertex. Each vertex could be used for representing any type of data, including locations, people, concepts, objects, or any other type of element, depending on the application.

\n
Edges represent the presence of a connection or relationship between two nodes. In social network analysis these are usually some type of social tie. We can say that in social network analysis, these connections are relationships between nodes, and edges in a graph are meant to represent them. In graph theory, edges are best thought of as a collection of pairs of nodes, where the two members of the pair are the nodes involved in the focal relationship. So if node A is related to node B via some relationship R, then AB is an edge in the relevant graph
\n\n`

export const promptForReactFlowContext = (context: string) => {
  return `ReactFlow Context: \n ${context}`
}

export const promptForUserMessage = (
  diagramTitle: string,
  diagramDescription: string,
) => {
  return `${promptForDiagram}  \n\nDiagram Title: ${diagramTitle}\nDiagram Description: ${diagramDescription}
  \n PLEASE RESPOND ONLY IN JSON INCLUDING VALID REACTFLOW NODE AND EDGE ARRAY.`
}

export const promptForResponse = `The response MUST ONLY be in JSON that includes valid ReactFlow Node and Edge array. Remember to position the edges and nodes so that it is a readable view. The response will be validated and if it is not valid, you will be asked to try again.
FIrst node should be of type "input" and last node should be of type "output"
\n Example Response FROM YOU: \n
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
${allCombinedCodeExample}
\`\`\`

NOTE: The X and Y positions for each node MUST be at least 100 apart from each other.
`

export const inputForReactFlowContext =
  'Custom Nodes and Custom Edges and Dagre Tree and Horizontal Flow and Sub Flow and Elkjs Tree'

/** Chart JS */
export const promptForChartJsDiagram = `Given the following diagram description and title, your task is to generate an explainable ChartJS Code Flow based on the description and title. The chart needs to be user friendly and understandable. It MUST have labels on the Y and X axis. BE AS DESCRIPTIVE AS POSSBILE IN THE DATA OBJECT YOU GENERATE. Use your knowledge based on the context of the description to generate the diagram.

\n
label 	string 	The label for the dataset which appears in the legend and tooltips.
clip 	number|object 	How to clip relative to chartArea. Positive value allows overflow, negative value clips that many pixels inside chartArea. 0 = clip at chartArea. Clipping can also be configured per side: clip: {left: 5, top: false, right: -2, bottom: 0}
order 	number 	The drawing order of dataset. Also affects order for stacking, tooltip and legend.
stack 	string 	The ID of the group to which this dataset belongs to (when stacked, each group will be a separate stack). Defaults to dataset type.
parsing 	boolean|object 	How to parse the dataset. The parsing can be disabled by specifying parsing: false at chart options or dataset. If parsing is disabled, data must be sorted and in the formats the associated chart type and scales use internally.
hidden 	boolean 	Configure the visibility of the dataset. Using hidden: true will hide the dataset from being rendered in the Chart.
`

export const promptForChartJsContext = (context: string) => {
  return `ChartJS Context: \n ${context}`
}

export const inputForChartJsContext =
  'Data Structures and Bar Charts and Line Charts and Area Charts and Other Charts'

export const promptForChartJsResponse = `The response MUST ONLY be in JSON that includes valid ChartJs code.
The response will be validated and if it is not valid, you will be asked to try again.
  \n Example Response FROM YOU: \n
  \`\`\`JSON
  {
    "data": {
      "labels": ["Jan", "Feb"],
      "datasets": [
        {
          "label": "Net sales",
          "data": [
            { "x": "Jan", "net": 100, "cogs": 50, "gm": 50 },
            { "x": "Feb", "net": 120, "cogs": 55, "gm": 75 }
          ],
          "parsing": { "yAxisKey": "net" }
        },
        {
          "label": "Cost of goods sold",
          "data": [
            { "x": "Jan", "net": 100, "cogs": 50, "gm": 50 },
            { "x": "Feb", "net": 120, "cogs": 55, "gm": 75 }
          ],
          "parsing": { "yAxisKey": "cogs" }
        },
        {
          "label": "Gross margin",
          "data": [
            { "x": "Jan", "net": 100, "cogs": 50, "gm": 50 },
            { "x": "Feb", "net": 120, "cogs": 55, "gm": 75 }
          ],
          "parsing": { "yAxisKey": "gm" }
        }
      ]
    }
  }  
  \`\`\`
  `

export const promptForUserMessageForChartJs = (
  diagramTitle: string,
  diagramDescription: string,
) => {
  return `${promptForDiagram}  \n\nDiagram Title: ${diagramTitle}\nDiagram Description: ${diagramDescription}
    \n PLEASE RESPOND ONLY IN VALID JSON INCLUDING VALID CHARTJS DATA OBJECT.`
}

export const promptForChartJsExampleCode = `Here is an example of a valid ChartJS code:
${chartJsAllCombinedBasicCode}
`

/** Mermaid */
export const promptForUserMessageForMermaid = (
  diagramTitle: string,
  diagramDescription: string,
) => {
  return `${promptForDiagram}  \n\nDiagram Title: ${diagramTitle}\nDiagram Description: ${diagramDescription}
    \n`
}
