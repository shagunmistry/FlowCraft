import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/20/solid'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

interface ShareableLinksModalProps {
  isOpen: boolean
  onClose: () => void
  shareableLink: string
}

export default function ShareableLinksModal({
  isOpen,
  onClose,
  shareableLink,
}: ShareableLinksModalProps) {
  const [isCopied, setIsCopied] = useState(false)

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <ClipboardDocumentIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Share Your Diagram! 🎉
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Your diagram is now shareable! Here's the link:
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-indigo-600">
                          {shareableLink}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  {!isCopied && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{
                        opacity: isCopied ? 0 : 1,
                        scale: isCopied ? 0.7 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => {
                        navigator.clipboard.writeText(shareableLink)
                        setIsCopied(true)
                      }}
                    >
                      Copy Link
                    </motion.button>
                  )}
                  <AnimatePresence>
                    {isCopied && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                      >
                        <CheckIcon className="mr-2 h-5 w-5" />
                        Copied!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
