import type { APIRoute } from 'astro';
import { getAuthFromRequest } from '../../../utils/auth';
import { getDB } from '../../../utils/db';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  // Auth from cookie
  const user = getAuthFromRequest(request);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Please sign in' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const templateType = formData.get('template_type')?.toString() || 'custom';
    const targetJurisdiction = formData.get('target_jurisdiction')?.toString() || 'city';
    const targetName = formData.get('target_name')?.toString()?.trim();
    const locationCity = formData.get('location_city')?.toString()?.trim();
    const locationState = formData.get('location_state')?.toString()?.trim()?.toUpperCase();
    const goalSignatures = parseInt(formData.get('goal_signatures')?.toString() || '100', 10);
    const goalDeadline = formData.get('goal_deadline')?.toString() || null;
    const title = formData.get('title')?.toString()?.trim();
    const storyMarkdown = formData.get('story_markdown')?.toString()?.trim();
    const slug = formData.get('slug')?.toString()?.trim()?.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    if (!title || !slug || !targetName) {
      return new Response(JSON.stringify({ error: 'Title, slug, and target name are required.' }), { status: 400 });
    }

    const db = getDB(env);

    // Check slug uniqueness
    const existing = db.prepare('SELECT id FROM campaigns WHERE slug = ?').bind(slug).first();
    if (existing) {
      return new Response(JSON.stringify({ error: 'This URL slug is already taken.' }), { status: 400 });
    }

    const id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO campaigns (id, slug, organizer_id, title, template_type, target_jurisdiction, target_name, location_city, location_state, story_markdown, goal_signatures, goal_deadline, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `).bind(id, slug, user.id, title, templateType, targetJurisdiction, targetName, locationCity || null, locationState || null, storyMarkdown || '', goalSignatures, goalDeadline).run();

    return redirect(`/campaigns/${slug}/manage`);
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to create campaign.' }), { status: 500 });
  }
};
