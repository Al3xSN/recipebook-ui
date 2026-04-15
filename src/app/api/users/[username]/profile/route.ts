import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { areFriends, orderedPair } from '@/lib/server/friendship-helpers';
import { toRecipeDto } from '@/lib/server/recipe-mapper';

type Params = { params: Promise<{ username: string }> };

// GET /api/users/[username]/profile
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { username } = await params;
  const target = await db.user.findUnique({ where: { username } });
  if (!target) return apiError(404, 'User not found.');

  // 404 if caller is blocked by target
  const blocked = await db.block.findUnique({
    where: { blockerId_blockedId: { blockerId: target.id, blockedId: session.userId } },
  });
  if (blocked) return apiError(404, 'User not found.');

  const isFriend = await areFriends(session.userId, target.id);

  // Determine friendship status
  let friendshipStatus = 0; // NotFriends
  if (isFriend) {
    friendshipStatus = 3; // Friends
  } else {
    const [a, b] = orderedPair(session.userId, target.id);
    const pending = await db.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: session.userId, receiverId: target.id, status: 0 },
          { senderId: target.id, receiverId: session.userId, status: 0 },
        ],
      },
    });
    if (pending) {
      friendshipStatus = pending.senderId === session.userId ? 1 : 2; // PendingOutgoing : PendingIncoming
    }
    void a;
    void b;
  }

  // Recipes visible to caller
  const visibilityFilter = isFriend ? { in: [1, 2] } : { equals: 1 };

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
}
