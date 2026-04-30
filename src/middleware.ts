import { clerkMiddleware } from '@clerk/astro/server';

export const onRequest = async (context: any, next: any) => {
  try {
    return await clerkMiddleware()(context, next);
  } catch (e) {
    // Clerk unavailable — pass through without auth
    return next();
  }
};
