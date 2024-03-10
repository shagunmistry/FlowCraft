import { Panel } from 'reactflow'
import { useState } from 'react'
import { track } from '@vercel/analytics'
import ReactFlowHelper from './ReactFlowHelper'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

export default function ReactFlowHelperButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleEditButtonClick = () => {
    track('diagram_help_button_clicked')

    setIsModalOpen(true)
  }

  return (
    <Panel position="top-left">
      <button
        type="button"
        className="inline-flex items-center gap-x-1.5 rounded-full text-lg font-bold font-medium font-semibold text-black hover:bg-indigo-500 hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={handleEditButtonClick}
      >
        <QuestionMarkCircleIcon
          className="-ml-0.5 h-10 w-10"
          aria-hidden="true"
        />
      </button>
      
    </Panel>
  )
}
