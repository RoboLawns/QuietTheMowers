import type { APIRoute } from 'astro';
import { getDBFromLocals } from '../utils/db';

export const prerender = false;

const staticPages = [
  '', 'manifesto', 'why', 'the-book', 'course', 'learn', 'about', 'contact',
  'blog', 'ordinances', 'measure', 'measure/rent', 'measure/buy', 'measure/protocol',
  'wins', 'wall', 'share', 'privacy', 'terms',
];

const staticLearn = ['learn/how-to-measure-noise'];
const staticBlog = ['blog/berkeley-wins-quiet-mornings'];
const staticOrdinances = ['ordinances/berkeley-gas-blower-ban'];

export const GET: APIRoute = async () => {
  const baseUrl = 'https://quietthemowers.com';

  let extraUrls: string[] = [];
  try {
    const db = getDBFromLocals({});
    const campaigns = db.prepare('SELECT slug FROM campaigns WHERE status != ?').bind('draft').all();
    if (campaigns.results) {
      extraUrls.push(...campaigns.results.map((r: any) => `campaigns/${r.slug}`));
    }
    const testimonials = db.prepare('SELECT id FROM testimonials WHERE status = ?').bind('approved').all();
    if (testimonials.results) {
      extraUrls.push(...testimonials.results.map((r: any) => `wall/${r.id}`));
    }
  } catch {}

  const allUrls = [...staticPages, ...staticLearn, ...staticBlog, ...staticOrdinances, ...extraUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${baseUrl}${url ? '/' + url : ''}</loc>
    <changefreq>${url.startsWith('blog') || url.startsWith('campaigns/') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${url === '' ? '1.0' : url === 'campaigns' ? '0.9' : '0.7'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
