import { Analytics } from '@vercel/analytics/react'
import Navbar from '@/components/Navbar'

import { Footer } from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Startup Costs Calculator - FlowCraft',
  description: 'Calculate the costs of starting a new business with FlowCraft',
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main>
        <Navbar />
        <div className="relative">{children}</div>
      </main>
      <Footer />
      <Analytics />
    </>
  )
}
