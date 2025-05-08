'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-auth/client'
import PricingTemplate from '../Pricing/Pricing'
import HowToUseSteps from '../HowToUseSteps'
import FAQs from '../FAQ'
import UsecasesForLanding from './Usecases.landing'
import DashboardNavbar from '../Dashboard/Navbar.dashboard'
import Navbar from '../Navbar'

// Playful icon with magical wand-like styling
const MagicWandIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.2"
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
    />
  </svg>
)

// Playful yet luxurious stats
const stats = [
  { id: 1, name: 'Visions Brought to Life', value: '10,000+' },
  { id: 2, name: 'Creative Styles', value: '48' },
  { id: 3, name: 'Delighted Creators', value: '1,200+' },
]

// Featured images showcasing illustrations and infographics
const featuredImages = [
  'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FDashboard%20-%20FlowCraft.jpeg?alt=media&token=2ba5c2db-a62c-48e5-ba05-c50c18e97865',
  'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FFlowCraft%20Mindmaps.png?alt=media&token=e9b039f1-539d-41aa-beac-42616ca2a117',
  'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FClassDiagram.png?alt=media&token=e0838b08-21f8-42fa-9e04-ccb100313673',
]

// Sample illustration styles for the tabs
const illustrationStyles = [
  { id: 'playful', name: 'Playful', image: '/style-playful.jpg' },
  { id: 'elegant', name: 'Elegant', image: '/style-elegant.jpg' },
  { id: 'minimalist', name: 'Minimalist', image: '/style-minimalist.jpg' },
  { id: 'vibrant', name: 'Vibrant', image: '/style-vibrant.jpg' },
]

export default function MainLanding() {
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('playful')
  const [magicText, setMagicText] = useState('Your journey begins with words')

  useEffect(() => {
    const supabase = createClient()
    const fetchAuthenticationStatus = async () => {
      const { data, error } = await supabase.auth.getUser()
      setAuthenticated(!!data?.user && !error)
    }
    fetchAuthenticationStatus()
  }, [])

  // Playful examples of what users can create
  const magicTexts = [
    'Your journey begins with words',
    'An astronaut riding a unicorn',
    'A map of my startup growth journey',
    'Compare renewable vs. fossil energy',
    'Timeline of AI breakthroughs',
    "My product's value proposition",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setMagicText(magicTexts[Math.floor(Math.random() * magicTexts.length)])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-50 via-white to-indigo-50">
      {authenticated ? <DashboardNavbar /> : <Navbar />}

      <main>
        {/* Playful yet Luxurious Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden pt-20 md:pt-28"
        >
          <div className="absolute inset-0 bg-[url('/magic-pattern.png')] bg-fixed opacity-[0.05]"></div>

          {/* Floating elements for playful decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-10 top-20 h-20 w-20 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 opacity-20 blur-xl"></div>
            <div className="absolute right-20 top-40 h-32 w-32 rounded-full bg-gradient-to-r from-blue-300 to-teal-300 opacity-20 blur-xl"></div>
            <div className="absolute bottom-40 left-1/4 h-24 w-24 rounded-full bg-gradient-to-r from-amber-300 to-orange-300 opacity-20 blur-xl"></div>
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6 font-serif text-sm uppercase tracking-[0.25em] text-fuchsia-600"
              >
                Imagination Made Visual
              </motion.p>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-serif text-5xl font-light tracking-tight text-gray-900 sm:text-7xl"
              >
                Describe It,
                <span className="mt-2 block bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text font-medium text-transparent">
                  We'll Illustrate It
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-base leading-relaxed text-slate-600 md:text-lg"
              >
                Transform your ideas into stunning visual stories with a touch
                of magic. Simply describe what you envision, and watch as we
                bring your concepts to life with custom illustrations,
                infographics, and diagrams.
              </motion.p>

              {/* Animated "magic text" input field */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mx-auto mt-8 max-w-xl"
              >
                <div className="relative rounded-2xl bg-white p-2 shadow-xl shadow-fuchsia-100/30">
                  <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-white px-6 py-3 shadow-sm">
                    <MagicWandIcon />
                    <span className="text-base italic text-slate-400">
                      "{magicText}"
                    </span>
                  </div>
                  <div className="absolute -right-2 -top-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 p-2 text-white shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Link
                  href={authenticated ? '/dashboard' : '/login'}
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-10 py-4 text-sm font-medium text-white shadow-xl transition-all duration-300 hover:shadow-fuchsia-200/50"
                >
                  <span className="relative z-10">
                    {authenticated ? 'Start Creating' : 'Begin Your Magic'}
                  </span>
                  <span className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 transition-transform duration-300 group-hover:translate-y-0"></span>
                </Link>

                <Link
                  href="/gallery"
                  className="flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-8 py-4 text-sm font-medium text-slate-800 shadow-md transition-all duration-300 hover:border-fuchsia-200 hover:shadow-xl hover:shadow-fuchsia-100/30"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  Explore Gallery
                </Link>
              </motion.div>
            </div>

            {/* TODO : Creative Output Showcase - Elegant Grid */}
            {/* <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-24 flow-root"
            >
              <div className="relative -m-2 rounded-2xl bg-white p-2 shadow-2xl shadow-fuchsia-100/50 ring-1 ring-inset ring-slate-900/5 lg:-m-4 lg:rounded-3xl lg:p-4">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredImages.map((src, idx) => (
                    <motion.div
                      key={src}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + idx * 0.2 }}
                      className="group relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-fuchsia-100/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100/50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <Image
                        src={src}
                        alt="Creative visualization example"
                        width={500}
                        height={300}
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div> */}

            {/* Style Selection Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-32"
            >
              <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl text-center">
                  <h3 className="font-serif text-sm uppercase tracking-[0.25em] text-fuchsia-600">
                    Your Style, Your Story
                  </h3>
                  <h2 className="mt-3 font-serif text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
                    Select Your{' '}
                    <span className="font-medium">Creative Mood</span>
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-slate-600">
                    Choose from our curated collection of visual styles to match
                    the tone and emotion of your story. Each style brings a
                    unique character to your vision.
                  </p>
                </div>

                {/* Style Selection Tabs */}
                <div className="mt-12">
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {illustrationStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setActiveTab(style.id)}
                        className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ${
                          activeTab === style.id
                            ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-lg shadow-fuchsia-200/30'
                            : 'bg-white text-slate-700 shadow-md hover:shadow-lg hover:shadow-fuchsia-100/20'
                        }`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>

                  {/* Style Preview */}
                  <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* TODO: <div className="overflow-hidden rounded-2xl bg-white p-1 shadow-xl shadow-indigo-100/30">
                      <Image
                        src={
                          illustrationStyles.find((s) => s.id === activeTab)
                            ?.image || '/style-default.jpg'
                        }
                        alt="Style preview"
                        width={600}
                        height={400}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    </div> */}
                    <div className="flex flex-col justify-center">
                      <h3 className="font-serif text-2xl font-medium text-slate-900">
                        {activeTab === 'playful' && 'Whimsical & Joyful'}
                        {activeTab === 'elegant' && 'Sophisticated & Refined'}
                        {activeTab === 'minimalist' && 'Clean & Essential'}
                        {activeTab === 'vibrant' && 'Bold & Energetic'}
                      </h3>
                      <p className="mt-4 text-lg leading-relaxed text-slate-600">
                        {activeTab === 'playful' &&
                          'Perfect for engaging presentations, educational content, and any story that aims to delight and captivate. Brings a sense of joy and wonder to your concepts.'}
                        {activeTab === 'elegant' &&
                          'Ideal for executive summaries, luxury brands, and professional contexts where sophistication matters. Conveys authority with a touch of exclusivity.'}
                        {activeTab === 'minimalist' &&
                          'Excellent for data-driven stories, technical explanations, and modern brands. Focuses attention on what truly matters with clean lines and purposeful design.'}
                        {activeTab === 'vibrant' &&
                          'Great for marketing campaigns, creative projects, and attention-grabbing content. Makes your message pop with bold colors and dynamic elements.'}
                      </p>
                      <div className="mt-8">
                        <Link
                          href={
                            authenticated
                              ? `/create?style=${activeTab}`
                              : '/login'
                          }
                          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-50 to-indigo-50 px-6 py-3 text-sm font-medium text-fuchsia-700 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-fuchsia-100/30"
                        >
                          <span>Create with this style</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Creation Process Feature */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-32"
            >
              <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                  {/* TODO: <div className="order-2 lg:order-1">
                    <div className="rounded-2xl bg-gradient-to-br from-fuchsia-50 to-indigo-50 p-1 shadow-xl">
                      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <Image
                          src="/text-to-illustration-preview.jpg" // Replace with actual image
                          alt="Text to illustration transformation"
                          width={600}
                          height={400}
                          className="w-full object-cover"
                        />
                      </div>
                    </div>
                  </div> */}

                  <div className="order-1 lg:order-2">
                    <h3 className="font-serif text-sm uppercase tracking-[0.25em] text-fuchsia-600">
                      Pure Magic
                    </h3>
                    <h2 className="mt-3 font-serif text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
                      From Words to
                      <span className="ml-2 font-medium">Visual Delight</span>
                    </h2>
                    <p className="mt-6 text-lg leading-relaxed text-slate-600">
                      Our magical creative process transforms your descriptions
                      into stunning visuals that tell your story. No design
                      skills needed—just describe what you envision, and we'll
                      handle the rest.
                    </p>
                    <div className="mt-8 space-y-4">
                      {[
                        'Describe your vision in plain language',
                        'Choose from multiple style options',
                        'Perfect for presentations and social media',
                        'Export in high-resolution formats',
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-4 w-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Creation Type Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-32"
            >
              <div className="mx-auto max-w-2xl text-center">
                <h3 className="font-serif text-sm uppercase tracking-[0.25em] text-fuchsia-600">
                  Creative Possibilities
                </h3>
                <h2 className="mt-3 font-serif text-3xl font-light tracking-tight text-gray-900">
                  What Would You Like to{' '}
                  <span className="font-medium">Create?</span>
                </h2>
              </div>

              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: 'Custom Illustrations',
                    description:
                      'Turn descriptions into beautiful illustrations for blogs, presentations, or social media.',
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-10 w-10"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                        />
                      </svg>
                    ),
                    color: 'from-purple-500 to-fuchsia-500',
                  },
                  {
                    title: 'Data Infographics',
                    description:
                      'Transform complex data into visually appealing and easy-to-understand infographics.',
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-10 w-10"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                        />
                      </svg>
                    ),
                    color: 'from-blue-500 to-indigo-500',
                  },
                  {
                    title: 'Concept Diagrams',
                    description:
                      'Visualize processes, systems, and relationships with clear and engaging diagrams.',
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-10 w-10"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    ),
                    color: 'from-teal-500 to-emerald-500',
                  },
                ].map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-fuchsia-100/50"
                  >
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-fuchsia-50 to-indigo-50 opacity-0 transition-all duration-500 group-hover:opacity-100"></div>

                    <div className="relative z-10 flex flex-col items-start">
                      <div
                        className={`mb-6 rounded-xl bg-gradient-to-r ${card.color} p-3 text-white shadow-lg`}
                      >
                        {card.icon}
                      </div>
                      <h3 className="mb-3 text-xl font-bold text-slate-900">
                        {card.title}
                      </h3>
                      <p className="text-slate-600">{card.description}</p>

                      <Link
                        href={
                          authenticated
                            ? `/create/${card.title.toLowerCase().replace(' ', '-')}`
                            : '/login'
                        }
                        className="mt-6 inline-flex items-center text-sm font-medium text-fuchsia-600 transition-all duration-300 hover:text-indigo-600"
                      >
                        <span>Start creating</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="ml-1 h-5 w-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            {/* Stats Section - Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mx-auto mt-32 max-w-7xl px-6 lg:px-8"
            >
              <div className="mx-auto max-w-2xl lg:max-w-none">
                <div className="text-center">
                  <h3 className="font-serif text-sm uppercase tracking-[0.25em] text-fuchsia-600">
                    Numbers That Inspire
                  </h3>
                  <h2 className="mt-3 font-serif text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
                    <span className="font-medium">Trust</span> in Our Creative
                    Magic
                  </h2>
                </div>
                <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 text-center sm:grid-cols-2 lg:grid-cols-3">
                  {stats.map((stat) => (
                    <motion.div
                      key={stat.id}
                      initial={{ y: 50, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: stat.id * 0.1 }}
                      className="group flex flex-col items-center rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-100/30"
                    >
                      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-50 to-indigo-50">
                        {stat.id === 1 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-10 w-10 text-fuchsia-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
                            />
                          </svg>
                        )}
                        {stat.id === 2 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-10 w-10 text-indigo-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                            />
                          </svg>
                        )}
                        {stat.id === 3 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-10 w-10 text-purple-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                            />
                          </svg>
                        )}
                      </div>
                      <dt className="text-base font-medium text-slate-500">
                        {stat.name}
                      </dt>
                      <dd className="mt-2 font-serif text-3xl font-light tracking-tight text-fuchsia-600 sm:text-4xl">
                        {stat.value}
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              </div>
            </motion.div>

            {/* Use Cases Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-32 bg-gradient-to-r from-fuchsia-50 to-indigo-50 py-24"
            >
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <h3 className="font-serif text-sm uppercase tracking-[0.25em] text-fuchsia-600">
                    Perfect For
                  </h3>
                  <h2 className="mt-3 font-serif text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
                    Who Can <span className="font-medium">Benefit?</span>
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-slate-600">
                    Our creative magic brings value to a wide range of
                    professionals and enthusiasts. Discover how our platform can
                    enhance your creative expression.
                  </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: 'Content Creators',
                      description:
                        'Enhance your blog posts, social media content, and videos with custom visuals that perfectly match your message.',
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-8 w-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                          />
                        </svg>
                      ),
                    },
                    {
                      title: 'Business Professionals',
                      description:
                        'Create engaging presentations, reports, and pitch decks that communicate complex ideas with clarity and style.',
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-8 w-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                          />
                        </svg>
                      ),
                    },
                    {
                      title: 'Educators',
                      description:
                        'Transform lesson plans and educational content into visually appealing materials that engage students and enhance learning.',
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-8 w-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                          />
                        </svg>
                      ),
                    },
                    {
                      title: 'Product Designers',
                      description:
                        'Visualize product concepts, user journeys, and wireframes with detailed diagrams that communicate your vision clearly.',
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-8 w-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                          />
                        </svg>
                      ),
                    },
                    {
                      title: 'Data Analysts',
                      description:
                        'Turn complex data into beautiful, insightful visualizations that tell a compelling story and drive decision-making.',
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-8 w-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                          />
                        </svg>
                      ),
                    },
                    {
                      title: 'Marketing Specialists',
                      description:
                        'Create eye-catching visuals for campaigns, social media, and ads that capture attention and drive engagement.',
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-8 w-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"
                          />
                        </svg>
                      ),
                    },
                  ].map((useCase, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ y: 30, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-100/30"
                    >
                      <div className="mb-6 w-fit rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 p-3 text-white shadow-lg">
                        {useCase.icon}
                      </div>
                      <h3 className="mb-3 text-xl font-bold text-slate-900">
                        {useCase.title}
                      </h3>
                      <p className="text-slate-600">{useCase.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* How It Works Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-32"
            >
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <h3 className="font-serif text-sm uppercase tracking-[0.25em] text-fuchsia-600">
                    Simple Process
                  </h3>
                  <h2 className="mt-3 font-serif text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
                    How the <span className="font-medium">Magic Happens</span>
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-slate-600">
                    Creating stunning visuals has never been easier. Our
                    intuitive process turns your words into beautiful
                    illustrations in just a few steps.
                  </p>
                </div>

                <div className="relative mt-16">
                  {/* Step Connector */}
                  <div className="absolute left-1/2 top-0 -ml-px h-full w-0.5 bg-gradient-to-b from-fuchsia-300 to-indigo-300 lg:block"></div>

                  {/* Steps */}
                  <div className="space-y-16">
                    {[
                      {
                        title: 'Describe Your Vision',
                        description:
                          'Tell us what you want to visualize in simple words. No design jargon needed—just describe what you envision.',
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-8 w-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                            />
                          </svg>
                        ),
                        screenshot:
                          'https://fllqlodhrvmnynkffoss.supabase.co/storage/v1/object/public/flowcraft-data//DescribeYourVision.gif',
                      },
                      {
                        title: 'Choose Your Style',
                        description:
                          'Select from our curated collection of visual styles to match the tone and emotion you want to convey.',
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-8 w-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                            />
                          </svg>
                        ),
                        screenshot: 'https://fllqlodhrvmnynkffoss.supabase.co/storage/v1/object/public/flowcraft-data//ColorOptions.gif',
                      },
                      {
                        title: 'Review',
                        description:
                          "See your vision come to life in real-time.",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-8 w-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        ),
                        screenshot: 'https://fllqlodhrvmnynkffoss.supabase.co/storage/v1/object/public/flowcraft-data//Review.gif',
                      },
                      // {
                      //   title: 'Download and Share',
                      //   description:
                      //     'Export your creation in high-resolution formats perfect for any use case—from presentations to social media.',
                      //   icon: (
                      //     <svg
                      //       xmlns="http://www.w3.org/2000/svg"
                      //       fill="none"
                      //       viewBox="0 0 24 24"
                      //       strokeWidth={1.5}
                      //       stroke="currentColor"
                      //       className="h-8 w-8"
                      //     >
                      //       <path
                      //         strokeLinecap="round"
                      //         strokeLinejoin="round"
                      //         d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      //       />
                      //     </svg>
                      //   ),
                      //   screenshot: '/step4-download.jpg',
                      // },
                    ].map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className={`relative flex items-start ${
                          idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                        } flex-col`}
                      >
                        <div
                          className={`flex-1 ${idx % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16'}`}
                        >
                          <div className="rounded-2xl bg-white p-8 shadow-xl">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-lg">
                              {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">
                              {step.title}
                            </h3>
                            <p className="mt-3 text-slate-600">
                              {step.description}
                            </p>
                          </div>
                        </div>

                        <div className="relative mt-8 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-xl lg:absolute lg:left-1/2 lg:-ml-6 lg:mt-0">
                          <span className="text-lg font-bold">{idx + 1}</span>
                        </div>

                        <div
                          className={`mt-8 flex-1 ${idx % 2 === 0 ? 'lg:pl-16' : 'lg:pr-16'}`}
                        >
                          <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-xl">
                            {step.screenshot?.endsWith('.mp4') ? (
                              <div className="rounded-xl bg-slate-100">
                                <video
                                  src={step.screenshot}
                                  controls
                                  autoPlay
                                  muted
                                  loop
                                  className="w-full rounded-xl object-cover"
                                />
                              </div>
                            ) : (
                              <div className="rounded-xl bg-slate-100">
                                <Image
                                  src={
                                    step.screenshot || '/placeholder-step.jpg'
                                  }
                                  alt={`Step ${idx + 1}: ${step.title}`}
                                  width={500}
                                  height={300}
                                  className="w-full rounded-xl object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-32 bg-gradient-to-r from-fuchsia-50 to-indigo-50 py-24"
            >
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <h3 className="font-serif text-sm uppercase tracking-[0.25em] text-fuchsia-600">
                    Testimonials
                  </h3>
                  <h2 className="mt-3 font-serif text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
                    What Our <span className="font-medium">Users Say</span>
                  </h2>
                </div>

                <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      quote:
                        "This tool has completely transformed how I create presentations. My clients are consistently impressed by the visuals I'm able to produce so quickly.",
                      author: 'Sarah Johnson',
                      role: 'Marketing Director',
                      avatar: '/avatar1.jpg',
                    },
                    {
                      quote:
                        'As someone with zero design skills, I never thought I could create professional-looking diagrams. This platform has been a game-changer for my business reports.',
                      author: 'Michael Chen',
                      role: 'Business Analyst',
                      avatar: '/avatar2.jpg',
                    },
                    {
                      quote:
                        'My students are more engaged than ever since I started using these illustrations in my lesson plans. It makes complex concepts so much easier to understand.',
                      author: 'Dr. Emily Rodriguez',
                      role: 'University Professor',
                      avatar: '/avatar3.jpg',
                    },
                  ].map((testimonial, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ y: 30, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative rounded-2xl bg-white p-8 shadow-xl"
                    >
                      <div className="absolute -top-5 left-10 h-10 w-10 overflow-hidden rounded-bl-xl rounded-tr-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500"></div>
                      <div className="relative">
                        <svg
                          className="h-12 w-12 text-fuchsia-100"
                          fill="currentColor"
                          viewBox="0 0 32 32"
                          aria-hidden="true"
                        >
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                        <p className="mt-6 text-slate-600">
                          {testimonial.quote}
                        </p>
                      </div>

                      <div className="mt-8 flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.author}
                            className="h-12 w-12 rounded-full"
                          />
                        </div>
                        <div className="ml-4">
                          <p className="text-lg font-bold text-slate-900">
                            {testimonial.author}
                          </p>
                          <p className="text-sm text-slate-500">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-32 bg-gradient-to-r from-fuchsia-50 to-indigo-50 py-24"
            >
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="font-serif text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
                    Ready to <span className="font-medium">Get Started?</span>
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-slate-600">
                    Create stunning visuals for your next project in minutes.
                    Sign up now and start bringing your ideas to life.
                  </p>
                  <Link
                    href={authenticated ? '/create' : '/login'}
                    className="mt-10 inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-8 py-3 text-base font-medium text-white shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
