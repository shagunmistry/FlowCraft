'use client'

import TryItGenerator from './TryItGenerator.client'
import { useIsAuthenticated } from './AuthCta.client'

// Signed-in users already have the full workbench, so the free generator is for visitors only.
export default function HeroGenerator() {
  const authed = useIsAuthenticated()
  if (authed) return null
  return <TryItGenerator />
}
