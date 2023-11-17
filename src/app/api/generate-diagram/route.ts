import { supabase } from '@/lib/supabase'
import { OpenAiApiEdge, openAiModel } from '@/lib/openai'
import GPT3Tokenizer from 'gpt3-tokenizer'
import { match_documents_for_react_flow } from '@/lib/utils'

export async function POST(req: Request) {
  const json = await req.json()

  const {
    diagramDescription,
    diagramTitle,
    // isRetry,
    // previouslyGeneratedDiagramCode,
    // errorDetails,
  } = json

  let summarizedDiagramDescription = ''

  const diagramFunction: string = match_documents_for_react_flow

  const diagramTypeEmbedding = await openAiModel.embeddings.create({
    input: diagramTitle,
    model: 'text-embedding-ada-002',
  })

  if (!diagramTypeEmbedding) {
    throw new Error(
      'Failed to create embeddings for the diagram description or type',
    )
  }

  const diagramTypeEmbeddings = diagramTypeEmbedding.data.map(
    (embedding) => embedding.embedding,
  )

  console.log('Diagram Type Embeddings: ', diagramTypeEmbeddings[0])

  const { error: matchError, data } = await supabase.rpc(diagramFunction, {
    query_embedding: diagramTypeEmbeddings[0],
    match_count: 2,
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

  const summarizedDiagramDescriptionPrompt =
    getSummaryPromptForDiagramDescription(diagramDescription)

  const summarizeRes = await OpenAiApiEdge.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: summarizedDiagramDescriptionPrompt,
      },
    ],
    temperature: 0.7,
  })

  const summarizeResponse = await summarizeRes.json()

  console.log('Summarize Response: ', summarizeResponse)

  if (
    summarizeResponse &&
    summarizeResponse.choices &&
    summarizeResponse.choices[0] &&
    summarizeResponse.choices[0].message &&
    summarizeResponse.choices[0].message.content
  ) {
    summarizedDiagramDescription = summarizeResponse.choices[0].message.content

    const assistantPrompt = getAssistantPrompt(contextText)

    const finalPrompt = getTemplateForDiagramBasedOnChosenType(
      contextText,
      summarizedDiagramDescription,
      diagramType,
      isRetry,
      previouslyGeneratedDiagramCode,
      errorDetails,
    )

    console.log('Final Prompt to send: ', finalPrompt)

    const res = await openAiModel.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a senior developer with expertise in MermaidJS and Diagramming.',
        },
        {
          role: 'assistant',
          content: assistantPrompt,
        },
        {
          role: 'user',
          content: finalPrompt,
        },
      ],
      temperature: 0.7,
    })

    console.log('Response from OpenAI: ', res)

    if (
      res &&
      res.choices &&
      res.choices[0] &&
      res.choices[0].message &&
      res.choices[0].message.content
    ) {
      console.log('Response from OpenAI 2: ', res.choices[0].message.content)
      return new Response(JSON.stringify(res.choices[0].message.content), {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      })
    }
  } else {
    throw new Error('Failed to summarize diagram description')
  }

  return new Response('Failed to generate diagram', {
    status: 500,
  })
}
