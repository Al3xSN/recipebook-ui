import { db } from '@/lib/db';
import { createNotification, NotificationType } from '@/lib/server/notifications';
import { RecipeNotFoundError } from './index';

export class CommentNotFoundError extends Error {
  constructor() {
    super('Comment not found.');
    this.name = 'CommentNotFoundError';
  }
}

export class CommentAccessError extends Error {
  constructor() {
    super('Access denied.');
    this.name = 'CommentAccessError';
  }
}

export interface ICommentDto {
  id: string;
  recipeId: string;
  authorUserId: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
  text: string;
  createdAt: Date;
}

export const getComments = async (recipeId: string): Promise<ICommentDto[]> => {
  const recipe = await db.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) throw new RecipeNotFoundError();

  const comments = await db.comment.findMany({
    where: { recipeId },
    include: { author: { select: { username: true, avatarUrl: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return comments.map((c) => ({
    id: c.id,
    recipeId: c.recipeId,
    authorUserId: c.authorId,
    authorUsername: c.author.username,
    authorAvatarUrl: c.author.avatarUrl,
    text: c.text,
    createdAt: c.createdAt,
  }));
};

export const addComment = async (
  recipeId: string,
  userId: string,
  text: string,
): Promise<ICommentDto> => {
  const recipe = await db.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) throw new RecipeNotFoundError();

  const comment = await db.$transaction(async (tx) => {
    const c = await tx.comment.create({
      data: { recipeId, authorId: userId, text },
      include: { author: { select: { username: true, avatarUrl: true } } },
    });
    if (recipe.userId !== userId) {
      await createNotification(tx, {
        userId: recipe.userId,
        senderId: userId,
        type: NotificationType.COMMENT,
        referenceId: c.id,
      });
    }
    return c;
  });

  return {
    id: comment.id,
    recipeId: comment.recipeId,
    authorUserId: comment.authorId,
    authorUsername: comment.author.username,
    authorAvatarUrl: comment.author.avatarUrl,
    text: comment.text,
    createdAt: comment.createdAt,
  };
};

export const deleteComment = async (
  commentId: string,
  recipeId: string,
  requesterId: string,
): Promise<void> => {
  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: { recipe: { select: { userId: true } } },
  });

  if (!comment || comment.recipeId !== recipeId) throw new CommentNotFoundError();

  const isAuthor = comment.authorId === requesterId;
  const isRecipeOwner = comment.recipe.userId === requesterId;
  if (!isAuthor && !isRecipeOwner) throw new CommentAccessError();

  await db.comment.delete({ where: { id: commentId } });
};
