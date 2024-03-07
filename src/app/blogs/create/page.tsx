import BlogEditor from '@/components/Blogs/Create/BlogEditor'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-auth/server'
import { redirect } from 'next/navigation'

export default async function CreateBlogPage() {
  const supabaseClient = createClient()
  const { data, error } = await supabaseClient.auth.getUser()

  if (error) {
    console.error('There was an error fetching the user', error)
    redirect('/login')
  }

  console.log('ID: ', data, 'Admin ID:', process.env.NEXT_PUBLIC_BLOG_ADMIN_ID)

  if (data && data.user.id !== process.env.NEXT_PUBLIC_BLOG_ADMIN_ID) {
    redirect('/blogs')
  }

  return (
    <div className="mx-auto max-w-3xl py-16">
      <h1 className="mb-8 text-4xl font-bold">Create a new blog post</h1>
      <BlogEditor />
    </div>
  )
}
