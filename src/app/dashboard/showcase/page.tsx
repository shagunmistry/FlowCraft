import FAQs from '@/components/FAQ'
import PublicGallery from '@/components/Gallery/Gallery'
import { createClient } from '@/lib/supabase-auth/server'
import { redirect } from 'next/navigation'

export default async function DashboardPublicGallery() {
  const sbClient = await createClient()
  const { data: userData, error } = await sbClient.auth.getUser()
  

  if (error || userData?.user === null) {
    return redirect('/login')
  }

  return (
    <>
      <PublicGallery user_id={userData.user.id} />
      <FAQs />
    </>
  )
}
