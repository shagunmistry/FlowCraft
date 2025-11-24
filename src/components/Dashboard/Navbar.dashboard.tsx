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
  SparklesIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase-auth/client'

const ProfileMenu = [
  { title: 'Settings', link: '/dashboard/settings' },
  { title: 'Help Center', link: '/support' },
  { title: 'Sign Out', link: '/auth/logout', danger: true },
]

export default function DashboardNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()

      if (!error && data.user) {
        const email = data.user.email || ''
        setUserEmail(email)
        setUserName(email.split('@')[0] || 'User')
      }
    }
    fetchUserData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-x-8">
            <Link
              href="/dashboard"
              className="flex-shrink-0 outline-none"
              aria-label="Go to Dashboard"
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

            <div className="hidden md:flex md:items-center md:gap-x-1">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/dashboard/showcase">Showcase</NavLink>
              <NavLink href="/image-studio">
                <SparklesIcon className="mr-1.5 h-4 w-4" />
                Image Studio
              </NavLink>
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-x-4">
            {/* CTA Button */}
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

            {/* Mobile Toggle */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                aria-label="Open main menu"
              >
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
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
            className="fixed inset-0 z-50 md:hidden"
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
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
            >
              <div className="flex items-center justify-between">
                <Link href="/dashboard" onClick={closeMenus}>
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

              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <MobileNavLink href="/dashboard" onClick={closeMenus}>
                      Dashboard
                    </MobileNavLink>
                    <MobileNavLink
                      href="/dashboard/showcase"
                      onClick={closeMenus}
                    >
                      Showcase
                    </MobileNavLink>
                    <MobileNavLink href="/image-studio" onClick={closeMenus}>
                      <span className="flex items-center gap-2">
                        <SparklesIcon className="h-4 w-4" /> Image Studio
                      </span>
                    </MobileNavLink>
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
                      href="/create/new"
                      onClick={closeMenus}
                      className="mt-4 flex w-full items-center justify-center rounded-lg bg-black px-3 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800"
                    >
                      New Creation
                    </Link>
                  </div>
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
