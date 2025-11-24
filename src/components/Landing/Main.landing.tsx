'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-auth/client'
import DashboardNavbar from '../Dashboard/Navbar.dashboard'
import Navbar from '../Navbar'

// Minimalist Icons (Stroke based, no fill)
const MagicIcon = ({ className }: { className?: string }) => (
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
    <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
)

const ArrowRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
)

// Animation variants for staggered entry
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

export default function MainLanding() {
  const [authenticated, setAuthenticated] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  const placeholders = [
    'Timeline of AI breakthroughs',
    'An astronaut riding a unicorn',
    'Startup growth map',
    'Sustainable energy comparison',
  ]

  useEffect(() => {
    const supabase = createClient()
    const fetchAuthenticationStatus = async () => {
      const { data, error } = await supabase.auth.getUser()
      setAuthenticated(!!data?.user && !error)
    }
    fetchAuthenticationStatus()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-gray-100">
      {authenticated ? <DashboardNavbar /> : <Navbar />}

      <main className="flex w-full flex-col items-center">
        {/* --- HERO SECTION --- */}
        <section className="mx-auto w-full max-w-[1200px] px-6 pb-24 pt-32 text-center md:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center"
          >
            <motion.h1
              variants={itemVariants}
              className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.1] tracking-tight text-gray-900 md:text-7xl"
            >
              Visual storytelling.
              <br />
              <span className="text-gray-400">Simply described.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-8 max-w-2xl text-xl leading-relaxed text-gray-500"
            >
              Create professional diagrams, illustrations, and infographics
              instantly. No design skills required.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href={authenticated ? '/dashboard' : '/login'}
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-3.5 text-base font-medium text-white transition-all hover:bg-gray-800"
              >
                {authenticated ? 'Go to Dashboard' : 'Start Creating Free'}
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-transparent px-8 py-3.5 text-base font-medium text-gray-900 transition-all hover:bg-gray-50"
              >
                View Gallery
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* --- SOCIAL PROOF (Minimal) --- */}
        <section className="w-full border-y border-gray-100 bg-gray-50/50">
          <div className="mx-auto max-w-[1200px] px-6 py-12">
            <dl className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
              {[
                { label: 'Visuals Created', value: '10k+' },
                { label: 'Unique Styles', value: '48' },
                { label: 'Happy Creators', value: '1.2k' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dt className="text-sm font-medium uppercase tracking-wide text-gray-500">
                    {stat.label}
                  </dt>
                  <dd className="text-3xl font-semibold tracking-tight text-gray-900">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --- FEATURES (Bento Grid Style) --- */}
        <section className="mx-auto w-full max-w-[1200px] px-6 py-32">
          <div className="mb-16 text-left md:text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
              Everything you need to communicate.
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              From rough concepts to polished assets.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: 'Illustrations',
                desc: 'Custom assets for blogs & marketing.',
                color: 'bg-purple-50', // Very subtle tint
              },
              {
                title: 'Infographics',
                desc: 'Turn data tables into visual stories.',
                color: 'bg-blue-50',
              },
              {
                title: 'System Diagrams',
                desc: 'Map out architecture and flows.',
                color: 'bg-emerald-50',
              },
              {
                title: 'Presentation Assets',
                desc: 'Decks that stand out.',
                color: 'bg-orange-50',
              },
              {
                title: 'Social Media',
                desc: 'Engagement driving visuals.',
                color: 'bg-pink-50',
              },
              {
                title: 'Educational',
                desc: 'Simplify complex topics.',
                color: 'bg-gray-50',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-3xl border border-transparent bg-gray-50 p-8 transition-colors duration-300 hover:border-gray-200 hover:bg-gray-100"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-500 transition-colors group-hover:text-gray-700">
                  {feature.desc}
                </p>

                <Link
                  href={authenticated ? '/create' : '/login'}
                  className="mt-8 flex translate-y-2 transform items-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white opacity-0 transition-all duration-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  Create <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- HOW IT WORKS (Clean Split Layout) --- */}
        <section className="w-full bg-gray-50 py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-20 max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
                From thought to image.
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                A seamless workflow designed for speed and quality.
              </p>
            </div>

            <div className="space-y-24">
              {[
                {
                  step: '01',
                  title: 'Describe',
                  desc: 'Type your idea naturally. No complex prompting engineering required. Just tell us what you see in your mind.',
                  media:
                    'https://fllqlodhrvmnynkffoss.supabase.co/storage/v1/object/public/flowcraft-data//DescribeYourVision.gif',
                },
                {
                  step: '02',
                  title: 'Style',
                  desc: 'Choose the aesthetic. Minimalist, hand-drawn, corporate, or futuristic. We match your brand voice.',
                  media:
                    'https://fllqlodhrvmnynkffoss.supabase.co/storage/v1/object/public/flowcraft-data//ColorOptions.gif',
                },
                {
                  step: '03',
                  title: 'Refine',
                  desc: 'Watch it generate instantly. Download high-resolution assets ready for production use.',
                  media:
                    'https://fllqlodhrvmnynkffoss.supabase.co/storage/v1/object/public/flowcraft-data//Review.gif',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2"
                >
                  <div
                    className={`order-1 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}
                  >
                    <span className="rounded border border-gray-200 px-2 py-1 text-xs font-bold uppercase tracking-widest text-gray-400">
                      Step {item.step}
                    </span>
                    <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-lg leading-relaxed text-gray-500">
                      {item.desc}
                    </p>
                  </div>
                  <div
                    className={`order-2 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                      {/* SEO Note: In production, ensure these GIFs have descriptive alt text */}
                      <Image
                        src={item.media}
                        alt={`${item.title} interface demonstration`}
                        width={600}
                        height={450}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- CALL TO ACTION --- */}
        <section className="w-full px-6 py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
              Ready to create?
            </h2>
            <p className="mt-6 text-xl text-gray-500">
              Join thousands of creators visualizing their ideas today.
            </p>
            <div className="mt-10">
              <Link
                href={authenticated ? '/create' : '/login'}
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-10 py-4 text-lg font-medium text-white shadow-lg shadow-gray-200 transition-all hover:bg-gray-800"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
