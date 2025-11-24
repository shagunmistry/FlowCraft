'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

// Icons
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
)

const BoltIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
  </svg>
)

const PaletteIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="13.5" cy="6.5" r=".5" />
    <circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" />
    <circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
)

const UsersIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const LayersIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const features = [
  {
    icon: SparklesIcon,
    title: 'AI-Powered Generation',
    description:
      'Transform text descriptions into professional diagrams instantly. Our AI understands context and creates accurate, beautiful visuals.',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: BoltIcon,
    title: 'Lightning Fast',
    description:
      'Create diagrams in seconds, not hours. From flowcharts to system architecture, get professional results instantly.',
    color: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
  },
  {
    icon: PaletteIcon,
    title: '48+ Diagram Types',
    description:
      'Flowcharts, sequence diagrams, mind maps, ERDs, user journeys, and more. Everything you need in one place.',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: LayersIcon,
    title: 'Professional Templates',
    description:
      'Start with pre-designed templates or create from scratch. Customize colors, layouts, and styles to match your brand.',
    color: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: UsersIcon,
    title: 'Collaboration Ready',
    description:
      'Share your diagrams publicly or keep them private. Perfect for teams, documentation, and presentations.',
    color: 'bg-pink-50',
    iconColor: 'text-pink-600',
  },
  {
    icon: DownloadIcon,
    title: 'Export Anywhere',
    description:
      'Download as PNG, SVG, or PDF. High-resolution exports ready for presentations, documents, and social media.',
    color: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
]

const diagramTypes = [
  'Flowcharts',
  'Sequence Diagrams',
  'Mind Maps',
  'ER Diagrams',
  'User Journey Maps',
  'System Architecture',
  'Process Maps',
  'Org Charts',
  'Network Diagrams',
  'State Diagrams',
  'Class Diagrams',
  'Gantt Charts',
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="flex w-full flex-col items-center">
        {/* Hero Section */}
        <section className="mx-auto w-full max-w-[1200px] px-6 pb-16 pt-32 text-center md:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center"
          >
            <motion.h1
              variants={itemVariants}
              className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.1] tracking-tight text-gray-900 md:text-6xl"
            >
              Everything you need to create
              <br />
              <span className="text-gray-400">stunning diagrams.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-500"
            >
              Powerful features that make diagram creation simple, fast, and
              professional. No design experience required.
            </motion.p>
          </motion.div>
        </section>

        {/* Main Features Grid */}
        <section className="mx-auto w-full max-w-[1200px] px-6 py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl ${feature.color} p-8 transition-all hover:shadow-lg`}
              >
                <div
                  className={`mb-4 inline-flex rounded-xl bg-white p-3 ${feature.iconColor}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Diagram Types Section */}
        <section className="mx-auto w-full max-w-[1200px] px-6 py-16">
          <div className="rounded-3xl border border-gray-100 bg-gray-50/50 p-12">
            <h2 className="mb-4 text-center text-3xl font-semibold tracking-tight text-gray-900">
              48+ Diagram Types
            </h2>
            <p className="mb-12 text-center text-lg text-gray-500">
              From simple flowcharts to complex system architectures
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {diagramTypes.map((type, index) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl bg-white px-4 py-3 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:shadow-md"
                >
                  {type}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="mx-auto w-full max-w-[1200px] px-6 py-16">
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight text-gray-900">
            Built for every team
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: 'Engineers',
                description:
                  'Document system architecture, design flows, and technical specifications with precision.',
                link: '/demos/engineers',
              },
              {
                title: 'Product Teams',
                description:
                  'Map user journeys, create wireframes, and visualize product roadmaps effortlessly.',
                link: '/gallery',
              },
              {
                title: 'Healthcare',
                description:
                  'Create patient flow diagrams, process maps, and clinical pathways with ease.',
                link: '/demos/healthcare',
              },
            ].map((useCase) => (
              <Link
                key={useCase.title}
                href={useCase.link}
                className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-gray-300 hover:shadow-lg"
              >
                <h3 className="mb-3 text-xl font-semibold text-gray-900 group-hover:text-gray-700">
                  {useCase.title}
                </h3>
                <p className="text-gray-600">{useCase.description}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-gray-900">
                  Learn more
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto w-full max-w-[1200px] px-6 py-24">
          <div className="rounded-3xl bg-gray-900 px-8 py-16 text-center">
            <h2 className="mb-4 text-3xl font-semibold text-white md:text-4xl">
              Ready to start creating?
            </h2>
            <p className="mb-8 text-lg text-gray-300">
              Join thousands of creators making stunning diagrams every day.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-medium text-gray-900 transition-all hover:bg-gray-100"
              >
                Start Creating Free
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center rounded-full border border-gray-600 bg-transparent px-8 py-3.5 text-base font-medium text-white transition-all hover:bg-gray-800"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
