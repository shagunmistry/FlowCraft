'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-auth/client'
import Navbar from '@/components/Navbar'

export default function PageWithNavbar({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()
      setIsAuthenticated(!error && !!data.user)
    }
    checkAuth()
  }, [])

  return (
    <>
      <Navbar />
      <div className={isAuthenticated ? 'pt-16' : 'pt-[72px]'}>
        {children}
      </div>
    </>
  )
}
