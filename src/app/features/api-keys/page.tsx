'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Key,
  Code2,
  Zap,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Copy,
  ChevronRight,
} from 'lucide-react'

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function ApiKeysFeaturePage() {
  // Client-side SEO title update
  useEffect(() => {
    document.title = 'API Keys - FlowCraft'
  }, [])

  const features = [
    {
      icon: Code2,
      title: 'VS Code Native',
      description:
        'Generate diagrams without leaving your editor. Seamlessly integrated into your daily workflow.',
      color: 'bg-blue-500',
    },
    {
      icon: Zap,
      title: 'Instant Generation',
      description:
        'Powered by advanced AI models to transform text into professional diagrams in milliseconds.',
      color: 'bg-amber-500',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Security',
      description:
        'Keys are encrypted at rest. Full control over rotation, revocation, and scope management.',
      color: 'bg-emerald-500',
    },
    {
      icon: Clock,
      title: 'Custom Expiration',
      description:
        'Set precise TTLs for your keys. Choose from 30 days, 90 days, or permanent validity.',
      color: 'bg-purple-500',
    },
  ]

  const useCases = [
    {
      title: 'CI/CD Pipelines',
      description: 'Automate documentation generation.',
    },
    { title: 'Code Reviews', description: 'Visual diffs for your logic.' },
    {
      title: 'Education',
      description: 'Explain concepts visually on the fly.',
    },
    {
      title: 'Rapid Prototyping',
      description: 'System design at the speed of thought.',
    },
  ]

  return (
    <main className="min-h-screen bg-[#F5F5F7] selection:bg-blue-500/20">
      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden pb-20 pt-32 lg:pb-32 lg:pt-40">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[1000px] -translate-x-1/2 bg-gradient-to-b from-blue-100/40 to-transparent opacity-60 blur-3xl" />
          <div className="animate-blob absolute left-1/4 top-20 h-72 w-72 rounded-full bg-purple-200/30 mix-blend-multiply blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute right-1/4 top-20 h-72 w-72 rounded-full bg-blue-200/30 mix-blend-multiply blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto max-w-4xl"
          >
            <motion.div
              variants={fadeInUp}
              className="mb-8 flex justify-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-black/5 backdrop-blur-md">
                <Key className="h-3.5 w-3.5 text-blue-500" />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold text-transparent">
                  New Feature
                </span>
                <span className="mx-2 h-3 w-px bg-slate-200" />
                API Keys Available Now
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl"
            >
              Diagrams, <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 bg-clip-text text-transparent">
                Straight from code.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-500"
            >
              Integrate FlowCraft directly into your development environment.
              Automate visuals, enhance documentation, and communicate complex
              logic without leaving your editor.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <a
                href="/dashboard/settings"
                className="group relative inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl active:scale-95"
              >
                Get API Key
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#docs"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:scale-105 hover:bg-slate-50 active:scale-95"
              >
                <Terminal className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-600" />
                Documentation
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- Feature Bento Grid --- */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                >
                  <div
                    className={`mb-6 inline-flex rounded-2xl ${feature.color} bg-opacity-10 p-3`}
                  >
                    <Icon
                      className={`h-6 w-6 ${feature.color.replace('bg-', 'text-')}`}
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold tracking-tight text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- Integration / Code Section --- */}
      <section
        id="docs"
        className="relative overflow-hidden bg-white px-6 py-20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-40 [background-size:32px_32px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Built for developers,
                <br />
                <span className="text-slate-400">by developers.</span>
              </h2>
              <p className="mb-8 text-lg text-slate-500">
                Simple, RESTful, and typed. Whether you're scripting in Python,
                building in Node, or integrating with VS Code, we've made it
                effortless.
              </p>

              <div className="space-y-4">
                {useCases.map((useCase, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-blue-50 p-1">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">
                        {useCase.title}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Code Window */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur transition duration-500 group-hover:opacity-40" />
              <div className="relative overflow-hidden rounded-xl bg-[#1e1e1e] shadow-2xl ring-1 ring-white/10">
                {/* Window Chrome */}
                <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                    <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="font-mono text-xs font-medium text-white/40">
                    generate.ts
                  </div>
                  <div className="w-12" /> {/* Spacer */}
                </div>

                {/* Code Content */}
                <div className="overflow-x-auto p-6">
                  <pre className="font-mono text-sm leading-relaxed">
                    <code className="text-blue-300">const</code>{' '}
                    <code className="text-white">response</code>{' '}
                    <code className="text-purple-300">=</code>{' '}
                    <code className="text-blue-300">await</code>{' '}
                    <code className="text-yellow-300">fetch</code>
                    <code className="text-white">(</code>
                    <br />
                    <span className="text-green-300">
                      {' '}
                      'https://flowcraft.app/api/generate-diagram'
                    </span>
                    <code className="text-white">,</code>
                    <br />
                    <code className="text-white"> {`{`}</code>
                    <br />
                    <code className="text-blue-300"> method:</code>{' '}
                    <code className="text-green-300">'POST'</code>
                    <code className="text-white">,</code>
                    <br />
                    <code className="text-blue-300"> headers:</code>{' '}
                    <code className="text-white">{`{`}</code>
                    <br />
                    <code className="text-blue-300">
                      {' '}
                      'Authorization':
                    </code>{' '}
                    <code className="text-green-300">'Bearer fc_live_...'</code>
                    <br />
                    <code className="text-white"> {`}`}</code>
                    <code className="text-white">,</code>
                    <br />
                    <code className="text-blue-300"> body:</code>{' '}
                    <code className="text-yellow-300">JSON</code>
                    <code className="text-white">.</code>
                    <code className="text-yellow-300">stringify</code>
                    <code className="text-white">({`{`}</code>
                    <br />
                    <code className="text-blue-300"> prompt:</code>{' '}
                    <code className="text-green-300">'User auth flow'</code>
                    <code className="text-white">,</code>
                    <br />
                    <code className="text-blue-300"> type:</code>{' '}
                    <code className="text-green-300">'flowchart'</code>
                    <br />
                    <code className="text-white"> {`}`})</code>
                    <br />
                    <code className="text-white"> {`}`}</code>
                    <br />
                    <code className="text-white">);</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Steps Section --- */}
      <section className="bg-[#F5F5F7] px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-slate-900">
            Up and running in minutes
          </h2>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute bottom-8 left-[27px] top-8 w-0.5 bg-slate-200 md:left-1/2 md:-ml-px" />

            {[
              {
                title: 'Generate Key',
                desc: 'Go to Settings > Developer and create a new secret key.',
              },
              {
                title: 'Install Extension',
                desc: 'Download FlowCraft for VS Code from the Marketplace.',
              },
              {
                title: 'Start Creating',
                desc: 'Use the command palette to generate diagrams instantly.',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative mb-12 flex items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 md:w-1/2" />

                <div className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-[#F5F5F7] bg-slate-900 text-white shadow-lg">
                  <span className="font-bold">{i + 1}</span>
                </div>

                <div
                  className={`flex-1 md:w-1/2 ${i % 2 === 0 ? 'pl-6 md:pr-12' : 'pl-6 md:pl-12'}`}
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-slate-500">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[2.5rem] bg-slate-900 px-6 py-16 shadow-2xl sm:px-16"
          >
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to automate your workflow?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Get your API key today and start generating professional diagrams
              programmatically.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/dashboard/settings"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95"
              >
                Create API Key
              </a>
              <a
                href="/pricing"
                className="text-sm font-semibold leading-6 text-white transition-colors hover:text-blue-300"
              >
                View Pricing <span aria-hidden="true">→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="border-t border-slate-200 bg-white px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6">
            {[
              {
                q: 'Is it included in my plan?',
                a: 'Yes, API usage shares the same quota as your main account plan.',
              },
              {
                q: 'How do I handle security?',
                a: 'We recommend storing keys in environment variables (.env) and never committing them to Git.',
              },
              {
                q: 'Can I revoke keys?',
                a: 'Absolutely. You can revoke any key instantly from your dashboard if you suspect it is compromised.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 transition-colors hover:bg-slate-50"
              >
                <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-sm text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
