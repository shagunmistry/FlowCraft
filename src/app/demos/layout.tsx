'use client'

import { Analytics } from '@vercel/analytics/react'
import Navbar from '@/components/Navbar'

import 'reactflow/dist/style.css'
import Footer from '@/components/Footer'

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
      <Analytics />
    </>
  )
}
