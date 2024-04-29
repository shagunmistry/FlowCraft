'use client'

import FAQs from '@/components/FAQ'
import Navbar from '@/components/Navbar'
import PricingTemplate from '@/components/Pricing/Pricing'
import { useSearchParams } from 'next/navigation'

export default function Pricing() {
  const searchParams = useSearchParams()
  const sourcePage = searchParams.get('sourcePage') as
    | 'landing'
    | 'dashboard'
    | 'mermaid'
    | 'chart'
  return (
    <>
      <Navbar />
      <PricingTemplate
        sourcePage={sourcePage || 'landing'}
        shouldGoToCheckout={sourcePage !== 'landing'}
      />
      <FAQs />
    </>
  )
}
