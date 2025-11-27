import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-auth/server';
import ImageStudioClient from './ImageStudioClient';

export default async function ImageStudioPage() {
  const sbClient = await createClient();
  const { data: userData, error } = await sbClient.auth.getUser();

  if (error || userData?.user === null) {
    return redirect('/login');
  }

  return <ImageStudioClient user={userData.user} />;
}