import type { APIRoute } from 'astro';
import { getAuthFromRequest } from '../../../../utils/auth';
import { getDB } from '../../../../utils/db';

export const prerender = false;

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const user = getAuthFromRequest(request);
  if (!user) return redirect('/sign-in');

  try {
    const formData = await request.formData();
    const body = formData.get('body')?.toString()?.trim();
    const campaignId = params.campaignId;

    if (!body || !campaignId) {
      return new Response(null, { status: 302, headers: { Location: `/campaigns/${params.slug}` } });
    }

    const db = getDB({});
    const id = crypto.randomUUID();
    db.prepare(
      'INSERT INTO comments (id, user_id, parent_type, parent_id, body) VALUES (?, ?, \'campaign\', ?, ?)'
    ).bind(id, user.id, campaignId, body).run();

    return redirect(`/campaigns/${params.slug}#comments`);
  } catch {
    return redirect(`/campaigns/${params.slug}`);
  }
};
