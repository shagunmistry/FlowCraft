import React, { useState } from 'react'
import { Menu } from '@headlessui/react'
import { OptionType } from '@/lib/utils'
import clsx from 'clsx'

const DIAGRAM_CATEGORIES = {
  ALL: 'All',
  FLOW: 'Flow',
  DATA: 'Data',
  SOFTWARE: 'Software',
  PLANNING: 'Planning',
} as const

type CategoryKey = keyof typeof DIAGRAM_CATEGORIES

type SpecEntry = {
  type: OptionType
  description: string
  badge?: string
}

const diagramOptions: Record<Exclude<CategoryKey, 'ALL'>, SpecEntry[]> = {
  FLOW: [
    { type: 'Flowchart', description: 'Process flows & decision paths' },
    {
      type: 'Sequence Diagram',
      description: 'Interactions between components',
    },
    { type: 'State Diagram', description: 'States & transitions of a system' },
    { type: 'User Journey', description: 'User experiences step by step' },
    { type: 'Block Diagram', description: 'Components & their connections' },
  ],
  DATA: [
    { type: 'Pie Chart', description: 'Proportional data in segments' },
    { type: 'Quadrant Chart', description: 'Items across four sections' },
    { type: 'Sankey', description: 'Flow quantities with variable arrows' },
    { type: 'XY Chart', description: 'Two-dimensional data points' },
    { type: 'Radar', description: 'Compare variables across axes' },
    { type: 'Treemap', description: 'Hierarchies as nested rectangles' },
  ],
  SOFTWARE: [
    { type: 'Class Diagram', description: 'Object-oriented system structure' },
    {
      type: 'Entity Relationship Diagram',
      description: 'Relationships between entities',
    },
    {
      type: 'Requirement Diagram',
      description: 'Requirements & dependencies',
    },
    { type: 'Git Graph', description: 'Git branches & merges' },
    { type: 'C4 Diagram', description: 'Architecture at multiple levels' },
    { type: 'Packet', description: 'Network packet structures' },
    { type: 'Architecture', description: 'System architecture' },
    { type: 'ZenUML', description: 'Text-based UML sequences' },
  ],
  PLANNING: [
    { type: 'Gantt', description: 'Project tasks & timelines' },
    { type: 'Mindmaps', description: 'Hierarchical idea maps' },
    { type: 'Timeline', description: 'Events in chronological order' },
    { type: 'Kanban', description: 'Work progress across stages' },
  ],
}

const featuredOptions: SpecEntry[] = [
  {
    type: 'Illustration',
    description: 'Editorial vector graphics',
    badge: 'New',
  },
  {
    type: 'Infographic',
    description: 'Complex info rendered visually',
    badge: 'New',
  },
]

const DiagramSelectionGrid = ({
  selectedOption,
  setSelectedOption,
  setVisionDescription,
  setColorPalette,
  setComplexityLevel,
  highlightedType,
  hideTextarea = false,
}: {
  selectedOption: OptionType
  setSelectedOption: (option: OptionType) => void
  setVisionDescription: (description: string) => void
  setColorPalette: (palette: string) => void
  setComplexityLevel: (level: string) => void
  highlightedType?: OptionType
  hideTextarea?: boolean
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('ALL')

  const colorPaletteOptions = [
    'Default',
    'Monochromatic',
    'Complementary',
    'Analogous',
  ]
  const complexityOptions = [
    'Medium (default)',
    'Simple',
    'Detailed',
    'Complex',
  ]

  const [selectedColorPalette, setSelectedColorPalette] = useState(
    colorPaletteOptions[0],
  )
  const [selectedComplexity, setSelectedComplexity] = useState(
    complexityOptions[0],
  )

  const allOptions: SpecEntry[] = [
    ...featuredOptions,
    ...Object.values(diagramOptions)
      .flat()
      .sort((a, b) =>
        (a.type as string).localeCompare(b.type as string),
      ),
  ]

  const visible: SpecEntry[] =
    selectedCategory === 'ALL'
      ? allOptions
      : diagramOptions[selectedCategory]

  return (
    <div className="space-y-8">
      {/* Category tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-rule">
        {(Object.keys(DIAGRAM_CATEGORIES) as CategoryKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={clsx(
              'relative px-4 py-3 text-sm transition-colors',
              selectedCategory === key
                ? 'text-signal'
                : 'text-paper/60 hover:text-paper',
            )}
          >
            {DIAGRAM_CATEGORIES[key]}
            {selectedCategory === key && (
              <span className="absolute bottom-0 left-2 right-2 h-px bg-signal" />
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map(({ type, description, badge }) => {
          const isSelected = selectedOption === type
          const isHighlighted = highlightedType === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedOption(type)}
              className={clsx(
                'group relative flex flex-col gap-3 p-5 text-left transition-colors duration-200',
                isSelected
                  ? 'bg-signal text-ink'
                  : isHighlighted
                    ? 'bg-signal/10 text-paper'
                    : 'bg-graphite text-paper hover:bg-ink',
              )}
            >
              {badge && (
                <div className="flex items-center justify-end">
                  <span
                    className={clsx(
                      'rounded-sm border px-1.5 py-0.5 text-xs',
                      isSelected
                        ? 'border-ink bg-ink text-signal'
                        : 'border-signal bg-signal/10 text-signal',
                    )}
                  >
                    {badge}
                  </span>
                </div>
              )}
              <div>
                <h4
                  className={clsx(
                    'font-serif text-xl leading-tight',
                    isSelected ? 'text-ink' : 'text-paper',
                  )}
                >
                  {type}
                </h4>
                <p
                  className={clsx(
                    'mt-1 text-xs leading-relaxed',
                    isSelected
                      ? 'text-ink/70'
                      : isHighlighted
                        ? 'text-paper/80'
                        : 'text-paper/50',
                  )}
                >
                  {description}
                </p>
              </div>
              {isHighlighted && !isSelected && (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 text-xs text-signal">
                  <span className="h-1 w-1 rounded-full bg-signal" />
                  suggested
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Vision description (when not hidden) */}
      {!hideTextarea && (
        <div className="space-y-3" id="vision-description">
          <label className="block text-sm text-fog">Describe the vision</label>
          <div className="overflow-hidden rounded-sm border border-rule bg-graphite">
            <textarea
              className="min-h-32 w-full resize-none border-0 bg-transparent p-4 text-[15px] leading-relaxed text-paper placeholder:text-fog focus:outline-none focus:ring-0"
              placeholder="Describe what you want to visualize. The more detail you give, the better it drafts."
              rows={4}
              onChange={(e) => setVisionDescription(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Advanced options */}
      <div className="space-y-4">
        <div className="text-sm text-fog">Advanced (optional)</div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DraftingSelect
            label="Color palette"
            value={selectedColorPalette}
            options={colorPaletteOptions}
            onChange={(v) => {
              setSelectedColorPalette(v)
              setColorPalette(v)
            }}
          />
          <DraftingSelect
            label="Complexity"
            value={selectedComplexity}
            options={complexityOptions}
            onChange={(v) => {
              setSelectedComplexity(v)
              setComplexityLevel(v)
            }}
          />
        </div>
      </div>
    </div>
  )
}

function DraftingSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-fog">
        {label}
      </label>
      <Menu as="div" className="relative">
        <Menu.Button className="flex w-full items-center justify-between rounded-sm border border-rule bg-graphite px-4 py-3 text-left text-sm text-paper transition-colors hover:border-signal/40">
          <span>{value}</span>
          <span className="text-xs text-fog">▾</span>
        </Menu.Button>

        <Menu.Items className="absolute z-20 mt-1 w-full overflow-hidden rounded-sm border border-rule bg-graphite shadow-2xl shadow-black/40">
          {options.map((option) => (
            <Menu.Item key={option}>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => onChange(option)}
                  className={clsx(
                    'block w-full px-4 py-2.5 text-left text-sm transition-colors',
                    active && 'bg-ink',
                    value === option
                      ? 'text-signal'
                      : 'text-paper/80 hover:text-paper',
                  )}
                >
                  {option}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>
    </div>
  )
}

export default DiagramSelectionGrid
