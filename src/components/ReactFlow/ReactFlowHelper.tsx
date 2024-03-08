import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

import userGuide from './UserHelper.mdx'

export default function ReactFlowHelper({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <QuestionMarkCircleIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      User Guide
                    </Dialog.Title>
                    <div className="prose mt-2 max-h-96 overflow-y-auto">
                      <div className="prose max-w-none lg:prose-lg">
                        <h2 className="mb-2 text-lg font-semibold">
                          Editing a Step
                        </h2>
                        <p className="mb-4">
                          To edit a step, simply hover over it. A pencil icon
                          will appear. Click on this icon to start editing the
                          step. When you're done, click anywhere outside the
                          step to save your changes.
                        </p>

                        <h2 className="mb-2 text-lg font-semibold">
                          Moving a Step
                        </h2>
                        <p className="mb-4">
                          To move a step, click and hold anywhere on the step
                          except the pencil icon. Drag the step to its new
                          position and release the mouse button to drop it.
                        </p>

                        <h2 className="mb-2 text-lg font-semibold">
                          Connecting Steps
                        </h2>
                        <p className="mb-4">
                          To connect two steps, hover over the first step. Small
                          circles will appear on its edges. Click and hold on a
                          circle, then drag it to the second step and release
                          the mouse button to create a connection.
                        </p>

                        <h2 className="mb-2 text-lg font-semibold">
                          Deleting a Step or Connection
                        </h2>
                        <p className="mb-4">
                          To delete a step or connection, first select it by
                          clicking on it. Then, press the `Delete` key on your
                          keyboard.
                        </p>

                        <h2 className="mb-2 text-lg font-semibold">
                          Navigating the Diagram
                        </h2>
                        <p className="mb-4">
                          You can move around the diagram by clicking and
                          dragging anywhere on the background. Use the scroll
                          wheel on your mouse to zoom in and out.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setOpen(false)}
                  >
                    Go back
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
