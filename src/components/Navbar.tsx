'use client'

import { Fragment, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'

const mainNavigation = [
  { name: 'Start Here', href: '/dashboard' },
  { name: 'Blog', href: '/blogs' },
  { name: 'Release Notes', href: '/release-notes' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact Us', href: '/support' },
]

const useCasesNavigation = [
  { name: 'For Teachers', href: '/demos/teachers' },
  { name: 'For Students', href: '/demos/students' },
  { name: 'For Healthcare', href: '/demos/healthcare' },
  { name: 'For Engineers', href: '/demos/engineers' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [useCasesOpen, setUseCasesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'sticky top-0 z-50 backdrop-blur-lg transition-all duration-300',
        scrolled ? 'bg-white/80 shadow-sm' : 'bg-white/0',
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex lg:flex-1"
        >
          <Link href="/" className="group relative">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Image
                className="h-12 w-auto rounded-xl"
                src={FlowCraftLogo}
                alt="FlowCraft Logo"
                priority
              />
            </motion.div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-6">
          <div className="flex items-center space-x-1">
            {mainNavigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <motion.button
                onClick={() => setUseCasesOpen(!useCasesOpen)}
                className="flex items-center rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                Use Cases
                <motion.div
                  animate={{ rotate: useCasesOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {useCasesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5"
                  >
                    {useCasesNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block rounded-xl px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-full p-2 text-gray-700 lg:hidden"
        >
          <div className="space-y-1.5">
            <motion.span className="block h-0.5 w-6 bg-gray-700" />
            <motion.span className="block h-0.5 w-6 bg-gray-700" />
          </div>
        </motion.button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed inset-y-0 right-0 w-full bg-white px-6 py-6 sm:max-w-sm"
            >
              <div className="flex items-center justify-between">
                <Link href="/">
                  <Image
                    className="h-12 w-auto"
                    src={FlowCraftLogo}
                    alt="FlowCraft Logo"
                  />
                </Link>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full p-2"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-700" />
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-8 flow-root bg-white"
              >
                <div className="space-y-2">
                  {[...mainNavigation, ...useCasesNavigation].map(
                    (item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block rounded-2xl px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ),
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
