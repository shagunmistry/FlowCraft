'use client'

import { motion } from 'framer-motion'
import TrackedLink from '@/components/TrackedLink.client'

interface GalleryHeaderProps {
  totalItems?: number
}

export default function GalleryHeader({ totalItems }: GalleryHeaderProps) {
  return (
    <section className="relative">
      {typeof totalItems === 'number' && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-10 text-sm text-fog"
        >
          {totalItems} drafts indexed
        </motion.p>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 },
          },
        }}
        className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-12"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="lg:col-span-8"
        >
          <h1 className="font-serif text-[52px] leading-[0.95] tracking-[-0.01em] text-paper md:text-[80px] lg:text-[96px]">
            <span className="block">Drafts from</span>
            <span className="block">
              <span className="italic text-signal">the community</span>
              <span className="text-fog">.</span>
            </span>
          </h1>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="lg:col-span-4 lg:pb-4"
        >
          <p className="max-w-md text-lg leading-relaxed text-paper/60">
            A rolling archive of flowcharts, mind maps, illustrations, and
            infographics, drafted from sentences by people like you.
          </p>
          <TrackedLink
            href="/?src=gallery"
            event="gallery_cta_clicked"
            className="mt-6 inline-flex items-center gap-2 rounded-sm bg-signal px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            Generate your own
          </TrackedLink>
          <p className="mt-5 text-sm text-fog">Updated continuously</p>
        </motion.div>
      </motion.div>
    </section>
  )
}
