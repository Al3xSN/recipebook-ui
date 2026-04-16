import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { areFriends } from '@/lib/server/friendship-helpers';
import { toRecipeDto } from '@/lib/server/recipe-mapper';
import { Visibility } from '@generated/prisma/client';

type Params = { params: Promise<{ friendUserId: string; recipeId: string }> };

// POST /api/friends/[friendUserId]/recipes/[recipeId]/import
export async function POST(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { friendUserId, recipeId } = await params;

  if (!(await areFriends(session.userId, friendUserId))) return apiError(404, 'Friend not found.');

  const original = await db.recipe.findUnique({
    where: { id: recipeId },
    include: { ingredients: true, instructions: true, tags: true },
  });

  if (!original) return apiError(404, 'Recipe not found.');
  if (original.userId !== friendUserId)
    return apiError(403, 'Recipe does not belong to this friend.');

  const copy = await db.recipe.create({
    data: {
      title: original.title,
      description: original.description,
      category: original.category,
      visibility: Visibility.PRIVATE, // imported copies default to Private
      difficulty: original.difficulty,
      cuisine: original.cuisine,
      prepTimeMinutes: original.prepTimeMinutes,
      cookTimeMinutes: original.cookTimeMinutes,
      servings: original.servings,
      imageUrl: original.imageUrl,
      userId: session.userId,
      ingredients: {
        create: original.ingredients.map((i) => ({
          name: i.name,
          amount: i.amount,
          unit: i.unit,
          order: i.order,
        })),
      },
      instructions: {
        create: original.instructions.map((s) => ({
          stepNumber: s.stepNumber,
          text: s.text,
        })),
      },
      tags: { create: original.tags.map((t) => ({ tag: t.tag })) },
    },
    include: { ingredients: true, instructions: true, tags: true, user: true },
  });

  return NextResponse.json(toRecipeDto(copy), { status: 201 });
}
