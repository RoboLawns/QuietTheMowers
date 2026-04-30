import type { APIRoute } from 'astro';
import { getCurrentUser } from '../../../../utils/auth';
import { getDBFromLocals } from '../../../../utils/db';

export const prerender = false;

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
  const user = await getCurrentUser(locals);
  if (!user) {
    return new Response(null, { status: 302, headers: { Location: '/sign-in' } });
  }

  try {
    const formData = await request.formData();
    const body = formData.get('body')?.toString()?.trim();
    const campaignId = params.campaignId;

    if (!body || !campaignId) {
      return new Response(null, { status: 302, headers: { Location: `/campaigns/${params.slug}` } });
    }

    const db = getDBFromLocals(locals);
    const id = crypto.randomUUID();
    db.prepare(
      'INSERT INTO comments (id, user_id, parent_type, parent_id, body) VALUES (?, ?, \'campaign\', ?, ?)'
    ).bind(id, user.id, campaignId, body).run();

    return redirect(`/campaigns/${params.slug}#comments`);
  } catch {
    return redirect(`/campaigns/${params.slug}`);
  }
};
