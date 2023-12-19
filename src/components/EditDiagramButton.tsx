import { PencilIcon } from '@heroicons/react/24/outline'
import { Edge, Node, Panel } from 'reactflow'
import EditDiagramModal from './EditDiagramModal'
import { useState } from 'react'
import { track } from '@vercel/analytics'

export default function EditDiagramButton({
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleEditButtonClick = () => {
    track('diagram_edit_button_clicked')

    setIsModalOpen(true)
  }

  return (
    <Panel position="top-left">
      <button
        type="button"
        className="inline-flex items-center gap-x-1.5 rounded-xl bg-pink-500 px-2.5 px-4 py-1.5 py-2 text-sm font-bold font-semibold text-white text-white shadow-sm hover:bg-indigo-500 hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={handleEditButtonClick}
      >
        <PencilIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Edit Labels
      </button>
      <EditDiagramModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        onNodesChange={onNodesChange}
        addNode={addNode}
        updateNodeLabel={updateNodeLabel}
        deleteNode={deleteNode}
      />
    </Panel>
  )
}
