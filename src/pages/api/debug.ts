import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    const info: Record<string, unknown> = {};
    try { info.hasAuth = typeof (locals as any)?.auth === 'function'; } catch (e: any) { info.hasAuth = e.message; }
    try {
      if (typeof (locals as any)?.auth === 'function') {
        const authData = await (locals as any).auth();
        info.authUserId = authData?.userId;
        info.authKeys = authData ? Object.keys(authData) : [];
      }
    } catch (e: any) { info.authError = e.message; }
    try { info.hasEnvDB = Boolean((env as any)?.DB); } catch (e: any) { info.hasEnvDB = e.message; }
    try {
      const db = (env as any)?.DB;
      if (db) {
        const r = db.prepare('SELECT COUNT(*) as count FROM users').all();
        info.dbUsers = r?.results?.[0]?.count;
      }
    } catch (e: any) { info.dbError = e.message; }

    return new Response(JSON.stringify(info, null, 2), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
