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

    if (!body) {
      return redirect(`/wall/${params.id}`);
    }

    const db = getDB({});
    const id = crypto.randomUUID();
    db.prepare(
      'INSERT INTO comments (id, user_id, parent_type, parent_id, body) VALUES (?, ?, \'testimonial\', ?, ?)'
    ).bind(id, user.id, params.id, body).run();

    return redirect(`/wall/${params.id}`);
  } catch {
    return redirect(`/wall/${params.id}`);
  }
};
