'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiRequestError } from '@/lib/api';
import type { IRecipeDto } from '@/interfaces/IRecipe';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DetailsStep } from './steps/DetailsStep';
import { IngredientsStep } from './steps/IngredientsStep';
import { StepsStep } from './steps/StepsStep';
import { PublishStep } from './steps/PublishStep';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
type Visibility = 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';

const STEP_LABELS = ['DETAILS', 'INGREDIENTS', 'STEPS', 'PUBLISH'] as const;

const NewRecipePage = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: 0 }]);
  const [instructions, setInstructions] = useState([{ text: '' }]);

  const handlePublish = async () => {
    setSubmitError(null);
    setIsLoading(true);

    try {
      const created = await apiFetch<IRecipeDto>('/api/recipes', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          category,
          visibility,
          difficulty,
          tags,
          prepTimeMinutes: Number(prepTimeMinutes) || 0,
          cookTimeMinutes: Number(cookTimeMinutes) || 0,
          servings: Number(servings) || 1,
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

      if (pendingImageFile) {
        const form = new FormData();
        form.append('image', pendingImageFile);
        await fetch(`/api/recipes/${created.id}/image`, { method: 'POST', body: form }).catch(
          () => {},
        );
      }

      router.push('/recipes');
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setSubmitError(err.detail);
      } else {
        setSubmitError('Failed to create recipe. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="text-xl font-bold"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
        >
          New Recipe
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
          }}
          onImageRemove={() => {
            setPendingImageFile(null);
            setPendingImagePreview(null);
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
          onPublish={handlePublish}
          isLoading={isLoading}
          error={submitError}
        />
      )}

      <ConfirmModal
        isOpen={showCancelModal}
        title="Discard recipe?"
        message="You'll lose all the details you've entered."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        onConfirm={() => router.push('/recipes')}
        onCancel={() => setShowCancelModal(false)}
      />
    </div>
  );
};

export default NewRecipePage;
