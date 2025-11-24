'use client'
import { useState } from 'react'
import ErrorAlert from '@/components/ErrorAlert'
import { BlogPost } from '../schema'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-auth/client'

export default function BlogEditor() {
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleBlogCreate = async (e: any) => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const dataToInsert = Object.fromEntries(formData)
    console.log(dataToInsert)

    if (
      dataToInsert.title === '' ||
      dataToInsert.summary === '' ||
      dataToInsert.image_url === '' ||
      dataToInsert.content === ''
    ) {
      setShowError(true)
      setErrorMessage('Please fill in all fields')
      return
    }

    setShowError(false)
    // post to Supabase `blog_posts` table
    const client = createClient()
    const { data, error } = await client.from('blog_posts').insert([
      {
        title: dataToInsert.title,
        description: dataToInsert.summary,
        image_url: dataToInsert.image_url,
        content: dataToInsert.content,
        created_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
      },
    ])

    if (error) {
      setShowError(true)
      console.error('Error inserting blog post', error)
      return
    }

    console.log('Blog post inserted', data)
    form.reset()
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <ErrorAlert message={errorMessage} show={showError} />
      <form
        action="#"
        method="POST"
        onSubmit={handleBlogCreate}
        className="relative"
      >
        <div className="overflow-hidden">
          <label htmlFor="title" className="sr-only">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="my-2.5 block w-full rounded-md border-red-300 pt-2.5 text-lg font-medium placeholder:text-gray-400 focus:ring-0"
            placeholder="Title"
          />
          <label htmlFor="summary" className="sr-only">
            Summary
          </label>
          <input
            type="text"
            name="summary"
            id="summary"
            className="text-md my-2.5 block w-full rounded-md border-red-300 pt-2.5 font-medium placeholder:text-pink-400 focus:ring-0"
            placeholder="Summary"
          />
          <label htmlFor="image_url" className="sr-only">
            Image URL
          </label>
          <input
            type="text"
            name="image_url"
            id="image_url"
            className="text-md my-2.5 block w-full rounded-md border-red-300 pt-2.5 font-medium placeholder:text-red-400 focus:ring-0"
            placeholder="Image URL"
          />
          <label htmlFor="content" className="sr-only">
            Content
          </label>
          <textarea
            rows={10}
            name="content"
            id="content"
            className="my-2.5 block w-full resize-none rounded-lg border-red-500 py-0 text-gray-900 shadow-lg placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Write your blog post content here"
            defaultValue={''}
          />

          {/* Spacer element to match the height of the toolbar */}
          <div aria-hidden="true">
            <div className="py-2">
              <div className="h-9" />
            </div>
            <div className="h-px" />
            <div className="py-2">
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-px bottom-0">
          <div className="flex items-center justify-between space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3">
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
