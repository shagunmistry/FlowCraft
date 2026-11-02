import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = buildMetadata({
  title: 'Blog | FlowCraft',
  description:
    'Insights, tutorials, and product updates from FlowCraft. Learn how to create better diagrams with AI.',
  path: '/blogs',
  keywords: ['flowchart blog', 'diagram tutorials', 'ai diagrams', 'flowcraft'],
})

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main>
        <Navbar />
        <div className="relative pt-16 lg:pt-[72px]">{children}</div>
      </main>
      <Footer />
      {/* Analytics is mounted in the root layout to avoid double-counting page views. */}
    </>
  )
}
