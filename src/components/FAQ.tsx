'use client'

import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/20/solid'

const faqs = [
  {
    id: 1,
    question: 'What is FlowCraft?',
    answer:
      'FlowCraft is an innovative AI-powered diagramming platform designed to revolutionize the way you create visual representations of ideas and processes. Our platform utilizes cutting-edge AI technology to assist you in generating stunning flowcharts, whiteboard sketches, charts, and complex diagrams with ease.',
  },
  {
    id: 2,
    question: 'How do I subscribe to FlowCraft?',
    answer:
      'Subscribing to FlowCraft is easy! Visit our pricing page and choose the plan that best suits your needs. You can then securely enter your payment information through Stripe to activate your subscription.',
  },
  {
    id: 3,
    question: 'Can I upgrade or downgrade my plan?',
    answer:
      'Absolutely! You can easily upgrade or downgrade your FlowCraft plan at any time. Simply contact our support team, and we will help you switch to a plan that better fits your needs.',
  },
  {
    id: 4,
    question: 'What happens when my free trial ends?',
    answer:
      "When your free trial ends, your account will automatically be converted to a paid subscription. You'll continue to have access to all of FlowCraft's features without any interruptions.",
  },
  {
    id: 5,
    question: 'How do I cancel my subscription?',
    answer:
      "You can cancel your FlowCraft subscription at any time by contacting our support team. We'll guide you through the process and ensure that your subscription is canceled without any hassle.",
  },
  {
    id: 7,
    question: 'What types of diagrams can I create with FlowCraft?',
    answer:
      'FlowCraft empowers you to create a wide variety of diagrams, including:  * Flowcharts * Whiteboard sketches * Charts (pie charts, bar charts, etc.) * Complex AI-generated diagrams:  * Sankey diagrams * Mind maps * Requirements diagrams * User journey maps',
  },
  {
    id: 8,
    question: 'How does the AI assistance work in FlowCraft?',
    answer:
      "FlowCraft's AI assistant leverages advanced algorithms to understand your needs and intentions. Simply provide basic information or a starting point, and our AI will suggest relevant shapes, connections, and layouts, streamlining the diagramming process. You can still maintain complete creative control while benefiting from the AI's efficiency and suggestions.",
  },
  {
    id: 9,
    question: 'Is FlowCraft suitable for beginners?',
    answer:
      "Absolutely! FlowCraft is designed with user-friendliness in mind. The intuitive interface and AI assistance make it easy for both beginners and experienced users to create professional-looking diagrams. Whether you're new to diagramming or looking to boost your productivity, FlowCraft caters to all skill levels.",
  },
  {
    id: 10,
    question: 'Does FlowCraft offer collaboration features?',
    answer:
      'We are currently working on implementing collaboration features in FlowCraft. Stay tuned for updates on our progress and upcoming releases!',
  },
  {
    id: 11,
    question: 'What are the benefits of using FlowCraft?',
    answer:
      'FlowCraft offers numerous benefits, including:  * Increased efficiency and productivity in diagramming  * Creation of professional-looking and visually appealing diagrams  * Enhanced communication and collaboration with teams  * Exploration and experimentation with different diagram types  * Reduced time spent on manual diagramming tasks',
  },
  {
    id: 12,
    question: 'Does FlowCraft offer a free trial?',
    answer:
      "Yes, we offer a free trial period for you to explore FlowCraft's features and experience the power of AI-assisted diagramming firsthand. Sign up for a free trial today and see how FlowCraft can revolutionize your diagramming process!",
  },
  {
    id: 13,
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
