import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';

type Params = { params: Promise<{ id: string; commentId: string }> };

// DELETE /api/recipes/[id]/comments/[commentId]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id: recipeId, commentId } = await params;

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: { recipe: { select: { userId: true } } },
  });

  if (!comment || comment.recipeId !== recipeId) return apiError(404, 'Comment not found.');

  const isAuthor = comment.authorId === session.userId;
  const isRecipeOwner = comment.recipe.userId === session.userId;
  if (!isAuthor && !isRecipeOwner) return apiError(403, 'Access denied.');

  await db.comment.delete({ where: { id: commentId } });
  return new NextResponse(null, { status: 204 });
}
