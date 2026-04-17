import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { areFriends } from '@/lib/server/friendship-helpers';
import { toRecipeDto } from '@/lib/server/recipe-mapper';
import { getUserByUsername } from '@/lib/server/user';
import { Visibility, FriendRequestStatus } from '@generated/prisma/client';

type Params = { params: Promise<{ username: string }> };

// GET /api/users/[username]/profile
export const GET = async (_req: NextRequest, { params }: Params) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { username } = await params;
  const target = await getUserByUsername(username);
  if (!target) return apiError(404, 'User not found.');

  const isFriend = await areFriends(session.userId, target.id);

  // Determine friendship status
  let friendshipStatus = 0; // NotFriends
  if (isFriend) {
    friendshipStatus = 3; // Friends
  } else {
    const pending = await db.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: session.userId, receiverId: target.id, status: FriendRequestStatus.PENDING },
          { senderId: target.id, receiverId: session.userId, status: FriendRequestStatus.PENDING },
        ],
      },
    });
    if (pending) {
      friendshipStatus = pending.senderId === session.userId ? 1 : 2; // PendingOutgoing : PendingIncoming
    }
  }

  // Recipes visible to caller
  const visibilityFilter = isFriend
    ? { in: [Visibility.PUBLIC, Visibility.FRIENDS_ONLY] }
    : { equals: Visibility.PUBLIC };

  const recipes = await db.recipe.findMany({
    where: { userId: target.id, visibility: visibilityFilter },
    include: { ingredients: true, instructions: true, tags: true, user: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    userId: target.id,
    username: target.username,
    displayName: target.displayName,
    bio: target.bio,
    avatarUrl: target.avatarUrl,
    friendshipStatus,
    recipes: recipes.map(toRecipeDto),
  });
};
