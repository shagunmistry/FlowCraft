'use client'
import Navbar from '@/components/Navbar'
import SimpleNotification from '@/components/SimpleNotification'
import { Metadata } from 'next'
import Link from 'next/link'
import { useState } from 'react'

export default function SupportPage() {
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error'>(
    'success',
  )
  const [openNotification, setOpenNotification] = useState(false)

  const openErrorNotification = () => {
    setNotificationMessage(
      'There was an error processing your request. Please try again later.',
    )
    setNotificationType('error')
    setOpenNotification(true)
  }

  const openSuccessNotification = () => {
    setNotificationMessage('Success! We have received your request.')
    setNotificationType('success')
    setOpenNotification(true)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    console.log('Form data:', data)
    const { firstName, lastName, company, email, message } = data

    fetch('/api/support', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        company,
        email,
        message,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Support request submitted:', data)
        openSuccessNotification()
      })
      .catch((error) => {
        console.error('Error submitting support request:', error)
        openErrorNotification()
      })

    e.currentTarget.reset()
  }

  return (
    <>
      <div className="isolate bg-gray-100 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Contact{' '}
            <Link href="/" className="text-pink-600">
              FlowCraft
            </Link>{' '}
            Support
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            We understand that even with the power of AI assistance, you might
            have questions or need help using FlowCraft. Our friendly support
            team is here to ensure you have a smooth and productive experience.
          </p>
        </div>
        <form
          method="POST"
          className="mx-auto mt-16 max-w-xl sm:mt-20"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                First name
              </label>
              <div className="mt-2.5">
                <input
                  required
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Last name
              </label>
              <div className="mt-2.5">
                <input
                  required
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="company"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Company
              </label>
              <div className="mt-2.5">
                <input
                  required
                  type="text"
                  name="company"
                  id="company"
                  autoComplete="organization"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2.5">
                <input
                  required
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Message
              </label>
              <div className="mt-2.5">
                <textarea
                  required
                  name="message"
                  id="message"
                  rows={4}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-pink-600 px-3.5 py-2.5 text-center text-lg font-semibold text-white shadow-lg shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              Let's talk
            </button>
          </div>
        </form>
        <SimpleNotification
          message={notificationMessage}
          type={notificationType}
          open={openNotification}
          setOpen={setOpenNotification}
          title="FlowCraft Support"
        />
      </div>
    </>
  )
}
