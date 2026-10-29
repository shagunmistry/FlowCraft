import 'server-only'
import stripe from '@/lib/stripe'

export type PricingTier = {
  name: string
  id: 'tier-hobby' | 'tier-pro' | 'tier-teams'
  href: string
  featured: boolean
  description: string
  price: { monthly: string; annually: string }
  mainFeatures: string[]
  cta: string
}

export const DiagramsAllowed = 20

export const staticTiers: PricingTier[] = [
  {
    name: 'Hobby',
    id: 'tier-hobby',
    href: '/sign-up?src=pricing',
    featured: false,
    description: 'Perfect for individual users',
    price: { monthly: '$8', annually: '$70' },
    mainFeatures: [
      `${DiagramsAllowed} AI-generated Diagrams per month`,
      'Access to Complex Diagrams (UML, Sankey, Mindmaps)',
      'Export and Share',
      'Customer support',
    ],
    cta: 'Get started',
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '/sign-up?src=pricing',
    featured: true,
    description: 'Perfect for professionals',
    price: { monthly: '$15', annually: '$150' },
    mainFeatures: [
      'All Hobby features',
      'Unlimited AI-generated Diagrams',
      'Unlimited Complex Diagrams',
      'Access to new features first',
      'Private diagrams',
      'Priority Support',
    ],
    cta: 'Get started',
  },
  {
    name: 'Teams',
    id: 'tier-teams',
    href: '/sign-up?src=pricing',
    featured: false,
    description: 'For teams and organizations',
    price: { monthly: '$49', annually: '$490' },
    mainFeatures: [
      'All Pro features',
      'Team workspaces',
      'Collaboration tools',
      'Shared diagram library',
      'Admin controls',
      'Dedicated support',
    ],
    cta: 'Contact sales',
  },
]

function formatStripeAmount(
  unitAmount: number | null,
  currency: string,
): string | null {
  if (unitAmount == null) return null
  const dollars = unitAmount / 100
  const isWhole = Number.isInteger(dollars)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(dollars)
}

async function retrievePrice(
  priceId: string | undefined,
  label: string,
): Promise<string> {
  if (!priceId) {
    throw new Error(
      `[pricing] Missing Stripe price ID env var for ${label}. Check STRIPE_*_PLAN_ID vars.`,
    )
  }
  try {
    const price = await stripe.prices.retrieve(priceId)
    const formatted = formatStripeAmount(price.unit_amount, price.currency)
    if (!formatted) {
      throw new Error(
        `[pricing] Stripe price ${priceId} (${label}) has no unit_amount`,
      )
    }
    console.log(
      `[pricing] ${label} (${priceId}): ${formatted} ${price.currency}`,
    )
    return formatted
  } catch (err: any) {
    console.error(
      `[pricing] Failed to retrieve Stripe price ${priceId} (${label}):`,
      err?.message ?? err,
    )
    throw err
  }
}

export async function fetchPricingTiers(): Promise<PricingTier[]> {
  const [hobbyMonthly, hobbyYearly, proMonthly, proYearly] = await Promise.all([
    retrievePrice(process.env.STRIPE_HOBBY_MONTHLY_PLAN_ID, 'Hobby monthly'),
    retrievePrice(process.env.STRIPE_HOBBY_YEARLY_PLAN_ID, 'Hobby yearly'),
    retrievePrice(process.env.STRIPE_PRO_MONTHLY_PLAN_ID, 'Pro monthly'),
    retrievePrice(process.env.STRIPE_PRO_YEARLY_PLAN_ID, 'Pro yearly'),
  ])

  return staticTiers.map((tier) => {
    if (tier.id === 'tier-hobby') {
      return {
        ...tier,
        price: { monthly: hobbyMonthly, annually: hobbyYearly },
      }
    }
    if (tier.id === 'tier-pro') {
      return {
        ...tier,
        price: { monthly: proMonthly, annually: proYearly },
      }
    }
    return tier
  })
}
