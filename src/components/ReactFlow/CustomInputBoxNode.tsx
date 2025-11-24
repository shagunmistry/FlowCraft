import { Fragment, memo, useCallback, useContext, useState } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'

import { AnimatePresence, motion } from 'framer-motion'
import { Cog6ToothIcon, PencilIcon, TrashIcon } from '@heroicons/react/20/solid'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { Menu, Transition } from '@headlessui/react'

function CustomInputBoxNode(props: any) {
  const { setNodes } = useReactFlow()
  const diagramContext = useContext(DiagramContext)
  const [isHovered, setIsHovered] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(props.data.label)

  const handleLabelChange = useCallback(
    (nodeId: string, newLabel: string) => {
      {
        const updatedNodes = diagramContext.nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, label: newLabel } }
          }
          return node
        })
        diagramContext.setNodes(updatedNodes)

        return setNodes((ns) => {
          const nodeIndex = ns.findIndex((n) => n.id === nodeId)
          const node = ns[nodeIndex]
          const newNode = {
            ...node,
            data: {
              ...node.data,
              label: newLabel,
            },
          }
          ns[nodeIndex] = newNode
          return ns
        })
      }
    },
    [setNodes],
  )

  const updateNodeLabel = (value: string) => {
    setLabel(value)
    handleLabelChange(props.id, value)
  }

  const deleteNode = () => {
    // remove node from react-flow
    setNodes((nodes) => nodes.filter((node) => node.id !== props.id))

    // remove node from context
    diagramContext.setNodes(
      diagramContext.nodes.filter((node) => node.id !== props.id),
    )
  }

  return (
    <>
      <Handle type="source" position={Position.Left} id={props.id} />
      <Handle type="target" position={Position.Right} id={props.id} />
      <Handle type="target" position={Position.Top} id={props.id} />
      <Handle type="target" position={Position.Bottom} id={props.id} />
      <motion.div
        className="input-box-node relative w-64 max-w-xs rounded-lg bg-red-500 p-4 opacity-80 shadow-lg"
        whileHover={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-0 m-2 rounded-full bg-white p-1 shadow"
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(true)}
            >
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex items-center rounded-full bg-red-100 text-red-400 hover:text-red-600">
                    <span className="sr-only">Open options</span>
                    <Cog6ToothIcon className="h-5 w-5" aria-hidden="true" />
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-red-100' : ''
                            } flex w-full justify-between px-4 py-2 text-sm text-red-700`}
                            onClick={() => setIsEditing(true)}
                          >
                            <PencilIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-red-100' : ''
                            } flex w-full justify-between px-4 py-2 text-sm text-red-700`}
                            onClick={() => deleteNode()}
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </motion.button>
          )}
        </AnimatePresence>
        <motion.div className="input-box-node__body">
          {isEditing ? (
            <motion.textarea
              className="input-box-node__input text-balance h-full w-full border-none bg-black p-2 text-white transition-all duration-300"
              value={label}
              onChange={(e) => updateNodeLabel(e.target.value)}
              onBlur={() => setIsEditing(false)}
              autoFocus
            />
          ) : (
            <motion.label className="input-box-node__input text-balance h-full w-full break-words border-none bg-transparent p-4 text-white transition-all duration-300">
              {label}
            </motion.label>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}

export default memo(CustomInputBoxNode)
