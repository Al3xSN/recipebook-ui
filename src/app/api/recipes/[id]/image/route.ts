import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { RecipeNotFoundError, RecipeAccessError } from '@/lib/server/recipe';
import { updateRecipeImage, deleteRecipeImage } from '@/lib/server/recipe/image';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type Params = { params: Promise<{ id: string }> };

export const POST = async (req: NextRequest, { params }: Params) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;

  const formData = await req.formData().catch(() => null);
  if (!formData) return apiError(400, 'Invalid form data.');

  const file = formData.get('image');
  if (!(file instanceof File)) return apiError(422, 'No file provided.');
  if (!ALLOWED_TYPES.includes(file.type))
    return apiError(422, 'Only JPEG, PNG, and WebP images are supported.');
  if (file.size > MAX_BYTES) return apiError(422, 'File must be 2 MB or smaller.');

  try {
    const url = await updateRecipeImage(id, session.userId, file);
    return NextResponse.json({ url });
  } catch (e) {
    if (e instanceof RecipeNotFoundError) return apiError(404, 'Recipe not found.');
    if (e instanceof RecipeAccessError) return apiError(403, 'Access denied.');
    throw e;
  }
};

export const DELETE = async (_req: NextRequest, { params }: Params) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;

  try {
    await deleteRecipeImage(id, session.userId);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    if (e instanceof RecipeNotFoundError) return apiError(404, 'Recipe not found.');
    if (e instanceof RecipeAccessError) return apiError(403, 'Access denied.');
    throw e;
  }
};
