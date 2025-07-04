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
  BellIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase-auth/client'

const ProfileMenu = [
  // { title: 'Account Settings', link: '/account/settings' },
  // { title: 'Your Creations', link: '/account/creations' },
  // { title: 'Help Center', link: '/support' },
  { title: 'Sign Out', link: '/auth/logout' },
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
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
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
      className={cn(
        'fixed left-0 right-0 top-0 z-50 backdrop-blur-xl transition-all duration-300',
        scrolled
          ? 'border-b border-slate-200/50 bg-white/90 shadow-sm'
          : 'bg-white/60',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and Dashboard Link */}
          <div className="flex items-center space-x-8">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group relative"
            >
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-violet-100 to-indigo-100 opacity-0 blur transition duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <Link href="/dashboard" className="flex items-center">
                  <Image
                    className="h-12 w-auto"
                    src={FlowCraftLogo}
                    alt="FlowCraft"
                    priority
                  />
                </Link>
              </div>
            </motion.div>

            <div className="hidden md:flex md:space-x-2">
              <Link
                href="/dashboard"
                className="flex items-center rounded-full bg-gradient-to-r from-violet-50 to-indigo-50 px-5 py-2.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-violet-100 hover:to-indigo-100 hover:shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-2 h-4 w-4 text-violet-600"
                >
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
                Dashboard
              </Link>

              <Link
                href="/dashboard/showcase"
                className="flex items-center rounded-full bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-2.5 text-sm font-medium text-green-700 transition-all duration-300 hover:from-green-100 hover:to-emerald-100 hover:shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="mr-2 h-4 w-4 text-green-600"
                >
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14.5V13H8v-2h3V7.5l4.5 4.5L11 16.5z" />
                </svg>
                Showcase
              </Link>

              <Link
                href="/image-studio"
                className="flex items-center rounded-full bg-gradient-to-r from-fuchsia-50 to-pink-50 px-5 py-2.5 text-sm font-medium text-fuchsia-700 transition-all duration-300 hover:from-fuchsia-100 hover:to-pink-100 hover:shadow-sm"
              >
                <SparklesIcon className="mr-2 h-4 w-4 text-fuchsia-600" />
                Image Studio
              </Link>

              <a
                href="/dashboard/diagrams/new"
                className="flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-violet-200/40"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                New Creation
              </a>
            </div>

          </div>

          {/* Desktop Actions Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* TODO: Notifications */}
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-full bg-white p-2.5 text-slate-600 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:text-violet-600 hover:shadow-md"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                3
              </span>
            </motion.button> */}

            {/* Profile Menu */}
            <motion.div className="profile-menu-container relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  setProfileOpen(!profileOpen)
                }}
                className="flex items-center rounded-full bg-white p-1.5 pr-3 text-slate-600 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:text-violet-600 hover:shadow-md"
              >
                <div className="mr-2 h-7 w-7 overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-indigo-600">
                  <UserIcon className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-medium">Account</span>
                <ChevronDownIcon
                  className={cn(
                    'ml-1 h-4 w-4 transition-transform duration-200',
                    profileOpen ? 'rotate-180' : '',
                  )}
                />
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-black/5"
                  >
                    <div className="rounded-lg bg-gradient-to-r from-violet-50 to-indigo-50 p-3">
                      <div className="text-sm font-medium text-slate-700">
                        {userName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {userEmail}
                      </div>
                    </div>

                    <div className="mt-1.5 space-y-1">
                      {ProfileMenu.map((item, index) => (
                        <Link
                          key={item.title}
                          href={item.link}
                          className={cn(
                            'block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700',
                            index === ProfileMenu.length - 1 &&
                            'text-red-500 hover:bg-red-50 hover:text-red-600',
                          )}
                          onClick={closeMenus}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-full p-2.5 text-slate-700 md:hidden"
          >
            <div className="space-y-1.5">
              <motion.span className="block h-0.5 w-6 bg-slate-700" />
              <motion.span className="block h-0.5 w-6 bg-slate-700" />
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
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 right-0 w-full bg-white px-6 py-6 sm:max-w-sm"
            >
              <div className="flex items-center justify-between">
                <Image
                  className="h-12 w-auto"
                  src={FlowCraftLogo}
                  alt="FlowCraft"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={closeMenus}
                  className="rounded-full p-2.5"
                >
                  <XMarkIcon className="h-6 w-6 text-slate-700" />
                </motion.button>
              </div>

              <div className="mt-6 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-indigo-600">
                    <UserIcon className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-700">
                      {userName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {userEmail}
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flow-root"
              >
                <div className="space-y-1.5">
                  <Link
                    href="/dashboard"
                    className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700"
                    onClick={closeMenus}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mr-3 h-5 w-5 text-violet-600"
                    >
                      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                    </svg>
                    Dashboard
                  </Link>

                  <Link
                    href="/image-studio"
                    className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-fuchsia-50 hover:text-fuchsia-700"
                    onClick={closeMenus}
                  >
                    <SparklesIcon className="mr-3 h-5 w-5 text-fuchsia-600" />
                    Image Studio
                  </Link>

                  <Link
                    href="/create/new"
                    className="flex items-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm"
                    onClick={closeMenus}
                  >
                    <PlusIcon className="mr-3 h-5 w-5" />
                    New Creation
                  </Link>

                  <div className="my-4 h-px bg-slate-200" />

                  {ProfileMenu.map((item, index) => (
                    <Link
                      key={item.title}
                      href={item.link}
                      className={cn(
                        'flex items-center rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700',
                        index === ProfileMenu.length - 1 &&
                        'text-red-500 hover:bg-red-50 hover:text-red-600',
                      )}
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
