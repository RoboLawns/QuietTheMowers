import { getDB } from './db';

// Decode JWT without atob (Works in Workers)
function decodeJWT(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const raw = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const text = decodeURIComponent(Array.prototype.map.call(
      atob(raw), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(text);
  } catch { return null; }
}

// Extract Clerk user from cookies + sync to D1
// Works without middleware — reads __session cookie directly
export function getAuthFromRequest(request: Request, env: any): AuthUser | null {
  try {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/__session=([^;]+)/);
    if (!match?.[1]) return null;

    const payload = decodeJWT(match[1]);
    if (!payload?.sub) return null;

    const clerkId = payload.sub as string;
    const email = (payload.email as string) || `${clerkId}@clerk.user`;
    const name = (payload.name as string) || email.split('@')[0] || 'User';

    // Sync to D1
    const db = getDB(env);
    let row = db.prepare('SELECT * FROM users WHERE auth_provider_id = ?').bind(clerkId).first() as any;
    if (!row) {
      db.prepare('INSERT INTO users (id, auth_provider_id, email, display_name, role) VALUES (?, ?, ?, ?, ?)')
        .bind(crypto.randomUUID(), clerkId, email, name, 'user').run();
      row = db.prepare('SELECT * FROM users WHERE auth_provider_id = ?').bind(clerkId).first() as any;
    }
    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      displayName: row.display_name || name,
      avatarUrl: row.avatar_url || '',
      role: row.role || 'user',
      location_city: row.location_city,
      location_state: row.location_state,
    };
  } catch { return null; }
}

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

    if (typeof l?.auth !== 'function') return null;

    const authData = await l.auth();
    const userId = authData?.userId;
    if (!userId) return null;

    const db = getDB(env);

    // Try to find existing user in D1
    let result = db.prepare('SELECT * FROM users WHERE auth_provider_id = ?').bind(userId).all();
    let user = result?.results?.[0] as any;

    // Auto-create if first sign-in
    if (!user) {
      // Get user details from Clerk session claims (most reliable in Worker)
      const sessionClaims = authData?.sessionClaims || {};
      const email = sessionClaims?.email || `${userId}@clerk.user`;
      const name = sessionClaims?.name || sessionClaims?.firstName || 'User';

      const id = crypto.randomUUID();
      db.prepare(
        'INSERT INTO users (id, auth_provider_id, email, display_name, avatar_url, role) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(id, userId, email, name, '', 'user').run();

      user = {
        id,
        auth_provider_id: userId,
        email,
        display_name: name,
        avatar_url: '',
        role: 'user',
        location_city: null,
        location_state: null,
      };
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name ?? 'User',
      avatarUrl: user.avatar_url ?? '',
      role: user.role as AuthUser['role'],
      location_city: user.location_city,
      location_state: user.location_state,
    };
  } catch (e) {
    // Silent — user just isn't logged in
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
