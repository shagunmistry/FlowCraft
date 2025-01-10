import React from 'react'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

const DiagramOption = ({
  diagram,
  isSelected,
  onSelect,
}: {
  diagram: any
  isSelected: boolean
  onSelect: (id: string) => void
}) => {
  return (
    <motion.div
      onClick={() => onSelect(diagram.id)}
      className="group relative overflow-hidden rounded-2xl bg-white/80 p-6 backdrop-blur-xl transition-colors hover:bg-white"
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Selection Indicator */}
      <motion.div
        className={`absolute right-0 top-0 h-full w-1 ${
          isSelected ? 'bg-blue-500' : 'bg-transparent'
        }`}
        initial={false}
        animate={{ opacity: isSelected ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Icon */}
      <div className="relative">
        <span className="inline-flex items-center justify-center rounded-xl bg-blue-50 p-3">
          <diagram.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
        </span>

        {/* Check Icon */}
        <motion.div
          className="absolute -right-2 -top-2"
          initial={{ scale: 0 }}
          animate={{ scale: isSelected ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
            <Check className="h-4 w-4" />
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="mt-6 space-y-2">
        <h3 className="text-lg font-medium text-gray-900">{diagram.title}</h3>
        <motion.p
          className="text-sm text-gray-500"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          {diagram.description}
        </motion.p>
      </div>

      {/* Interactive highlight overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-blue-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: isSelected ? 0.1 : 0 }}
        whileHover={{ opacity: 0.05 }}
      />
    </motion.div>
  )
}

const DiagramSelectionGrid = ({
  currentStep = 1,
  availableDiagrams = [],
  selectedDiagram,
  handleDiagramSelection,
}: {
  currentStep: number
  availableDiagrams: any[]
  selectedDiagram: string | null
  handleDiagramSelection: (id: string) => void
}) => {
  if (currentStep !== 1) return null

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">
        Choose a Diagram Type
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableDiagrams.map((diagram) => (
          <DiagramOption
            key={diagram.id}
            diagram={diagram}
            isSelected={selectedDiagram === diagram.id}
            onSelect={handleDiagramSelection}
          />
        ))}
      </div>

      {/* Helper text */}
      <p className="text-sm text-gray-500">
        Select a diagram type to continue. You can customize its appearance in
        the next step.
      </p>
    </div>
  )
}

export default DiagramSelectionGrid
