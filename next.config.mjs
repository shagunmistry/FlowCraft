import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Environment variables
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_ASSISTANT_ID: process.env.OPENAI_ASSISTANT_ID,
    OPENAI_FUNCTIONS_ASSISTANT_ID: process.env.OPENAI_FUNCTIONS_ASSISTANT_ID,
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_PRIVATE_KEY,
    NEXT_PUBLIC_BLOG_ADMIN_ID: process.env.BLOG_ADMIN_ID,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_FLOWCRAFT_API: process.env.FLOWCRAFT_API_URL,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
}
export default withMDX(nextConfig)
