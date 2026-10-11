import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdmin } from './lib/admin-api'

export const dynamic = 'force-dynamic'

const tabs = [
  { href: '/dashboard/admin', label: 'Overview' },
  { href: '/dashboard/admin/diagrams', label: 'Diagrams' },
  { href: '/dashboard/admin/users', label: 'Users' },
  { href: '/dashboard/admin/engagement', label: 'Engagement' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAdmin()
  if (!ok) redirect('/dashboard')

  return (
    <div className="px-6 py-6">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <nav className="flex gap-4 text-sm">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="text-fog hover:text-black"
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  )
}
