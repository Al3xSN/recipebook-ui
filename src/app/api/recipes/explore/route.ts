import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server/require-auth';
import { searchRecipes } from '@/lib/server/recipe/search';

// GET /api/recipes/explore
export const GET = async (req: NextRequest) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { searchParams } = req.nextUrl;

  const result = await searchRecipes({
    userId: session.userId,
    search: searchParams.get('search') || undefined,
    difficulty: searchParams.get('difficulty') || undefined,
    cuisine: searchParams.get('cuisine') ? Number(searchParams.get('cuisine')) : undefined,
    category: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
    tags: searchParams.getAll('tags').map(Number),
    maxTotalMinutes: searchParams.get('maxTotalMinutes')
      ? Number(searchParams.get('maxTotalMinutes'))
      : undefined,
    minServings: searchParams.get('minServings')
      ? Number(searchParams.get('minServings'))
      : undefined,
    maxServings: searchParams.get('maxServings')
      ? Number(searchParams.get('maxServings'))
      : undefined,
    sortOrder: searchParams.get('sortOrder') ? Number(searchParams.get('sortOrder')) : 1,
    page: Math.max(1, Number(searchParams.get('page') || 1)),
    pageSize: Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || 20))),
  });

  return NextResponse.json(result);
};
