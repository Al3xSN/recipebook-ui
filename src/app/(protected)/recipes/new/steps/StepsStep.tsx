'use client';

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
      <p className="text-sm" style={{ color: 'var(--text2)' }}>
        Write your instructions step by step.
      </p>

      <div className="flex flex-col gap-3">
        {instructions.map((inst, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className="mt-2.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {i + 1}
            </span>
            <textarea
              value={inst.text}
              onChange={(e) => update(i, e.target.value)}
              rows={2}
              placeholder={`Step ${i + 1}…`}
              className="flex-1 resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'white',
                color: 'var(--text)',
              }}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              disabled={instructions.length === 1}
              aria-label="Remove step"
              className="mt-2 rounded-lg p-1.5 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
              style={{ color: 'var(--text3)' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="w-fit rounded-lg border border-dashed px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
        style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
      >
        + Add step
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
          className="flex-1 rounded-lg border py-3 text-sm font-medium transition-colors hover:opacity-80"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="flex-[2] rounded-lg py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};
