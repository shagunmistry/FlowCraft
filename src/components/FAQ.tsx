'use client'

import { Disclosure, Transition } from '@headlessui/react'

const faqs = [
  {
    question: 'What is FlowCraft?',
    answer:
      'FlowCraft is an AI-powered drafting suite for diagrams, charts, and illustrations. Describe what you want. It drafts the visual. No dragging, no toolbar archaeology.',
  },
  {
    question: 'What can I draft?',
    answer:
      'Flowcharts, sequence diagrams, mind maps, knowledge graphs, user-journey maps, Sankey diagrams, pie charts, infographics, and editorial illustrations — all from a single sentence or a document paste.',
  },
  {
    question: 'Is it suitable for beginners?',
    answer:
      "Absolutely. If you can write a sentence, you can draft a diagram. The interface is intentionally quiet — your idea is the input, the visual is the output.",
  },
  {
    question: 'Does FlowCraft support collaboration?',
    answer:
      'Real-time collaboration is on the roadmap. Shared links with invite codes are live today. Check the release notes for latest updates.',
  },
  {
    question: 'How does billing work?',
    answer:
      'Monthly or annual, with a 17% discount for annual. Cancel anytime. Specific billing questions — reach support directly.',
  },
]

export default function FAQs() {
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
    <section className="relative bg-ink text-paper" aria-labelledby="faq-heading">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-40"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative mx-auto max-w-[1280px] border-t border-rule px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2
              id="faq-heading"
              className="mt-6 font-serif text-5xl leading-[0.95] tracking-[-0.01em] text-paper md:text-6xl"
            >
              Questions,
              <br />
              <span className="italic text-signal">answered</span>
              <span className="text-paper">.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-paper/60">
              Can't find what you need? Reach out to{' '}
              <a
                href="/support"
                className="text-signal underline decoration-signal/40 underline-offset-4 transition-colors hover:decoration-signal"
              >
                support
              </a>
              .
            </p>
          </div>

          <dl className="lg:col-span-7">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question}>
                {({ open }) => (
                  <div className="border-t border-rule last:border-b">
                    <dt>
                      <Disclosure.Button className="group flex w-full items-start justify-between gap-6 py-6 text-left text-paper transition-colors hover:text-signal">
                        <span className="font-serif text-xl md:text-2xl">
                          {faq.question}
                        </span>
                        <span className="mt-1 flex h-7 w-7 flex-none items-center justify-center border border-rule font-mono text-fog transition-all group-hover:border-signal group-hover:text-signal">
                          {open ? '–' : '+'}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Transition
                      enter="transition duration-200 ease-out"
                      enterFrom="transform -translate-y-1 opacity-0"
                      enterTo="transform translate-y-0 opacity-100"
                      leave="transition duration-150 ease-out"
                      leaveFrom="transform translate-y-0 opacity-100"
                      leaveTo="transform -translate-y-1 opacity-0"
                    >
                      <Disclosure.Panel as="dd" className="pb-8 pr-8">
                        <p className="max-w-2xl text-base leading-relaxed text-paper/60">
                          {faq.answer}
                        </p>
                      </Disclosure.Panel>
                    </Transition>
                  </div>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
