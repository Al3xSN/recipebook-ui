import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/server/password';
import { apiError } from '@/lib/server/api-error';
import { createUser, UserConflictError } from '@/lib/server/user';

export const POST = async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  if (!body) return apiError(400, 'Invalid request body.');

  const { username, email, password, displayName } = body as {
    username?: string;
    email?: string;
    password?: string;
    displayName?: string;
  };

  if (!username?.trim()) return apiError(422, 'Username is required.');
  if (!email?.trim()) return apiError(422, 'Email is required.');
  if (!password) return apiError(422, 'Password is required.');
  if (password.length < 6) return apiError(422, 'Password must be at least 6 characters.');
  if (!/[A-Z]/.test(password)) return apiError(422, 'Password must contain an uppercase letter.');
  if (!/[a-z]/.test(password)) return apiError(422, 'Password must contain a lowercase letter.');
  if (!/[0-9]/.test(password)) return apiError(422, 'Password must contain a digit.');
  if (!/[^A-Za-z0-9]/.test(password))
    return apiError(422, 'Password must contain a special character.');
  if (displayName && displayName.length > 100)
    return apiError(422, 'Display name must be 100 characters or fewer.');

  const passwordHash = await hashPassword(password);

  try {
    const user = await createUser({
      username: username.trim(),
      email: email.toLowerCase(),
      passwordHash,
      displayName: displayName?.trim() || null,
    });

    return NextResponse.json(
      { id: user.id, username: user.username, email: user.email, displayName: user.displayName },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof UserConflictError) {
      return err.field === 'email'
        ? apiError(422, 'An account with this email already exists.')
        : apiError(422, 'This username is already taken.');
    }
    throw err;
  }
};
