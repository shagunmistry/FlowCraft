import { PencilIcon } from '@heroicons/react/24/outline'
import { Edge, Node, Panel, updateEdge } from 'reactflow'
import EditNodesDiagramModal from '../EditNodesDiagramModal'
import { useState } from 'react'
import { track } from '@vercel/analytics'

export default function EditDiagramButton({
  nodes,
  edges,
  addNode,
  updateNodeLabel,
  deleteNode,
  updateEdgeLabel,
}: {
  nodes: Node[]
  edges: Edge[]
  addNode: (node: Node) => void
  updateNodeLabel: (nodeId: string, label: string) => void
  deleteNode: (nodeId: string) => void
  updateEdgeLabel: (id: string, newValue: string) => void
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleEditButtonClick = () => {
    track('diagram_edit_button_clicked')

    setIsModalOpen(true)
  }

  return (
    <Panel position="top-center">
      <button
        type="button"
        className="inline-flex items-center gap-x-1.5 rounded-xl bg-pink-500 px-2.5 px-4 py-1.5 py-2 text-sm font-bold font-semibold text-white text-white shadow-sm hover:bg-red-500 hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        onClick={handleEditButtonClick}
      >
        <PencilIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Edit
      </button>
      <EditNodesDiagramModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        nodes={nodes}
        edges={edges}
        addNode={addNode}
        updateNodeLabel={updateNodeLabel}
        updateEdgeLabel={updateEdgeLabel}
        deleteNode={deleteNode}
      />
    </Panel>
  )
}
