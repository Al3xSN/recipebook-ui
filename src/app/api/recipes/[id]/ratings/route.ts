import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { getRecipeById, RecipeNotFoundError } from '@/lib/server/recipe';
import { upsertRating } from '@/lib/server/recipe/ratings';
import { db } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

// GET /api/recipes/[id]/ratings
export const GET = async (_req: NextRequest, { params }: Params) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id: recipeId } = await params;

  const stats = await db.rating.aggregate({
    where: { recipeId },
    _avg: { value: true },
    _count: { value: true },
  });

  return NextResponse.json({
    averageRating: stats._avg.value,
    totalCount: stats._count.value,
  });
};

// POST /api/recipes/[id]/ratings
export const POST = async (req: NextRequest, { params }: Params) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id: recipeId } = await params;

  try {
    const recipe = await getRecipeById(recipeId);

    if (recipe.userId === session.userId) return apiError(422, 'You cannot rate your own recipe.');

    const body = await req.json().catch(() => null);
    const value = body?.value;

    if (typeof value !== 'number' || value < 1 || value > 5)
      return apiError(422, 'Rating value must be between 1 and 5.');

    const result = await upsertRating(recipeId, session.userId, value);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof RecipeNotFoundError) return apiError(404, 'Recipe not found.');
    throw e;
  }
};
