import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { toRecipeDto } from '@/lib/server/recipe-mapper';

// GET /api/recipes — list all recipes owned by the authenticated user
export async function GET() {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const recipes = await db.recipe.findMany({
    where: { userId: session.userId },
    include: { ingredients: true, instructions: true, tags: true, user: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(recipes.map(toRecipeDto));
}

// POST /api/recipes — create a new recipe
export async function POST(req: NextRequest) {
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

  const recipe = await db.recipe.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      category,
      visibility,
      difficulty: difficulty ?? null,
      cuisine: cuisine ?? null,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      imageUrl: imageUrl?.trim() || null,
      userId: session.userId,
      ingredients: { create: ingredients },
      instructions: { create: instructions },
      tags: { create: tags.map((tag: number) => ({ tag })) },
    },
    include: { ingredients: true, instructions: true, tags: true, user: true },
  });

  return NextResponse.json(toRecipeDto(recipe), { status: 201 });
}
