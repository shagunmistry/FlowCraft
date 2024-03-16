import { Fragment, useContext, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import Image from 'next/image'

import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'

import { motion } from 'framer-motion'
import { Edge, Node } from 'reactflow'
import EditNodesDiagramModal from '../EditNodesDiagramModal'
import EditEdgesOnDiagramModal from './Modals/EditEdgesOnDiagramModal'
import ReactFlowHelper from './ReactFlowHelper'
import {
  ArrowDownTrayIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid'
import GridToggle from './GridToggle'

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

export default function DiagramSettingsBar({
  nodes,
  edges,
  addNode,
  updateNodeLabel,
  deleteNode,
  updateEdgeLabel,
  deleteEdge,
  clearReactFlowDiagram,
  createShareableLink,
  toggleGrid,
  downloadFlowDiagramAsPng
}: {
  nodes: Node[]
  edges: Edge[]
  addNode: (node: Node) => void
  updateNodeLabel: (nodeId: string, label: string) => void
  deleteNode: (nodeId: string) => void
  updateEdgeLabel: (id: string, newValue: string) => void
  deleteEdge: (id: string) => void
  clearReactFlowDiagram: () => void
  createShareableLink: () => void
  toggleGrid: (enabled: boolean) => void
  downloadFlowDiagramAsPng: () => void
}) {
  const context = useContext(DiagramContext)

  const [isEditNodeModalOpen, setIsEditNodeModalOpen] = useState(false)
  const [isEditEdgeModalOpen, setIsEditEdgeModalOpen] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)

  return (
    <>
      <Disclosure
        as="header"
        className="mx-auto mb-4 w-11/12 rounded-lg bg-indigo-700"
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-5xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
              <div className="relative flex h-16 justify-between">
                <div className="relative z-10 flex px-2 lg:px-0">
                  <div className="flex flex-shrink-0 items-center">
                    <Image
                      className="h-8 w-auto rounded-full"
                      src={FlowCraftLogo}
                      alt="FlowCraft"
                      width={32}
                      height={32}
                    />
                  </div>
                </div>
                <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
                  <div className="w-full sm:max-w-xs">
                    <label htmlFor="search" className="sr-only">
                      Title
                    </label>
                    <p className="sm:text-md text-wrap relative text-center text-xl font-semibold text-white">
                      {context.title}
                    </p>
                  </div>
                </div>
                <div className="relative z-10 flex items-center lg:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                {/* <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                  <Menu as="div" className="relative ml-4 flex-shrink-0">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={cn(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700',
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div> */}
              </div>
              <nav
                className="hidden lg:flex lg:space-x-4 lg:py-2"
                aria-label="Global"
              >
                <Menu as="div" className="relative ml-4 flex-shrink-0">
                  <div>
                    <Menu.Button className="block w-16 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-gray-300 text-white hover:bg-gray-700 hover:text-white">
                      <span className="absolute -inset-1.5" />
                      File
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-max origin-top-right rounded-md bg-white py-1 shadow-lg">
                      <Menu.Item>
                        {({ active }) => (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              active ? 'bg-indigo-400' : '',
                              'block w-full rounded-md px-4 py-2 text-sm text-gray-700',
                            )}
                            onClick={() => createShareableLink()}
                          >
                            Share
                          </motion.button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              active ? 'bg-indigo-400' : '',
                              'block w-full rounded-md px-4 py-2 text-sm text-gray-700',
                            )}
                            onClick={() => downloadFlowDiagramAsPng()}
                          >
                            Download
                          </motion.button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              active ? 'bg-indigo-400' : '',
                              'block w-full rounded-md px-4 py-2 text-sm text-gray-700',
                            )}
                            onClick={() => setIsHelpModalOpen(true)}
                          >
                            Help
                          </motion.button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
                <Menu as="div" className="relative ml-4 flex-shrink-0">
                  <div>
                    <Menu.Button className="block w-16 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-gray-300 text-white hover:bg-gray-700 hover:text-white">
                      <span className="absolute -inset-1.5" />
                      Edit
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-max origin-top-right rounded-md bg-white py-1 shadow-lg">
                      <Menu.Item>
                        {({ active }) => (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              active ? 'bg-indigo-400' : '',
                              'block w-full rounded-md px-4 py-2 text-sm text-gray-700',
                            )}
                            onClick={() => setIsEditNodeModalOpen(true)}
                          >
                            Edit Node Labels
                          </motion.button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              active ? 'bg-indigo-400' : '',
                              'block w-full rounded-md px-4 py-2 text-sm text-gray-700',
                            )}
                            onClick={() => setIsEditEdgeModalOpen(true)}
                          >
                            Edit Arrows
                          </motion.button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              active ? 'bg-red-200' : '',
                              'block w-full rounded-md px-4 py-2 text-sm text-gray-700',
                            )}
                            onClick={() => clearReactFlowDiagram()}
                          >
                            Clear Diagram
                          </motion.button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <button className="block w-16 rounded-md px-3 py-2 text-sm font-medium text-white transition-all duration-200 ease-in-out">
                  <GridToggle onChange={toggleGrid} />
                </button>
              </nav>
            </div>

            <Disclosure.Panel
              as="nav"
              className="lg:hidden"
              aria-label="Global"
            >
              <div className="space-y-1 px-2 pb-3 pt-2">
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                      File
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 z-10 mt-2 w-max origin-top-right rounded-md bg-white py-1 shadow-lg">
                      <Menu.Item>
                        {({ active }) => (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              active ? 'bg-indigo-400' : '',
                              'block w-full rounded-md px-4 py-2 text-sm text-gray-700',
                            )}
                            onClick={() => createShareableLink()}
                          >
                            Share
                          </motion.button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              active ? 'bg-indigo-400' : '',
                              'block w-full rounded-md px-4 py-2 text-sm text-gray-700',
                            )}
                            onClick={() => setIsHelpModalOpen(true)}
                          >
                            Help
                          </motion.button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                      Edit
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 z-10 mt-2 w-max origin-top-right rounded-md bg-white py-1 shadow-lg">
                      <Menu.Item>
                        {({ active }) => (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              active ? 'bg-indigo-400' : '',
                              'block w-full rounded-md px-4 py-2 text-sm text-gray-700',
                            )}
                            onClick={() => setIsEditNodeModalOpen(true)}
                          >
                            Edit Node Labels
                          </motion.button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              active ? 'bg-indigo-400' : '',
                              'block w-full rounded-md px-4 py-2 text-sm text-gray-700',
                            )}
                            onClick={() => setIsEditEdgeModalOpen(true)}
                          >
                            Edit Arrows
                          </motion.button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              active ? 'bg-red-200' : '',
                              'block w-full rounded-md px-4 py-2 text-sm text-gray-700',
                            )}
                            onClick={() => clearReactFlowDiagram()}
                          >
                            Clear Diagram
                          </motion.button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
                <button className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  <GridToggle onChange={toggleGrid} />
                </button>
              </div>
              {/* <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.imageUrl}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div> */}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <EditNodesDiagramModal
        nodes={nodes}
        edges={edges}
        addNode={addNode}
        updateNodeLabel={updateNodeLabel}
        updateEdgeLabel={updateEdgeLabel}
        deleteNode={deleteNode}
        open={isEditNodeModalOpen}
        setOpen={setIsEditNodeModalOpen}
      />
      <EditEdgesOnDiagramModal
        edges={edges}
        updateEdgeLabel={updateEdgeLabel}
        open={isEditEdgeModalOpen}
        setOpen={setIsEditEdgeModalOpen}
        deleteEdge={deleteEdge}
      />
      <ReactFlowHelper open={isHelpModalOpen} setOpen={setIsHelpModalOpen} />
    </>
  )
}
