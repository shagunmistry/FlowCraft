'use client'

import { motion } from 'framer-motion'

export default function GalleryHeader() {
  return (
    <section className="w-full bg-white pb-12 pt-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="mb-6 inline-block rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-gray-500">
            Inspiration
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Community Creations
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-500">
            Discover and get inspired by diagrams created by our community.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
