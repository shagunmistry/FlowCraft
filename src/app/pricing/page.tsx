'use client'

import FAQs from '@/components/FAQ'
import PageWithNavbar from '@/components/PageWithNavbar'
import PricingTemplate from '@/components/Pricing/Pricing'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function PricingContent() {
  const searchParams = useSearchParams()
  const sourcePage = searchParams.get('sourcePage') as
    | 'landing'
    | 'dashboard'
    | 'mermaid'
    | 'chart'
  return (
    <PricingTemplate
      sourcePage={sourcePage || 'landing'}
      shouldGoToCheckout={sourcePage !== 'landing'}
    />
  )
}

export default function Pricing() {
  return (
    <PageWithNavbar>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <PricingContent />
      </Suspense>
      <FAQs />
    </PageWithNavbar>
  )
}
