'use client'
import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { cn } from '@/lib/utils'

const mailingLists = [
  {
    id: 1,
    title: 'Flow Diagram',
    description:
      'A flow diagram is a diagram representing some kind of process or workflow.',
  },
  {
    id: 2,
    title: 'Chart',
    description:
      'A chart is a graphical representation of data, in which "the data is represented by symbols, such as bars in a bar chart, lines in a line chart, or slices in a pie chart".',
  },
]

export default function ChartOrDiagramSelection() {
  const [selectedOption, setSelectedOption] = useState(mailingLists[0])

  return (
    <RadioGroup value={selectedOption} onChange={setSelectedOption}>
      <RadioGroup.Label className="text-base font-semibold leading-6 text-gray-900">
        Select a chart or diagram type
      </RadioGroup.Label>

      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {mailingLists.map((mailingList) => (
          <RadioGroup.Option
            key={mailingList.id}
            value={mailingList}
            className={({ active }) =>
              cn(
                active
                  ? 'border-indigo-600 ring-2 ring-indigo-600'
                  : 'border-gray-300',
                'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none',
              )
            }
          >
            {({ checked, active }) => (
              <>
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className="block text-sm font-medium text-gray-900"
                    >
                      {mailingList.title}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className="mt-1 flex items-center text-sm text-gray-500"
                    >
                      {mailingList.description}
                    </RadioGroup.Description>
                  </span>
                </span>
                <CheckCircleIcon
                  className={cn(
                    !checked ? 'invisible' : '',
                    'h-5 w-5 text-indigo-600',
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    active ? 'border' : 'border-2',
                    checked ? 'border-indigo-600' : 'border-transparent',
                    'pointer-events-none absolute -inset-px rounded-lg',
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}
