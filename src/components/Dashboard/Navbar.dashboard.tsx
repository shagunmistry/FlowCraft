'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import { UserIcon } from '@heroicons/react/20/solid'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'

const NavigationOptions = [
  { title: 'Flow Diagram', link: '/dashboard/flow-diagram' },
  { title: 'Complex Diagrams', link: '/dashboard/mermaid' },
  { title: 'Chart', link: '/dashboard/chart' },
]

const ProfileMenu = [
  { title: 'Help', link: '/support' },
  { title: 'Sign out', link: '/auth/logout' },
]

export default function DashboardNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenus = () => {
    setMobileMenuOpen(false)
    setProfileOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed left-0 right-0 top-0 z-50 backdrop-blur-lg transition-all duration-300',
        scrolled ? 'bg-white/80 shadow-sm' : 'bg-white/60',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard" className="flex items-center">
                <Image
                  className="h-10 w-auto"
                  src={FlowCraftLogo}
                  alt="FlowCraft"
                  priority
                />
              </Link>
            </motion.div>

            <div className="hidden md:flex md:space-x-1">
              <Link
                href="/dashboard"
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                Dashboard
              </Link>
              {NavigationOptions.map((item) => (
                <Link
                  key={item.title}
                  href={item.link}
                  className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Profile Menu */}
          <div className="hidden md:flex md:items-center">
            <motion.div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center rounded-full bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200"
              >
                <UserIcon className="h-5 w-5" />
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: 'spring', duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5"
                    >
                      {ProfileMenu.map((item) => (
                        <Link
                          key={item.title}
                          href={item.link}
                          className="block rounded-xl px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                          onClick={closeMenus}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-full p-2 text-gray-700 md:hidden"
          >
            <div className="space-y-1.5">
              <motion.span className="block h-0.5 w-6 bg-gray-700" />
              <motion.span className="block h-0.5 w-6 bg-gray-700" />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={closeMenus}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed inset-y-0 right-0 w-full bg-white px-6 py-6 sm:max-w-sm"
            >
              <div className="flex items-center justify-between">
                <Image
                  className="h-10 w-auto"
                  src={FlowCraftLogo}
                  alt="FlowCraft"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={closeMenus}
                  className="rounded-full p-2"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-700" />
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flow-root"
              >
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="block rounded-2xl px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    onClick={closeMenus}
                  >
                    Dashboard
                  </Link>
                  {NavigationOptions.map((item) => (
                    <Link
                      key={item.title}
                      href={item.link}
                      className="block rounded-2xl px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      onClick={closeMenus}
                    >
                      {item.title}
                    </Link>
                  ))}
                  <div className="my-4 h-px bg-gray-200" />
                  {ProfileMenu.map((item) => (
                    <Link
                      key={item.title}
                      href={item.link}
                      className="block rounded-2xl px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      onClick={closeMenus}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
