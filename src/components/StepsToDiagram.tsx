import { cn } from '@/lib/utils'
import { CheckIcon } from '@heroicons/react/20/solid'

const steps = [
  {
    name: 'Choose Type',
    description: 'Select whether you want to create a chart or flow diagram.',
    status: 'complete',
    stepNumber: 1,
  },
  {
    name: 'Select Example',
    description: 'If you are unsure, select an example to get started.',
    status: 'current',
    stepNumber: 1.5,
  },
  {
    name: 'Title',
    description: 'Enter a title that describes your chart or diagram.',
    status: 'complete',
    stepNumber: 2,
  },
  {
    name: 'Description (Optional)',
    description:
      'Enter the data that you want to visualize. The more quantitative the data, the better.',
    stepNumber: 3,
    status: 'complete',
  },
  {
    name: 'Create',
    description: 'Click the create button to create your chart or diagram!',
    status: 'complete',
    stepNumber: 4,
  },
  {
    name: 'Download',
    description: 'Download your chart or diagram to share with others!',
    status: 'complete',
    stepNumber: 5,
  },
]

export default function StepsToDiagram() {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn(
              stepIdx !== steps.length - 1 ? 'pb-10' : '',
              'relative',
            )}
          >
            {step.status === 'complete' ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-red-600"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 group-hover:bg-red-800">
                      <p className="text-lg font-semibold text-white">
                        {step.stepNumber}
                      </p>
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-xl font-medium font-semibold">
                      {step.name}
                    </span>
                    <span className="text-md text-white">
                      {step.description}
                    </span>
                  </span>
                </div>
              </>
            ) : step.status === 'current' ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                    aria-hidden="true"
                  />
                ) : null}
                <div
                  className="group relative flex items-start"
                  aria-current="step"
                >
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-600 bg-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-white">
                      {step.name}
                    </span>
                    <span className="text-sm text-white">
                      {step.description}
                    </span>
                  </span>
                </div>
              </>
            ) : (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-gray-500">
                      {step.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {step.description}
                    </span>
                  </span>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
