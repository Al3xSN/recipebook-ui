import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { areFriends } from '@/lib/server/friends';
import { toRecipeDto } from '@/lib/server/recipe/mapper';

type Params = { params: Promise<{ friendUserId: string }> };

// GET /api/friends/[friendUserId]/recipes
export const GET = async (_req: NextRequest, { params }: Params) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { friendUserId } = await params;

  if (!(await areFriends(session.userId, friendUserId)))
    return apiError(404, 'Specified user is not a friend.');

  const recipes = await db.recipe.findMany({
    where: { userId: friendUserId },
    include: {
      ingredients: true,
      instructions: true,
      tags: true,
      user: true,
      ratings: { select: { value: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(recipes.map(toRecipeDto));
};
