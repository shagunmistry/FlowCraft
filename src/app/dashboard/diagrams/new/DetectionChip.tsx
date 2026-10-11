import React, { Fragment } from 'react'
import { motion } from 'framer-motion'
import { Menu, Transition } from '@headlessui/react'
import { InputClassification, OptionType } from '@/lib/utils'
import clsx from 'clsx'

const INPUT_TYPE_LABELS: Record<string, string> = {
  plain_text: 'Text description',
  meeting_transcript: 'Meeting transcript',
  python_code: 'Python code',
  javascript_code: 'JavaScript / TypeScript',
  generic_code: 'Source code',
  markdown_bullets: 'Markdown / list',
  json_data: 'JSON data',
  yaml_data: 'YAML data',
  sql_schema: 'SQL schema',
  api_spec_openapi: 'OpenAPI spec',
}

const ALL_DIAGRAM_TYPES: OptionType[] = [
  'Flowchart',
  'Sequence Diagram',
  'Class Diagram',
  'State Diagram',
  'Entity Relationship Diagram',
  'User Journey',
  'Gantt',
  'Pie Chart',
  'Quadrant Chart',
  'Requirement Diagram',
  'Mindmaps',
  'Timeline',
  'Sankey',
  'XY Chart',
  'Block Diagram',
  'Architecture',
  'Kanban',
  'Radar',
  'Treemap',
  'Infographic',
]

export default function DetectionChip({
  classification,
  onOverride,
  selectedOption,
}: {
  classification: InputClassification
  onOverride: (type: OptionType) => void
  selectedOption?: OptionType
}) {
  const inputLabel =
    INPUT_TYPE_LABELS[classification.inputType] || classification.inputType

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-wrap items-center gap-3 rounded-sm border border-signal/30 bg-signal/5 px-4 py-3"
    >
      <span className="inline-flex items-center gap-1.5 text-xs text-signal">
        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
        Detected
      </span>
      <span className="rounded-sm border border-signal/30 bg-ink px-2 py-0.5 text-xs text-paper">
        {inputLabel}
      </span>

      <span className="text-xs text-fog">suggests</span>

      <Menu as="div" className="relative">
        <Menu.Button className="group inline-flex items-center gap-1.5 rounded-sm border border-signal bg-signal/10 px-2.5 py-1 text-sm text-signal transition-colors hover:bg-signal/20">
          {selectedOption ?? classification.suggestedDiagram}
          <span className="text-xs">▾</span>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-150"
          enterFrom="opacity-0 scale-95 translate-y-1"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 z-50 mt-2 max-h-64 w-60 overflow-y-auto rounded-sm border border-rule bg-graphite py-1 shadow-2xl shadow-black/40 focus:outline-none">
            {ALL_DIAGRAM_TYPES.map((type) => (
              <Menu.Item key={type}>
                {({ active }) => (
                  <button
                    className={clsx(
                      'w-full px-3 py-2 text-left text-sm transition-colors',
                      active && 'bg-ink',
                      type === (selectedOption ?? classification.suggestedDiagram)
                        ? 'font-medium text-signal'
                        : 'text-paper/80 hover:text-paper',
                    )}
                    onClick={() => onOverride(type)}
                  >
                    {type}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>

      {classification.confidence >= 0.8 && (
        <span className="ml-auto text-xs text-fog">
          {Math.round(classification.confidence * 100)}% match
        </span>
      )}
    </motion.div>
  )
}
