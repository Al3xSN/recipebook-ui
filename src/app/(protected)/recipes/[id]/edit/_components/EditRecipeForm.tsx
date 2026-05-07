'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiRequestError } from '@/lib/api';
import { IRecipeDto } from '@/interfaces/IRecipe';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DetailsStep } from '@/app/(protected)/recipes/new/steps/DetailsStep';
import { IngredientsStep } from '@/app/(protected)/recipes/new/steps/IngredientsStep';
import { StepsStep } from '@/app/(protected)/recipes/new/steps/StepsStep';
import { PublishStep } from '@/app/(protected)/recipes/new/steps/PublishStep';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
type Visibility = 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';

const STEP_LABELS = ['DETAILS', 'INGREDIENTS', 'STEPS', 'PUBLISH'] as const;

interface IEditRecipeFormProps {
  recipeId: string;
  initialRecipe: IRecipeDto;
}

export const EditRecipeForm = ({ recipeId, initialRecipe }: IEditRecipeFormProps) => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(
    initialRecipe.imageUrl ?? null,
  );
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(
    initialRecipe.imageUrl ?? null,
  );
  const [imageRemoved, setImageRemoved] = useState(false);

  const [title, setTitle] = useState(initialRecipe.title);
  const [description, setDescription] = useState(initialRecipe.description ?? '');
  const [category, setCategory] = useState(initialRecipe.category);
  const [tags, setTags] = useState<number[]>(initialRecipe.tags);
  const [difficulty, setDifficulty] = useState<Difficulty>(
    (initialRecipe.difficulty as Difficulty) ?? 'EASY',
  );
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(String(initialRecipe.prepTimeMinutes));
  const [cookTimeMinutes, setCookTimeMinutes] = useState(String(initialRecipe.cookTimeMinutes));
  const [servings, setServings] = useState(String(initialRecipe.servings));
  const [visibility, setVisibility] = useState<Visibility>(initialRecipe.visibility as Visibility);
  const [ingredients, setIngredients] = useState(
    initialRecipe.ingredients.map((i) => ({
      name: i.name,
      amount: String(i.amount),
      unit: i.unit,
    })),
  );
  const [instructions, setInstructions] = useState(
    initialRecipe.instructions.map((s) => ({ text: s.text })),
  );

  const handleSave = async () => {
    setSubmitError(null);
    setIsLoading(true);

    try {
      await apiFetch(`/api/recipes/${recipeId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          category,
          tags,
          difficulty,
          visibility,
          prepTimeMinutes: Number(prepTimeMinutes) || 0,
          cookTimeMinutes: Number(cookTimeMinutes) || 0,
          servings: Number(servings) || 1,
          imageUrl: imageRemoved ? null : existingImageUrl,
          ingredients: ingredients.map((ing) => ({
            name: ing.name,
            amount: Number(ing.amount) || 0,
            unit: ing.unit,
          })),
          instructions: instructions.map((inst, i) => ({
            stepNumber: i + 1,
            text: inst.text,
          })),
        }),
      });

      if (imageRemoved && existingImageUrl) {
        await fetch(`/api/recipes/${recipeId}/image`, { method: 'DELETE' }).catch(() => {});
      }
      if (pendingImageFile) {
        const form = new FormData();
        form.append('image', pendingImageFile);
        await fetch(`/api/recipes/${recipeId}/image`, { method: 'POST', body: form }).catch(
          () => {},
        );
      }

      router.push(`/recipes/${recipeId}`);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setSubmitError(err.detail);
      } else {
        setSubmitError('Failed to save recipe. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-(--text)">Edit Recipe</h1>
        <button
          type="button"
          onClick={() => setShowCancelModal(true)}
          className="text-sm text-(--text2) transition-colors hover:opacity-70"
        >
          Cancel
        </button>
      </div>

      <div className="mb-8 flex">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = step === stepNum;
          const isDone = step > stepNum;

          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={`text-[9px] font-semibold tracking-widest text-(${isActive ? '--accent' : isDone ? '--text2' : '--text3'})`}
              >
                {label}
              </span>
              <div
                className={`h-0.5 w-full bg-(${isActive || isDone ? '--accent' : '--border'})`}
              />
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <DetailsStep
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          category={category}
          setCategory={setCategory}
          tags={tags}
          setTags={setTags}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          prepTimeMinutes={prepTimeMinutes}
          setPrepTimeMinutes={setPrepTimeMinutes}
          cookTimeMinutes={cookTimeMinutes}
          setCookTimeMinutes={setCookTimeMinutes}
          servings={servings}
          setServings={setServings}
          pendingImagePreview={pendingImagePreview}
          onImageSelect={(file, preview) => {
            setPendingImageFile(file);
            setPendingImagePreview(preview);
            setImageRemoved(false);
          }}
          onImageRemove={() => {
            setPendingImageFile(null);
            setPendingImagePreview(null);
            setImageRemoved(true);
            setExistingImageUrl(null);
          }}
          onContinue={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <IngredientsStep
          ingredients={ingredients}
          setIngredients={setIngredients}
          onBack={() => setStep(1)}
          onContinue={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <StepsStep
          instructions={instructions}
          setInstructions={setInstructions}
          onBack={() => setStep(2)}
          onContinue={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <PublishStep
          title={title}
          category={category}
          prepTimeMinutes={prepTimeMinutes}
          cookTimeMinutes={cookTimeMinutes}
          servings={servings}
          difficulty={difficulty}
          ingredientCount={ingredients.length}
          stepCount={instructions.length}
          visibility={visibility}
          setVisibility={setVisibility}
          onBack={() => setStep(3)}
          onPublish={handleSave}
          isLoading={isLoading}
          error={submitError}
          submitLabel="Save Changes"
          infoBanner="Review your changes and save when ready."
        />
      )}

      <ConfirmModal
        isOpen={showCancelModal}
        title="Discard changes?"
        message="You'll lose all your edits."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        onConfirm={() => router.push(`/recipes/${recipeId}`)}
        onCancel={() => setShowCancelModal(false)}
      />
    </div>
  );
};
