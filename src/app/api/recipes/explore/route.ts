import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { toRecipeDto } from '@/lib/server/recipe-mapper';

// GET /api/recipes/explore
export async function GET(req: NextRequest) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { searchParams } = req.nextUrl;

  const search = searchParams.get('search') || undefined;
  const difficulty = searchParams.get('difficulty')
    ? Number(searchParams.get('difficulty'))
    : undefined;
  const cuisine = searchParams.get('cuisine') ? Number(searchParams.get('cuisine')) : undefined;
  const category = searchParams.get('category') ? Number(searchParams.get('category')) : undefined;
  const tagParams = searchParams.getAll('tags').map(Number);
  const maxTotalMinutes = searchParams.get('maxTotalMinutes')
    ? Number(searchParams.get('maxTotalMinutes'))
    : undefined;
  const minServings = searchParams.get('minServings')
    ? Number(searchParams.get('minServings'))
    : undefined;
  const maxServings = searchParams.get('maxServings')
    ? Number(searchParams.get('maxServings'))
    : undefined;
  const sortOrder = searchParams.get('sortOrder') ? Number(searchParams.get('sortOrder')) : 1;
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || 20)));

  // Get friend IDs for friends-visibility recipes
  const friendships = await db.friendship.findMany({
    where: { OR: [{ userAId: session.userId }, { userBId: session.userId }] },
  });
  const friendIds = friendships.map((f) => (f.userAId === session.userId ? f.userBId : f.userAId));

  const where: Prisma.RecipeWhereInput = {
    AND: [
      // Visibility: public OR (friends + caller is a friend) OR own recipes
      {
        OR: [
          { visibility: 1 },
          { visibility: 2, userId: { in: friendIds } },
          { userId: session.userId },
        ],
      },
      ...(search
        ? [
            {
              title: { contains: search, mode: Prisma.QueryMode.insensitive },
            } as Prisma.RecipeWhereInput,
          ]
        : []),
      ...(difficulty !== undefined ? [{ difficulty }] : []),
      ...(cuisine !== undefined ? [{ cuisine }] : []),
      ...(category !== undefined ? [{ category }] : []),
      ...(tagParams.length > 0 ? [{ tags: { some: { tag: { in: tagParams } } } }] : []),
      ...(maxTotalMinutes !== undefined
        ? [{ AND: [{ prepTimeMinutes: { lte: maxTotalMinutes } }] } as Prisma.RecipeWhereInput]
        : []),
      ...(minServings !== undefined ? [{ servings: { gte: minServings } }] : []),
      ...(maxServings !== undefined ? [{ servings: { lte: maxServings } }] : []),
    ],
  };

  // Filter by maxTotalMinutes on combined time using raw where
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
        ? { createdAt: 'asc' } // placeholder for importCount
        : sortOrder === 4
          ? { prepTimeMinutes: 'asc' }
          : { createdAt: 'desc' }; // default: newest

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

  const totalPages = Math.ceil(totalCount / pageSize);

  return NextResponse.json({
    items: recipes.map(toRecipeDto),
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  });
}
