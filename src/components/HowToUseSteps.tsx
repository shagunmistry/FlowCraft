import ReactFlow, { MiniMap } from 'reactflow'

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
const features = [
  {
    name: 'Save Time and Effort',
    description: 'Generate diagrams in MINUTES instead of hours',
  },
  {
    name: 'No Technical Skills Required',
    description: 'No prior knowledge of diagram software is needed.',
  },
  {
    name: 'Thoughtfully designed',
    description:
      'The comfortable disc binding allows you to quickly rearrange pages or combine lined, graph, and blank refills.',
  },
  {
    name: 'Create Professional Diagrams',
    description: 'Produce high-quality diagrams that impress your audience.',
  },
  {
    name: 'Free to Use',
    description: 'Start creating diagrams for free with no risk.',
  },
]

// Examples nodes of a work promotion diagram
const exampleNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Step 1' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    data: { label: 'Step 2' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Step 3' },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Step 4' },
    position: { x: 250, y: 200 },
  },
]

// Example edges of a work promotion diagram
const exampleEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
  },
]

export default function HowToUseSteps() {
  return (
    <div className="bg-white">
      <section aria-labelledby="features-heading" className="relative">
        <div className="aspect-h-2 aspect-w-3 sm:aspect-w-5 lg:aspect-none overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-16">
          <ReactFlow
            nodes={exampleNodes}
            edges={exampleEdges}
            fitView={true}
            className="overflow-hidden rounded-lg bg-pink-100 shadow-lg lg:h-full lg:w-full"
          >
            <MiniMap />
          </ReactFlow>
        </div>

        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:pt-32">
          <div className="lg:col-start-2">
            <h2
              id="features-heading"
              className="text-3xl font-extrabold tracking-tight text-pink-900 sm:text-4xl"
            >
              A better way to diagram
            </h2>
            <p className="mt-4 text-pink-500">
              We've all been there. You need to create a diagram for a
              presentation, but you don't have the time or skills to do it
              yourself. You could hire someone to do it for you, but that would
              cost a lot of money. And what if they don't get it right? What if
              they make mistakes in the diagram?
            </p>

            <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 text-sm sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.name}>
                  <dt className="font-medium text-pink-900">{feature.name}</dt>
                  <dd className="mt-2 text-pink-500">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  )
}
