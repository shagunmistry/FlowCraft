export const landingFaqs = [
  {
    question: 'What is FlowCraft?',
    answer:
      'FlowCraft is an AI diagram generator. You describe a process, system or idea in plain language and it draws the flowchart, mind map, sequence diagram or database schema for you.',
  },
  {
    question: 'Can I try it without an account?',
    answer:
      'Yes. The generator at the top of this page works with no sign up. Create a free account when you want to save, edit and export your diagrams.',
  },
  {
    question: 'Which diagram types can FlowCraft create?',
    answer:
      'Flowcharts, mind maps, sequence diagrams, class diagrams, state machines, entity relationship diagrams, knowledge graphs, Sankey diagrams, charts, infographics and illustrations.',
  },
  {
    question: 'Can I edit a diagram after it is generated?',
    answer:
      'Yes. Refine it with a follow up instruction or adjust it by hand, then share a link or export it.',
  },
  {
    question: 'What formats can I export?',
    answer: 'You can export PNG, SVG and PDF files, or share a public link to the diagram.',
  },
  {
    question: 'How much does FlowCraft cost?',
    answer:
      'Paid plans start with Hobby for individuals, Pro for unlimited diagrams, and Teams for shared workspaces. Annual billing saves 17 percent and you can cancel at any time.',
  },
]

export default function LandingFaq() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: landingFaqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <section aria-labelledby="faq-heading" className="border-t border-rule">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-24 lg:grid-cols-12 lg:px-8 lg:py-32">
        <h2
          id="faq-heading"
          className="font-serif text-4xl leading-[1.05] text-paper md:text-5xl lg:col-span-4"
        >
          Questions people ask
        </h2>
        <div className="lg:col-span-8">
          {landingFaqs.map((f) => (
            <details key={f.question} className="group border-b border-rule py-5 first:pt-0">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg text-paper [&::-webkit-details-marker]:hidden">
                {f.question}
                <span aria-hidden className="mt-1 text-fog transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[62ch] text-[17px] leading-relaxed text-fog">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
