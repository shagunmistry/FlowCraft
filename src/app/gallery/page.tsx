'use client'

import FAQs from '@/components/FAQ'
import Navbar from '@/components/Navbar'
import PublicGallery from '@/components/Gallery/Gallery'
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
      <PublicGallery user_id={null} />
      <FAQs />
    </>
  )
}
