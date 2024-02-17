const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Environment variables
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_ASSISTANT_ID: process.env.OPENAI_ASSISTANT_ID,
    OPENAI_FUNCTIONS_ASSISTANT_ID: process.env.OPENAI_FUNCTIONS_ASSISTANT_ID,
  },
}

module.exports = withMDX(nextConfig)
