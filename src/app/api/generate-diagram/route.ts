import { getEmbeddingForContext } from '@/lib/supabase'
import {
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
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { DiagramOrChartType } from '@/lib/utils'
import { createClient } from '@/lib/supabase-auth/server'

export const maxDuration = 200

export async function POST(req: Request) {
  const supabaseClient = createClient()
  const { data: userData, error: userDataError } =
    await supabaseClient.auth.getUser()

  if (userDataError) {
    console.error(
      'Error getting user data while generating diagram:',
      userDataError,
    )
  }

  const json = await req.json()
  const { title: diagramTitle, description: diagramDescription } = json
  const type = json.type as DiagramOrChartType

  let contextText = ''
  if (type !== 'Whiteboard') {
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
          : type === 'Whiteboard'
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
          : type === 'Whiteboard'
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
          : type === 'Whiteboard'
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
      const { data: insertData, error: insertError } = await supabaseClient
        .from('diagrams')
        .insert([
          {
            title: diagramTitle,
            description: diagramDescription,
            type,
            data: JSON.stringify(result),
            created_at: new Date().toISOString(),
            user_id: userData.user?.id,
            private: true,
          },
        ])

      console.log('Insert Data: ', insertData)
      console.log('Insert Error: ', insertError)
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

    await supabaseClient.from('diagrams').insert([
      {
        title: diagramTitle,
        description: diagramDescription,
        type,
        data: JSON.stringify(result),
        created_at: new Date().toISOString(),
        user_id: userData.user?.id,
      },
    ])
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

  await supabaseClient.from('diagrams').insert([
    {
      title: diagramTitle,
      description: diagramDescription,
      type,
      data: `Failed to generate diagram`,
      created_at: new Date().toISOString(),
      user_id: userData.user?.id,
    },
  ])
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
