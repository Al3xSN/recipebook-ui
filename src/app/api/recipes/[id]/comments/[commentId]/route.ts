import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import {
  deleteComment,
  CommentNotFoundError,
  CommentAccessError,
} from '@/lib/server/recipe/comments';

type Params = { params: Promise<{ id: string; commentId: string }> };

// DELETE /api/recipes/[id]/comments/[commentId]
export const DELETE = async (_req: NextRequest, { params }: Params) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id: recipeId, commentId } = await params;

  try {
    await deleteComment(commentId, recipeId, session.userId);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    if (e instanceof CommentNotFoundError) return apiError(404, 'Comment not found.');
    if (e instanceof CommentAccessError) return apiError(403, 'Access denied.');
    throw e;
  }
};
