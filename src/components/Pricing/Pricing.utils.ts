export const DiagramsAllowed = 20

export const frequencies = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually' },
]
export const tiers = [
  {
    name: 'FlowCraft Hobby',
    id: 'tier-hobby',
    href: '/login',
    featured: true, // This plan is featured
    description: 'Perfect for individual users and small teams',
    price: { monthly: '$7.99', annually: '$63.99' },
    mainFeatures: [
      `${DiagramsAllowed} AI-generated Diagrams/Whiteboards per month`,
      'Access to AI-generated Complex Diagrams such as UML, Sankey, Mindmaps, and more',
      'Export and Share',
      'Customer support',
    ],
    cta: 'Start your Hobby trial!',
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '/login',
    featured: false,
    description:
      'Perfect for professionals. Get unlimited AI-generated visuals and upcoming features!',
    price: { monthly: '$12.99', annually: '$103.99' },
    mainFeatures: [
      'All features of the Hobby plan',
      'Unlimited AI-generated Flow Diagrams',
      'Unlimited AI-generated Complex Diagrams',
      'Access to new features first',
      'Team collaboration features (coming soon!)',
      'Priority Customer Support',
    ],
    cta: 'Start your Pro trial!',
  },
]
