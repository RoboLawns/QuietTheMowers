import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    const info: Record<string, unknown> = { deployedAt: '2026-04-30T17:34:00Z' };
    try { info.hasAuth = typeof (locals as any)?.auth === 'function'; } catch (e: any) { info.hasAuth = e.message; }
    try {
      if (typeof (locals as any)?.auth === 'function') {
        const authData = await (locals as any).auth();
        info.authUserId = authData?.userId;
        info.authKeys = authData ? Object.keys(authData) : [];
      }
    } catch (e: any) { info.authError = e.message; }
    try { info.hasEnvDB = Boolean((env as any)?.DB); } catch (e: any) { info.hasEnvDB = e.message; }
    try { info.envKeys = Object.keys(env as object).filter(k => !k.startsWith('__')); } catch (e: any) { info.envKeys = e.message; }
    try { info.hasEnvClerk = Boolean((env as any)?.CLERK_SECRET_KEY); } catch (e: any) { info.hasEnvClerk = e.message; }
    try { info.hasProcessClerk = Boolean((globalThis as any)?.process?.env?.CLERK_SECRET_KEY); } catch (e: any) { info.hasProcessClerk = e.message; }
    try {
      const cookieHeader = Astro.request.headers.get('cookie') || '';
      info.cookieKeys = cookieHeader.split(';').map((c: string) => c.trim().split('=')[0]).filter(Boolean);
      info.cookieCount = info.cookieKeys.length;
    } catch (e: any) { info.cookieKeys = e.message; }
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
