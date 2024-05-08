import { Fragment, useRef, useState } from 'react'
import { FaceSmileIcon, StarIcon } from '@heroicons/react/20/solid'
import { Dialog, Transition } from '@headlessui/react'

import { TempMermaidDiagramType } from './Mermaid/OverviewDialog.mermaid'
import { DiagramOrChartType } from '@/lib/utils'

const StarRatingInput = ({
  type,
}: {
  type: DiagramOrChartType | TempMermaidDiagramType
}) => {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

  const [openAdditionalFeedback, setOpenAdditionalFeedback] = useState(false)

  const cancelButtonRef = useRef(null)

  const handleRating = async (value: number) => {
    console.log('Rating:', value)

    setRating(value)

    if (value < 5) {
      setOpenAdditionalFeedback(true)
    } else {
      await sendRatingToServer('', value)
      setOpenAdditionalFeedback(false)
    }
  }

  const handleSubmitFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const improved = (
      e.currentTarget.elements.namedItem('improved') as HTMLTextAreaElement
    ).value

    const features = (
      e.currentTarget.elements.namedItem('features') as HTMLTextAreaElement
    ).value

    const message = `Improvements: ${improved}\nFeatures: ${features}`

    await sendRatingToServer(message)

    setOpenAdditionalFeedback(false)
    e.currentTarget.reset()
  }

  const sendRatingToServer = async (message: string, value: number = 0) => {
    console.log('Submitting support request:', {
      message,
      type,
      rating,
    })
    fetch('/api/support', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        type,
        rating: value === 0 ? rating : value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Support request submitted:', data)
      })
      .catch((error) => {
        console.error('Error submitting support request:', error)
      })
  }

  return (
    <>
      <div className="mt-10 flex justify-center lg:mt-12">
        <div className="text-xl font-bold">Rate this diagram:</div>
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1

          return (
            <label key={i}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => handleRating(ratingValue)}
                className="hidden"
              />
              <StarIcon
                className="h-6 w-6 cursor-pointer"
                fill={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              />
            </label>
          )
        })}
        <Transition.Root show={openAdditionalFeedback} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={setOpenAdditionalFeedback}
          >
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
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                        <FaceSmileIcon
                          className="h-6 w-6 text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          How can we improve?
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            It seems like you didn't have the best experience.
                            Help us improve by providing some additional
                            feedback?
                          </p>
                        </div>
                      </div>
                    </div>
                    <form
                      className="mt-5 sm:mt-4 sm:pl-4"
                      onSubmit={handleSubmitFeedback}
                    >
                      <div className="space-y-6">
                        <div className="col-span-full">
                          <label
                            htmlFor="improved"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            What can be improved?
                          </label>
                          <div className="mt-2">
                            <textarea
                              required
                              id="improved"
                              name="improved"
                              rows={3}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              defaultValue={''}
                            />
                          </div>
                        </div>
                        <div className="col-span-full">
                          <label
                            htmlFor="features"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            What features would you like to see added or more
                            of?
                          </label>
                          <div className="mt-2">
                            <textarea
                              required
                              id="features"
                              name="features"
                              rows={3}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              defaultValue={''}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
                        <button
                          type="submit"
                          className="text-md inline-flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2 font-semibold text-white shadow-lg transition-colors duration-150 ease-in-out hover:bg-pink-400 sm:w-auto"
                        >
                          Leave feedback
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-3 sm:mt-0 sm:w-auto"
                          onClick={() => setOpenAdditionalFeedback(false)}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </>
  )
}

export default StarRatingInput
