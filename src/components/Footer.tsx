'use client'

import React, { useState } from 'react'

const Footer = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isHovered, setIsHovered] = useState<string | null>(null)

  // Navigation items from original code
  const footerNavigation = {
    main: [
      { name: 'Get Started', href: '/' },
      { name: 'Blogs', href: '/blogs' },
      { name: 'Release Notes', href: '/release-notes' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Contact Us', href: '/support' },
    ],
    legal: [
      { name: 'Privacy', href: '/privacy-policy' },
      { name: 'Terms', href: '/terms' },
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

  // Feedback form handler
  const handleFeedbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Simulate sending feedback
    setTimeout(() => {
      setIsFeedbackOpen(false)
      setFeedbackMessage('')
      alert('Thank you for your feedback!')
    }, 500)
  }

  // Decorative SVG elements for the magical theme
  const DecorativeElements = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -bottom-6 left-20 h-24 w-24 rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500 opacity-20 blur-xl"></div>
      <div className="absolute -bottom-10 right-1/4 h-32 w-32 rounded-full bg-gradient-to-r from-indigo-400 to-purple-600 opacity-20 blur-xl"></div>
      <div className="absolute right-20 top-10 h-20 w-20 rounded-full bg-gradient-to-r from-purple-300 to-fuchsia-400 opacity-20 blur-xl"></div>
    </div>
  )

  return (
    <footer className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-950 to-purple-950"></div>

      {/* Decorative elements */}
      <DecorativeElements />

      {/* Main content */}
      <div className="relative mx-auto max-w-md px-6 py-16 sm:max-w-3xl lg:max-w-7xl lg:px-8">
        {/* Logo area */}
        <div className="mb-12 flex flex-col items-center">
          <div className="mb-6 flex items-center">
            {/* FlowCraft logo - Using a placeholder */}
            <div className="relative h-12 w-48">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 opacity-70 blur-sm"></div>
              <div className="relative flex h-full items-center justify-center">
                <h2 className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text font-serif text-3xl font-bold tracking-wide text-transparent">
                  FlowCraft
                </h2>
              </div>
            </div>
          </div>
          <p className="max-w-md text-center text-sm font-light text-purple-200">
            Transform your ideas into stunning visual content with the power of
            AI
          </p>
        </div>

        {/* Main navigation links */}
        <nav className="mb-12 grid grid-cols-1 gap-y-8 text-center sm:grid-cols-3 sm:gap-x-8 md:flex md:justify-center md:space-x-10">
          {footerNavigation.main.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setIsHovered(item.name)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <a
                href={item.href}
                className="inline-block font-sans text-lg tracking-wide text-white transition duration-300 hover:text-fuchsia-200"
              >
                {item.name}
              </a>
              {/* Animated underline for hover effect */}
              <div
                className={`mt-1 h-0.5 origin-left transform bg-gradient-to-r from-fuchsia-400 to-indigo-400 transition-all duration-300 ${isHovered === item.name ? 'scale-x-100' : 'scale-x-0'}`}
              ></div>
            </div>
          ))}
        </nav>

        {/* Social links with animation */}
        <div className="mb-12 flex justify-center space-x-8">
          {footerNavigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group relative"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30"></div>
              <div className="relative transform transition-transform duration-300 hover:scale-110">
                <item.icon className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>

        {/* Feedback button with modal */}
        <div className="mb-12 flex justify-center">
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-3 transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 opacity-70 transition-opacity duration-300 group-hover:opacity-90"></span>
            <span className="relative text-sm font-medium text-white">
              Share Feedback
            </span>
          </button>
        </div>

        {/* Feedback modal */}
        {isFeedbackOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-md rounded-xl border border-purple-500/30 bg-gradient-to-b from-indigo-900 to-purple-900 p-8 shadow-2xl">
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="absolute right-3 top-3 text-purple-200 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h3 className="mb-6 text-center font-serif text-xl text-white">
                We'd Love Your Feedback
              </h3>

              <form onSubmit={handleFeedbackSubmit}>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  className="mb-4 w-full rounded-lg border border-purple-600/50 bg-purple-900/50 p-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="Share your thoughts with us..."
                  rows={4}
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-3 text-white transition-all duration-300 hover:from-fuchsia-600 hover:to-indigo-600"
                >
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Legal links */}
        <div className="mb-8 flex justify-center space-x-12">
          {footerNavigation.legal.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm text-purple-200 transition-colors duration-300 hover:text-white"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Copyright and additional info */}
        <div className="text-center">
          <p className="mb-4 font-serif text-sm text-purple-200">
            &copy; 2024 FlowCraft. All rights reserved.
          </p>
          <p className="mx-auto max-w-2xl text-xs text-purple-300/70">
            We improve our products and advertising by using Microsoft Clarity
            to see how you use our website. By using our site, you agree that we
            and Microsoft can collect and use this data. Our privacy policy
            explains how we use your data and cookies.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
