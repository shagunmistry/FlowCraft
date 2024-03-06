import { unstable_cache } from 'next/cache'
import { supabase } from './supabase'

export async function getPostsForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '')
    : null

  return await unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('title, description, slug, image, imageBlurhash, createdAt')
        .eq('published', true)
        .eq(
          subdomain ? 'subdomain' : 'customDomain',
          subdomain ? subdomain : domain,
        )
        .order('createdAt', { ascending: false })

      if (error) {
        throw error
      }

      return data
    },
    [`${domain}-posts`],
    {
      revalidate: 900,
      tags: [`${domain}-posts`],
    },
  )()
}
