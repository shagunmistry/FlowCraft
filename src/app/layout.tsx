import { type Metadata } from 'next'

import '@/styles/tailwind.css'

import { GoogleAnalytics } from '@next/third-parties/google'
import MicrosoftClarity from '@/components/MicrosoftClarity'
import { LoadingProvider } from '@/lib/LoadingProvider'
import ThemeProvider from '@/components/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'
import { SITE_URL, SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s - FlowCraft',
    default:
      'FlowCraft - Generate diagrams with an AI. No more dragging and dropping from scratch.',
  },
  description:
    'Generate diagrams with a click. No more dragging and dropping from scratch.',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description:
    'FlowCraft creates flowcharts, sequence diagrams, mind maps, and knowledge graphs with AI.',
  sameAs: [
    'https://twitter.com/flowcraftapp',
    'https://www.linkedin.com/company/flowcraftapp',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/blogs?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="style"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400;500&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <GoogleAnalytics gaId="AW-16550420965" />
      <MicrosoftClarity />
      {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      )}
      <body className="flex min-h-full bg-ink text-paper">
        <ThemeProvider>
          <LoadingProvider>
            <div className="w-full">{children}</div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
