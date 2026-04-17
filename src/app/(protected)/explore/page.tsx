import { Suspense } from 'react';

import { Prisma, Visibility, FriendRequestStatus } from '@generated/prisma/client';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { toRecipeDto } from '@/lib/server/recipe-mapper';
import type { IRecipeDto } from '@/interfaces/IRecipe';
import { RecipeCard } from '../recipes/_components/RecipeCard';
import { ExploreFilters } from './_components/ExploreFilters';

interface IExploreParams {
  search: string;
  sortOrder: number;
  category: number | undefined;
  tags: number[];
  page: number;
  pageSize: number;
}

interface IExploreResult {
  items: IRecipeDto[];
  totalCount: number;
  totalPages: number;
}

async function getExploreRecipes(params: IExploreParams, userId: string): Promise<IExploreResult> {
  const { search, sortOrder, category, tags, page, pageSize } = params;

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
      ...(category !== undefined ? [{ category }] : []),
      ...(tags.length > 0 ? [{ tags: { some: { tag: { in: tags } } } }] : []),
    ],
  };

  const orderBy: Prisma.RecipeOrderByWithRelationInput =
    sortOrder === 2
      ? { ratings: { _count: 'desc' } }
      : sortOrder === 4
        ? { prepTimeMinutes: 'asc' }
        : { createdAt: 'desc' };

  const [totalCount, recipes] = await Promise.all([
    db.recipe.count({ where }),
    db.recipe.findMany({
      where,
      include: { ingredients: true, instructions: true, tags: true, user: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    items: recipes.map(toRecipeDto),
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    sortOrder?: string;
    category?: string;
    tags?: string;
    page?: string;
  }>;
}) {
  const session = await auth();
  const userId = session!.user!.id;

  const { search = '', sortOrder = '1', category = '', tags = '', page = '1' } = await searchParams;

  const params: IExploreParams = {
    search,
    sortOrder: Number(sortOrder),
    category: category ? Number(category) : undefined,
    tags: tags ? [Number(tags)] : [],
    page: Math.max(1, Number(page)),
    pageSize: 20,
  };

  const { items, totalCount, totalPages } = await getExploreRecipes(params, userId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Explore recipes</h1>
        <p className="mt-1 text-sm text-gray-500">Discover recipes shared by the community.</p>
      </div>

      {/* Filters + pagination — client component, Suspense required for useSearchParams */}
      <Suspense fallback={<div className="mb-8 h-32" />}>
        <ExploreFilters totalCount={totalCount} totalPages={totalPages} />
      </Suspense>

      {/* Recipe grid */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <p className="text-sm text-gray-500">No recipes found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} currentUserId={userId} />
          ))}
        </div>
      )}
    </div>
  );
}
