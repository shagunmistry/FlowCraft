import { headers } from 'next/headers'
import { getPostsForSite } from '@/lib/fetchers'

export default async function Sitemap() {
  const headersList = headers()
  const domain =
    headersList
      .get('host')
      ?.replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) ??
    'vercel.pub'

  const posts = await getPostsForSite(domain)

  console.log('Sitemap posts: ', posts)

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
    ...posts.map(({ slug }: { slug: string }) => ({
      url: `https://${domain}/${slug}`,
      lastModified: new Date(),
    })),
  ]
}
