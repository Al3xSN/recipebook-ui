import { put, del } from '@vercel/blob';
import { db } from '@/lib/db';
import { RecipeNotFoundError, RecipeAccessError } from './index';

export const updateRecipeImage = async (
  id: string,
  ownerId: string,
  file: File,
): Promise<string> => {
  const recipe = await db.recipe.findUnique({ where: { id } });
  if (!recipe) throw new RecipeNotFoundError();
  if (recipe.userId !== ownerId) throw new RecipeAccessError();

  if (recipe.imageUrl) {
    await del(recipe.imageUrl).catch(() => {});
  }

  const blob = await put(`recipes/${id}`, file, {
    access: 'public',
    contentType: file.type,
    addRandomSuffix: true,
  });

  await db.recipe.update({ where: { id }, data: { imageUrl: blob.url } });

  return blob.url;
};

export const deleteRecipeImage = async (id: string, ownerId: string): Promise<void> => {
  const recipe = await db.recipe.findUnique({ where: { id } });
  if (!recipe) throw new RecipeNotFoundError();
  if (recipe.userId !== ownerId) throw new RecipeAccessError();

  if (recipe.imageUrl) {
    await del(recipe.imageUrl).catch(() => {});
    await db.recipe.update({ where: { id }, data: { imageUrl: null } });
  }
};
