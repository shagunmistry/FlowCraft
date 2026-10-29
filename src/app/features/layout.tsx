import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = buildMetadata({
  title: 'AI Diagram Generator Features | FlowCraft',
  description:
    'Explore FlowCraft features: AI-generated diagrams, mind maps, flowcharts, sequence diagrams, user journeys, knowledge graphs, and more.',
  path: '/features',
  keywords: [
    'flowcraft features',
    'ai flowchart generator',
    'diagram features',
    'mermaid editor',
  ],
})

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
