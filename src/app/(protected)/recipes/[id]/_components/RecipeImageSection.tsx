import { BookIcon, EditIcon } from '@/components/icons';
import Image from 'next/image';
import { RecipeHeroActions } from './RecipeHeroActions';
import Link from 'next/link';
import { DeleteRecipeButton } from './DeleteRecipeButton';
import { IRecipeDto } from '@/interfaces/IRecipe';

interface IRecipeImageSectionProps {
  recipe: IRecipeDto;
  isOwner: boolean;
}

export const RecipeImageSection = ({ recipe, isOwner }: IRecipeImageSectionProps) => {
  return (
    <div className="relative">
      {recipe.imageUrl ? (
        <div className="relative aspect-video w-full bg-(--bg2)">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-contain"
            sizes="(max-width: 512px) 100vw, 512px"
            priority
          />
        </div>
      ) : (
        <div className="flex h-64 w-full items-center justify-center bg-[#e8d5cc]">
          <BookIcon className="h-16 w-16 text-[#c4a99a]" strokeWidth={1.5} />
        </div>
      )}

      <RecipeHeroActions />

      {isOwner && (
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-orange-500"
          >
            <EditIcon className="h-3.5 w-3.5" />
            Edit
          </Link>

          <DeleteRecipeButton recipeId={recipe.id} />
        </div>
      )}
    </div>
  );
};
