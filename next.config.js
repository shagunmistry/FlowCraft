const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
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
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
}

module.exports = withMDX(nextConfig)
