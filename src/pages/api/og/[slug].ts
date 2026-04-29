import type { APIRoute } from 'astro';
import { getDBFromLocals } from '../../../utils/db';

export const prerender = false;

// Generate dynamic OG image as HTML that can be screenshot
export const GET: APIRoute = async ({ params, url, locals }) => {
  const { slug } = params;
  const type = url.searchParams.get('type') || 'campaign';
  const db = getDBFromLocals(locals);

  let title = 'Quiet The Mowers';
  let subtitle = '';
  let stat = '';

  if (type === 'campaign') {
    const campaign = db.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM signatures WHERE campaign_id = c.id) as signature_count
      FROM campaigns c WHERE c.slug = ?
    `).bind(slug).first() as any;

    if (campaign) {
      title = campaign.title;
      subtitle = `${campaign.location_city}${campaign.location_state ? ', ' + campaign.location_state : ''}`;
      stat = `${campaign.signature_count} of ${campaign.goal_signatures} signatures`;
    }
  } else if (type === 'testimonial') {
    const testimonial = db.prepare('SELECT * FROM testimonials WHERE id = ? AND status = ?').bind(slug, 'approved').first() as any;
    if (testimonial) {
      title = testimonial.title;
      subtitle = `— ${testimonial.display_name}${testimonial.location_city ? ', ' + testimonial.location_city : ''}`;
    }
  }

  // Return a styled HTML page that can be screenshotted for OG images
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>OG</title></head>
<body style="margin:0;width:1200px;height:630px;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;background:linear-gradient(135deg,#2f5627,#1a3a15)">
  <div style="text-align:center;max-width:900px;padding:40px">
    <div style="color:#fbbf24;font-size:14px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-bottom:20px">#QuietTheMowers</div>
    <h1 style="color:white;font-size:52px;font-weight:700;line-height:1.2;margin-bottom:16px">${title}</h1>
    ${subtitle ? `<p style="color:#ccbda5;font-size:28px;margin-bottom:24px">${subtitle}</p>` : ''}
    ${stat ? `<div style="display:inline-block;background:#fbbf24;color:#451a03;font-weight:700;font-size:24px;padding:12px 32px;border-radius:12px">${stat}</div>` : ''}
    <div style="margin-top:30px;color:#95c589;font-size:18px">quietthemowers.com</div>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
