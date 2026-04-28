import { del } from '@vercel/blob';
import { Visibility, FriendRequestStatus } from '@generated/prisma/client';
import { db } from '@/lib/db';
import { toRecipeCardDto, toRecipeDto } from '@/lib/server/recipe/mapper';
import {
  IRecipeDto,
  ICreateRecipeData,
  IUpdateRecipeData,
  IRecipeCardDto,
} from '@/interfaces/IRecipe';
import { FriendshipStatus } from '@/enums/FriendshipStatus';

export class RecipeNotFoundError extends Error {
  constructor() {
    super('Recipe not found.');
    this.name = 'RecipeNotFoundError';
  }
}

export class RecipeAccessError extends Error {
  constructor() {
    super('Access denied.');
    this.name = 'RecipeAccessError';
  }
}

const RECIPE_INCLUDE = {
  ingredients: true,
  instructions: true,
  tags: true,
  user: true,
  ratings: { select: { value: true } },
} as const;

export const getRecipeById = async (id: string): Promise<IRecipeDto> => {
  const recipe = await db.recipe.findUnique({
    where: { id },
    include: RECIPE_INCLUDE,
  });
  if (!recipe) throw new RecipeNotFoundError();
  return toRecipeDto(recipe);
};

export const getRecipesByUserIdAsync = async (
  userId: string,
  isOwner: boolean,
  friendshipStatus: FriendshipStatus,
): Promise<IRecipeCardDto[]> => {
  const visibilityFilter = isOwner
    ? undefined
    : friendshipStatus === FriendshipStatus.Friends
      ? { in: [Visibility.PUBLIC, Visibility.FRIENDS_ONLY] }
      : { equals: Visibility.PUBLIC };

  const recipes = await db.recipe.findMany({
    where: {
      userId,
      visibility: visibilityFilter,
    },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      category: true,
      visibility: true,
      cookTimeMinutes: true,
      prepTimeMinutes: true,
      user: { select: { displayName: true } },
      ratings: { select: { value: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return recipes.map(toRecipeCardDto);
};

export const getPublicRecipes = async (category?: number): Promise<IRecipeCardDto[]> => {
  const recipes = await db.recipe.findMany({
    where: {
      visibility: Visibility.PUBLIC,
      ...(category !== undefined ? { category } : {}),
    },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      category: true,
      visibility: true,
      cookTimeMinutes: true,
      prepTimeMinutes: true,
      user: { select: { displayName: true } },
      ratings: { select: { value: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return recipes.map(toRecipeCardDto);
};

export const canAccessRecipe = async (
  recipe: { userId: string; visibility: Visibility },
  viewerId: string,
): Promise<void> => {
  if (recipe.userId === viewerId) return;
  if (recipe.visibility === Visibility.PRIVATE) throw new RecipeAccessError();
  if (recipe.visibility === Visibility.FRIENDS_ONLY) {
    const connection = await db.friendRequest.findFirst({
      where: {
        status: FriendRequestStatus.ACCEPTED,
        OR: [
          { senderId: viewerId, receiverId: recipe.userId },
          { senderId: recipe.userId, receiverId: viewerId },
        ],
      },
    });
    if (!connection) throw new RecipeAccessError();
  }
};

export const createRecipe = async (
  userId: string,
  data: ICreateRecipeData,
): Promise<IRecipeDto> => {
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
  } = data;

  const recipe = await db.recipe.create({
    data: {
      title,
      description: description || null,
      category,
      visibility,
      difficulty: difficulty ?? null,
      cuisine: cuisine ?? null,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      imageUrl: imageUrl || null,
      userId,
      ingredients: { create: ingredients.map((i) => ({ ...i, order: i.order ?? 0 })) },
      instructions: { create: instructions },
      tags: { create: tags.map((tag) => ({ tag })) },
    },
    include: RECIPE_INCLUDE,
  });

  return toRecipeDto(recipe);
};

export const updateRecipe = async (id: string, data: IUpdateRecipeData): Promise<IRecipeDto> => {
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
  } = data;

  const [, , , recipe] = await db.$transaction([
    db.ingredient.deleteMany({ where: { recipeId: id } }),
    db.instructionStep.deleteMany({ where: { recipeId: id } }),
    db.recipeTag.deleteMany({ where: { recipeId: id } }),
    db.recipe.update({
      where: { id },
      data: {
        title,
        description: description || null,
        category,
        visibility,
        difficulty: difficulty ?? null,
        cuisine: cuisine ?? null,
        prepTimeMinutes,
        cookTimeMinutes,
        servings,
        imageUrl: imageUrl || null,
        ingredients: { create: ingredients.map((i) => ({ ...i, order: i.order ?? 0 })) },
        instructions: { create: instructions },
        tags: { create: tags.map((tag) => ({ tag })) },
      },
      include: RECIPE_INCLUDE,
    }),
  ]);

  return toRecipeDto(recipe);
};

export const deleteRecipe = async (id: string): Promise<void> => {
  const recipe = await db.recipe.findUnique({ where: { id }, select: { imageUrl: true } });
  if (recipe?.imageUrl) {
    await del(recipe.imageUrl).catch(() => {});
  }
  await db.recipe.delete({ where: { id } });
};
