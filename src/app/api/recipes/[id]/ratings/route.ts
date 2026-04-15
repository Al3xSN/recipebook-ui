import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';

type Params = { params: Promise<{ id: string }> };

// POST /api/recipes/[id]/ratings
export async function POST(req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id: recipeId } = await params;
  const recipe = await db.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) return apiError(404, 'Recipe not found.');

  if (recipe.userId === session.userId) return apiError(422, 'You cannot rate your own recipe.');

  const body = await req.json().catch(() => null);
  const value = body?.value;

  if (typeof value !== 'number' || value < 1 || value > 5)
    return apiError(422, 'Rating value must be between 1 and 5.');

  await db.rating.upsert({
    where: { recipeId_userId: { recipeId, userId: session.userId } },
    create: { recipeId, userId: session.userId, value },
    update: { value },
  });

  const stats = await db.rating.aggregate({
    where: { recipeId },
    _avg: { value: true },
    _count: { value: true },
  });

  return NextResponse.json({
    recipeId,
    userId: session.userId,
    value,
    averageRating: stats._avg.value ?? 0,
    totalCount: stats._count.value,
  });
}
