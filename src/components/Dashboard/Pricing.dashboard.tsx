'use client'
import PricingTiers from '../Pricing.landing'

export default function PricingOnDashboard({
  goToCheckout = false,
}: {
  goToCheckout: boolean
}) {
  return <PricingTiers goToCheckout={goToCheckout} />
}
