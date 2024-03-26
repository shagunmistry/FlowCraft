'use client'

import { getMermaidDiagramTitle, MermaidDiagramType } from '@/lib/utils.mermaid'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useState } from 'react'

export type TempMermaidDiagramType =
  | 'flowchart'
  | 'sequenceDiagram'
  | 'classDiagram'
  | 'stateDiagram'
  | 'entityRelationshipDiagram'
  | 'userJourney'
  | 'gantt'
  | 'pieChart'
  | 'quadrantChart'
  | 'requirementDiagram'
  | 'gitgraph'
  | 'mindmaps'
  | 'timeline'
  | 'zenuml'
  | 'sankey'

const getDescription = (type: TempMermaidDiagramType) => {
  switch (type) {
    case 'flowchart':
      return 'Map out processes and steps involved in a task or workflow.'
    case 'sequenceDiagram':
      return 'Visualize the interaction between different objects in a system.'
    case 'classDiagram':
      return 'Clearly model object-oriented systems, showing classes, attributes, and relationships.'
    case 'stateDiagram':
      return 'Depict the different states a system can be in and how it transitions between them.'
    case 'entityRelationshipDiagram':
      return 'Illustrate the relationships between entities (data points) in a database.'
    case 'userJourney':
      return "Craft compelling user experiences by visualizing a user's interaction with your product or service."
    case 'gantt':
      return 'Effectively manage projects by creating clear timelines with tasks and dependencies.'
    case 'pieChart':
      return 'Represent data in a circular chart, ideal for showing proportions of a whole.'
    case 'quadrantChart':
      return 'Organize data into four quadrants, useful for visualizing comparisons or relationships between two sets of data.'
    case 'requirementDiagram':
      return 'Capture both functional and non-functional requirements for software development.'
    case 'gitgraph':
      return 'Visualize your Git repository history with a clear and concise graph (Beta).'
    case 'mindmaps':
      return 'Brainstorm and organize ideas visually using a non-linear structure.'
    case 'timeline':
      return 'Create clear timelines for projects, events, or historical occurrences.'
    case 'zenuml':
      return 'Model data flows and transformations with a focus on data quality (Beta).'
    case 'sankey':
      return 'Visualize complex relationships between flows or stocks, often used to represent material or energy flows (Beta).'
    default:
      return 'Description not available.'
  }
}

const getDiagramImage = (type: TempMermaidDiagramType) => {
  switch (type) {
    case 'classDiagram':
      return 'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FClassDiagram.png?alt=media&token=e0838b08-21f8-42fa-9e04-ccb100313673'
    case 'entityRelationshipDiagram':
      return `https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FEntityRelationshipDiagram.png?alt=media&token=489adeba-3237-43ca-b049-2af9aa7aa318`
    case 'flowchart':
      return `https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FFlowchart%20Diagram.png?alt=media&token=7f4f2498-f7d2-458e-8574-a947c5f76400`
    case 'gantt':
      return 'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FGanttDiagram.png?alt=media&token=3473dcc9-1f77-43d1-bd53-0b876ab1fdc1'
    case 'gitgraph':
      return 'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FGitDiagram.png?alt=media&token=8a41a1a9-eb24-485b-ade3-e64d57ae0f33'
    case 'mindmaps':
      return 'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FMindMapDiagram.png?alt=media&token=9c7af896-3760-4b60-a9e5-b0ecfb7f00f0'
    case 'pieChart':
      return 'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FPieChartDiagram.png?alt=media&token=ffd6b393-0282-4f0a-a825-fd05c2148ded'
    case 'quadrantChart':
      return 'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FQuadrantDiagram.png?alt=media&token=34891e63-947d-4e48-a44d-76e939fd3598'
    case 'requirementDiagram':
      return 'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FRequirementsDiagram.png?alt=media&token=23a1894f-8120-4163-b89c-b037b5e6be26'
    case 'sankey':
      return 'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FSankeyDiagram.png?alt=media&token=690e8aaa-a7f8-4c8a-bb4e-f69d4a5fdce6'
    case 'sequenceDiagram':
      return 'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FSequenceDiagram.png?alt=media&token=107c915a-0ca2-4ef6-aa99-75c4063035a9'
    case 'stateDiagram':
      return 'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FStateDiagram.png?alt=media&token=d973d545-f6ee-4ef5-89c7-600781e8344e'
    case 'timeline':
      return 'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FTimelineDiagram.png?alt=media&token=ecabe0b9-631d-4d3b-af59-95045f8e8e9a'
    case 'userJourney':
      return 'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FUserJourneyDiagram.png?alt=media&token=48ade66b-a168-4ebc-89d9-e91e7d103974'
    case 'zenuml':
      return 'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FZenUmlDiagram.png?alt=media&token=4a29846a-017a-4f8d-ad25-4a5aa9d94473'
    default:
      return 'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FClassDiagram.png?alt=media&token=e0838b08-21f8-42fa-9e04-ccb100313673'
  }
}

export default function OverviewDialog({
  type,
  open,
  setOpen,
}: {
  type: TempMermaidDiagramType
  open: boolean
  setOpen: (open: boolean) => void
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                    <div className="sm:col-span-4 lg:col-span-5">
                      <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg shadow-lg">
                        <Image
                          src={getDiagramImage(type)}
                          alt={getMermaidDiagramTitle(type)}
                          className="h-full w-full object-scale-down object-center"
                          fill
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-8 lg:col-span-7">
                      <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                        {getMermaidDiagramTitle(type)}
                      </h2>

                      <section
                        aria-labelledby="information-heading"
                        className="mt-3"
                      >
                        <h3 id="information-heading" className="sr-only">
                          Diagram information
                        </h3>

                        <p className="text-2xl text-gray-900">
                          {getDescription(type)}
                        </p>
                      </section>
                      <Link
                        href={`/dashboard/mermaid/${type}`}
                        className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Create {getMermaidDiagramTitle(type)}
                      </Link>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
