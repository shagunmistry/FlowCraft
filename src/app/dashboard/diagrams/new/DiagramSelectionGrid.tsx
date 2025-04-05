import React from 'react'
import { Brush, ChevronDownIcon, NotebookPenIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { MicrophoneIcon } from '@heroicons/react/20/solid'
import { OptionType } from '@/lib/utils'
import { Menu } from '@headlessui/react'

const DiagramSelectionGrid = ({
  _setSelectedOption,
  setVisionDescription,
  setColorPalette,
  setComplexityLevel,
}: {
  _setSelectedOption: (option: OptionType) => void
  setVisionDescription: (description: string) => void
  setColorPalette: (palette: string) => void
  setComplexityLevel: (level: string) => void
}) => {
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null)
  const [colorDropdownOpen, setColorDropdownOpen] = React.useState(false)
  const [complexityDropdownOpen, setComplexityDropdownOpen] =
    React.useState(false)

  const colorPaletteOptions = [
    'Brand colors (default)',
    'Monochromatic',
    'Complementary',
    'Analogous',
    'Custom...',
  ]

  const complexityOptions = [
    'Medium (default)',
    'Simple',
    'Detailed',
    'Complex',
  ]

  const [selectedColorPalette, setSelectedColorPalette] = React.useState(
    colorPaletteOptions[0],
  )
  const [selectedComplexity, setSelectedComplexity] = React.useState(
    complexityOptions[0],
  )

  const availableOptions: OptionType[] = [
    'Illustration',
    'Infographic',
    // 'Diagram',
  ]

  const [_selectedOption, setSelectedOption] = React.useState<OptionType>(null)

  const handleOptionSelect = (option: OptionType) => {
    setSelectedOption(option)
    _setSelectedOption(option)
  }

  const handleColorPaletteChange = (palette: string) => {
    setSelectedColorPalette(palette)
    setColorPalette(palette)
    setColorDropdownOpen(false)
  }

  const handleComplexityChange = (level: string) => {
    setSelectedComplexity(level)
    setComplexityLevel(level)
    setComplexityDropdownOpen(false)
  }

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setColorDropdownOpen(false)
      setComplexityDropdownOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <>
      <div className="mb-10">
        <h3 className="mb-6 font-serif text-xl font-medium">Select One</h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {availableOptions.map((type) => (
            <motion.div
              key={type}
              className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 ${
                hoveredCard === type || _selectedOption === type
                  ? 'border-indigo-500 shadow-md'
                  : 'border-slate-200'
              } ${_selectedOption === type ? 'bg-indigo-50' : 'bg-white'}`}
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredCard(type)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => handleOptionSelect(type)}
            >
              <div className="mb-4 flex h-32 items-center justify-center">
                {type === 'Illustration' && (
                  <Brush
                    className="h-16 w-16 text-red-500"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {type === 'Infographic' && (
                  <NotebookPenIcon
                    className="h-16 w-16 text-blue-500"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {/* {type === 'Diagram' && (
                  <ChartArea
                    className="h-16 w-16 text-green-500"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )} */}
              </div>
              <h4 className="mb-2 text-center font-serif text-lg font-medium">
                {type}
              </h4>
              <p className="text-center text-sm text-slate-600">
                {type === 'Illustration' &&
                  'Vector graphics ideal for storytelling and decoration.'}
                {type === 'Infographic' &&
                  'Data visualization with a narrative structure.'}
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
            onChange={(e) => setVisionDescription(e.target.value)}
          ></textarea>
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              type="button"
              className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200"
              title="Voice input"
            >
              <MicrophoneIcon className="h-5 w-5" />
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

      {/* Advanced Options - Canva Style Dropdowns */}
      <div className="mb-10">
        <div className="mb-6 flex items-center">
          <h3 className="font-serif text-xl font-medium">Advanced options</h3>
          <span className="ml-2 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
            Optional
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Color Palette Dropdown - Canva Style */}
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Color palette
            </label>
            <Menu as="div" className="relative w-full">
              <Menu.Button className="flex w-full items-center justify-between rounded-lg border-2 border-slate-200 bg-white p-3 text-left text-slate-700 hover:bg-slate-50">
                <span>{selectedColorPalette}</span>
                <ChevronDownIcon
                  className="ui-open:rotate-180 h-5 w-5 transform text-slate-500 transition-transform"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Menu.Items className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {colorPaletteOptions.map((option) => (
                  <Menu.Item key={option}>
                    {({ active }) => (
                      <div
                        className={`cursor-pointer px-4 py-2 ${
                          active ? 'bg-indigo-50' : ''
                        } ${
                          selectedColorPalette === option
                            ? 'bg-indigo-50 font-medium text-indigo-600'
                            : 'text-slate-700'
                        }`}
                        onClick={() => setSelectedColorPalette(option)}
                      >
                        {option}
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Menu>
          </div>

          {/* Complexity Level Dropdown - Canva Style */}
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Complexity level
            </label>
            <Menu as="div" className="relative w-full">
              <Menu.Button className="flex w-full items-center justify-between rounded-lg border-2 border-slate-200 bg-white p-3 text-left text-slate-700 hover:bg-slate-50">
                <span>{selectedComplexity}</span>
                <ChevronDownIcon
                  className="ui-open:rotate-180 h-5 w-5 transform text-slate-500 transition-transform"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Menu.Items className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {complexityOptions.map((option) => (
                  <Menu.Item key={option}>
                    {({ active }) => (
                      <div
                        className={`cursor-pointer px-4 py-2 ${
                          active ? 'bg-indigo-50' : ''
                        } ${
                          selectedComplexity === option
                            ? 'bg-indigo-50 font-medium text-indigo-600'
                            : 'text-slate-700'
                        }`}
                        onClick={() => setSelectedComplexity(option)}
                      >
                        {option}
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </>
  )
}

export default DiagramSelectionGrid
