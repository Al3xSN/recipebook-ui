'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiRequestError } from '@/lib/api';
import type { IRecipeDto } from '@/interfaces/IRecipe';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DetailsStep } from '@/app/(protected)/recipes/new/steps/DetailsStep';
import { IngredientsStep } from '@/app/(protected)/recipes/new/steps/IngredientsStep';
import { StepsStep } from '@/app/(protected)/recipes/new/steps/StepsStep';
import { PublishStep } from '@/app/(protected)/recipes/new/steps/PublishStep';
import { EditRecipePageSkeleton } from './_components/EditRecipePageSkeleton';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
type Visibility = 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';

const STEP_LABELS = ['DETAILS', 'INGREDIENTS', 'STEPS', 'PUBLISH'] as const;

const EditRecipePage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const { id } = use(params);

  const [isLoadingRecipe, setIsLoadingRecipe] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Image state
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(-1);
  const [tags, setTags] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState('');
  const [cookTimeMinutes, setCookTimeMinutes] = useState('');
  const [servings, setServings] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC');
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: 0 }]);
  const [instructions, setInstructions] = useState([{ text: '' }]);

  useEffect(() => {
    apiFetch<IRecipeDto>(`/api/recipes/${id}`)
      .then((r) => {
        setTitle(r.title);
        setDescription(r.description ?? '');
        setCategory(r.category);
        setTags(r.tags);
        setDifficulty((r.difficulty as Difficulty) ?? 'EASY');
        setVisibility(r.visibility as Visibility);
        setPrepTimeMinutes(String(r.prepTimeMinutes));
        setCookTimeMinutes(String(r.cookTimeMinutes));
        setServings(String(r.servings));
        setExistingImageUrl(r.imageUrl ?? null);
        setPendingImagePreview(r.imageUrl ?? null);
        setIngredients(
          r.ingredients.map((i) => ({ name: i.name, amount: String(i.amount), unit: i.unit })),
        );
        setInstructions(r.instructions.map((s) => ({ text: s.text })));
      })
      .catch((err) => {
        if (err instanceof ApiRequestError) setLoadError(err.detail);
        else setLoadError('Failed to load recipe.');
      })
      .finally(() => setIsLoadingRecipe(false));
  }, [id]);

  const handleSave = async () => {
    setSubmitError(null);
    setIsLoading(true);

    try {
      await apiFetch(`/api/recipes/${id}`, {
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
        await fetch(`/api/recipes/${id}/image`, { method: 'DELETE' }).catch(() => {});
      }
      if (pendingImageFile) {
        const form = new FormData();
        form.append('image', pendingImageFile);
        await fetch(`/api/recipes/${id}/image`, { method: 'POST', body: form }).catch(() => {});
      }

      router.push(`/recipes/${id}`);
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

  if (isLoadingRecipe) {
    return <EditRecipePageSkeleton />;
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <p className="text-sm text-red-600">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="text-xl font-bold"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
        >
          Edit Recipe
        </h1>
        <button
          type="button"
          onClick={() => setShowCancelModal(true)}
          className="text-sm transition-colors hover:opacity-70"
          style={{ color: 'var(--text2)' }}
        >
          Cancel
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-8 flex">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <span
                className="text-[9px] font-semibold tracking-widest"
                style={{
                  color: isActive ? 'var(--accent)' : isDone ? 'var(--text2)' : 'var(--text3)',
                }}
              >
                {label}
              </span>
              <div
                className="h-0.5 w-full"
                style={{
                  backgroundColor: isActive || isDone ? 'var(--accent)' : 'var(--border)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Steps */}
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
        onConfirm={() => router.push(`/recipes/${id}`)}
        onCancel={() => setShowCancelModal(false)}
      />
    </div>
  );
};

export default EditRecipePage;
