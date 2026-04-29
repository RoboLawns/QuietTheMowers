import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ url, redirect }) => {
  const redirectTo = url.searchParams.get('redirect') || '/dashboard';
  
  if (import.meta.env.DEV && !import.meta.env.CLERK_SECRET_KEY) {
    return redirect('/dashboard');
  }
  
  return redirect(`/?redirect_url=${encodeURIComponent(redirectTo)}`);
};
