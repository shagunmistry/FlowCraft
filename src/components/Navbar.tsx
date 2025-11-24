'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import {
  ChevronDownIcon,
  XMarkIcon,
  Bars2Icon,
} from '@heroicons/react/24/outline'

const mainNavigation = [
  { name: 'Gallery', href: '/gallery' },
  { name: 'Image Studio', href: '/image-studio' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blogs' },
]

const useCasesNavigation = [
  { name: 'For Executives', href: '/demos/executives' },
  { name: 'For Designers', href: '/demos/designers' },
  { name: 'For Healthcare', href: '/demos/healthcare' },
  { name: 'For Engineers', href: '/demos/engineers' },
  { name: 'For Educators', href: '/demos/educators' },
]

export default function Navbar({ isAuthenticated = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [useCasesHovered, setUseCasesHovered] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-gray-100 bg-white/95 backdrop-blur-sm'
          : 'bg-white',
      )}
    >
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg">
            <Image
              src={FlowCraftLogo}
              alt="FlowCraft"
              fill
              className="object-cover"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          {!isAuthenticated && (
            <>
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}

              {/* Use Cases Dropdown (Hover Interaction) */}
              <div
                className="relative h-full py-2"
                onMouseEnter={() => setUseCasesHovered(true)}
                onMouseLeave={() => setUseCasesHovered(false)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                  Use Cases
                  <ChevronDownIcon
                    className={`h-3 w-3 transition-transform duration-200 ${useCasesHovered ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {useCasesHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 top-full w-56 -translate-x-1/2 pt-4"
                    >
                      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg ring-1 ring-black/5">
                        <div className="p-2">
                          {useCasesNavigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="block rounded-lg px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="hidden items-center justify-center rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 lg:inline-flex"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="hidden items-center gap-4 lg:flex">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="-mr-2 p-2 text-gray-600 hover:text-gray-900 lg:hidden"
          >
            <Bars2Icon className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-gray-900/20 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white p-6 shadow-2xl lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <div className="h-10 w-10 overflow-hidden rounded-lg">
                    <Image
                      src={FlowCraftLogo}
                      alt="FlowCraft"
                      className="object-cover"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mr-2 p-2 text-gray-500 hover:text-gray-900"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <div className="flex flex-col gap-1">
                      {mainNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block rounded-lg px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>

                    <div className="my-2 h-px bg-gray-100" />

                    <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Use Cases
                    </p>
                    <div className="flex flex-col gap-1">
                      {useCasesNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block rounded-lg px-4 py-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>

                    <div className="mt-auto flex flex-col gap-3 pt-6">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
                      >
                        Get Started
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
