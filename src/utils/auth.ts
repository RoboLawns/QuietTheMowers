import { getDB } from './db';

// In production, Clerk provides the session via Astro.locals.auth()
// For Cloudflare Workers, env vars come from import { env } from 'cloudflare:workers'

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  role: 'user' | 'organizer' | 'admin';
  location_city?: string;
  location_state?: string;
}

// Get the current user from Clerk
export async function getCurrentUser(locals: App.Locals, env?: any): Promise<AuthUser | null> {
  try {
    const l = locals as any;

    // @clerk/astro provides locals.auth()
    if (typeof l?.auth === 'function') {
      const authResult = await l.auth();
      const userId = authResult?.userId;
      if (userId && env) {
        const db = getDB(env);
        let result = db.prepare('SELECT * FROM users WHERE auth_provider_id = ?').bind(userId).all();
        let user = result?.results?.[0] as any;

        // Auto-sync: if user exists in Clerk but not in D1, create them
        if (!user) {
          const clerkUser = authResult.user || (l.currentUser ? await l.currentUser() : null);
          const email = clerkUser?.emailAddresses?.[0]?.emailAddress || authResult.sessionClaims?.email || `user-${userId}@unknown`;
          const name = clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : (authResult.sessionClaims?.name || 'User');
          const imageUrl = clerkUser?.imageUrl || '';

          const id = crypto.randomUUID();
          db.prepare(
            'INSERT INTO users (id, auth_provider_id, email, display_name, avatar_url, role) VALUES (?, ?, ?, ?, ?, ?)'
          ).bind(id, userId, email, name, imageUrl, 'user').run();

          result = db.prepare('SELECT * FROM users WHERE auth_provider_id = ?').bind(userId).all();
          user = result?.results?.[0] as any;
        }

        if (user) {
          return {
            id: user.id,
            email: user.email,
            displayName: user.display_name ?? 'User',
            avatarUrl: user.avatar_url ?? '',
            role: user.role as AuthUser['role'],
            location_city: user.location_city,
            location_state: user.location_state,
          };
        }
      }
    }
  } catch (e) {
    console.error('getCurrentUser error:', e);
  }

  return null;
}

// Create or find user in our DB after Clerk sign-in
// Returns { user, isNew } so caller can send welcome email if needed
export async function syncUser(env: any, clerkUser: { id: string; email: string; name?: string; imageUrl?: string }) {
  const db = getDB(env);
  const existing = db.prepare('SELECT * FROM users WHERE auth_provider_id = ?').bind(clerkUser.id).first() as any;

  if (existing) {
    db.prepare(
      'UPDATE users SET email = ?, display_name = ?, avatar_url = ?, updated_at = datetime(\'now\') WHERE auth_provider_id = ?'
    ).bind(clerkUser.email, clerkUser.name ?? null, clerkUser.imageUrl ?? null, clerkUser.id).run();
    return { user: existing as AuthUser, isNew: false };
  }

  const id = crypto.randomUUID();
  db.prepare(
    'INSERT INTO users (id, auth_provider_id, email, display_name, avatar_url, role) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, clerkUser.id, clerkUser.email, clerkUser.name ?? null, clerkUser.imageUrl ?? null, 'user').run();

  return {
    user: {
      id,
      email: clerkUser.email,
      displayName: clerkUser.name ?? 'User',
      avatarUrl: clerkUser.imageUrl ?? '',
      role: 'user' as const,
    },
    isNew: true,
  };
}
