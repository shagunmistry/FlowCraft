'use client'

import { Disclosure, Transition } from '@headlessui/react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

const faqs = [
  {
    question: 'What is FlowCraft?',
    answer:
      'FlowCraft is an innovative AI-powered diagramming platform designed to revolutionize the way you create visual representations of ideas and processes. Our platform utilizes cutting-edge AI technology to assist you in generating stunning flowcharts, whiteboard sketches, charts, and complex diagrams with ease.',
  },
  {
    question: 'What types of diagrams can I create?',
    answer:
      'FlowCraft empowers you to create a wide variety of diagrams including Flow Diagrams, Whiteboard sketches, Charts (pie, bar, etc.), and complex AI-generated visuals like Sankey diagrams, Mind maps, Requirements diagrams, and User journey maps.',
  },
  {
    question: 'Is FlowCraft suitable for beginners?',
    answer:
      "Absolutely. FlowCraft is designed with user-friendliness in mind. The intuitive interface and AI assistance make it easy for both beginners and experienced users to create professional-looking diagrams. Whether you're new to diagramming or looking to boost your productivity, FlowCraft caters to all skill levels.",
  },
  {
    question: 'Does FlowCraft offer collaboration features?',
    answer:
      'We are currently working on implementing real-time collaboration features in FlowCraft. Stay tuned for updates on our progress and upcoming releases in our changelog.',
  },
  {
    question: 'How does billing work?',
    answer:
      "If you have specific questions about billing or your FlowCraft subscription that aren't addressed in your dashboard, please contact our support team. We're happy to assist you immediately.",
  },
]

export default function FAQs() {
  // Generate JSON-LD for SEO Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <section className="bg-white" aria-labelledby="faq-heading">
      {/* Inject SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-zinc-100">
          <div className="mb-10 lg:mb-14">
            <h2
              id="faq-heading"
              className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl"
            >
              Frequently asked questions
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Can’t find the answer you’re looking for? Reach out to our{' '}
              <a
                href="/support"
                className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
              >
                customer support
              </a>{' '}
              team.
            </p>
          </div>

          <dl className="mt-10 space-y-6 divide-y divide-zinc-100">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-zinc-900 transition-colors hover:text-zinc-600">
                        <span className="text-base font-medium leading-7">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusIcon
                              className="h-5 w-5 flex-none"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusIcon
                              className="h-5 w-5 flex-none"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        <p className="text-base leading-7 text-zinc-500">
                          {faq.answer}
                        </p>
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
