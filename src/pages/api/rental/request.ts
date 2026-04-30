import type { APIRoute } from 'astro';
import { getAuthFromRequest } from '../../../utils/auth';
import { getDB } from '../../../utils/db';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const user = getAuthFromRequest(request);
  if (!user) return redirect('/sign-in');

  try {
    const formData = await request.formData();
    const db = getDB(env);

    const id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO rental_requests (id, user_id, requested_start, requested_end, shipping_address, intended_use, campaign_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).bind(
      id,
      user.id,
      formData.get('start_date')?.toString() || null,
      formData.get('end_date')?.toString() || null,
      formData.get('address')?.toString() || null,
      formData.get('intended_use')?.toString() || null,
      formData.get('campaign')?.toString() || null
    ).run();

    return redirect('/measure/rent?msg=submitted');
  } catch (e) {
    return redirect('/measure/rent?msg=error');
  }
};
