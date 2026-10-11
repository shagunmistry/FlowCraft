'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { XMarkIcon } from '@heroicons/react/24/outline'

const Footer = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const navigation = {
    product: [
      { name: 'Get Started', href: '/' },
      { name: 'Templates', href: '/templates' },
      { name: 'Gallery', href: '/gallery' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Tools', href: '/tools' },
      { name: 'Release Notes', href: '/release-notes' },
      {
        name: 'VS Code Extension',
        href: 'https://marketplace.visualstudio.com/items?itemName=FlowCraft.flowcraft',
      },
    ],
    resources: [
      { name: 'Blogs', href: '/blogs' },
      { name: 'Support', href: '/support' },
      { name: 'Contact Us', href: '/support' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  }

  const handleFeedbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTimeout(() => {
      setIsFeedbackOpen(false)
      setFeedbackMessage('')
    }, 500)
  }

  return (
    <footer
      className="relative overflow-hidden border-t border-rule bg-ink text-paper"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* subtle grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgba(196,255,61,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="xl:grid xl:grid-cols-3 xl:gap-12">
          {/* Brand Column */}
          <div className="space-y-5">
            <Link href="/" className="group inline-flex items-center gap-2.5">
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
                    stroke="#C4FF3D"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <path
                    d="M10 11h12M10 16h8M10 21h5"
                    stroke="#F3EFE4"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <circle cx="22" cy="16" r="1.5" fill="#C4FF3D" />
                </svg>
              </span>
              <span className="font-serif text-[22px] text-paper">
                Flow<span className="italic text-signal">craft</span>
              </span>
            </Link>
            <p className="max-w-xs font-serif text-lg leading-snug text-paper/80">
              Transform ideas into stunning visual content — drafted with the
              precision of AI.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="mt-14 grid grid-cols-2 gap-10 xl:col-span-2 xl:mt-0 md:grid-cols-4">
            <FooterColumn title="Product" items={navigation.product} />
            <FooterColumn title="Resources" items={navigation.resources} />
            <FooterColumn title="Legal" items={navigation.legal} />
            <div>
              <FooterHeading>Feedback</FooterHeading>
              <p className="mt-5 text-sm leading-6 text-paper/60">
                Help us improve the draft.
              </p>
              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="group mt-5 inline-flex items-center gap-2 rounded-sm border border-signal/40 bg-signal/10 px-3 py-2 text-sm text-signal transition-colors hover:bg-signal/20"
              >
                <span>Share feedback</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-rule pt-8 text-xs text-fog sm:flex-row sm:items-center sm:justify-between lg:mt-20">
          <p>
            <span className="text-signal">©</span> {new Date().getFullYear()}{' '}
            FlowCraft · All rights reserved
          </p>
          <p className="max-w-sm sm:text-right">
            Improved via Microsoft Clarity · By using the site you consent to
            our data practices.
          </p>
        </div>
      </div>

      {/* Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFeedbackOpen(false)}
          />
          <div className="relative w-full max-w-md transform overflow-hidden rounded-sm border border-rule bg-graphite p-6 shadow-2xl shadow-black/40">
            <div className="mb-5 flex items-center justify-between border-b border-rule pb-4">
              <div>
                <h3 className="font-serif text-lg text-paper">
                  Share your feedback
                </h3>
              </div>
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="text-fog transition-colors hover:text-paper"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit}>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className="min-h-[120px] w-full rounded-sm border border-rule bg-ink/60 p-3 text-sm text-paper placeholder:text-fog focus:border-signal/50 focus:outline-none focus:ring-0"
                placeholder="What's on your mind?"
                required
              />
              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(false)}
                  className="rounded-sm px-3 py-2 text-sm text-fog transition-colors hover:text-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-sm bg-signal px-3 py-2 text-sm text-ink transition-colors hover:bg-paper"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  )
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-fog">
        {children}
      </span>
      <span className="h-px flex-1 bg-rule" />
    </div>
  )
}

function FooterColumn({
  title,
  items,
}: {
  title: string
  items: { name: string; href: string }[]
}) {
  return (
    <div>
      <FooterHeading>{title}</FooterHeading>
      <ul role="list" className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="group inline-flex items-center gap-2 text-sm text-paper/70 transition-colors hover:text-paper"
            >
              <span className="h-px w-0 bg-signal transition-all duration-300 group-hover:w-3" />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Footer
