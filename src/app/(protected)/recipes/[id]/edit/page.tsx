import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import {
  getRecipeById,
  canAccessRecipe,
  RecipeNotFoundError,
  RecipeAccessError,
} from '@/lib/server/recipe';
import { EditRecipeForm } from './_components/EditRecipeForm';

const EditRecipePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  const { id } = await params;

  let recipe: Awaited<ReturnType<typeof getRecipeById>>;
  try {
    recipe = await getRecipeById(id);
    await canAccessRecipe(recipe, session!.user!.id);
  } catch (e) {
    if (e instanceof RecipeNotFoundError || e instanceof RecipeAccessError) notFound();
    throw e;
  }

  if (recipe.userId !== session!.user!.id) notFound();

  return <EditRecipeForm recipeId={id} initialRecipe={recipe} />;
};

export default EditRecipePage;
