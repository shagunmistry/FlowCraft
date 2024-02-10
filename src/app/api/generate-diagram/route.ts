import {
  MATCH_DOCUMENTS_FOR_CHARTJS_TABLE,
  MATCH_DOCUMENTS_FOR_REACT_FLOW_TABLE,
  getEmbeddingForContext,
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
import * as tldrawInputs from '@/lib/openai.tldraw'
import GPT3Tokenizer from 'gpt3-tokenizer'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { DiagramOrChartType } from '@/lib/utils'

export const maxDuration = 200

export async function POST(req: Request) {
  const json = await req.json()
  const { title: diagramTitle, description: diagramDescription } = json
  const type = json.type as DiagramOrChartType

  let contextText = ''
  if (type !== 'TLDraw') {
    contextText = await getEmbeddingForContext(type, contextText)
  }

  console.log('Context Text: ', contextText)

  const assistantMessage1: ChatCompletionMessageParam = {
    role: 'assistant',
    content:
      type === 'Flow Diagram'
        ? promptForReactFlowContext(contextText)
        : type === 'Chart'
          ? promptForChartJsContext(contextText)
          : '',
  }

  const userMessage2: ChatCompletionMessageParam = {
    role: 'user',
    content:
      type === 'Flow Diagram'
        ? promptForResponse
        : type === 'Chart'
          ? promptForChartJsResponse
          : type === 'TLDraw'
            ? tldrawInputs.promptForResponse
            : '',
  }

  const assistantMessage3: ChatCompletionMessageParam = {
    role: 'assistant',
    content:
      type === 'Flow Diagram'
        ? promptForExampleCode
        : type === 'Chart'
          ? promptForChartJsExampleCode
          : type === 'TLDraw'
            ? tldrawInputs.promptForExampleCode
            : '',
  }

  const userMessage: ChatCompletionMessageParam = {
    role: 'user',
    content:
      type === 'Flow Diagram'
        ? promptForUserMessage(diagramTitle, diagramDescription)
        : type === 'Chart'
          ? promptForUserMessageForChartJs(diagramTitle, diagramDescription)
          : type === 'TLDraw'
            ? tldrawInputs.promptForUserMessageForTlDraw(
                diagramTitle,
                diagramDescription,
              )
            : '',
  }

  const res = await openAiModel.chat.completions.create({
    model: 'gpt-4-0125-preview',
    messages: [assistantMessage1, assistantMessage3, userMessage2, userMessage],
    temperature: 0.8,
    max_tokens: 2300,
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

    console.log('2. Response from OpenAI: ', result)

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

    console.log('3. Response from OpenAI: ', res.choices[0].message.content)

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
