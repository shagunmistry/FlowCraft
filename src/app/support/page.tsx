'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PaperAirplaneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import SimpleNotification from '@/components/SimpleNotification'
import clsx from 'clsx'

// --- Components ---

const InputField = ({
  label,
  id,
  type = 'text',
  required = false,
  ...props
}: any) => (
  <div className="group">
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-medium leading-6 text-zinc-900"
    >
      {label} {required && <span className="text-blue-600">*</span>}
    </label>
    <input
      type={type}
      name={id}
      id={id}
      required={required}
      className="block w-full rounded-lg border-0 bg-zinc-50/50 px-4 py-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 transition-all placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
      {...props}
    />
  </div>
)

const TextAreaField = ({
  label,
  id,
  rows = 4,
  required = false,
  ...props
}: any) => (
  <div>
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-medium leading-6 text-zinc-900"
    >
      {label} {required && <span className="text-blue-600">*</span>}
    </label>
    <textarea
      name={id}
      id={id}
      rows={rows}
      required={required}
      className="block w-full resize-none rounded-lg border-0 bg-zinc-50/50 px-4 py-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 transition-all placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
      {...props}
    />
  </div>
)

const SubmitButton = ({ isLoading }: { isLoading: boolean }) => (
  <button
    type="submit"
    disabled={isLoading}
    className={clsx(
      'flex w-full items-center justify-center rounded-full px-8 py-4 text-sm font-semibold text-white shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-70',
      isLoading ? 'bg-zinc-400' : 'bg-zinc-900 hover:bg-zinc-800',
    )}
  >
    {isLoading ? (
      <span className="flex items-center gap-2">
        <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Sending...
      </span>
    ) : (
      <span className="flex items-center gap-2">
        Send Message
        <PaperAirplaneIcon className="h-4 w-4" />
      </span>
    )}
  </button>
)

// --- Main Page ---

export default function SupportPage() {
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    open: false,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get('first-name'),
      lastName: formData.get('last-name'),
      company: formData.get('company'),
      email: formData.get('email'),
      message: formData.get('message'),
    }

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to submit')

      setNotification({
        message: 'Request received. We will get back to you shortly.',
        type: 'success',
        open: true,
      })
      e.currentTarget.reset()
    } catch (error) {
      console.error('Submission error:', error)
      setNotification({
        message: 'Something went wrong. Please try again later.',
        type: 'error',
        open: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <SimpleNotification
        message={notification.message}
        type={notification.type}
        open={notification.open}
        setOpen={(open) => setNotification((prev) => ({ ...prev, open }))}
        title="Support Status"
      />

      <div className="relative isolate px-6 pt-24 lg:px-8">
        {/* Header Section */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-blue-50 p-3 ring-1 ring-blue-100">
              <ChatBubbleLeftRightIcon
                className="h-6 w-6 text-blue-600"
                aria-hidden="true"
              />
            </div>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Contact Support
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Need help with{' '}
            <span className="font-semibold text-zinc-900">FlowCraft</span>? Our
            team is ready to assist you. Fill out the form below and we'll
            respond as soon as possible.
          </p>
        </div>

        {/* Form Section */}
        <div className="mx-auto max-w-xl pb-24">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <InputField
                label="First name"
                id="first-name"
                autoComplete="given-name"
                required
              />
              <InputField
                label="Last name"
                id="last-name"
                autoComplete="family-name"
                required
              />

              <div className="sm:col-span-2">
                <InputField
                  label="Company"
                  id="company"
                  autoComplete="organization"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <InputField
                  label="Email address"
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <TextAreaField
                  label="How can we help?"
                  id="message"
                  required
                  placeholder="Describe your issue or question..."
                />
              </div>
            </div>

            <div className="pt-4">
              <SubmitButton isLoading={loading} />
              <p className="mt-4 text-center text-xs text-zinc-500">
                By contacting us, you agree to our{' '}
                <Link
                  href="/terms"
                  className="underline underline-offset-2 hover:text-zinc-900"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="underline underline-offset-2 hover:text-zinc-900"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
