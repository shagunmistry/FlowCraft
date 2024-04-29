'use client'

import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/20/solid'

const faqs = [
  {
    question: 'What is FlowCraft?',
    answer:
      'FlowCraft is an innovative AI-powered diagramming platform designed to revolutionize the way you create visual representations of ideas and processes. Our platform utilizes cutting-edge AI technology to assist you in generating stunning flowcharts, whiteboard sketches, charts, and complex diagrams with ease.',
  },
  {
    question: 'What types of diagrams can I create with FlowCraft?',
    answer:
      'FlowCraft empowers you to create a wide variety of diagrams, such as: Flow Diagrams, Whiteboard diagrams, Charts (pie charts, bar charts, etc.), Complex AI-generated diagrams: (Sankey diagrams, Mind maps, Requirements diagrams, User journey maps), and more! Our platform is versatile and flexible, allowing you to explore different diagram types and unleash your creativity.',
  },

  {
    question: 'Is FlowCraft suitable for beginners?',
    answer:
      "Absolutely! FlowCraft is designed with user-friendliness in mind. The intuitive interface and AI assistance make it easy for both beginners and experienced users to create professional-looking diagrams. Whether you're new to diagramming or looking to boost your productivity, FlowCraft caters to all skill levels.",
  },
  {
    question: 'Does FlowCraft offer collaboration features?',
    answer:
      'We are currently working on implementing collaboration features in FlowCraft. Stay tuned for updates on our progress and upcoming releases!',
  },
  {
    question: 'I have a billing question not addressed here. What should I do?',
    answer:
      "If you have any further questions about billing or your FlowCraft subscription, feel free to contact our friendly support team. We're happy to assist you!",
  },
]
export default function FAQs() {
  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl divide-y divide-pink-500/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-pink-500">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-pink-500/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-pink-500">
                        <span className="text-base font-semibold leading-7">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusSmallIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusSmallIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600">
                        {faq.answer}
                      </p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
