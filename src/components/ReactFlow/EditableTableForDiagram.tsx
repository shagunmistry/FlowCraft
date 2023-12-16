import { Fragment, useContext, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Edge, Node, NodeChange } from 'reactflow'
import { cn } from '@/lib/utils'
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/20/solid'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'

export default function EditableTableForDiagram({
  nodes,
  edges,
  setNodes,
  onNodesChange,
  addNode,
  updateNodeLabel,
  deleteNode,
}: {
  nodes: Node[]
  edges: Edge[]
  setNodes: (ndoes: Node[]) => void
  onNodesChange: any
  addNode: (node: Node) => void
  updateNodeLabel: (nodeId: string, label: string) => void
  deleteNode: (nodeId: string) => void
}) {
  const context = useContext(DiagramContext)

  // const [nodesState, setNodesState] = useState<Node[]>(nodes)

  return (
    <div className="mt-14">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                  <table className="min-w-full divide-y divide-pink-200 rounded-lg shadow-lg">
                    <thead className="bg-pink-300">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xl uppercase tracking-wider text-indigo-500"
                        >
                          Edit Your Diagram
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {nodes.map((node) => {
                        return (
                          <tr key={node.id}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              <div className="flex shrink-0 items-center gap-x-6">
                                <input
                                  type="text"
                                  defaultValue={node.data.label}
                                  onChange={(event) => {
                                    node.data.label = event.target.value
                                    // setNodesState([...nodesState])
                                    updateNodeLabel(node.id, event.target.value)
                                  }}
                                  className="mt-1 block w-full rounded-md border border-indigo-300 px-3 py-2 text-lg text-indigo-700 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                                <button
                                  className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-base text-sm font-semibold ring-1 ring-inset ring-green-300 hover:bg-green-300 hover:text-white"
                                  onClick={() => {
                                    context.setLoading(true)
                                    context.setNodes([])
                                    setTimeout(() => {
                                      context.setNodes(nodes)
                                      context.setLoading(false)
                                    }, 200)
                                  }}
                                >
                                  Update
                                </button>
                                <button
                                  className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-md bg-red-500 px-3 py-2 text-base text-sm font-semibold text-white ring-1 ring-inset ring-green-300 hover:bg-green-300 hover:text-white"
                                  onClick={() => {
                                    context.setLoading(true)
                                    context.setNodes([])
                                    setTimeout(() => {
                                      deleteNode(node.id)
                                      context.setLoading(false)
                                    }, 200)
                                  }}
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          <div className="flex shrink-0 items-center gap-x-6">
                            <button
                              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-md bg-indigo-500 px-3 py-2 text-base text-sm font-semibold text-white ring-1 ring-inset ring-green-300 hover:bg-indigo-900 hover:text-white"
                              onClick={() => {
                                addNode({
                                  ...nodes[1],
                                  id: `${nodes.length + 1}`,
                                  data: {
                                    ...nodes[1].data,
                                    label: `Entry ${nodes.length + 1}`,
                                  },
                                  position: {
                                    x: 0,
                                    y: 0,
                                  },
                                })
                              }}
                            >
                              Add Item
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
