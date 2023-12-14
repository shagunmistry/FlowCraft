import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { cn } from '@/lib/utils'

export default function ChartOrDiagramSelection({
  options,
  setSelectedOption,
  selectedOption,
}: {
  options: {
    id: number
    title: string
    description: string
  }[]
  setSelectedOption: (option: any) => void
  selectedOption: any
}) {
  return (
    <div className="mb-7">
      <RadioGroup value={selectedOption} onChange={setSelectedOption}>
        <RadioGroup.Label className="text-base text-xl font-semibold text-indigo-700">
          Select a chart or diagram type
        </RadioGroup.Label>

        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
          {options.map((option) => (
            <RadioGroup.Option
              key={option.id}
              value={option}
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
                        {option.title}
                      </RadioGroup.Label>
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
    </div>
  )
}
