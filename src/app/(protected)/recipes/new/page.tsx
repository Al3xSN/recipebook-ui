'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiRequestError } from '@/lib/api';
import { IRecipeDto } from '@/interfaces/IRecipe';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DetailsStep } from './steps/DetailsStep';
import { IngredientsStep } from './steps/IngredientsStep';
import { StepsStep } from './steps/StepsStep';
import { PublishStep } from './steps/PublishStep';
import { ImportStep, type MockExtractedRecipe } from './steps/ImportStep';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
type Visibility = 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
type Mode = 'manual' | 'import';

const MANUAL_STEP_LABELS = ['DETAILS', 'INGREDIENTS', 'STEPS', 'PUBLISH'] as const;
const IMPORT_STEP_LABELS = ['IMPORT', 'PUBLISH'] as const;

const NewRecipePage = () => {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('manual');
  const [step, setStep] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showModeModal, setShowModeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const hasManualData =
    title !== '' ||
    ingredients.some((i) => i.name !== '') ||
    instructions.some((i) => i.text !== '');

  const handleSwitchToImport = () => {
    if (hasManualData) {
      setShowModeModal(true);
    } else {
      setMode('import');
    }
  };

  const confirmSwitchToImport = () => {
    setShowModeModal(false);
    setTitle('');
    setDescription('');
    setCategory(-1);
    setTags([]);
    setDifficulty('EASY');
    setPrepTimeMinutes('');
    setCookTimeMinutes('');
    setServings('');
    setPendingImageFile(null);
    setPendingImagePreview(null);
    setIngredients([{ name: '', amount: '', unit: 0 }]);
    setInstructions([{ text: '' }]);
    setStep(1);
    setMode('import');
  };

  const handleImportComplete = useCallback((data: MockExtractedRecipe) => {
    setTitle(data.title);
    setDescription(data.description);
    setCategory(data.category);
    setDifficulty(data.difficulty);
    setPrepTimeMinutes(data.prepTimeMinutes);
    setCookTimeMinutes(data.cookTimeMinutes);
    setServings(data.servings);
    setTags(data.tags);
    setIngredients(data.ingredients);
    setInstructions(data.instructions);
    setMode('manual');
    setStep(1);
  }, []);

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
    <div className="max-w-lg p-5">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-(--text)">New Recipe</h1>
        <button
          type="button"
          onClick={() => (hasManualData ? setShowCancelModal(true) : router.push('/recipes'))}
          className="text-sm text-(--text2) transition-colors hover:opacity-70"
        >
          Cancel
        </button>
      </div>

      <div className="mb-6 flex gap-2 rounded-full border border-solid border-(--border) bg-(--bg2) p-1">
        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`flex-1 cursor-pointer rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors bg-${mode === 'manual' ? '(--accent)' : 'transparent'} text-${mode === 'manual' ? 'white' : '(--text2)'}`}
        >
          🔥 Manual
        </button>
        <button
          type="button"
          onClick={handleSwitchToImport}
          className={`flex-1 cursor-pointer rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors bg-${mode !== 'manual' ? '(--accent)' : 'transparent'} text-${mode !== 'manual' ? 'white' : '(--text2)'}`}
        >
          🪄 Import from video
        </button>
      </div>

      {mode === 'manual' ? (
        <div className="mb-8 flex">
          {MANUAL_STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <div key={label} className="flex flex-1 flex-col items-center gap-1">
                <span
                  className={`text-[9px] font-semibold tracking-widest text-${isActive ? '(--accent)' : isDone ? '(--text2)' : '(--text3)'}`}
                >
                  {label}
                </span>

                <div
                  className={`bg-${isActive || isDone ? '(--accent)' : '(--border)'} h-0.5 w-full`}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-8 flex">
          {IMPORT_STEP_LABELS.map((label, i) => {
            const isActive = i === 0;
            return (
              <div key={label} className="flex flex-1 flex-col items-center gap-1">
                <span
                  className={`text-[9px] font-semibold tracking-widest text-${isActive ? '(--accent)' : '(--text3)'}`}
                >
                  {label}
                </span>
                <div className={`h-0.5 w-full bg-${isActive ? '(--accent)' : '(--border)'}`} />
              </div>
            );
          })}
        </div>
      )}

      {mode === 'import' && (
        <div className="relative">
          <div className="pointer-events-none blur-xs select-none">
            <ImportStep onComplete={handleImportComplete} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="rounded-full bg-(--accent) px-4 py-2 text-xs font-semibold text-white"
              style={{
                boxShadow: '0 2px 12px rgba(61,43,31,0.18)',
              }}
            >
              Coming soon
            </span>
          </div>
        </div>
      )}

      {mode === 'manual' && step === 1 && (
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

      {mode === 'manual' && step === 2 && (
        <IngredientsStep
          ingredients={ingredients}
          setIngredients={setIngredients}
          onBack={() => setStep(1)}
          onContinue={() => setStep(3)}
        />
      )}

      {mode === 'manual' && step === 3 && (
        <StepsStep
          instructions={instructions}
          setInstructions={setInstructions}
          onBack={() => setStep(2)}
          onContinue={() => setStep(4)}
        />
      )}

      {mode === 'manual' && step === 4 && (
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

      <ConfirmModal
        isOpen={showModeModal}
        title="Switch to import?"
        message="Your manually entered details will be cleared."
        confirmLabel="Switch"
        cancelLabel="Keep editing"
        onConfirm={confirmSwitchToImport}
        onCancel={() => setShowModeModal(false)}
      />
    </div>
  );
};

export default NewRecipePage;
