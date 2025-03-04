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

  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null)

  return (
    <>
      <div className="mb-10">
        <h3 className="mb-6 font-serif text-xl font-medium">
          Choose output type
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {['Illustration', 'Infographic', 'Diagram'].map((type) => (
            <motion.div
              key={type}
              className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 ${
                hoveredCard === type
                  ? 'border-indigo-500 shadow-md'
                  : 'border-slate-200'
              }`}
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredCard(type)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <div className="mb-4 flex h-32 items-center justify-center">
                {type === 'Illustration' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-16 w-16 text-indigo-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                    />
                    <circle cx="6" cy="8" r="2" strokeWidth="1.5" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {type === 'Infographic' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-16 w-16 text-fuchsia-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8 13v-1m4 1v-3m4 3V8M12 21l5-5-2.5-2.5L17 11l-3-3-2.5 2.5L8 7 3 12"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 9h18M3 20h18"
                    />
                  </svg>
                )}
                {type === 'Diagram' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-16 w-16 text-purple-500"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                      strokeWidth="1.5"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M10 6.5h4M17.5 10v4M6.5 14v-4M10 17.5h4"
                    />
                  </svg>
                )}
              </div>
              <h4 className="mb-2 text-center font-serif text-lg font-medium">
                {type}
              </h4>
              <p className="text-center text-sm text-slate-600">
                {type === 'Illustration' &&
                  'Vector graphics ideal for storytelling and decoration.'}
                {type === 'Infographic' &&
                  'Data visualization with a narrative structure.'}
                {type === 'Diagram' &&
                  'Process flows, hierarchies and structured relationships.'}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="mb-6 font-serif text-xl font-medium">
          Describe your vision
        </h3>
        <div className="relative">
          <textarea
            className="min-h-40 w-full rounded-xl border-2 border-slate-200 p-5 pr-20 text-lg transition-all duration-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Describe what you want to visualize... The more details you provide, the better!"
            rows={5}
          ></textarea>
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              type="button"
              className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200"
              title="Voice input"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
            <button
              type="button"
              className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200"
              title="AI suggestions"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <circle cx="15.5" cy="8.5" r="1.5" />
                <path d="M17 15c-2 2-5 2-7 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="mb-10">
        <div className="mb-6 flex items-center">
          <h3 className="font-serif text-xl font-medium">Advanced options</h3>
          <span className="ml-2 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
            Optional
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Color palette
            </label>
            <select className="w-full rounded-lg border-2 border-slate-200 p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option>Brand colors (default)</option>
              <option>Monochromatic</option>
              <option>Complementary</option>
              <option>Analogous</option>
              <option>Custom...</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Complexity level
            </label>
            <select className="w-full rounded-lg border-2 border-slate-200 p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option>Medium (default)</option>
              <option>Simple</option>
              <option>Detailed</option>
              <option>Complex</option>
            </select>
          </div>
        </div>
      </div>
    </>
  )
}

export default DiagramSelectionGrid
