'use client';

import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, XIcon } from '@/components/icons';
import { useState } from 'react';

interface Instruction {
  text: string;
}

interface StepsStepProps {
  instructions: Instruction[];
  setInstructions: (v: Instruction[]) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const StepsStep = ({
  instructions,
  setInstructions,
  onBack,
  onContinue,
}: StepsStepProps) => {
  const [error, setError] = useState<string | null>(null);

  const add = () => setInstructions([...instructions, { text: '' }]);

  const remove = (i: number) => setInstructions(instructions.filter((_, idx) => idx !== i));

  const update = (i: number, text: string) =>
    setInstructions(instructions.map((inst, idx) => (idx === i ? { text } : inst)));

  const handleContinue = () => {
    if (instructions.some((inst) => !inst.text.trim())) {
      setError('Each step must have instructions.');
      return;
    }
    setError(null);
    onContinue();
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-(--text2)">Write your instructions step by step.</p>

      <div className="flex flex-col gap-3">
        {instructions.map((inst, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="mt-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--accent) text-xs font-bold text-white">
              {i + 1}
            </span>

            <textarea
              value={inst.text}
              onChange={(e) => update(i, e.target.value)}
              rows={2}
              placeholder={`Step ${i + 1}…`}
              className="flex-1 resize-none rounded-lg border border-(--border) bg-white px-3 py-2.5 text-base text-(--text) transition-colors outline-none focus:ring-2"
            />

            <button
              type="button"
              onClick={() => remove(i)}
              disabled={instructions.length === 1}
              aria-label="Remove step"
              className="mt-2 rounded-lg p-1.5 text-(--text3) transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <XIcon />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="flex w-fit items-center gap-1 rounded-lg border border-dashed border-(--border) px-4 py-2 text-sm font-medium text-(--text2) transition-colors hover:opacity-80"
      >
        <PlusIcon />
        <span>Add step</span>
      </button>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-(--border) py-3 text-sm font-medium text-(--text) transition-colors hover:opacity-80"
        >
          <ArrowLeftIcon className="h-6 w-6" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="flex flex-2 items-center justify-center gap-1 rounded-lg bg-(--accent) py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          <span>Continue</span>
          <ArrowRightIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
