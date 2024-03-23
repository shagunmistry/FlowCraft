import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { cn, DiagramOrChartType } from '@/lib/utils'

const TitlePrefixExamples = {
  Chart: [
    'Bar Chart of...',
    'Bubble Chart of...',
    'Line Chart of...',
    'Pie Chart of...',
    'Polar Area Chart of...',
    'Radar Chart of...',
    'Scatter Chart of...',
  ],
  Mermaid: [
    'Flowchart of...',
    'Sequence Diagram of...',
    'Class Diagram of...',
    'State Diagram of...',
    'Entity Relationship Diagram of...',
    'User Journey of...',
    'Gantt of...',
    'Pie Chart of...',
    'Quadrant Chart of...',
    'Requirement Diagram of...',
    'Gitgraph (Git) Diagram of...',
    'Mindmaps of...',
    'Timeline of...',
    'Zenuml of...',
    'Sankey of...',
  ],
  Whiteboard: [],
  'Flow Diagram': [],
}

export default function ExamplesDropdown({
  values,
  selectExample,
  selectedType,
  selectedTypeDescription,
}: {
  values: {
    title: string
    description: string
  }[]
  selectedType: DiagramOrChartType
  selectedTypeDescription: string
  selectExample: (title: string, description: string) => void
}) {
  const [selected, setSelected] = useState(values[2])

  useEffect(() => {
    setSelected(values[2])
  }, [values])

  const handleSelect = (value: { title: string; description: string }) => {
    setSelected(value)
    selectExample(value.title, value.description)
  }

  return (
    <div className="mb-4">
      <h2 className="text-lg font-medium leading-6">
        {selectedTypeDescription}
      </h2>
      <ul className="my-8 text-lg text-gray-500">
        {TitlePrefixExamples[selectedType] &&
        TitlePrefixExamples[selectedType].length > 0 ? (
          <>
            <h2 className="text-lg font-medium leading-6">
              Prefix your Diagram Title with:
            </h2>
            {TitlePrefixExamples[selectedType].map((title) => (
              <li key={title} className="flex items-center gap-x-2">
                <CheckIcon className="h-5 w-5 text-pink-600" />
                <span>"{title}"</span>
              </li>
            ))}
            <li key="Custom Chart" className="flex items-center gap-x-2">
              <CheckIcon className="h-5 w-5 text-pink-600" />
              <span>Or let the AI decide for you!</span>
            </li>
          </>
        ) : null}
      </ul>
      <Listbox value={selected} onChange={handleSelect}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium leading-6">
              Try these examples to get started!
            </Listbox.Label>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 sm:text-sm sm:leading-6">
                <span className="inline-flex w-full truncate">
                  <span className="truncate">{selected.title}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {values.map((value) => (
                    <Listbox.Option
                      key={value.title}
                      className={({ active }) =>
                        cn(
                          active ? 'bg-pink-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value={value}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex">
                            <span
                              className={cn(
                                selected ? 'font-semibold' : 'font-normal',
                                'truncate',
                              )}
                            >
                              {value.title}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={cn(
                                active ? 'text-white' : 'text-pink-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  )
}
