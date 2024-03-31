import FAQs from '@/components/FAQ'
import Navbar from '@/components/Navbar'
import PricingTemplate from '@/components/Pricing/Pricing.template'

export default function Pricing() {
  return (
    <>
      <Navbar />
      <PricingTemplate sourcePage="landing" shouldGoToCheckout={false} />
      <FAQs />
    </>
  )
}
