'use client'
import { StarIcon } from '@heroicons/react/20/solid'
import Image, { StaticImageData } from 'next/image'

import ReactFlow, { Controls, EdgeTypes, MiniMap } from 'reactflow'
import CustomEdge from './ReactFlow/CustomEdge'

// Define the custom edge type
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

// Reusable Tailwind classes for the Apple-style shadow and border
const cardStyle = 'rounded-xl border border-gray-200 shadow-md'
const ctaButtonStyle =
  'block w-full rounded-lg border border-transparent bg-blue-500 px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'

export default function BaseUseCaseLanding({
  headline,
  subheadline,
  ratedBy,
  imageSrc,
  imageAlt,
  imageDescription,
  imageDescriptionSubtext,
  contentArea,
  ctaHeader,
  ctaSubHeader,
  nodes,
  edges,
  diagramTitle,
}: {
  headline: string // SEO: Primary H1 for the page
  subheadline: string
  ratedBy: string
  imageSrc: StaticImageData
  imageAlt: string // SEO: Essential for images
  imageDescription: string
  imageDescriptionSubtext: string
  contentArea: { headline: string; subheadline: string }[] // Content structure uses H2s
  ctaHeader: string
  ctaSubHeader: string
  nodes: any[]
  edges: any[]
  diagramTitle: string
}) {
  // Removed the squareSvgs function entirely as it conflicts with the minimalist, no-gradients aesthetic.

  return (
    // Base background is pure white
    <div className="bg-white text-gray-900">
      <main>
        {/* Hero section */}
        {/* Adjusted padding for a cleaner, wider look */}
        <section className="overflow-hidden pb-24 pt-16 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-16 lg:px-8">
            {/* Left Column: Headline and CTA */}
            <div className="lg:pr-12">
              <div className="mt-8 lg:mt-0">
                <div className="sm:max-w-xl">
                  {/* H1 is essential for SEO and prominence */}
                  <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
                    {headline}
                  </h1>
                  {/* Subtle, highly legible subheadline */}
                  <p className="mt-6 text-xl text-gray-500">{subheadline}</p>
                </div>

                {/* Hero CTA Form (Simplified) */}
                <form action="#" className="mt-10 sm:flex sm:max-w-md">
                  {process.env.NODE_ENV !== 'production' ? (
                    <div className="min-w-0 flex-1">
                      <label htmlFor="hero-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="hero-email"
                        type="email"
                        // Clean, white input with subtle border
                        className="block w-full rounded-lg border border-gray-300 px-5 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  ) : null}
                  <div className="mt-4 sm:ml-3 sm:mt-0">
                    <a href="/" className={ctaButtonStyle}>
                      Get Started
                    </a>
                  </div>
                </form>

                {/* Rating component (Subtle and non-intrusive) */}
                <div className="mt-8">
                  <div className="inline-flex items-center divide-x divide-gray-300">
                    <div className="flex flex-shrink-0 pr-5">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <StarIcon
                          key={item}
                          // Gold color for stars
                          className="h-5 w-5 text-yellow-500"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1 py-1 pl-5 text-sm text-gray-500">
                      <span className="font-semibold text-gray-900">
                        Rated 5 stars
                      </span>{' '}
                      by{' '}
                      <span className="font-semibold text-gray-900">
                        {ratedBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: ReactFlow Diagram (Primary Visual) */}
            {/* The diagram is the main visual, placed prominently */}
            <div className="relative mt-16 lg:mt-0">
              {/* Apply the clean card style to the diagram container */}
              <div className={`${cardStyle} h-96 p-6 lg:h-full lg:p-8`}>
                <h2 className="mb-4 text-center text-xl font-bold">
                  "{diagramTitle}"
                </h2>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  fitView={true}
                  // Minimalist, pure white background for the flow
                  className="h-full w-full rounded-lg border border-gray-200 bg-white"
                  attributionPosition="top-right"
                  contentEditable={false}
                  edgeTypes={edgeTypes}
                  // Disable drag for a cleaner initial UX unless explicitly needed
                  draggable={false}
                >
                  {/* Use simple controls for minimalism */}
                  <Controls
                    showZoom={true}
                    showFitView={true}
                    showInteractive={false}
                  />
                  {/* MiniMap is often complex/distracting, so we might omit it or style it minimally. Retained for function, but keep in mind for full minimalist removal. */}
                  {/* <MiniMap /> */}
                </ReactFlow>
              </div>

              {/* Tips for diagram use (Simplified UX) */}
              <div className="mt-4 flex items-center justify-center gap-x-6 text-center">
                <p className="text-sm font-medium text-gray-500">
                  <span className="mr-1 inline-block text-base">🖱️</span> Click
                  to drag or scroll to zoom.
                </p>
                <p className="text-sm font-medium text-gray-500">
                  <span className="mr-1 inline-block text-base">✏️</span> Edit
                  available after sign up.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- */}

        {/* Content & Testimonial Section */}
        {/* White background section for clean separation */}
        <section className="relative bg-white py-24">
          <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:gap-16 lg:px-8">
            {/* Left Column: Use Case Content Areas */}
            <div className="mx-auto max-w-md px-4 sm:max-w-3xl lg:order-2 lg:max-w-none lg:px-0">
              {/* Content area: Uses H2 for better SEO and hierarchy */}
              {contentArea.map((item, index) => (
                <div
                  key={item.headline}
                  className={`pt-12 ${index === 0 ? 'pt-0' : 'mt-12 border-t border-gray-200'}`}
                >
                  {/* H2 for main content headings */}
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {item.headline}
                  </h2>
                  <div className="mt-4 space-y-4 text-gray-500">
                    <p className="text-lg leading-7">{item.subheadline}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Image/Quote Block */}
            {/* Simple white card block for the image/testimonial */}
            <div className="relative mx-auto mt-16 max-w-md px-4 sm:max-w-3xl lg:order-1 lg:mt-0 lg:max-w-none lg:px-0">
              <div className={`${cardStyle} overflow-hidden`}>
                <Image
                  className="h-full w-full object-cover"
                  src={imageSrc}
                  alt={imageAlt}
                  width={600} // Added explicit size for Next/Image optimization
                  height={400} // Added explicit size for Next/Image optimization
                />
              </div>

              {/* Quote Block - positioned directly below the image for flow */}
              <blockquote className="mt-8 rounded-xl bg-gray-50 p-6 lg:p-8">
                <div className="text-lg font-medium text-gray-900">
                  <p className="relative">"{imageDescription}"</p>
                </div>
                <footer className="mt-4">
                  <p className="text-base font-semibold text-gray-500">
                    {imageDescriptionSubtext}
                  </p>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* --- */}

        {/* Final CTA section (Prominent, simple, clean) */}
        {/* Use a soft gray background for contrast from the white sections */}
        <section className="relative mt-24 bg-gray-50 py-20 sm:mt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Apply the clean card style to the CTA container */}
            <div
              className={`bg-white p-8 text-center sm:p-12 lg:p-16 ${cardStyle}`}
            >
              <div className="relative">
                <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                  {ctaHeader}
                </h2>
                <p className="mx-auto mt-4 max-w-3xl text-xl text-gray-500">
                  {ctaSubHeader}
                </p>
              </div>

              {/* CTA Form */}
              <form action="#" className="mt-10 sm:mx-auto sm:flex sm:max-w-lg">
                {process.env.NODE_ENV !== 'production' ? (
                  <div className="min-w-0 flex-1">
                    <label htmlFor="cta-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="cta-email"
                      type="email"
                      className="block w-full rounded-lg border border-gray-300 px-5 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                ) : null}
                <div className="mt-4 sm:ml-3 sm:mt-0">
                  <a href="/login" className={ctaButtonStyle}>
                    Get Started
                  </a>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
