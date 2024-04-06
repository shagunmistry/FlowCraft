import { createClient } from '@/lib/supabase-auth/server'
import { notFound } from 'next/navigation'

import { MDXRemote } from 'next-mdx-remote/rsc'
import { BlogPost } from '@/components/Blogs/schema'

import type { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = params.id

  const supabaseClient = createClient()

  const { data, error } = await supabaseClient
    .from('blog_posts')
    .select('*')
    .eq('id', id)

  if (error) {
    console.error('Error fetching blog post', error)
    return notFound()
  }

  const blog = data[0] as BlogPost
  return {
    title: `${blog.title} | FlowCraft.app`,
    description: blog.description,
    keywords: ['flowchart', 'ai', 'diagram', 'chart', 'whiteboard'],
  }
}

export default async function BlogPage({ params }: { params: { id: string } }) {
  const supabaseClient = createClient()

  const { data, error } = await supabaseClient
    .from('blog_posts')
    .select('*')
    .eq('id', params.id)

  if (error) {
    console.error('Error fetching blog post', error)
    return notFound()
  }

  const blog = data[0] as BlogPost

  return (
    <div className="bg-gray-100 py-12">
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-indigo-700">{blog.title}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {new Date(blog.published_at).toLocaleDateString()}
          </p>
        </div>
      </nav>
      <div className="prose-h1:font-large prose prose-lg mx-auto mt-24 max-w-3xl space-y-6 text-black prose-headings:underline prose-a:text-blue-600 prose-strong:text-black prose-code:rounded-md prose-img:rounded-xl sm:space-y-8">
        <Image
          src={blog.image_url}
          alt={blog.title}
          width={600}
          height={400}
          className="mx-auto rounded-md"
        />
        <MDXRemote source={blog.content} />
      </div>
    </div>
  )
}
