'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  ArrowDownTrayIcon,
  PhotoIcon,
  CodeBracketIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline'
import { toPng } from 'html-to-image'
import { exportAsPdf } from '@/lib/export-utils'
import { track } from '@/lib/analytics'

interface DownloadMenuProps {
  contentRef: React.RefObject<HTMLDivElement | null>
  title: string
  type: string
}

function downloadSVG(svgContent: string, filename = 'diagram') {
  const parser = new DOMParser()
  const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml')
  const svgElement = svgDoc.querySelector('svg')

  if (!svgElement) return

  if (!svgElement.hasAttribute('width')) svgElement.setAttribute('width', '800')
  if (!svgElement.hasAttribute('height'))
    svgElement.setAttribute('height', '600')

  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svgElement)

  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.svg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function getExportTarget(
  contentRef: React.RefObject<HTMLDivElement | null>,
  isFlowDiagram: boolean,
): HTMLElement | null {
  if (isFlowDiagram) {
    return document.querySelector('.react-flow__viewport') as HTMLElement | null
  }
  return contentRef.current
}

export default function DownloadMenu({
  contentRef,
  title,
  type,
}: DownloadMenuProps) {
  const filename = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'diagram'
  const lowerType = type.toLowerCase()
  const isFlowDiagram = lowerType === 'flow diagram'
  const isSvgType =
    ['infographic', 'mermaid'].includes(lowerType) ||
    (!['illustration', 'generated_image', 'flow diagram', 'chart'].includes(
      lowerType,
    ))

  const handleDownloadPng = async () => {
    track('export_clicked', { format: 'png' })
    const target = getExportTarget(contentRef, isFlowDiagram)
    if (!target) return
    try {
      const dataUrl = await toPng(target, {
        backgroundColor: '#ffffff',
        pixelRatio: 3,
      })
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('PNG export failed:', err)
    }
  }

  const handleDownloadSvg = () => {
    track('export_clicked', { format: 'svg' })
    const target = getExportTarget(contentRef, isFlowDiagram)
    if (!target) return
    const svgElement = target.querySelector('svg')
    if (!svgElement) return
    const svgContent = new XMLSerializer().serializeToString(svgElement)
    downloadSVG(svgContent, filename)
  }

  const handleDownloadPdf = async () => {
    track('export_clicked', { format: 'pdf' })
    const target = getExportTarget(contentRef, isFlowDiagram)
    if (!target) return
    try {
      await exportAsPdf(target, `${filename}.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
    }
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className="rounded-sm p-2 text-fog transition-all duration-150 hover:bg-graphite hover:text-signal"
        title="Download"
        aria-label="Download"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-sm border border-rule bg-graphite py-1 shadow-2xl shadow-black/60 focus:outline-none">
          <div className="border-b border-rule px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.28em] text-signal">
            ▸ Export
          </div>
          <DownloadItem
            onClick={handleDownloadPng}
            icon={PhotoIcon}
            label="Download as PNG"
            ext="png"
          />
          {isSvgType && (
            <DownloadItem
              onClick={handleDownloadSvg}
              icon={CodeBracketIcon}
              label="Download as SVG"
              ext="svg"
            />
          )}
          <DownloadItem
            onClick={handleDownloadPdf}
            icon={DocumentIcon}
            label="Download as PDF"
            ext="pdf"
          />
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

function DownloadItem({
  onClick,
  icon: Icon,
  label,
  ext,
}: {
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
  ext: string
}) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={`group flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
            active ? 'bg-ink text-signal' : 'text-paper/80'
          }`}
        >
          <Icon
            className={`h-4 w-4 ${active ? 'text-signal' : 'text-fog'}`}
          />
          <span className="flex-1 text-left">{label}</span>
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.22em] ${
              active ? 'text-signal' : 'text-fog'
            }`}
          >
            .{ext}
          </span>
        </button>
      )}
    </Menu.Item>
  )
}
