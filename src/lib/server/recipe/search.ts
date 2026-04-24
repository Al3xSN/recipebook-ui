import { Prisma, Visibility, Difficulty, FriendRequestStatus } from '@generated/prisma/client';
import { db } from '@/lib/db';
import { toRecipeDto } from '@/lib/server/recipe/mapper';
import { IRecipeDto } from '@/interfaces/IRecipe';

export interface ISearchRecipesParams {
  userId: string;
  search?: string;
  difficulty?: string;
  cuisine?: number;
  category?: number;
  tags?: number[];
  maxTotalMinutes?: number;
  minServings?: number;
  maxServings?: number;
  sortOrder?: number;
  page?: number;
  pageSize?: number;
}

export interface ISearchRecipesResult {
  items: IRecipeDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const searchRecipes = async (
  params: ISearchRecipesParams,
): Promise<ISearchRecipesResult> => {
  const {
    userId,
    search,
    difficulty: difficultyParam,
    cuisine,
    category,
    tags: tagParams = [],
    maxTotalMinutes,
    minServings,
    maxServings,
    sortOrder = 1,
    page = 1,
    pageSize = 20,
  } = params;

  const connections = await db.friendRequest.findMany({
    where: {
      status: FriendRequestStatus.ACCEPTED,
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
  });
  const friendIds = connections.map((c) => (c.senderId === userId ? c.receiverId : c.senderId));

  const where: Prisma.RecipeWhereInput = {
    AND: [
      {
        OR: [
          { visibility: Visibility.PUBLIC },
          { visibility: Visibility.FRIENDS_ONLY, userId: { in: friendIds } },
          { userId },
        ],
      },
      ...(search
        ? [
            {
              title: { contains: search, mode: Prisma.QueryMode.insensitive },
            } as Prisma.RecipeWhereInput,
          ]
        : []),
      ...(difficultyParam && Object.values(Difficulty).includes(difficultyParam as Difficulty)
        ? [{ difficulty: difficultyParam as Difficulty }]
        : []),
      ...(cuisine !== undefined ? [{ cuisine }] : []),
      ...(category !== undefined ? [{ category }] : []),
      ...(tagParams.length > 0 ? [{ tags: { some: { tag: { in: tagParams } } } }] : []),
      ...(minServings !== undefined ? [{ servings: { gte: minServings } }] : []),
      ...(maxServings !== undefined ? [{ servings: { lte: maxServings } }] : []),
    ],
  };

  if (maxTotalMinutes !== undefined) {
    (where.AND as Prisma.RecipeWhereInput[]).push({
      prepTimeMinutes: { lte: maxTotalMinutes },
      cookTimeMinutes: { lte: maxTotalMinutes },
    });
  }

  const orderBy: Prisma.RecipeOrderByWithRelationInput =
    sortOrder === 2
      ? { ratings: { _count: 'desc' } }
      : sortOrder === 3
        ? { createdAt: 'asc' }
        : sortOrder === 4
          ? { prepTimeMinutes: 'asc' }
          : { createdAt: 'desc' };

  const [totalCount, recipes] = await Promise.all([
    db.recipe.count({ where }),
    db.recipe.findMany({
      where,
      include: {
        ingredients: true,
        instructions: true,
        tags: true,
        user: true,
        ratings: { select: { value: true } },
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    items: recipes.map(toRecipeDto),
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};
