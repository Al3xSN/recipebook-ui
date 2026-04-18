import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { getRecipesByUserId, createRecipe } from '@/lib/server/recipe';

// GET /api/recipes — list all recipes owned by the authenticated user
export const GET = async () => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const recipes = await getRecipesByUserId(session.userId);

  return NextResponse.json(recipes);
};

// POST /api/recipes — create a new recipe
export const POST = async (req: NextRequest) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

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
  if (category === undefined) return apiError(422, 'Category is required.');
  if (visibility === undefined) return apiError(422, 'Visibility is required.');
  if (prepTimeMinutes === undefined) return apiError(422, 'Prep time is required.');
  if (cookTimeMinutes === undefined) return apiError(422, 'Cook time is required.');
  if (servings === undefined) return apiError(422, 'Servings is required.');

  const recipe = await createRecipe(session.userId, {
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

  return NextResponse.json(recipe, { status: 201 });
};
