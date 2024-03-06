import { supabase } from '@/lib/supabase'
import { notFound, redirect } from 'next/navigation'
import Editor from '@/components/editor'

export default async function PostPage({ params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, site:subdomain')
    .eq('id', decodeURIComponent(params.id))
    .single()

  const session = await supabase.auth.getSession()

  if (
    error ||
    !data ||
    (data.userId !== session.data.session && !session.data.session?.user)
  ) {
    console.error('Error: ', error, data)
    return notFound()
  }

  return <Editor post={data} />
}
