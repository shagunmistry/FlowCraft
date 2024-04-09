import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  CogIcon,
  RssIcon,
} from '@heroicons/react/20/solid'
import { MapIcon } from '@heroicons/react/24/outline'

const useCases = [
  {
    name: 'Knowledge Sharing Diagrams.',
    description:
      'Explain complex algorithms or system interactions visually with flowcharts for onboarding and training.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Process Mapping:.',
    description:
      'Create process maps to visualize and optimize workflows, identify bottlenecks, and improve efficiency.',
    icon: CogIcon,
  },
  {
    name: 'Stakeholder Communication.',
    description:
      'Use diagrams to communicate ideas and compltex concepts to stakeholders, clients, and team members.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Data Visualization.',
    description:
      'Turn raw data into pie charts, bar graphs, and other visualizations that provide insights and drive decisions.',
    icon: RssIcon,
  },
  {
    name: 'User Flow Prototyping.',
    description:
      'Quickly visualize user journeys and wireframes with intuitive diagrams, accelerating ideation and testing.',
    icon: Cog6ToothIcon,
  },
  {
    name: 'System Architecture.',
    description:
      'Design system architecture diagrams to plan and communicate the structure of complex systems.',
    icon: MapIcon,
  },
]

export default function UsecasesForLanding() {
  return (
    <div className="bg-gray-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight text-pink-500 sm:text-4xl">
            Use Cases
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            How FlowCraft has helped many users and organizations to like yours.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {useCases.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-pink-500">
                <feature.icon
                  className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                  aria-hidden="true"
                />
                {feature.name}
              </dt>{' '}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
