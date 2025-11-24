'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-auth/client'
import { BlogPost } from './schema'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRightIcon,
  PlusIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

// --- Components ---

const BlogSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[16/9] w-full rounded-2xl bg-gray-100" />
    <div className="mt-4 h-4 w-1/4 rounded bg-gray-100" />
    <div className="mt-2 h-6 w-3/4 rounded bg-gray-100" />
    <div className="mt-2 h-4 w-full rounded bg-gray-100" />
  </div>
)

const EmptyState = ({ isAdmin }: { isAdmin: boolean }) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 py-24 text-center">
    <h3 className="text-lg font-semibold text-gray-900">No posts yet</h3>
    <p className="mt-2 text-sm text-gray-500">
      Stay tuned for updates from the team.
    </p>
    {isAdmin && (
      <Link
        href="/blogs/create"
        className="mt-6 inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Create first post
      </Link>
    )}
  </div>
)

export default function BlogsHomePage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initData = async () => {
      const supabase = createClient()

      // 1. Check Admin Status
      const { data: userData } = await supabase.auth.getUser()
      console.log(
        'User Data:',
        userData,
        ' Admin ID:',
        process.env.NEXT_PUBLIC_BLOG_ADMIN_ID,
      )
      if (
        !!process.env.NEXT_PUBLIC_BLOG_ADMIN_ID &&
        userData?.user?.id !== undefined &&
        userData?.user?.id === process.env.NEXT_PUBLIC_BLOG_ADMIN_ID
      ) {
        console.log('User is admin')
        setIsAdmin(true)
      }

      // 2. Fetch Blogs
      const { data: blogData, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false })

      if (!error && blogData) {
        if (blogData.length > 0) {
          setFeaturedPost(blogData[0] as BlogPost)
          setBlogs(blogData.slice(1) as BlogPost[])
        }
      }
      setIsLoading(false)
    }

    initData()
  }, [])

  return (
    <main className="min-h-screen bg-white pb-20 pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between border-b border-gray-200 pb-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              FlowCraft Blog
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Insights, updates, and thoughts on design and engineering.
            </p>
          </div>
          {isAdmin && (
            <Link
              href="/blogs/create"
              className="hidden items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-black sm:inline-flex"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Manage Posts
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="aspect-[16/9] animate-pulse rounded-2xl bg-gray-100" />
              <div className="space-y-4">
                <div className="h-8 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <BlogSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : !featuredPost ? (
          <EmptyState isAdmin={isAdmin} />
        ) : (
          <div className="space-y-16">
            {/* Featured Hero Section */}
            <section aria-label="Featured Post">
              <article className="relative isolate flex flex-col gap-8 lg:flex-row">
                <div className="lg:aspect-square relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 sm:aspect-[2/1] lg:w-1/2 lg:shrink-0">
                  {featuredPost.image_url ? (
                    <Image
                      src={featuredPost.image_url}
                      alt={featuredPost.title}
                      fill
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-50 text-gray-300">
                      <span className="text-lg font-medium">
                        No Cover Image
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-x-4 text-xs">
                    <time
                      dateTime={featuredPost.published_at}
                      className="text-gray-500"
                    >
                      {new Date(featuredPost.published_at).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        },
                      )}
                    </time>
                    <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                      Featured
                    </span>
                  </div>
                  <div className="group relative max-w-xl">
                    <h3 className="mt-3 text-2xl font-bold leading-tight text-gray-900 group-hover:text-gray-600">
                      <Link href={`/blogs/${featuredPost.id}`}>
                        <span className="absolute inset-0" />
                        {featuredPost.title}
                      </Link>
                    </h3>
                    <p className="mt-5 text-lg leading-8 text-gray-600">
                      {featuredPost.description}
                    </p>
                  </div>
                  <div className="mt-6 flex border-t border-gray-100 pt-6">
                    <div className="relative flex items-center gap-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="text-sm leading-6">
                        <p className="font-semibold text-gray-900">
                          <span className="absolute inset-0" />
                          {featuredPost.author}
                        </p>
                        <p className="text-gray-500">Author</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </section>

            {/* Grid for Older Posts */}
            {blogs.length > 0 && (
              <section
                aria-label="Recent Posts"
                className="border-t border-gray-200 pt-16"
              >
                <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">
                  Recent Stories
                </h2>
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                  {blogs.map((post) => (
                    <article
                      key={post.id}
                      className="group flex flex-col items-start justify-between"
                    >
                      <div className="relative w-full">
                        <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 sm:aspect-[3/2]">
                          {post.image_url && (
                            <Image
                              src={post.image_url}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          )}
                        </div>
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/5" />
                      </div>
                      <div className="max-w-xl">
                        <div className="mt-4 flex items-center gap-x-4 text-xs">
                          <time
                            dateTime={post.published_at}
                            className="flex items-center gap-1 text-gray-500"
                          >
                            <CalendarIcon className="h-3.5 w-3.5" />
                            {new Date(post.published_at).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                              },
                            )}
                          </time>
                        </div>
                        <div className="group relative">
                          <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                            <Link href={`/blogs/${post.id}`}>
                              <span className="absolute inset-0" />
                              {post.title}
                            </Link>
                          </h3>
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                            {post.description}
                          </p>
                        </div>
                        <div className="relative mt-4 flex items-center gap-x-2 text-sm font-medium text-gray-900 group-hover:text-gray-600">
                          Read article{' '}
                          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
