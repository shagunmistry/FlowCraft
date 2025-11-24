'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import { UserIcon, PlusIcon } from '@heroicons/react/20/solid'
import {
  ChevronDownIcon,
  XMarkIcon,
  Bars2Icon,
  SparklesIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase-auth/client'

const mainNavigation = [
  { name: 'Features', href: '/features' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Image Studio', href: '/image-studio' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blogs' },
]

const useCasesNavigation = [
  // { name: 'For Executives', href: '/demos/executives' },
  // { name: 'For Designers', href: '/demos/designers' },
  { name: 'For Healthcare', href: '/demos/healthcare' },
  { name: 'For Engineers', href: '/demos/engineers' },
  // { name: 'For Educators', href: '/demos/educators' },
]

const authenticatedNavigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Showcase', href: '/dashboard/showcase' },
  {
    name: 'Image Studio',
    href: '/image-studio',
    icon: SparklesIcon,
  },
]

const ProfileMenu = [
  { title: 'Settings', link: '/dashboard/settings' },
  { title: 'Help Center', link: '/support' },
  { title: 'Sign Out', link: '/auth/logout', danger: true },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [useCasesHovered, setUseCasesHovered] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()

      if (!error && data.user) {
        setIsAuthenticated(true)
        const email = data.user.email || ''
        setUserEmail(email)
        setUserName(email.split('@')[0] || 'User')

        // Fetch subscription status
        try {
          const response = await fetch('/api/usage')
          if (response.ok) {
            const usageData = await response.json()
            setIsSubscribed(usageData.subscribed || false)
          }
        } catch (err) {
          console.error('Failed to fetch subscription status:', err)
        }
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (profileOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          e.target &&
          !(e.target as Element).closest('.profile-menu-container')
        ) {
          setProfileOpen(false)
        }
      }
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [profileOpen])

  const closeMenus = () => {
    setMobileMenuOpen(false)
    setProfileOpen(false)
    setUseCasesHovered(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'border-gray-200/80 bg-white/80 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/60'
          : 'border-transparent bg-white/70 backdrop-blur-lg',
      )}
    >
      <div className={cn(
        'mx-auto px-6 lg:px-8',
        isAuthenticated ? 'max-w-7xl' : 'max-w-[1200px]'
      )}>
        <div className={cn(
          'flex items-center justify-between',
          isAuthenticated ? 'h-16' : 'h-[72px]'
        )}>
          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-x-8">
            <Link
              href={isAuthenticated ? '/dashboard' : '/'}
              className="flex-shrink-0 outline-none"
              aria-label={isAuthenticated ? 'Go to Dashboard' : 'Go to Home'}
            >
              <motion.div
                whileHover={{ opacity: 0.8 }}
                whileTap={{ scale: 0.97 }}
              >
                <Image
                  className="h-10 w-auto"
                  src={FlowCraftLogo}
                  alt="FlowCraft Logo"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-x-1">
              {isAuthenticated ? (
                // Authenticated Navigation
                <>
                  {authenticatedNavigation.map((item) => (
                    <NavLink key={item.name} href={item.href}>
                      {item.icon && <item.icon className="mr-1.5 h-4 w-4" />}
                      {item.name}
                    </NavLink>
                  ))}
                </>
              ) : (
                // Unauthenticated Navigation
                <>
                  {mainNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Use Cases Dropdown */}
                  <div
                    className="relative h-full py-2"
                    onMouseEnter={() => setUseCasesHovered(true)}
                    onMouseLeave={() => setUseCasesHovered(false)}
                  >
                    <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
                      Use Cases
                      <ChevronDownIcon
                        className={cn(
                          'h-3 w-3 transition-transform duration-200',
                          useCasesHovered ? 'rotate-180' : ''
                        )}
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
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-x-4">
            {isAuthenticated ? (
              <>
                {/* Upgrade Button (only for non-subscribed users) */}
                {!isSubscribed && (
                  <div className="hidden md:block">
                    <Link
                      href="/pricing"
                      className="flex items-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-indigo-500 hover:to-purple-500 hover:shadow-md active:scale-95"
                    >
                      Upgrade
                    </Link>
                  </div>
                )}

                {/* New Creation Button */}
                <div className="hidden md:block">
                  <Link
                    href="/dashboard/diagrams/new"
                    className="flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105 hover:bg-gray-800 active:scale-95"
                  >
                    <PlusIcon className="mr-1.5 h-4 w-4 text-gray-300" />
                    New Creation
                  </Link>
                </div>

                {/* Profile Dropdown */}
                <div className="profile-menu-container relative hidden md:block">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setProfileOpen(!profileOpen)
                    }}
                    className="flex items-center gap-x-2 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-3 transition-colors hover:border-gray-300 focus:outline-none"
                    aria-label="Open user menu"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                      <UserIcon className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {userName}
                    </span>
                    <ChevronDownIcon
                      className={cn(
                        'h-3 w-3 text-gray-400 transition-transform duration-200',
                        profileOpen ? 'rotate-180' : '',
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                      >
                        <div className="px-4 py-3">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {userName}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {userEmail}
                          </p>
                        </div>
                        <div className="py-1">
                          {ProfileMenu.map((item) => (
                            <Link
                              key={item.title}
                              href={item.link}
                              onClick={closeMenus}
                              className={cn(
                                'group flex items-center rounded-lg px-4 py-2 text-sm transition-colors',
                                item.danger
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-gray-700 hover:bg-gray-50',
                              )}
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              // Unauthenticated Actions
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
              aria-label="Open main menu"
            >
              {isAuthenticated ? (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars2Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden overflow-visible"
          >
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm"
              onClick={closeMenus}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-visible bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
            >
              <div className="flex items-center justify-between">
                <Link
                  href={isAuthenticated ? '/dashboard' : '/'}
                  onClick={closeMenus}
                >
                  <Image
                    className="h-8 w-auto"
                    src={FlowCraftLogo}
                    alt="FlowCraft"
                  />
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={closeMenus}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-6 flow-root bg-white">
                <div className="-my-6 divide-y divide-gray-500/10">
                  {isAuthenticated ? (
                    <>
                      {/* Authenticated Mobile Menu */}
                      <div className="space-y-2 py-6">
                        {authenticatedNavigation.map((item) => (
                          <MobileNavLink
                            key={item.name}
                            href={item.href}
                            onClick={closeMenus}
                          >
                            {item.icon ? (
                              <span className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" /> {item.name}
                              </span>
                            ) : (
                              item.name
                            )}
                          </MobileNavLink>
                        ))}
                      </div>

                      <div className="space-y-4 py-6">
                        <div className="flex items-center gap-x-3 px-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">
                              {userName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {userEmail}
                            </span>
                          </div>
                        </div>

                        {ProfileMenu.map((item) => (
                          <Link
                            key={item.title}
                            href={item.link}
                            onClick={closeMenus}
                            className={cn(
                              '-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium leading-7 hover:bg-gray-50',
                              item.danger ? 'text-red-600' : 'text-gray-900',
                            )}
                          >
                            {item.title}
                          </Link>
                        ))}

                        <Link
                          href="/dashboard/diagrams/new"
                          onClick={closeMenus}
                          className="mt-4 flex w-full items-center justify-center rounded-lg bg-black px-3 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800"
                        >
                          New Creation
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Unauthenticated Mobile Menu */}
                      <div className="space-y-2 py-6">
                        {mainNavigation.map((item) => (
                          <MobileNavLink
                            key={item.name}
                            href={item.href}
                            onClick={closeMenus}
                          >
                            {item.name}
                          </MobileNavLink>
                        ))}
                      </div>

                      <div className="py-6">
                        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Use Cases
                        </p>
                        <div className="space-y-2">
                          {useCasesNavigation.map((item) => (
                            <MobileNavLink
                              key={item.name}
                              href={item.href}
                              onClick={closeMenus}
                            >
                              {item.name}
                            </MobileNavLink>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 py-6">
                        <Link
                          href="/login"
                          onClick={closeMenus}
                          className="flex items-center justify-center rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/login"
                          onClick={closeMenus}
                          className="flex items-center justify-center rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
                        >
                          Get Started
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// Helper components for cleaner code
function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    >
      {children}
    </Link>
  )
}
