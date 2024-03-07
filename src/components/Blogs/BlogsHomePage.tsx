'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-auth/client'
import { BlogPost } from './schema'
import Link from 'next/link'
import Image from 'next/image'

export default function BlogsHomePage() {
  const [isAdmin, setIsAdmin] = useState(false)

  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [featuredPost, setFeaturedPost] = useState({
    title: 'The Best Way to Start a Blog',
    href: '#',
    description: 'This is a simple blog post that shows how to start a blog.',
    date: 'Mar 16, 2020',
    datetime: '2020-03-16',
    author: {
      name: 'Roel Aufderehar',
      href: '#',
      imageUrl:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=32&h=32&q=60',
    },
  })

  useEffect(() => {
    fetchNumberOfBlogs()
  }, [])

  useEffect(() => {
    checkIfAdmin()
  }, [])

  async function checkIfAdmin() {
    const supabaseClient = createClient()
    const { data, error } = await supabaseClient.auth.getUser()
    if (error) {
      console.error('There was an error fetching the user', error)
      return
    }
    if (data && data.user.id === process.env.NEXT_PUBLIC_BLOG_ADMIN_ID) {
      setIsAdmin(true)
    }
  }

  async function fetchNumberOfBlogs() {
    const supabaseClient = createClient()
    const { data, error } = await supabaseClient.from('blog_posts').select('*')
    console.log('Blogs:', data, 'Error:', error)
    if (error) {
      console.error('Error fetching blogs', error)
      return
    }
    if (data) {
      setBlogs(data as BlogPost[])
    }
    const featuredPost = data[0] as any
    console.log('Featured post:', featuredPost)
    if (featuredPost) {
      setFeaturedPost({
        title: featuredPost.title,
        href: `/blogs/${featuredPost.id}`,
        description: featuredPost.description,
        date: featuredPost.published_at,
        datetime: featuredPost.published_at,
        author: {
          name: featuredPost.author,
          href: '#',
          imageUrl:
            'https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=32&h=32&q=60',
        },
      })

      // remove featured post from list of blogs
      const blogs = data as BlogPost[]
      const filteredBlogs = blogs.filter((blog) => blog.id !== featuredPost.id)
      setBlogs(filteredBlogs)
    }
  }

  return (
    <div className="bg-black py-24 sm:py-32">
      {isAdmin && (
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-0">
          <div className="flex justify-end">
            <Link
              href="/blogs/create"
              className="rounded-md border border-indigo-200 bg-indigo-100 px-4 py-2 text-sm font-semibold leading-6 text-indigo-600 hover:bg-indigo-200"
            >
              Create or manage posts
            </Link>
          </div>
        </div>
      )}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-12 px-6 sm:gap-y-16 lg:grid-cols-2 lg:px-8">
        <article className="mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-lg">
          <time
            dateTime={featuredPost.datetime}
            className="block text-sm leading-6 text-gray-200"
          >
            {new Date(featuredPost.date).toLocaleDateString()}
          </time>
          <h2
            id="featured-post"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            {featuredPost.title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-200">
            {featuredPost.description}
          </p>
          <div className="mt-4 flex flex-col justify-between gap-6 sm:mt-8 sm:flex-row-reverse sm:gap-8 lg:mt-4 lg:flex-col">
            <div className="flex">
              <Link
                href={featuredPost.href}
                className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                aria-describedby="featured-post"
              >
                Continue reading <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </article>
        <div className="mx-auto w-full max-w-2xl border-t border-gray-900/10 pt-12 sm:pt-16 lg:mx-0 lg:max-w-none lg:border-t-0 lg:pt-0">
          <div className="-my-12 divide-y divide-indigo-400">
            {blogs.map((blog: BlogPost) => (
              <article key={blog.id} className="py-12">
                <div className="group relative max-w-xl">
                  <time
                    dateTime={blog.published_at}
                    className="block text-sm leading-6 text-gray-200"
                  >
                    {new Date(blog.published_at).toLocaleDateString()}
                  </time>
                  <h2 className="mt-2 text-lg font-semibold text-white group-hover:text-gray-200">
                    <Link href={`/blogs/${blog.id}`}>
                      <span className="absolute inset-0" />
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-gray-200">
                    {blog.description}
                  </p>
                </div>
                <div className="mt-4 flex">
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="relative flex gap-x-2.5 text-sm font-semibold leading-6 text-white"
                  >
                    <Image
                      src={blog.image_url}
                      alt={blog.title}
                      width={32}
                      height={32}
                      className="h-6 w-6 flex-none rounded-full bg-gray-50"
                    />
                    {blog.author}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
