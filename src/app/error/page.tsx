'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  console.log('ErrorPage message: ', message)
  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">Uh Oh!</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            We're sorry &mdash; something's gone wrong on our end.
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">{message}</p>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Please try again later, or contact
            <Link href="/support" className="text-pink-700 underline">
              {' '}
              support{' '}
            </Link>
            if the problem persists.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-pink-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back Home.
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
