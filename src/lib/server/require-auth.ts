import { auth } from '@/auth';
import { apiError } from '@/lib/server/api-error';

export type AuthSession = {
  userId: string;
  email: string;
  username: string;
  displayName: string | null;
};

/**
 * Call at the top of a Route Handler to enforce authentication.
 * Returns the session data on success, or a 401 NextResponse to return directly.
 *
 * Usage:
 *   const result = await requireAuth();
 *   if (result instanceof Response) return result;
 *   const { userId } = result;
 */
export async function requireAuth(): Promise<AuthSession | Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return apiError(401, 'Authentication required.');
  }

  return {
    userId: session.user.id,
    email: session.user.email,
    username: session.user.username,
    displayName: session.user.displayName,
  };
}
