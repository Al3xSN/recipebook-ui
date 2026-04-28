import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import {
  getRecipeById,
  canAccessRecipe,
  RecipeNotFoundError,
  RecipeAccessError,
} from '@/lib/server/recipe';
import { db } from '@/lib/db';
import { RecipeDetailTabs } from './_components/RecipeDetailTabs';
import { RecipeImageSection } from './_components/RecipeImageSection';
import { RecipeInfoSection } from './_components/RecipeInfoSection';

const RecipeDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  const { id } = await params;

  let recipe: Awaited<ReturnType<typeof getRecipeById>>;
  try {
    recipe = await getRecipeById(id);

    await canAccessRecipe(recipe, session!.user!.id);
  } catch (e) {
    if (e instanceof RecipeNotFoundError || e instanceof RecipeAccessError) {
      notFound();
    }

    throw e;
  }

  const isOwner = recipe.userId === session?.user?.id;

  const [ratingStats, commentCount] = await Promise.all([
    db.rating.aggregate({
      where: { recipeId: id },
      _avg: { value: true },
      _count: { value: true },
    }),
    db.comment.count({ where: { recipeId: id } }),
  ]);

  return (
    <div className="mx-auto max-w-lg">
      <RecipeImageSection recipe={recipe} isOwner={isOwner} />

      <RecipeInfoSection recipe={recipe} ratingStats={ratingStats} />

      <RecipeDetailTabs
        recipe={recipe}
        recipeId={id}
        commentCount={commentCount}
        isOwner={isOwner}
      />
    </div>
  );
};

export default RecipeDetailPage;
