import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const info: Record<string, unknown> = {
    hasRuntime: Boolean((locals as any)?.runtime),
    hasEnv: Boolean((locals as any)?.runtime?.env),
    hasDB: Boolean((locals as any)?.runtime?.env?.DB),
    envKeys: (locals as any)?.runtime?.env ? Object.keys((locals as any).runtime.env) : [],
  };

  // Try a simple DB query
  try {
    const db = (locals as any)?.runtime?.env?.DB;
    if (db) {
      const result = db.prepare('SELECT 1 as test').all();
      info.dbQuery = { success: true, results: result.results };
    }
  } catch (e: any) {
    info.dbQuery = { success: false, error: e.message };
  }

  return new Response(JSON.stringify(info, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
