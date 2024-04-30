import { createClient } from '@/lib/supabase-auth/client'
import { Dialog, Transition } from '@headlessui/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { Fragment, useState } from 'react'

export default function FeedbackDialog({
  open,
  setOpen,
  header,
  message,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  header: string
  message: string
}) {
  const [submitting, setSubmitting] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const feedback = formData.get('feedback')
    const newFeatures = formData.get('new-features')
    const followup = formData.get('followup')
    console.log('Feedback:', feedback)
    console.log('New Features:', newFeatures)
    console.log('Followup:', followup)

    setSubmitting(true)
    const sbClient = createClient()
    const user = await sbClient.auth.getSession()

    if (user && user.data.session && user.data.session.user.email) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FLOWCRAFT_API}/feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            feedback,
            newFeatures,
            followUp: followup === 'on',
            email: user.data.session.user.id,
          }),
        },
      )

      if (response.ok) {
        console.log('Feedback submitted')
      } else {
        console.error('Feedback submission failed')
      }

      setSubmitting(false)
    } else {
      console.error('No user found')
      setSubmitting(false)
    }

    setOpen(false)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-screen transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:rounded-2xl sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <QuestionMarkCircleIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {header}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{message}</p>
                    </div>
                  </div>
                  <form className="mt-5 sm:mt-6" onSubmit={handleSubmit}>
                    <div>
                      <label
                        htmlFor="feedback"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        How can we improve?
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="feedback"
                          name="feedback"
                          rows={4}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus-visible:border-indigo-500 focus-visible:ring-indigo-500 sm:text-sm"
                          placeholder="What can we do better?"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <label
                        htmlFor="new-features"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        What features would you like to see in the future?
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="new-features"
                          name="new-features"
                          rows={4}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus-visible:border-indigo-500 focus-visible:ring-indigo-500 sm:text-sm"
                          placeholder="Feature requests"
                        />
                      </div>
                    </div>

                    <div className="relative mt-2 flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="followup"
                          aria-describedby="followup-description"
                          name="followup"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label
                          htmlFor="followup"
                          className="font-medium text-gray-900"
                        >
                          Can we follow up with you?
                        </label>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        disabled={submitting}
                      >
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
