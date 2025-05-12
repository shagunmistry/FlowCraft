import { type Metadata } from 'next'

import '@/styles/tailwind.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: {
    template: '%s - FlowCraft VS Code Extension',
    default:
      'FlowCraft - Generate diagrams with an AI. No more dragging and dropping from scratch.',
  },
  description:
    'Generate Code Diagrams with a click. No more dragging and dropping from scratch.',
}

export default function VsCodePageLaytout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <GoogleAnalytics gaId="AW-16550420965" />

      <main>
        {/* <Navbar /> */}
        <div className="relative">{children}</div>
      </main>
      {/* <Footer /> */}
      <Analytics />
    </>
  )
}
