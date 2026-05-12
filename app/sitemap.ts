import { MetadataRoute } from 'next' 
 
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap { 
  return [ 
    { url: 'https://www.lupusventure.com', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }, 
    { url: 'https://www.lupusventure.com/who-we-are', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 }, 
    { url: 'https://www.lupusventure.com/what-we-do', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 }, 
    { url: 'https://www.lupusventure.com/insights', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 }, 
    { url: 'https://www.lupusventure.com/reach-us', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 }, 
  ] 
} 
