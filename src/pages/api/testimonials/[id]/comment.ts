import type { APIRoute } from 'astro';
import { getCurrentUser } from '../../../../utils/auth';
import { getDB } from '../../../../utils/db';

export const prerender = false;

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
  const user = await getCurrentUser(locals);
  if (!user) {
    return new Response(null, { status: 302, headers: { Location: '/sign-in' } });
  }

  try {
    const formData = await request.formData();
    const body = formData.get('body')?.toString()?.trim();

    if (!body) {
      return redirect(`/wall/${params.id}`);
    }

    const db = getDBFromLocals(locals);
    const id = crypto.randomUUID();
    db.prepare(
      'INSERT INTO comments (id, user_id, parent_type, parent_id, body) VALUES (?, ?, \'testimonial\', ?, ?)'
    ).bind(id, user.id, params.id, body).run();

    return redirect(`/wall/${params.id}`);
  } catch {
    return redirect(`/wall/${params.id}`);
  }
};
