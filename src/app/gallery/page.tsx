'use client'

import FAQs from '@/components/FAQ'
import PageWithNavbar from '@/components/PageWithNavbar'
import PublicGallery from '@/components/Gallery/Gallery'

export default function Pricing() {
  return (
    <PageWithNavbar>
      <PublicGallery user_id={null} />
      <FAQs />
    </PageWithNavbar>
  )
}
