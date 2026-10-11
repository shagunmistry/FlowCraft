'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import ThemeToggle from '@/components/ThemeToggle'

export type NavbarAuth = {
  isAuthenticated: boolean
  userName: string
  userEmail: string
  isSubscribed: boolean
}

const mainNavigation = [
  { name: 'Features', href: '/features' },
  { name: 'Templates', href: '/templates' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Studio', href: '/image-studio' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Journal', href: '/blogs' },
]

const useCasesNavigation = [
  { name: 'For Healthcare', href: '/demos/healthcare' },
  { name: 'For Engineers', href: '/demos/engineers' },
  {
    name: 'VS Code Extension',
    href: 'https://marketplace.visualstudio.com/items?itemName=FlowCraft.flowcraft',
    external: true,
  },
]

const authenticatedNavigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Templates', href: '/templates' },
  { name: 'Showcase', href: '/dashboard/showcase' },
  { name: 'Studio', href: '/image-studio' },
]

const ProfileMenu = [
  // { title: 'Settings', link: '/dashboard/settings' },
  { title: 'Help Center', link: '/support' },
  { title: 'Sign Out', link: '/auth/logout', danger: true },
]

export default function NavbarClient({ auth }: { auth: NavbarAuth }) {
  const { isAuthenticated, userName, userEmail, isSubscribed } = auth
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [useCasesOpen, setUseCasesOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!profileOpen && !useCasesOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (!target) return
      if (!target.closest('[data-menu="profile"]')) setProfileOpen(false)
      if (!target.closest('[data-menu="usecases"]')) setUseCasesOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [profileOpen, useCasesOpen])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const closeMenus = () => {
    setMobileMenuOpen(false)
    setProfileOpen(false)
    setUseCasesOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={false}
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-300',
          scrolled
            ? 'border-b border-rule bg-ink/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-ink',
        )}
      >
        <div
          className={cn(
            'mx-auto flex items-center justify-between px-5 lg:px-8',
            isAuthenticated ? 'max-w-[1400px]' : 'max-w-[1280px]',
            'h-[68px] lg:h-[76px]',
          )}
        >
          {/* Logo block */}
          <div className="flex items-center gap-x-6 lg:gap-x-10">
            <Link
              href={isAuthenticated ? '/dashboard' : '/'}
              onClick={closeMenus}
              className="group flex items-center gap-2.5 outline-none"
              aria-label="FlowCraft"
            >
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-signal/10 blur-md transition-opacity duration-500 group-hover:opacity-100" />
                <svg
                  viewBox="0 0 32 32"
                  className="relative h-8 w-8"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="14.5"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    className="origin-center stroke-signal transition-transform duration-[1200ms] group-hover:rotate-90"
                  />
                  <path
                    d="M10 11h12M10 16h8M10 21h5"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    className="stroke-paper"
                  />
                  <circle cx="22" cy="16" r="1.5" className="fill-signal" />
                </svg>
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-serif text-[22px] text-paper">
                  Flow<span className="italic text-signal">craft</span>
                </span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-x-1 lg:flex">
              {isAuthenticated ? (
                authenticatedNavigation.map((item) => (
                  <DeskNavLink key={item.name} href={item.href}>
                    {item.name}
                  </DeskNavLink>
                ))
              ) : (
                <>
                  {mainNavigation.map((item) => (
                    <DeskNavLink key={item.name} href={item.href}>
                      {item.name}
                    </DeskNavLink>
                  ))}

                  <div className="relative" data-menu="usecases">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setUseCasesOpen((o) => !o)
                      }}
                      className="group flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm text-paper/70 transition-colors hover:text-paper"
                    >
                      <span>Studios</span>
                      <motion.svg
                        animate={{ rotate: useCasesOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-3 w-3 text-fog"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M3 5l3 3 3-3" />
                      </motion.svg>
                    </button>

                    <AnimatePresence>
                      {useCasesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                          className="absolute left-0 top-full mt-3 w-[280px] origin-top"
                        >
                          <div className="relative overflow-hidden rounded-sm border border-rule bg-graphite shadow-2xl shadow-black/40">
                            <div className="p-1.5">
                              {useCasesNavigation.map((item) => (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  target={item.external ? '_blank' : undefined}
                                  rel={
                                    item.external
                                      ? 'noopener noreferrer'
                                      : undefined
                                  }
                                  onClick={closeMenus}
                                  className="group flex items-center justify-between rounded-sm px-3 py-2.5 text-paper/80 transition-colors hover:bg-ink hover:text-paper"
                                >
                                  <span className="text-sm">{item.name}</span>
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

          {/* Right actions */}
          <div className="flex items-center gap-x-3">
            <ThemeToggle className="hidden lg:flex" />
            {isAuthenticated ? (
              <>
                {!isSubscribed && (
                  <Link
                    href="/pricing?sourcePage=dashboard"
                    className="group relative hidden overflow-hidden rounded-sm border border-signal/40 bg-signal/10 px-4 py-2 text-sm text-signal transition-colors hover:bg-signal/20 md:inline-flex"
                  >
                    <span className="relative z-10">★ Upgrade</span>
                    <span className="absolute inset-y-0 -left-10 w-10 skew-x-[-20deg] bg-signal/30 transition-transform duration-700 group-hover:translate-x-[220%]" />
                  </Link>
                )}

                <Link
                  href="/dashboard/diagrams/new"
                  className="group hidden items-center gap-2 rounded-sm bg-signal px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper md:inline-flex"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-ink opacity-60" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-ink" />
                  </span>
                  New draft
                </Link>

                <div className="relative hidden md:block" data-menu="profile">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setProfileOpen((o) => !o)
                    }}
                    className="flex items-center gap-x-2.5 rounded-sm border border-rule bg-graphite px-2 py-1.5 text-paper transition-colors hover:border-signal/50"
                    aria-label="Open user menu"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-signal/15 text-xs font-medium text-signal">
                      {(userName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm">{userName}</span>
                    <motion.svg
                      animate={{ rotate: profileOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="h-3 w-3 text-fog"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M3 5l3 3 3-3" />
                    </motion.svg>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-3 w-64 origin-top-right overflow-hidden rounded-sm border border-rule bg-graphite shadow-2xl shadow-black/40"
                      >
                        <div className="border-b border-rule px-4 py-3">
                          <p className="font-serif text-base text-paper">
                            {userName}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-fog">
                            {userEmail}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <span
                              className={cn(
                                'inline-flex h-1.5 w-1.5 rounded-full',
                                isSubscribed
                                  ? 'bg-signal'
                                  : 'bg-fog animate-tick',
                              )}
                            />
                            <span className="text-fog">
                              {isSubscribed ? 'Pro access' : 'Free tier'}
                            </span>
                          </div>
                        </div>
                        <div className="p-1">
                          {ProfileMenu.map((item) => (
                            <Link
                              key={item.title}
                              href={item.link}
                              onClick={closeMenus}
                              className={cn(
                                'block rounded-sm px-3 py-2 text-sm transition-colors',
                                item.danger
                                  ? 'text-red-300/80 hover:bg-red-500/10 hover:text-red-300'
                                  : 'text-paper/80 hover:bg-ink hover:text-paper',
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
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm text-paper/70 transition-colors hover:text-paper"
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-sm bg-signal px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper"
                >
                  <span className="relative z-10">Start drafting</span>
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="group -mr-2 flex h-11 w-11 items-center justify-center text-paper lg:hidden"
              aria-label="Open main menu"
            >
              <div className="flex flex-col gap-[5px]">
                <span className="h-px w-6 bg-paper transition-transform group-hover:w-7" />
                <span className="h-px w-4 bg-signal transition-transform group-hover:w-7" />
                <span className="h-px w-6 bg-paper transition-transform group-hover:w-7" />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenus}
              className="absolute inset-0 bg-ink/90 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative ml-auto flex h-full w-full max-w-sm flex-col overflow-hidden border-l border-rule bg-ink"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'radial-gradient(rgb(var(--color-signal) / 0.12) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />

              <div className="relative flex items-center justify-end border-b border-rule px-6 py-5">
                <button
                  type="button"
                  className="-m-2 p-2 text-paper"
                  onClick={closeMenus}
                  aria-label="Close menu"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    className="h-5 w-5"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <div className="relative flex-1 overflow-y-auto px-6 py-8">
                {isAuthenticated ? (
                  <>
                    <MobileGroup label="Workspace">
                      {authenticatedNavigation.map((item, i) => (
                        <MobileLink
                          key={item.name}
                          href={item.href}
                          index={i}
                          onClick={closeMenus}
                        >
                          {item.name}
                        </MobileLink>
                      ))}
                    </MobileGroup>

                    <MobileGroup label="Account">
                      <div className="mb-4 rounded-sm border border-rule bg-graphite p-4">
                        <p className="font-serif text-lg text-paper">
                          {userName}
                        </p>
                        <p className="mt-1 truncate text-xs text-fog">
                          {userEmail}
                        </p>
                      </div>
                      {ProfileMenu.map((item, i) => (
                        <MobileLink
                          key={item.title}
                          href={item.link}
                          index={i + 3}
                          onClick={closeMenus}
                          danger={item.danger}
                        >
                          {item.title}
                        </MobileLink>
                      ))}
                    </MobileGroup>

                    <Link
                      href="/dashboard/diagrams/new"
                      onClick={closeMenus}
                      className="mt-6 flex items-center justify-between rounded-sm bg-signal px-4 py-4 text-sm font-medium text-ink"
                    >
                      <span>New draft</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <MobileGroup label="Navigate">
                      {mainNavigation.map((item, i) => (
                        <MobileLink
                          key={item.name}
                          href={item.href}
                          index={i}
                          onClick={closeMenus}
                        >
                          {item.name}
                        </MobileLink>
                      ))}
                    </MobileGroup>

                    <MobileGroup label="Studios">
                      {useCasesNavigation.map((item, i) => (
                        <MobileLink
                          key={item.name}
                          href={item.href}
                          index={i + mainNavigation.length}
                          onClick={closeMenus}
                          external={item.external}
                        >
                          {item.name}
                        </MobileLink>
                      ))}
                    </MobileGroup>

                    <div className="mt-8 flex flex-col gap-3">
                      <Link
                        href="/login"
                        onClick={closeMenus}
                        className="flex items-center justify-center rounded-sm border border-rule px-4 py-4 text-sm text-paper hover:bg-graphite"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/login"
                        onClick={closeMenus}
                        className="flex items-center justify-between rounded-sm bg-signal px-4 py-4 text-sm font-medium text-ink"
                      >
                        <span>Start drafting</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>

              <div className="relative flex items-center justify-between gap-3 border-t border-rule px-6 py-4 text-xs text-fog">
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function DeskNavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-center rounded-sm px-3 py-2 text-sm text-paper/70 transition-colors hover:text-paper"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-signal transition-all duration-300 group-hover:w-full" />
      </span>
    </Link>
  )
}

function MobileGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xs font-medium text-fog">
          {label}
        </span>
        <span className="h-px flex-1 bg-rule" />
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  )
}

function MobileLink({
  href,
  index = 0,
  onClick,
  children,
  danger,
  external,
}: {
  href: string
  index?: number
  onClick: () => void
  children: React.ReactNode
  danger?: boolean
  external?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 + index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={onClick}
        className={cn(
          'group flex items-center justify-between border-b border-rule py-4 transition-colors',
          danger
            ? 'text-red-300/80 hover:text-red-300'
            : 'text-paper/80 hover:text-paper',
        )}
      >
        <span className="font-serif text-2xl">{children}</span>
      </Link>
    </motion.div>
  )
}
