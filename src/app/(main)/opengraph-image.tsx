import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template'

export const runtime = 'edge'
export const alt = 'FlowCraft: AI-powered diagrams'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function OgImage() {
  return renderOgImage({
    title: 'Generate diagrams with AI',
    subtitle:
      'Flowcharts, mind maps, sequence diagrams, and more, in seconds.',
  })
}
