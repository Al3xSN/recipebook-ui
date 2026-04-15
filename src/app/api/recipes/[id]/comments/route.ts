import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';

type Params = { params: Promise<{ id: string }> };

// GET /api/recipes/[id]/comments
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id: recipeId } = await params;
  const recipe = await db.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) return apiError(404, 'Recipe not found.');

  const comments = await db.comment.findMany({
    where: { recipeId },
    include: { author: { select: { username: true, avatarUrl: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(
    comments.map((c) => ({
      id: c.id,
      recipeId: c.recipeId,
      authorUserId: c.authorId,
      authorUsername: c.author.username,
      authorAvatarUrl: c.author.avatarUrl,
      text: c.text,
      createdAt: c.createdAt,
    })),
  );
}

// POST /api/recipes/[id]/comments
export async function POST(req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id: recipeId } = await params;
  const recipe = await db.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) return apiError(404, 'Recipe not found.');

  const body = await req.json().catch(() => null);
  const text = body?.text?.trim();
  if (!text) return apiError(422, 'Comment text is required.');
  if (text.length > 500) return apiError(422, 'Comment must be 500 characters or fewer.');

  const comment = await db.comment.create({
    data: { recipeId, authorId: session.userId, text },
    include: { author: { select: { username: true, avatarUrl: true } } },
  });

  return NextResponse.json({
    id: comment.id,
    recipeId: comment.recipeId,
    authorUserId: comment.authorId,
    authorUsername: comment.author.username,
    authorAvatarUrl: comment.author.avatarUrl,
    text: comment.text,
    createdAt: comment.createdAt,
  });
}
