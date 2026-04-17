import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import {
  getRecipeById,
  canAccessRecipe,
  updateRecipe,
  deleteRecipe,
  RecipeNotFoundError,
  RecipeAccessError,
} from '@/lib/server/recipe';

type Params = { params: Promise<{ id: string }> };

// GET /api/recipes/[id]
export const GET = async (_req: NextRequest, { params }: Params) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;

  try {
    const recipe = await getRecipeById(id);
    await canAccessRecipe(recipe, session.userId);
    return NextResponse.json(recipe);
  } catch (e) {
    if (e instanceof RecipeNotFoundError) return apiError(404, 'Recipe not found.');
    if (e instanceof RecipeAccessError) return apiError(403, 'Access denied.');
    throw e;
  }
};

// PUT /api/recipes/[id]
export const PUT = async (req: NextRequest, { params }: Params) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;

  try {
    const existing = await getRecipeById(id);
    if (existing.userId !== session.userId) return apiError(403, 'Access denied.');

    const body = await req.json().catch(() => null);
    if (!body) return apiError(400, 'Invalid request body.');

    const {
      title,
      description,
      ingredients = [],
      instructions = [],
      tags = [],
      category,
      visibility,
      difficulty,
      cuisine,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      imageUrl,
    } = body;

    if (!title?.trim()) return apiError(422, 'Title is required.');

    const recipe = await updateRecipe(id, {
      title: title.trim(),
      description: description?.trim() || null,
      ingredients,
      instructions,
      tags,
      category,
      visibility,
      difficulty: difficulty ?? null,
      cuisine: cuisine ?? null,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      imageUrl: imageUrl?.trim() || null,
    });

    return NextResponse.json(recipe);
  } catch (e) {
    if (e instanceof RecipeNotFoundError) return apiError(404, 'Recipe not found.');
    throw e;
  }
};

// DELETE /api/recipes/[id]
export const DELETE = async (_req: NextRequest, { params }: Params) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;

  try {
    const existing = await getRecipeById(id);
    if (existing.userId !== session.userId) return apiError(403, 'Access denied.');
    await deleteRecipe(id);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    if (e instanceof RecipeNotFoundError) return apiError(404, 'Recipe not found.');
    throw e;
  }
};
