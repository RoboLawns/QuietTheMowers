import type { APIRoute } from 'astro';
import { getDBFromLocals } from '../../../utils/db';

export const prerender = false;

// Generate an embeddable HTML snippet for campaign progress
export const GET: APIRoute = async ({ params, url, locals }) => {
  const { slug } = params;
  const db = getDBFromLocals(locals);

  const campaign = db.prepare(`
    SELECT c.*,
      (SELECT COUNT(*) FROM signatures WHERE campaign_id = c.id) as signature_count
    FROM campaigns c WHERE c.slug = ?
  `).bind(slug).first() as any;

  if (!campaign) {
    return new Response('Campaign not found', { status: 404 });
  }

  const progress = Math.round((campaign.signature_count / campaign.goal_signatures) * 100);
  const siteUrl = url.origin;

  const html = `<!-- Quiet The Mowers Campaign Widget -->
<div style="max-width:360px;border:1px solid #e0d7c8;border-radius:12px;padding:16px;font-family:Inter,system-ui,sans-serif;background:#fff">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#4e8c42"/><path d="M8 16c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" stroke-width="2.5" stroke-linecap="round"/><circle cx="16" cy="12" r="2" fill="white"/><rect x="10" y="21" width="12" height="3" rx="1.5" fill="#D97706"/></svg>
    <span style="font-weight:600;font-size:14px;color:#284621">${campaign.title}</span>
  </div>
  <div style="font-size:13px;color:#826750;margin-bottom:12px">${campaign.target_name || campaign.location_city || ''}</div>
  <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:8px">
    <span style="font-size:28px;font-weight:700;color:#4e8c42">${campaign.signature_count}</span>
    <span style="font-size:12px;color:#826750">of ${campaign.goal_signatures} signatures</span>
  </div>
  <div style="width:100%;height:6px;background:#e0d7c8;border-radius:3px;margin-bottom:12px">
    <div style="width:${progress}%;height:6px;background:#4e8c42;border-radius:3px"></div>
  </div>
  <a href="${siteUrl}/campaigns/${campaign.slug}/sign" style="display:block;text-align:center;background:#4e8c42;color:white;padding:10px;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none">Sign This Petition</a>
</div>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
