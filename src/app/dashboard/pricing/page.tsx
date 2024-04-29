import FAQs from '@/components/FAQ'
import PricingTemplate from '@/components/Pricing/Pricing'
import { createClient } from '@/lib/supabase-auth/server'
import { redirect } from 'next/navigation'

export default async function DashboardPricingSignUp() {
  const sbClient = createClient()

  const { data: userData, error } = await sbClient.auth.getUser()

  if (error || userData?.user === null) {
    return redirect('/login')
  }

  return (
    <>
      <PricingTemplate sourcePage="dashboard" shouldGoToCheckout={true} />
      <FAQs />
    </>
  )
}
