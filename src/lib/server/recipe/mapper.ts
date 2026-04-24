import { Recipe, Ingredient, InstructionStep, RecipeTag, User } from '@generated/prisma/client';

type RecipeWithRelations = Recipe & {
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  tags: RecipeTag[];
  user: User;
  ratings: { value: number }[];
};

export const toRecipeDto = (recipe: RecipeWithRelations) => {
  const ratingCount = recipe.ratings.length;
  const averageRating =
    ratingCount > 0 ? recipe.ratings.reduce((sum, r) => sum + r.value, 0) / ratingCount : null;

  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    ingredients: recipe.ingredients.map((i) => ({
      name: i.name,
      amount: Number(i.amount),
      unit: i.unit,
      order: i.order,
    })),
    instructions: recipe.instructions.map((s) => ({
      stepNumber: s.stepNumber,
      text: s.text,
    })),
    tags: recipe.tags.map((t) => t.tag),
    category: recipe.category,
    visibility: recipe.visibility,
    difficulty: recipe.difficulty,
    cuisine: recipe.cuisine,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    servings: recipe.servings,
    imageUrl: recipe.imageUrl,
    userId: recipe.userId,
    author: {
      username: recipe.user.username ?? '',
      displayName: recipe.user.displayName ?? recipe.user.username ?? '',
      avatarUrl: recipe.user.avatarUrl,
    },
    createdAt: recipe.createdAt instanceof Date ? recipe.createdAt.toISOString() : recipe.createdAt,
    updatedAt: recipe.updatedAt instanceof Date ? recipe.updatedAt.toISOString() : recipe.updatedAt,
    averageRating,
    ratingCount,
  };
};
