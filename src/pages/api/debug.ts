import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    const info: Record<string, unknown> = {};

    try { info.localsType = typeof locals; } catch (e: any) { info.localsType = e.message; }
    try { info.localsKeys = locals ? Object.keys(locals as object) : 'null'; } catch (e: any) { info.localsKeys = e.message; }
    try { info.hasRuntime = Boolean((locals as any)?.runtime); } catch (e: any) { info.hasRuntime = e.message; }
    try { info.hasEnv = Boolean((locals as any)?.runtime?.env); } catch (e: any) { info.hasEnv = e.message; }

    return new Response(JSON.stringify(info, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
