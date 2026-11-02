import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = buildMetadata({
  title: 'Support | FlowCraft',
  description:
    'Get help with FlowCraft. Contact our team for support, feature requests, or feedback about AI-powered diagram generation.',
  path: '/support',
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
