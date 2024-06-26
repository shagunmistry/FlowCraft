import { Fragment, useState } from 'react'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import {
  BellAlertIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import { cn } from '@/lib/utils'

function getIcon(type: 'success' | 'error' | 'warning' | 'info') {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className="h-6 w-6 text-green-100" />
    case 'error':
      return <XCircleIcon className="h-6 w-6 text-red-100" />
    case 'warning':
      return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-100" />
    case 'info':
      return <InformationCircleIcon className="h-6 w-6 text-indigo-100" />
    default:
      return <InformationCircleIcon className="h-6 w-6 text-gray-100" />
  }
}

export default function SimpleNotification({
  message,
  title,
  type,
  open,
  setOpen,
}: {
  message: string
  title: string
  type: 'success' | 'error' | 'warning' | 'info'
  open: boolean
  setOpen: (open: boolean) => void
}) {
  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={open}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={cn(
                type === 'success' && 'bg-green-500',
                type === 'error' && 'bg-red-500',
                type === 'warning' && 'bg-yellow-500',
                type === 'info' && 'bg-indigo-500',
                'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5',
              )}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">{getIcon(type)}</div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="mt-1 text-sm text-white">{message}</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setOpen(false)
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}
