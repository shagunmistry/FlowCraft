'use client'
import { Fragment, useContext, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PencilIcon } from '@heroicons/react/24/outline'
import { Edge, Node } from 'reactflow'
import { TrashIcon } from '@heroicons/react/20/solid'
import { motion } from 'framer-motion'

export default function EditEdgesOnDiagramModal({
  open,
  setOpen,
  edges,
  updateEdgeLabel,
  deleteEdge,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  edges: Edge[]
  updateEdgeLabel: (id: string, newValue: string) => void
  deleteEdge: (id: string) => void
}) {
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
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
          <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
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
                <div>
                  <div className="mt-3 sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Edit Your Diagram
                    </Dialog.Title>
                    <div className="mt-2">
                      <div className="mx-auto max-w-5xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                          <div className="flex flex-col">
                            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                              <div className="inline-block min-w-full py-2 align-middle">
                                <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                  <h2 className="mt-2 text-lg font-bold text-gray-900">
                                    Arrows and Labels
                                  </h2>
                                  <p className="mt-1 text-sm text-gray-500">
                                    These represent the connections between your
                                    nodes. You can edit the labels or delete the
                                    arrows here.
                                  </p>
                                  <table className="min-w-full divide-y divide-pink-200">
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                      {edges &&
                                        edges.map((edge: any) => {
                                          return (
                                            <tr key={edge.id}>
                                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                <div className="flex shrink-0 items-center gap-x-6">
                                                  <input
                                                    type="text"
                                                    defaultValue={
                                                      edge.data
                                                        ? edge.data.label
                                                        : ''
                                                    }
                                                    placeholder={
                                                      !edge.data
                                                        ? 'Enter a label'
                                                        : ''
                                                    }
                                                    onChange={(event) => {
                                                      if (!edge.data) {
                                                        edge.data = {}
                                                      }
                                                      edge.data.label =
                                                        event.target.value
                                                      updateEdgeLabel(
                                                        edge.id,
                                                        event.target.value,
                                                      )
                                                    }}
                                                    className="mt-1 block w-full rounded-md border border-indigo-300 px-3 py-2 text-lg text-indigo-700 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                  />
                                                  <motion.button
                                                    type="button"
                                                    onClick={() => {
                                                      deleteEdge(edge.id)
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                    whileHover={{
                                                      scale: 1.1,
                                                      rotate: 90,
                                                    }}
                                                    whileTap={{ scale: 0.9 }}
                                                  >
                                                    <TrashIcon className="h-6 w-6" />
                                                  </motion.button>
                                                </div>
                                              </td>
                                            </tr>
                                          )
                                        })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => {
                      setOpen(false)
                    }}
                    ref={cancelButtonRef}
                  >
                    Close
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
