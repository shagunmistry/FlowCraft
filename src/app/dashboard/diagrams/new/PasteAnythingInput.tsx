import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { InputClassification, OptionType } from '@/lib/utils'
import DetectionChip from './DetectionChip'
import clsx from 'clsx'

const ACCEPTED_EXTENSIONS = [
  '.md',
  '.txt',
  '.json',
  '.yaml',
  '.yml',
  '.sql',
  '.py',
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
]
const MAX_FILE_SIZE = 50 * 1024 // 50KB

export default function PasteAnythingInput({
  value,
  onChange,
  onClassify,
  classification,
  isClassifying,
  onOverride,
  fileName,
  onFileNameChange,
  selectedOption,
}: {
  value: string
  onChange: (text: string) => void
  onClassify: (text: string, filename?: string) => void
  classification: InputClassification | null
  isClassifying: boolean
  onOverride: (type: OptionType) => void
  fileName: string | null
  onFileNameChange: (name: string | null) => void
  selectedOption?: OptionType
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTextChange = useCallback(
    (text: string) => {
      onChange(text)
      onClassify(text, fileName || undefined)
      setFileError(null)
    },
    [onChange, onClassify, fileName],
  )

  const handleFileRead = useCallback(
    (file: File) => {
      setFileError(null)
      const ext = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!ACCEPTED_EXTENSIONS.includes(ext)) {
        setFileError(
          `Unsupported file type. Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}`,
        )
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError('File too large (max 50KB)')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        onFileNameChange(file.name)
        onChange(text)
        onClassify(text, file.name)
      }
      reader.onerror = () => setFileError('Failed to read file')
      reader.readAsText(file)
    },
    [onChange, onClassify, onFileNameChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFileRead(file)
    },
    [handleFileRead],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const clearFile = useCallback(() => {
    onFileNameChange(null)
    onChange('')
    setFileError(null)
    if (textareaRef.current) textareaRef.current.focus()
  }, [onChange, onFileNameChange])

  return (
    <div className="space-y-3">
      <div
        className={clsx(
          'relative overflow-hidden rounded-sm border transition-colors duration-200',
          isDragOver
            ? 'border-signal bg-signal/5'
            : value
              ? 'border-rule bg-graphite'
              : 'border-rule bg-graphite/60 hover:border-signal/40',
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* corner ticks */}
        <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-signal/60" />
        <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-signal/60" />
        <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-signal/60" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-signal/60" />

        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-ink/90 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-2 text-signal">
                <span className="text-sm">Drop file to upload</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <textarea
          ref={textareaRef}
          className={clsx(
            'min-h-[180px] w-full resize-none border-0 bg-transparent px-5 py-5 text-[15px] leading-relaxed text-paper placeholder:text-fog focus:outline-none focus:ring-0',
            fileName && 'font-mono text-sm',
          )}
          placeholder="Paste meeting notes, code, SQL, JSON, markdown — or just describe what you want drafted."
          value={value}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={7}
        />

        <div className="flex items-center justify-between border-t border-rule bg-ink/60 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group inline-flex items-center gap-2 text-xs text-fog transition-colors hover:text-signal"
            >
              <span className="inline-block h-px w-4 bg-current transition-all group-hover:w-6" />
              Upload file
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(',')}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileRead(file)
                e.target.value = ''
              }}
            />

            {fileName && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 rounded-sm border border-signal/30 bg-signal/10 px-2 py-1 text-xs text-signal"
              >
                {fileName}
                <button
                  onClick={clearFile}
                  className="ml-0.5 hover:text-paper"
                  aria-label="Remove file"
                >
                  ✕
                </button>
              </motion.span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-fog">
            {isClassifying && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-1.5"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
                Analyzing…
              </motion.span>
            )}
            {value.length > 0 && !isClassifying && (
              <span>{value.length.toLocaleString()} chars</span>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {fileError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-400"
          >
            {fileError}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {classification && !isClassifying && (
          <DetectionChip
            classification={classification}
            onOverride={onOverride}
            selectedOption={selectedOption}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
