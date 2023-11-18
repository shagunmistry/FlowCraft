import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import {
  OpenAiApiEdge,
  openAiModel,
  promptForDiagram,
  promptForDiagramTitle,
  promptForExampleCode,
  promptForReactFlowContext,
  promptForResponse,
  promptForUserMessage,
} from '@/lib/openai'
import { MATCH_DOCUMENTS_FOR_REACT_FLOW_TABLE, supabase } from '@/lib/supabase'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import { useContext, useState } from 'react'

import GPT3Tokenizer from 'gpt3-tokenizer'
import { ChatCompletionRequestMessage } from 'openai-edge'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

// const generateDiagram = async (
//   diagramTitle: string,
//   diagramDescription: string,
// ) => {
//   const reactFlowNodesAndEdgesEmbedding = await openAiModel.embeddings.create({
//     input: 'Nodes and Edges',
//     model: 'text-embedding-ada-002',
//   })

//   if (!reactFlowNodesAndEdgesEmbedding) {
//     console.error(
//       'Failed to create embeddings for the diagram description or type',
//     )
//   }

//   const diagramTypeEmbeddings = reactFlowNodesAndEdgesEmbedding.data.map(
//     (embedding) => embedding.embedding,
//   )

//   console.log('Diagram Type Embeddings: ', diagramTypeEmbeddings[0])

//   const { error: matchError, data } = await supabase.rpc(
//     MATCH_DOCUMENTS_FOR_REACT_FLOW_TABLE,
//     {
//       query_embedding: diagramTypeEmbeddings[0],
//       match_count: 5,
//     },
//   )

//   if (matchError) {
//     throw new Error(matchError.message)
//   }

//   const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
//   let tokenCount = 0
//   let contextText = ''

//   for (let i = 0; i < 2; i++) {
//     const pageSection = data[i]
//     const content = pageSection.content
//     const encoded = tokenizer.encode(content)
//     tokenCount += encoded.text.length

//     if (tokenCount >= 1500) {
//       break
//     }

//     contextText += `${content.trim()}\n---\n`
//   }

//   console.log('Context Text: ', contextText)

//   const assistantMessage1: ChatCompletionMessageParam = {
//     role: 'assistant',
//     content: promptForReactFlowContext(contextText),
//   }

//   const assistantMessage2: ChatCompletionMessageParam = {
//     role: 'assistant',
//     content: promptForResponse,
//   }

//   const assistantMessage3: ChatCompletionMessageParam = {
//     role: 'assistant',
//     content: promptForExampleCode,
//   }

//   const userMessage: ChatCompletionMessageParam = {
//     role: 'user',
//     content: promptForUserMessage(diagramTitle, diagramDescription),
//   }

//   const res = await openAiModel.chat.completions.create({
//     model: 'gpt-3.5-turbo-16k',
//     messages: [
//       assistantMessage1,
//       assistantMessage2,
//       assistantMessage3,
//       userMessage,
//     ],
//     temperature: 0.7,
//   })

//   console.log('Response from OpenAI: ', res)

//   return res

//   // if (
//   //   res &&
//   //   res.choices &&
//   //   res.choices[0] &&
//   //   res.choices[0].message &&
//   //   res.choices[0].message.content
//   // ) {
//   //   console.log('Response from OpenAI 2: ', res.choices[0].message.content)
//   //   return new Response(JSON.stringify(res.choices[0].message.content), {
//   //     headers: {
//   //       'content-type': 'application/json;charset=UTF-8',
//   //     },
//   //   })
//   // }

//   // return new Response('Failed to generate diagram', {
//   //   status: 500,
//   // })
// }

export default function TextBox() {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>('')

  const context = useContext(DiagramContext)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    context.loading = true
    setLoading(true)

    console.log('title', title)
    console.log('description', description)
    context.description = description
    context.title = title

    try {
      setError(null)
      const diagram = await fetch('/api/generate-diagram', {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          description: description,
        }),
      })

      console.log('Diagram Response: ', diagram)

      const diagramJson = await diagram.json()

      console.log('Diagram JSON: ', JSON.parse(diagramJson.result))
      const diagramResult = JSON.parse(diagramJson.result)

      if (diagramResult && diagramResult.nodes && diagramResult.edges) {
        context.setNodes(diagramResult.nodes)
        context.setEdges(diagramResult.edges)
      }

      context.loading = false
      setLoading(false)
    } catch (e) {
      console.log('Error generating diagram: ', e)
      context.loading = false
      setLoading(false)
      setError('There was an error generating the diagram, please try again')
    }
  }

  if (loading) {
    return (
      <div className="mt-14 h-96 w-full rounded-lg bg-pink-50 shadow-lg">
        <div className="flex h-full items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-pink-500"></div>
        </div>
      </div>
    )
  }

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
        <label htmlFor="title" className="sr-only">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className="block w-full border-0 pt-2.5 text-lg font-medium placeholder:text-gray-400 focus:ring-0"
          placeholder="Title"
          defaultValue={''}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="description" className="sr-only">
          Description
        </label>
        <textarea
          rows={10}
          name="description"
          id="description"
          className="block w-full resize-none border-0 py-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="Write a description..."
          defaultValue={''}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Spacer element to match the height of the toolbar */}
        <div aria-hidden="true">
          <div className="py-2">
            <div className="h-9" />
          </div>
          <div className="h-px" />
        </div>
      </div>

      <div className="absolute inset-x-px bottom-0">
        {/* Actions: These are just examples to demonstrate the concept, replace/wire these up however makes sense for your project. */}

        <div className="flex items-center justify-between space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3">
          <div className="flex">
            <button
              type="button"
              className="group -my-2 -ml-2 inline-flex items-center rounded-full px-3 py-2 text-left text-gray-400"
            >
              <PaperClipIcon
                className="-ml-1 mr-2 h-5 w-5 group-hover:text-gray-500"
                aria-hidden="true"
              />
              <span className="text-sm italic text-gray-500 group-hover:text-gray-600">
                Attach a file
              </span>
            </button>
          </div>
          <div className="flex-shrink-0">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create
            </button>
          </div>
        </div>
      </div>
      {error && (
        <div className="absolute inset-x-px bottom-0">
          <div className="flex items-center justify-between space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3">
            <div className="flex">
              <span className="text-sm italic text-red-500 group-hover:text-red-600">
                {error}
              </span>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
