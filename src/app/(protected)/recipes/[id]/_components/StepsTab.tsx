'use client';

import { useState } from 'react';

interface IStep {
  stepNumber: number;
  text: string;
}

interface IStepsTab {
  steps: IStep[];
}

export const StepsTab = ({ steps }: IStepsTab) => {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const toggle = (stepNumber: number) =>
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(stepNumber)) next.delete(stepNumber);
      else next.add(stepNumber);
      return next;
    });

  const sorted = [...steps].sort((a, b) => a.stepNumber - b.stepNumber);

  return (
    <div className="px-4 py-5">
      <p className="mb-5 text-sm text-orange-500">Tap a step to mark it done.</p>
      <ol className="flex flex-col gap-4">
        {sorted.map((step) => {
          const done = completed.has(step.stepNumber);
          return (
            <li
              key={step.stepNumber}
              className="flex cursor-pointer gap-4"
              onClick={() => toggle(step.stepNumber)}
            >
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  done ? 'bg-gray-100 text-gray-400' : 'bg-orange-500 text-white'
                }`}
              >
                {step.stepNumber}
              </span>
              <p
                className={`pt-0.5 leading-relaxed transition-colors ${
                  done ? 'text-gray-400 line-through' : 'text-gray-700'
                }`}
              >
                {step.text}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
