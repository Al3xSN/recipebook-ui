import { db } from '@/lib/db';
import { createNotification, NotificationType } from '@/lib/server/notifications';
import { RecipeNotFoundError } from './index';

export interface IRatingResult {
  recipeId: string;
  userId: string;
  value: number;
  averageRating: number;
  totalCount: number;
}

export const upsertRating = async (
  recipeId: string,
  userId: string,
  value: number,
): Promise<IRatingResult> => {
  const recipe = await db.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) throw new RecipeNotFoundError();

  await db.$transaction(async (tx) => {
    await tx.rating.upsert({
      where: { recipeId_userId: { recipeId, userId } },
      create: { recipeId, userId, value },
      update: { value },
    });
    await createNotification(tx, {
      userId: recipe.userId,
      senderId: userId,
      type: NotificationType.RATING,
      referenceId: recipeId,
    });
  });

  const stats = await db.rating.aggregate({
    where: { recipeId },
    _avg: { value: true },
    _count: { value: true },
  });

  return {
    recipeId,
    userId,
    value,
    averageRating: stats._avg.value ?? 0,
    totalCount: stats._count.value,
  };
};
