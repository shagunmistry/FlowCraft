'use client'

import { ColorDropdown } from './ColorDropdown'

interface DiagramControlsProps {
  colorPalette: string
  setColorPalette: (value: string) => void
  complexityLevel: string
  setComplexityLevel: (value: string) => void
}

export function DiagramControls({
  colorPalette,
  setColorPalette,
  complexityLevel,
  setComplexityLevel
}: DiagramControlsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label htmlFor="color-palette" className="block text-sm font-medium text-gray-700 mb-1">
          Color Palette
        </label>
        <ColorDropdown 
          value={colorPalette} 
          onChange={setColorPalette}
        />
      </div>
      
      <div>
        <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 mb-1">
          Complexity Level
        </label>
        <select
          id="complexity"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          value={complexityLevel}
          onChange={(e) => setComplexityLevel(e.target.value)}
        >
          <option>Simple</option>
          <option>Medium (default)</option>
          <option>Complex</option>
        </select>
      </div>
    </div>
  )
}