import type { APIRoute } from 'astro';
import { getCurrentUser } from '../../utils/auth';
import { env } from 'cloudflare:workers';

export const prerender = false;

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const POST: APIRoute = async ({ request, locals }) => {
  const user = await getCurrentUser(locals, env);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const purpose = (formData.get('purpose')?.toString() || 'general') as 'campaign_hero' | 'testimonial_photo' | 'avatar' | 'general';

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return new Response(JSON.stringify({ error: 'File too large (max 5MB)' }), { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Invalid file type. Use JPEG, PNG, WebP, or GIF.' }), { status: 400 });
    }

    const r2 = (env as any).UPLOADS;
    if (!r2) {
      return new Response(JSON.stringify({ error: 'R2 not configured' }), { status: 500 });
    }

    // Generate key with user ID prefix for organization
    const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
    const key = `${purpose}/${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    // Upload to R2
    await r2.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
      customMetadata: {
        userId: user.id,
        purpose,
        originalName: file.name,
      },
    });

    // Return the public URL (assuming custom domain or workers.dev for serving)
    const publicUrl = `/api/r2/${key}`;

    return new Response(JSON.stringify({
      success: true,
      url: publicUrl,
      key,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
