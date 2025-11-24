'use client'

import FAQs from '@/components/FAQ'
import Navbar from '@/components/Navbar'
import PublicGallery from '@/components/Gallery/Gallery'

export default function Pricing() {
  return (
    <>
      <Navbar />
      <PublicGallery user_id={null} />
      <FAQs />
    </>
  )
}
