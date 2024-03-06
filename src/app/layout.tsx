import { type Metadata } from 'next'

import '@/styles/tailwind.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: {
    template: '%s - FlowCraft',
    default:
      'FlowCraft - Generate diagrams with an AI. No more dragging and dropping from scratch.',
  },
  description:
    'Generate diagrams with a click. No more dragging and dropping from scratch.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-white antialiased">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
        />
      </head>
      <body className="flex min-h-full">
        <div className="w-full">{children}</div>
        <Analytics />
      </body>
    </html>
  )
}
