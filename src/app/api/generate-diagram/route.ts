import {
  MATCH_DOCUMENTS_FOR_CHARTJS_TABLE,
  MATCH_DOCUMENTS_FOR_REACT_FLOW_TABLE,
  supabase,
} from '@/lib/supabase'
import {
  inputForChartJsContext,
  inputForReactFlowContext,
  openAiModel,
  promptForChartJsContext,
  promptForChartJsExampleCode,
  promptForChartJsResponse,
  promptForExampleCode,
  promptForReactFlowContext,
  promptForResponse,
  promptForUserMessage,
  promptForUserMessageForChartJs,
} from '@/lib/openai'
import GPT3Tokenizer from 'gpt3-tokenizer'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { DiagramOrChartType } from '@/lib/utils'

export const maxDuration = 200

export async function POST(req: Request) {
  const json = await req.json()
  const { title: diagramTitle, description: diagramDescription } = json
  const type = json.type as DiagramOrChartType

  const inputToUse =
    type === 'Flow Diagram' ? inputForReactFlowContext : inputForChartJsContext
  const matchFunctionToUse =
    type === 'Flow Diagram'
      ? MATCH_DOCUMENTS_FOR_REACT_FLOW_TABLE
      : MATCH_DOCUMENTS_FOR_CHARTJS_TABLE

  const inputEmbedding = await openAiModel.embeddings.create({
    input: inputToUse,
    model: 'text-embedding-ada-002',
  })

  if (!inputEmbedding) {
    console.error(
      'Failed to create embeddings for the diagram description or type',
    )
  }

  const diagramTypeEmbeddings = inputEmbedding.data.map(
    (embedding) => embedding.embedding,
  )

  console.log('Diagram Type Embeddings: ', diagramTypeEmbeddings[0])

  const { error: matchError, data } = await supabase.rpc(matchFunctionToUse, {
    query_embedding: diagramTypeEmbeddings[0],
    match_count: 5,
  })

  if (matchError) {
    throw new Error(matchError.message)
  }

  const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
  let tokenCount = 0
  let contextText = ''

  for (let i = 0; i < 2; i++) {
    const pageSection = data[i]
    const content = pageSection.content
    const encoded = tokenizer.encode(content)
    tokenCount += encoded.text.length

    if (tokenCount >= 1500) {
      break
    }

    contextText += `${content.trim()}\n---\n`
  }

  console.log('Context Text: ', contextText)

  const assistantMessage1: ChatCompletionMessageParam = {
    role: 'assistant',
    content:
      type === 'Flow Diagram'
        ? promptForReactFlowContext(contextText)
        : promptForChartJsContext(contextText),
  }

  const userMessage2: ChatCompletionMessageParam = {
    role: 'user',
    content:
      type === 'Flow Diagram' ? promptForResponse : promptForChartJsResponse,
  }

  const assistantMessage3: ChatCompletionMessageParam = {
    role: 'assistant',
    content:
      type === 'Flow Diagram'
        ? promptForExampleCode
        : promptForChartJsExampleCode,
  }

  const userMessage: ChatCompletionMessageParam = {
    role: 'user',
    content:
      type === 'Flow Diagram'
        ? promptForUserMessage(diagramTitle, diagramDescription)
        : promptForUserMessageForChartJs(diagramTitle, diagramDescription),
  }

  const res = await openAiModel.chat.completions.create({
    model: 'gpt-4',
    messages: [assistantMessage1, assistantMessage3, userMessage2, userMessage],
    temperature: 0.7,
  })

  if (res?.choices?.[0]?.message) {
    console.log('1. Response from OpenAI: ', res.choices[0].message.content)

    // if the response includes ```json or ``` then we need to extract the json
    // and return it as the result
    const response = res.choices[0].message.content as string
    const lowercasejsonMatch = response.match(/```json\n([\s\S]*?)\n```/)
    const uppercasejsonMatch = response.match(/```JSON\n([\s\S]*?)\n```/)
    const result = lowercasejsonMatch
      ? lowercasejsonMatch[1]
      : uppercasejsonMatch
        ? uppercasejsonMatch[1]
        : null

    if (result) {
      return new Response(
        JSON.stringify({
          result,
        }),
        {
          headers: {
            'content-type': 'application/json',
          },
        },
      )
    }

    return new Response(
      JSON.stringify({
        result: res.choices[0].message.content,
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    )
  }

  return new Response(
    JSON.stringify({
      result: 'Failed to generate diagram',
    }),
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  )
}
