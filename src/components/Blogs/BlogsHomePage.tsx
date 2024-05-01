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
    <div className="bg-gray-100 p-12">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            FlowCraft Blog
          </h2>
        </div>
        {isAdmin && (
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <Link
              href="/blogs/create"
              className="ml-3 inline-flex items-center rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              Create or manage posts
            </Link>
          </div>
        )}
      </div>
      <div className="mt-8 grid max-w-7xl grid-cols-1 gap-x-8 gap-y-12 sm:gap-y-16 lg:grid-cols-2">
        <article className="mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-lg">
          <time
            dateTime={featuredPost.datetime}
            className="block text-sm leading-6 text-pink-500"
          >
            {new Date(featuredPost.date).toLocaleDateString()}
          </time>
          <h2
            id="featured-post"
            className="mt-4 text-2xl font-bold tracking-tight hover:text-pink-500 sm:text-xl"
          >
            <Link href={featuredPost.href} aria-describedby="featured-post">
              {featuredPost.title}
            </Link>
          </h2>
          <p className="mt-4 text-lg leading-8 text-pink-500">
            {featuredPost.description}
          </p>
          <div className="mt-4 flex flex-col justify-between gap-6 sm:mt-8 sm:flex-row-reverse sm:gap-8 lg:mt-4 lg:flex-col">
            <div className="flex">
              <Link
                href={featuredPost.href}
                className="text-sm font-semibold leading-6 text-pink-600 hover:text-pink-500"
                aria-describedby="featured-post"
              >
                Continue reading <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </article>
        <div className="mx-auto w-full max-w-2xl border-t border-gray-900/10 pt-12 sm:pt-16 lg:mx-0 lg:max-w-none lg:border-t-0 lg:pt-0">
          <div className="-my-12 divide-y divide-pink-400">
            {blogs.map((blog: BlogPost) => (
              <article
                key={blog.id}
                className="my-12 rounded-lg bg-white px-4 py-12 shadow-md sm:px-6"
              >
                <div className="group relative max-w-xl">
                  <time
                    dateTime={blog.published_at}
                    className="block text-sm leading-6 text-pink-500"
                  >
                    {new Date(blog.published_at).toLocaleDateString()}
                  </time>
                  <h2 className="mt-2 text-lg font-semibold group-hover:text-pink-500">
                    <Link href={`/blogs/${blog.id}`}>
                      <span className="absolute inset-0" />
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-pink-500">
                    {blog.description}
                  </p>
                </div>
                <div className="mt-4 flex">
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="relative flex gap-x-2.5 text-sm font-semibold leading-6"
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
