import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { toRecipeDto } from '@/lib/server/recipe-mapper';

type Params = { params: Promise<{ id: string }> };

// GET /api/recipes/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;
  const recipe = await db.recipe.findUnique({
    where: { id },
    include: { ingredients: true, instructions: true, tags: true },
  });

  if (!recipe) return apiError(404, 'Recipe not found.');

  const isOwner = recipe.userId === session.userId;
  if (!isOwner) {
    if (recipe.visibility === 0) return apiError(403, 'Access denied.');
    if (recipe.visibility === 2) {
      const friendship = await db.friendship.findFirst({
        where: {
          OR: [
            { userAId: session.userId, userBId: recipe.userId },
            { userAId: recipe.userId, userBId: session.userId },
          ],
        },
      });
      if (!friendship) return apiError(403, 'Access denied.');
    }
  }

  return NextResponse.json(toRecipeDto(recipe));
}

// PUT /api/recipes/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;
  const existing = await db.recipe.findUnique({ where: { id } });
  if (!existing) return apiError(404, 'Recipe not found.');
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

  // Full replacement: delete nested entities and re-insert
  const [, , , recipe] = await db.$transaction([
    db.ingredient.deleteMany({ where: { recipeId: id } }),
    db.instructionStep.deleteMany({ where: { recipeId: id } }),
    db.recipeTag.deleteMany({ where: { recipeId: id } }),
    db.recipe.update({
      where: { id },
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
        ingredients: { create: ingredients },
        instructions: { create: instructions },
        tags: { create: tags.map((tag: number) => ({ tag })) },
      },
      include: { ingredients: true, instructions: true, tags: true },
    }),
  ]);

  return NextResponse.json(toRecipeDto(recipe));
}

// DELETE /api/recipes/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;
  const existing = await db.recipe.findUnique({ where: { id } });
  if (!existing) return apiError(404, 'Recipe not found.');
  if (existing.userId !== session.userId) return apiError(403, 'Access denied.');

  await db.recipe.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
