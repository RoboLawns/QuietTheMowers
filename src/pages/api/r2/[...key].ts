import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

// Serve files from R2 — public read access
export const GET: APIRoute = async ({ params }) => {
  const key = params.key as string;
  if (!key) {
    return new Response('Not Found', { status: 404 });
  }

  const r2 = (env as any).UPLOADS;
  if (!r2) {
    return new Response('R2 not configured', { status: 500 });
  }

  try {
    const obj = await r2.get(key);
    if (!obj) {
      return new Response('Not Found', { status: 404 });
    }

    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(obj.body, { status: 200, headers });
  } catch (e: any) {
    return new Response('Error: ' + e.message, { status: 500 });
  }
};
