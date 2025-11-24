'use client'
import Link from 'next/link'
import FeedbackDialog from '../FeedbackDialog'
import { useState } from 'react'

import { motion } from 'framer-motion'

export default function DashboardHeading({
  subscribed,
  name,
  imageUrl,
  stats,
}: {
  subscribed: boolean
  name: string
  imageUrl: string
  stats: { id: number; name: string; value: number }[]
}) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false)

  return (
    <>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <h2 className="sr-only" id="profile-overview-title">
          Profile Overview
        </h2>
        <div className="bg-white p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5">
              <div className="flex-shrink-0">
                <img
                  className="mx-auto h-20 w-20 rounded-full"
                  src={imageUrl}
                  alt={name}
                />
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p className="text-sm font-medium text-gray-600">
                  Welcome back,
                </p>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {name}
                </p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 ease-in-out hover:bg-green-700"
                  onClick={() => setFeedbackModalOpen(true)}
                >
                  Feature Request
                </button>
              </div>
            </div>
            <div className="mt-5 flex justify-center sm:mt-0">
              {subscribed ? (
                <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-red-500 ring-1 ring-inset ring-gray-200">
                  <svg
                    className="h-1.5 w-1.5 fill-red-500"
                    viewBox="0 0 6 6"
                    aria-hidden="true"
                  >
                    <circle cx={3} cy={3} r={3} />
                  </svg>
                  Subscribed
                </span>
              ) : (
                <Link
                  href={'/pricing?sourcePage=dashboard'}
                  className="inline-flex items-center justify-center rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-pink-600"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 divide-y divide-red-200 border-t border-red-200 bg-gray-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <motion.div
              key={stat.name}
              className="px-6 py-5 text-center sm:px-4 sm:py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-red-900">{stat.value}</span>{' '}
              <span className="text-red-600">{stat.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <FeedbackDialog
        header="Feature Request"
        message="What features would you like to see in the future?"
        open={feedbackModalOpen}
        setOpen={setFeedbackModalOpen}
      />
    </>
  )
}
