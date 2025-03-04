'use client'

import { Fragment, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import {
  ChevronDownIcon,
  XMarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

// Main navigation items for non-authenticated users
const mainNavigation = [
  { name: 'Gallery', href: '/gallery' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blogs' },
  { name: 'Release Notes', href: '/release-notes' },
]

// Specialized use cases dropdown items
const useCasesNavigation = [
  { name: 'For Executives', href: '/demos/executives' },
  { name: 'For Designers', href: '/demos/designers' },
  { name: 'For Healthcare', href: '/demos/healthcare' },
  { name: 'For Engineers', href: '/demos/engineers' },
  { name: 'For Educators', href: '/demos/educators' },
]

export default function Navbar({ isAuthenticated = false }) {
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

  // Close dropdown when clicking outside
  useEffect(() => {
    if (useCasesOpen) {
      const handleClickOutside = () => setUseCasesOpen(false)
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [useCasesOpen])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'sticky top-0 z-50 backdrop-blur-xl transition-all duration-300',
        scrolled
          ? 'border-b border-slate-200/50 bg-white/90 shadow-sm'
          : 'bg-white/0',
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex lg:flex-1"
        >
          <Link href="/" className="group">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-violet-100 to-indigo-100 opacity-0 blur transition duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <Image
                  className="h-12 w-auto rounded-xl"
                  src={FlowCraftLogo}
                  alt="FlowCraft"
                  priority
                />
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Desktop Navigation - Different based on authentication */}
        <div className="hidden lg:flex lg:gap-x-2">
          {isAuthenticated ? (
            /* Authenticated navigation - Dashboard only */
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                href="/dashboard"
                className="flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-violet-200/40"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
                Dashboard
              </Link>
            </motion.div>
          ) : (
            /* Non-authenticated navigation */
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
                    className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:text-violet-700"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              {/* Use Cases Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  onClick={() => setUseCasesOpen(!useCasesOpen)}
                  className="flex items-center rounded-full px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:text-violet-700"
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
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5"
                    >
                      <div className="space-y-1">
                        {useCasesNavigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition-all hover:bg-violet-50 hover:text-violet-700"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Contact Us / Support */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mainNavigation.length * 0.1 }}
              >
                <Link
                  href="/support"
                  className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:text-violet-700"
                >
                  Contact
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* CTA Buttons - Only show for non-authenticated */}
        {!isAuthenticated && (
          <div className="hidden items-center gap-x-4 lg:flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/login"
                className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:text-violet-700"
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                href="/login"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-violet-200/40"
              >
                <span className="relative z-10">Get Started</span>
              </Link>
            </motion.div>
          </div>
        )}

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center rounded-full p-2 text-slate-700 lg:hidden"
        >
          <div className="space-y-1.5">
            <motion.span className="block h-0.5 w-6 bg-slate-700" />
            <motion.span className="block h-0.5 w-6 bg-slate-700" />
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
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 right-0 w-full bg-white px-6 py-6 sm:max-w-sm"
            >
              <div className="flex items-center justify-between">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Image
                    className="h-12 w-auto"
                    src={FlowCraftLogo}
                    alt="FlowCraft"
                  />
                </Link>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full p-2"
                >
                  <XMarkIcon className="h-6 w-6 text-slate-700" />
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-8 flow-root"
              >
                <div className="space-y-1.5 py-2">
                  {isAuthenticated ? (
                    // Only Dashboard for authenticated users in mobile menu
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-base font-medium text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="mr-3 h-5 w-5"
                        >
                          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                        </svg>
                        Dashboard
                      </Link>
                    </motion.div>
                  ) : (
                    // Full menu for non-authenticated users
                    <>
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
                              className="block rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-violet-700"
                            >
                              {item.name}
                            </Link>
                          </motion.div>
                        ),
                      )}

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay:
                            (mainNavigation.length +
                              useCasesNavigation.length) *
                            0.05,
                        }}
                      >
                        <Link
                          href="/support"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-violet-700"
                        >
                          Contact
                        </Link>
                      </motion.div>

                      <div className="my-4 border-t border-slate-200"></div>

                      <div className="grid grid-cols-2 gap-3 px-2">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Link
                            href="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-700"
                          >
                            Sign In
                          </Link>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Link
                            href="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm"
                          >
                            Get Started
                          </Link>
                        </motion.div>
                      </div>
                    </>
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
