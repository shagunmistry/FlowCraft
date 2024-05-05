import { type Metadata } from 'next'

import '@/styles/tailwind.css'
import Script from 'next/script'

import { GoogleAnalytics } from '@next/third-parties/google'
import MicrosoftClarity from '@/components/MicrosoftClarity'

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
      <GoogleAnalytics gaId="AW-16550420965" />
      <MicrosoftClarity />
      <body className="flex min-h-full">
        <div className="w-full">{children}</div>
      </body>
    </html>
  )
}
