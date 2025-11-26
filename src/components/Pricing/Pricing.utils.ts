export const DiagramsAllowed = 20

export const frequencies = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually' },
]
export const tiers = [
  {
    name: 'Hobby',
    id: 'tier-hobby',
    href: '/login',
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
    href: '/login',
    featured: true, // Featured plan
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
    href: '/login',
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
