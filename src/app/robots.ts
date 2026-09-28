import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo';

// Private / transactional areas. Search pages are noindexed via meta tag instead,
// so they stay crawlable and Google can see that tag.
const PRIVATE = ['/admin', '/api/', '/checkout/', '/order/', '/login'];

// AI search & answer engines (GEO). Allowed explicitly so the store can be cited
// in ChatGPT, Perplexity, Claude, Gemini and Copilot answers.
const AI_CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'PerplexityBot', 'Perplexity-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
