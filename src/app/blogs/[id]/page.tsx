import { createClient } from '@/lib/supabase-auth/server'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { BlogPost } from '@/components/Blogs/schema'
import type { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { buildMetadata, buildCanonical, SITE_NAME, SITE_URL } from '@/lib/seo'
import { mdxComponents } from '@/components/Mdx/MdxComponents'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params
  if (!/^\d+$/.test(id)) {
    return { title: 'Post Not Found' }
  }
  const supabaseClient = await createClient()

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
  return buildMetadata({
    title: `${blog.title} | FlowCraft`,
    description: blog.description,
    path: `/blogs/${id}`,
    image: blog.image_url,
    type: 'article',
    publishedTime: blog.published_at,
    keywords: ['flowchart', 'ai', 'diagram', 'chart', 'whiteboard'],
  })
}

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^\d+$/.test(id)) {
    return notFound()
  }
  const supabaseClient = await createClient()

  const { data, error } = await supabaseClient
    .from('blog_posts')
    .select('*')
    .eq('id', id)

  if (error || !data || data.length === 0) {
    console.error('Error fetching blog post', error)
    return notFound()
  }

  const blog = data[0] as BlogPost

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    image: blog.image_url ? [blog.image_url] : undefined,
    datePublished: blog.published_at,
    dateModified: blog.published_at,
    author: {
      '@type': 'Person',
      name: blog.author || SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': buildCanonical(`/blogs/${id}`),
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: buildCanonical('/') },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: buildCanonical('/blogs') },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: buildCanonical(`/blogs/${id}`),
      },
    ],
  }

  return (
    <main className="min-h-screen bg-white pb-20 pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
