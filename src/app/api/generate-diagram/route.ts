import { getEmbeddingForContext } from '@/lib/supabase'
import {
  openAiModel,
  promptForChartJsExampleCode,
  promptForChartJsResponse,
  promptForExampleCode,
  promptForResponse,
  promptForUserMessage,
  promptForUserMessageForChartJs,
  promptForUserMessageForMermaid,
} from '@/lib/openai'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { DiagramOrChartType } from '@/lib/utils'
import { createClient } from '@/lib/supabase-auth/server'
import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import { getDiagramPrompt } from '@/lib/Examples/GetDiagramPrompt'

import { OPEN_AI_MODEL } from '@/lib/utils'

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

    return new Response(
      JSON.stringify({
        error: 'Error getting user data while generating diagram',
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
        status: 401,
      },
    )
  }

  // Check if the user exists in the users table, if not, insert them
  const { data: userDataFromDB } = await supabaseClient
    .from('users')
    .select('*')
    .eq('user_id', userData.user?.id)

  if (userDataFromDB?.length === 0 || !userDataFromDB) {
    const { data: insertUserData, error: insertUserError } =
      await supabaseClient.from('users').insert([
        {
          id: userData.user?.id,
          email: userData.user?.email,
          created_at: new Date().toISOString(),
        },
      ])
    if (insertUserError) {
      console.error(
        'Error inserting user data while generating diagram:',
        insertUserError,
      )
    }
  }

  console.log('User Data from DB: ', userDataFromDB)
  if (
    userDataFromDB &&
    userDataFromDB?.length > 0 &&
    userDataFromDB[0].subscribed === false
  ) {
    // Check how many diagrams the user has created already in the diagrams table
    const { data: userDiagramsData, error: userDiagramsError } =
      await supabaseClient
        .from('diagrams')
        .select()
        .eq('user_id', userData.user?.id)

    if (userDiagramsError) {
      console.error(
        'Error getting user diagrams while generating diagram:',
        userDiagramsError,
      )

      return new Response(
        JSON.stringify({
          error: 'Error getting user diagrams while generating diagram',
        }),
        {
          headers: {
            'content-type': 'application/json',
          },
          status: 401,
        },
      )
    }

    if (userDiagramsData.length > 2) {
      return new Response(
        JSON.stringify({
          error: 'User has created more than 5 diagrams',
        }),
        {
          headers: {
            'content-type': 'application/json',
          },
          status: 400,
        },
      )
    }
  }

  const json = await req.json()
  console.log('JSON: ', json)
  const { title: diagramTitle, description: diagramDescription } = json
  const type = json.type as DiagramOrChartType | TempMermaidDiagramType

  let contextText = ''
  if (type === 'Flow Diagram' || type === 'Chart') {
    contextText = await getEmbeddingForContext(type, contextText)
  }

  const assistantMessage1: ChatCompletionMessageParam = {
    role: 'assistant',
    content: getDiagramPrompt(type, contextText),
  }

  const assistantMessage3: ChatCompletionMessageParam = {
    role: 'assistant',
    content:
      type === 'Flow Diagram'
        ? promptForExampleCode
        : type === 'Chart'
          ? promptForChartJsExampleCode
          : '',
  }

  const userMessage: ChatCompletionMessageParam = {
    role: 'user',
    content:
      type === 'Flow Diagram'
        ? promptForUserMessage(diagramTitle, diagramDescription)
        : type === 'Chart'
          ? promptForUserMessageForChartJs(diagramTitle, diagramDescription)
          : promptForUserMessageForMermaid(diagramTitle, diagramDescription),
  }

  const userMessage2: ChatCompletionMessageParam = {
    role: 'user',
    content:
      type === 'Flow Diagram'
        ? promptForResponse
        : type === 'Chart'
          ? promptForChartJsResponse
          : '',
  }

  const arrayOfMessages = [
    assistantMessage1,
    assistantMessage3,
    userMessage2,
    userMessage,
  ]

  const res = await openAiModel.chat.completions.create({
    model: OPEN_AI_MODEL,
    messages: arrayOfMessages,
    temperature: 0.8,
    max_tokens: 2300,
    response_format: { type: 'json_object' },
  })

  console.log('1. Response from OpenAI: ', res.choices[0].message.content)
  if (res?.choices?.[0]?.message) {
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
        .select('id')

      if (insertError) {
        console.error(
          'Error inserting diagram data while generating diagram:',
          insertError,
        )
        return new Response(
          JSON.stringify({
            error: 'Error inserting diagram data while generating diagram',
          }),
          {
            headers: {
              'content-type': 'application/json',
            },
            status: 401,
          },
        )
      }

      console.log('Insert Data: ', insertData)
      console.log('Insert Error: ', insertError)
      return new Response(
        JSON.stringify({
          result,
          id: insertData[0].id,
        }),
        {
          headers: {
            'content-type': 'application/json',
          },
        },
      )
    }

    console.log('3. Response from OpenAI: ', res.choices[0].message.content)

    const { data: insertData, error: insertError } = await supabaseClient
      .from('diagrams')
      .insert([
        {
          title: diagramTitle,
          description: diagramDescription,
          type,
          data: JSON.stringify(response),
          created_at: new Date().toISOString(),
          user_id: userData.user?.id,
        },
      ])
      .select('id')

    if (insertError) {
      console.error(
        'Error inserting diagram data while generating diagram:',
        insertError,
      )

      return new Response(
        JSON.stringify({
          error: 'Error inserting diagram data while generating diagram',
        }),
        {
          headers: {
            'content-type': 'application/json',
          },
          status: 401,
        },
      )
    }

    return new Response(
      JSON.stringify({
        result: res.choices[0].message.content,
        id: insertData[0].id,
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
