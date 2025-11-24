import { createClient } from '@/lib/supabase-auth/server'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { BlogPost } from '@/components/Blogs/schema'
import type { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = params.id
  const supabaseClient = createClient()

  const { data, error } = await supabaseClient
    .from('blog_posts')
    .select('*')
    .eq('id', id)

  if (error || !data || data.length === 0) {
    return {
      title: 'Post Not Found',
    }
  }

  const blog = data[0] as BlogPost
  return {
    title: `${blog.title} | FlowCraft`,
    description: blog.description,
    keywords: ['flowchart', 'ai', 'diagram', 'chart', 'whiteboard'],
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: [blog.image_url],
      type: 'article',
      publishedTime: blog.published_at,
    },
  }
}

// Custom MDX Components to ensure internal content matches the aesthetic
const mdxComponents = {
  h1: (props: any) => (
    <h1
      className="mb-4 mt-8 text-3xl font-bold tracking-tight text-gray-900"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="mb-4 mt-10 text-2xl font-semibold tracking-tight text-gray-900"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="mb-3 mt-8 text-xl font-semibold tracking-tight text-gray-900"
      {...props}
    />
  ),
  p: (props: any) => (
    <p
      className="not-prose mb-6 text-lg leading-relaxed text-gray-700"
      {...props}
    />
  ),
  a: (props: any) => (
    <a
      className="font-medium text-gray-900 underline decoration-gray-400 underline-offset-4 transition-all hover:decoration-black"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul className="my-6 ml-6 list-disc space-y-2 text-gray-700" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="my-6 border-l-4 border-gray-200 pl-4 italic text-gray-800"
      {...props}
    />
  ),
}

export default async function BlogPage({ params }: { params: { id: string } }) {
  const supabaseClient = createClient()

  const { data, error } = await supabaseClient
    .from('blog_posts')
    .select('*')
    .eq('id', params.id)

  if (error || !data || data.length === 0) {
    console.error('Error fetching blog post', error)
    return notFound()
  }

  const blog = data[0] as BlogPost

  return (
    <main className="min-h-screen bg-white pb-20 pt-24">
      <article className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Navigation */}
        <nav className="mb-12">
          <Link
            href="/blogs"
            className="group inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
        </nav>

        {/* Header Section */}
        <header className="mb-10 text-left">
          <div className="mb-6 flex items-center gap-x-3 text-sm text-gray-500">
            <time dateTime={blog.published_at}>
              {new Date(blog.published_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <span className="h-0.5 w-0.5 rounded-full bg-gray-500" />
            <span>{blog.author}</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {blog.title}
          </h1>

          <p className="text-xl leading-8 text-gray-600">{blog.description}</p>
        </header>

        {/* Featured Image */}
        {blog.image_url && (
          <div className="mb-12 overflow-hidden rounded-2xl bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
            <Image
              src={blog.image_url}
              alt={blog.title}
              width={1200}
              height={630}
              priority
              className="w-full object-cover transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-lg prose-gray max-w-none prose-headings:font-semibold prose-a:font-medium">
          <MDXRemote source={blog.content} components={mdxComponents} />
        </div>

        {/* Footer / Share (Optional) */}
        <div className="mt-16 border-t border-gray-100 pt-8">
          <Link
            href="/blogs"
            className="text-sm font-semibold text-gray-900 hover:underline"
          >
            &larr; Read more articles
          </Link>
        </div>
      </article>
    </main>
  )
}
