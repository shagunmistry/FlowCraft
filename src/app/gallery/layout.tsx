import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = buildMetadata({
  title: 'AI Diagram Examples: Flowcharts, Mind Maps and More | FlowCraft',
  description:
    'Browse diagrams created by the FlowCraft community. Flowcharts, sequence diagrams, mind maps, and more — built with AI.',
  path: '/gallery',
  keywords: ['diagram gallery', 'flowchart examples', 'ai diagram examples'],
})

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
