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

const VSCodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
    />
  </svg>
)

const stats = [
  { id: 1, name: 'Diagrams Created', value: '1500+' },
  { id: 2, name: 'Supported Diagrams', value: '26' },
  { id: 3, name: 'Users Served', value: '600+' },
]

export default function MainLanding() {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const fetchAuthenticationStatus = async () => {
      const { data, error } = await supabase.auth.getUser()
      setAuthenticated(!!data?.user && !error)
    }
    fetchAuthenticationStatus()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {authenticated ? <DashboardNavbar /> : <Navbar />}

      <main>
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden pt-16 md:pt-24"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl"
              >
                Create stunning diagrams
                <span className="block bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                  in seconds
                </span>
              </motion.h1>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Link
                  href={authenticated ? '/dashboard' : '/login'}
                  className="rounded-full bg-gray-900 px-8 py-4 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 hover:bg-gray-800"
                >
                  {authenticated ? 'Go to Dashboard' : 'Get Started For Free'}
                </Link>
                <Link
                  href="https://marketplace.visualstudio.com/items?itemName=FlowCraft.flowcraft"
                  className="flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-gray-900 shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
                >
                  <VSCodeIcon />
                  Download VS Code Extension
                </Link>
              </motion.div>
            </div>

            {/* Feature Images Grid */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-16 flow-root sm:mt-24"
            >
              <div className="relative -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FDashboard%20-%20FlowCraft.jpeg?alt=media&token=2ba5c2db-a62c-48e5-ba05-c50c18e97865',
                    'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FFlowCraft%20Mindmaps.png?alt=media&token=e9b039f1-539d-41aa-beac-42616ca2a117',
                    'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FMermaidDiagrams%2FClassDiagram.png?alt=media&token=e0838b08-21f8-42fa-9e04-ccb100313673',
                  ].map((src, idx) => (
                    <motion.div
                      key={src}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + idx * 0.2 }}
                      className="overflow-hidden rounded-2xl bg-white shadow-2xl"
                    >
                      <Image
                        src={src}
                        alt="Feature preview"
                        width={500}
                        height={300}
                        className="w-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-32"
            >
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                  {stats.map((stat, idx) => (
                    <motion.div
                      key={stat.id}
                      initial={{ y: 50, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.2 }}
                      className="mx-auto flex max-w-xs flex-col gap-y-4"
                    >
                      <dt className="text-base font-medium text-gray-600">
                        {stat.name}
                      </dt>
                      <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900">
                        {stat.value}
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              </div>
            </motion.div>

            {/* Getting Started Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-32"
            >
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  Three Simple Steps
                </h2>
              </div>
              <HowToUseSteps />
            </motion.div>

            {/* Use Cases */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-32"
            >
              <UsecasesForLanding />
            </motion.div>

            {/* Pricing */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-32"
            >
              <PricingTemplate
                sourcePage="landing"
                shouldGoToCheckout={authenticated}
              />
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-32"
            >
              <div className="relative isolate overflow-hidden rounded-3xl bg-gray-900 px-6 py-24 shadow-2xl sm:px-24 xl:py-32">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    Start creating amazing diagrams today
                  </h2>
                  <p className="mt-6 text-lg leading-8 text-gray-300">
                    Join thousands of users who are already creating stunning
                    diagrams with FlowCraft
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                      href="/login"
                      className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-gray-900 shadow-lg transition-all hover:scale-105"
                    >
                      Get started
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-32"
            >
              <FAQs />
            </motion.div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
