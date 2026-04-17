import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { RecipeNotFoundError } from '@/lib/server/recipe';
import { getComments, addComment } from '@/lib/server/recipe/comments';

type Params = { params: Promise<{ id: string }> };

// GET /api/recipes/[id]/comments
export const GET = async (_req: NextRequest, { params }: Params) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id: recipeId } = await params;

  try {
    const comments = await getComments(recipeId);
    return NextResponse.json(comments);
  } catch (e) {
    if (e instanceof RecipeNotFoundError) return apiError(404, 'Recipe not found.');
    throw e;
  }
};

// POST /api/recipes/[id]/comments
export const POST = async (req: NextRequest, { params }: Params) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id: recipeId } = await params;

  const body = await req.json().catch(() => null);
  const text = body?.text?.trim();
  if (!text) return apiError(422, 'Comment text is required.');
  if (text.length > 500) return apiError(422, 'Comment must be 500 characters or fewer.');

  try {
    const comment = await addComment(recipeId, session.userId, text);
    return NextResponse.json(comment);
  } catch (e) {
    if (e instanceof RecipeNotFoundError) return apiError(404, 'Recipe not found.');
    throw e;
  }
};
