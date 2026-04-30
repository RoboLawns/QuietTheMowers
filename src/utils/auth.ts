import { getDBFromLocals } from './db';

// In production, Clerk provides the session via Astro.locals.auth()
// For development without Clerk configured, use a mock session

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  role: 'user' | 'organizer' | 'admin';
}

// Get the current user from Clerk
export async function getCurrentUser(_locals: App.Locals): Promise<AuthUser | null> {
  try {
    const locals = _locals as any;

    // @clerk/astro provides locals.auth() which returns { userId } or a promise
    if (typeof locals?.auth === 'function') {
      const authResult = await locals.auth();
      const userId = authResult?.userId;
      if (userId) {
        const db = getDBFromLocals(_locals);
        const result = db.prepare('SELECT * FROM users WHERE auth_provider_id = ?').bind(userId).all();
        const user = result?.results?.[0] as any;
        if (user) {
          return {
            id: user.id,
            email: user.email,
            displayName: user.display_name ?? 'User',
            avatarUrl: user.avatar_url ?? '',
            role: user.role as AuthUser['role'],
          };
        }
      }
    }
  } catch {
    // Clerk not configured or DB not available
  }

  return null;
}

// Create or find user in our DB after Clerk sign-in
export async function syncUser(locals: App.Locals, clerkUser: { id: string; email: string; name?: string; imageUrl?: string }) {
  const db = getDBFromLocals(locals);
  const existing = db.prepare('SELECT * FROM users WHERE auth_provider_id = ?').bind(clerkUser.id).first() as any;

  if (existing) {
    // Update
    db.prepare(
      'UPDATE users SET email = ?, display_name = ?, avatar_url = ?, updated_at = datetime(\'now\') WHERE auth_provider_id = ?'
    ).bind(clerkUser.email, clerkUser.name ?? null, clerkUser.imageUrl ?? null, clerkUser.id).run();
    return existing as AuthUser;
  }

  // Create
  const id = crypto.randomUUID();
  db.prepare(
    'INSERT INTO users (id, auth_provider_id, email, display_name, avatar_url, role) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, clerkUser.id, clerkUser.email, clerkUser.name ?? null, clerkUser.imageUrl ?? null, 'user').run();

  return {
    id,
    email: clerkUser.email,
    displayName: clerkUser.name ?? 'User',
    avatarUrl: clerkUser.imageUrl ?? '',
    role: 'user' as const,
  };
}
