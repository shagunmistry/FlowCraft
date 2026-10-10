'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface GalleryHeaderProps {
  totalItems?: number
}

export default function GalleryHeader({ totalItems }: GalleryHeaderProps) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const d = new Date()
      setTime(
        `${d.getUTCHours().toString().padStart(2, '0')}:${d
          .getUTCMinutes()
          .toString()
          .padStart(2, '0')} UTC`,
      )
    }
    update()
    const interval = setInterval(update, 1000 * 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative">
      {/* Sheet strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-fog"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-signal/60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-signal" />
            </span>
            <span className="text-paper">Sheet · Gallery</span>
          </span>
          <span>/</span>
          <span className="hidden sm:inline">Community · Public visuals</span>
          {typeof totalItems === 'number' && (
            <>
              <span className="hidden sm:inline">/</span>
              <span className="hidden sm:inline text-paper">
                {totalItems.toString().padStart(3, '0')} drafts indexed
              </span>
            </>
          )}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span>{time || '—:—'}</span>
          <span className="text-signal">◆</span>
          <span>Archive open</span>
        </div>
      </motion.div>

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
            infographics — drafted from sentences by people like you.
          </p>
          <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-signal animate-tick" />
            <span>Updated continuously</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
