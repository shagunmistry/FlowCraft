'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { XMarkIcon } from '@heroicons/react/24/outline'

const Footer = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  // Organized navigation for better column layout
  const navigation = {
    product: [
      { name: 'Get Started', href: '/' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Release Notes', href: '/release-notes' },
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
    social: [
      {
        name: 'Instagram',
        href: 'https://www.instagram.com/shazzamm_/',
        icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: 'Twitter',
        href: 'https://twitter.com/mistry_shagun',
        icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        ),
      },
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
      className="border-t border-gray-100 bg-white"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <span className="sr-only">FlowCraft</span>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                FlowCraft
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-gray-500">
              Transform your ideas into stunning visual content with the power
              of AI.
            </p>
            <div className="flex space-x-4 pt-2">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 transition-colors hover:text-gray-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Product
                </h3>
                <ul role="list" className="mt-4 space-y-3">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-500 transition-colors hover:text-gray-900"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Resources
                </h3>
                <ul role="list" className="mt-4 space-y-3">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-500 transition-colors hover:text-gray-900"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Legal
                </h3>
                <ul role="list" className="mt-4 space-y-3">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-500 transition-colors hover:text-gray-900"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Feedback
                </h3>
                <p className="mt-4 text-sm leading-6 text-gray-500">
                  Help us improve FlowCraft.
                </p>
                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="mt-4 rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                >
                  Share Feedback
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-100 pt-8 sm:flex sm:items-center sm:justify-between lg:mt-16">
          <p className="text-xs leading-5 text-gray-400">
            &copy; {new Date().getFullYear()} FlowCraft. All rights reserved.
          </p>
          <p className="mt-4 max-w-sm text-xs leading-5 text-gray-400 sm:mt-0 sm:text-right">
            We improve our products using Microsoft Clarity. By using our site,
            you agree to our data collection practices.
          </p>
        </div>
      </div>

      {/* Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFeedbackOpen(false)}
          />
          <div className="relative w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl ring-1 ring-black/5 transition-all">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                Share your feedback
              </h3>
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit}>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className="min-h-[120px] w-full rounded-lg border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-gray-900"
                placeholder="What's on your mind?"
                required
              />
              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800"
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

export default Footer
