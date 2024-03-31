import { cn } from '@/lib/utils'
import { CheckIcon } from '@heroicons/react/20/solid'
import ReactFlow, { MiniMap } from 'reactflow'

const steps: {
  id: string
  name: string
  description: string
  status: 'complete' | 'current' | 'upcoming'
}[] = [
  {
    id: '01',
    name: 'Choose Diagram Type',
    description:
      'You can choose from a variety of diagram types such as Flow Diagrams, Whiteboard, Mindmaps, and more.',
    status: 'current',
  },
  {
    id: '02',
    name: 'Title & Description',
    description: 'Enter a title and describe your diagram.',
    status: 'current',
  },
  {
    id: '03',
    name: 'View & Share',
    description: 'View, edit, and share your FlowCraft Diagram with others.',
    status: 'current',
  },
]

export default function HowToUseSteps() {
  return (
    <div className="mt-10 lg:border-b lg:border-t lg:border-indigo-200">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Progress"
      >
        <ol
          role="list"
          className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-indigo-200"
        >
          {steps.map((step, stepIdx) => (
            <li key={step.id} className="relative overflow-hidden lg:flex-1">
              <div
                className={cn(
                  stepIdx === 0 ? 'rounded-t-md border-b-0' : '',
                  stepIdx === steps.length - 1 ? 'rounded-b-md border-t-0' : '',
                  'overflow-hidden border border-indigo-200 lg:border-0',
                )}
              >
                <>
                  <span
                    className={cn(
                      stepIdx !== 0 ? 'lg:pl-9' : '',
                      'flex items-start px-6 py-5 text-sm font-medium',
                    )}
                  >
                    <span className="flex-shrink-0">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-pink-600">
                        <span className="text-pink-600">{step.id}</span>
                      </span>
                    </span>
                    <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                      <span className="text-lg font-medium text-pink-600">
                        {step.name}
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        {step.description}
                      </span>
                    </span>
                  </span>
                </>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
