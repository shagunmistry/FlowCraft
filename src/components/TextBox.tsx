import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { useContext, useState } from 'react'

import Dropdown from './Dropdown'

export const exampleTitlesAndDescriptions = [
  {
    title: 'House Buying Process',
    description:
      'The house buying process is the process by which a person buys a house. The process can be broken down into 5 steps: 1. Find a house 2. Make an offer 3. Get a mortgage 4. Close on the house 5. Move in',
  },
  {
    title: 'Paneer Tikka Masala Recipe',
    description:
      'Paneer Tikka Masala is a popular Indian dish. It is made by marinating paneer in a mixture of spices and then cooking it in a tomato-based sauce. The dish is typically served with rice or naan.',
  },
  {
    title: 'How to Make a Paper Airplane',
    description:
      'Paper airplanes are a fun and easy way to pass the time. They can be made in many different shapes, sizes, and colors. This article will teach you how to make a paper airplane that flies far and fast!',
  },
  {
    title: 'Patient Triaging Process',
    description:
      'The patient triaging process is a system that helps healthcare providers determine the order in which patients should be seen. It is used to prioritize patients based on their medical needs and the severity of their condition.',
  },
]

export default function TextBox() {
  const [title, setTitle] = useState<string>(
    exampleTitlesAndDescriptions[2].title,
  )
  const [description, setDescription] = useState<string>(
    exampleTitlesAndDescriptions[2].description,
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>('')

  const context = useContext(DiagramContext)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    context.loading = true
    setLoading(true)

    console.log('--- title', title)
    console.log('---- description', description)
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
      <>
        <div className="mt-14 h-96 w-full rounded-lg bg-pink-50 shadow-lg">
          <p className="text-md text-center text-pink-900">
            Please be patient while we generate your diagram, it may take a
            couple minutes.
          </p>
          <div className="flex h-full items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-pink-500"></div>
          </div>
        </div>
      </>
    )
  }

  const selectExample = (title: string, description: string) => {
    setTitle(title)
    setDescription(description)
  }

  return (
    <>
      {/** Show a dropdown for example title and description values */}

      <Dropdown
        values={exampleTitlesAndDescriptions}
        selectExample={selectExample}
      />
      <form className="relative" onSubmit={handleSubmit}>
        <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
          <label htmlFor="title" className="sr-only">
            Diagram Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="block w-full border-0 pt-2.5 text-lg font-medium placeholder:text-gray-400 focus:ring-0"
            placeholder="Diagram Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="description" className="sr-only">
            Diagram Description
          </label>
          <textarea
            rows={10}
            name="description"
            id="description"
            className="block w-full resize-none border-0 py-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Write a description about what you want to diagram"
            value={description}
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
              {/* <button
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
            </button> */}
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
          <div className="absolute inset-x-px">
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
    </>
  )
}
