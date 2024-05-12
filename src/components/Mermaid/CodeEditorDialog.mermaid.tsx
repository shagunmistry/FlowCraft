import { Fragment, useContext, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { PencilIcon } from '@heroicons/react/20/solid'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'

import mermaid from 'mermaid'

const validateCode = async (code: string) => {
  return await mermaid.parse(code).catch((err) => {
    console.log('Error: ', err)
    return err.message
  })
}

export default function CodeEditorDialog({
  open,
  setOpen,
  code,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  code: string
}) {
  const cancelButtonRef = useRef(null)

  const context = useContext(DiagramContext)

  const [_code, _setCode] = useState(code)

  console.log('Code: ', code.length, ' _code: ', _code.length)

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    const isValid = await validateCode(_code)

    console.log('isValid', isValid)

    if (isValid === true) {
      context.setMermaidData(_code)
      _setCode('')
      setError(null)
      setOpen(false)
    } else {
      setError(isValid)
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <PencilIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Edit Your Diagram
                    </Dialog.Title>
                    <div className="mt-2">
                      <textarea
                        value={_code.length > 0 ? _code : code}
                        onChange={(e) => {
                          _setCode(e.target.value)
                        }}
                        className="mt-2 block h-72 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 font-mono text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100"
                      />
                    </div>
                  </div>
                </div>
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XCircleIcon
                          className="h-5 w-5 text-red-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Your code seems to be invalid
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{error}</p>
                          <p>
                            To learn more about Mermaid Code syntax, please
                            visit{' '}
                            <a
                              href="http://mermaid.js.org/syntax/flowchart.html"
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-indigo-600 underline hover:text-indigo-500"
                            >
                              Mermaid Documentation
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
                    focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
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
