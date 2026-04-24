'use client';

import { useState, useEffect, useRef } from 'react';
import { YouTubeIcon, InstagramIcon, TikTokIcon, FacebookIcon } from '@/components/icons';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface MockExtractedRecipe {
  title: string;
  description: string;
  category: number;
  difficulty: Difficulty;
  prepTimeMinutes: string;
  cookTimeMinutes: string;
  servings: string;
  tags: number[];
  ingredients: { name: string; amount: string; unit: number }[];
  instructions: { text: string }[];
}

const MOCK_RECIPE: MockExtractedRecipe = {
  title: 'Creamy Garlic Pasta',
  description:
    'A rich and flavorful pasta dish with a creamy garlic sauce, ready in under 30 minutes.',
  category: 2,
  difficulty: 'EASY',
  prepTimeMinutes: '10',
  cookTimeMinutes: '20',
  servings: '4',
  tags: [8],
  ingredients: [
    { name: 'pasta', amount: '400', unit: 3 },
    { name: 'heavy cream', amount: '200', unit: 6 },
    { name: 'garlic', amount: '4', unit: 13 },
    { name: 'parmesan cheese', amount: '50', unit: 3 },
    { name: 'olive oil', amount: '2', unit: 0 },
    { name: 'salt', amount: '1', unit: 11 },
    { name: 'black pepper', amount: '1', unit: 11 },
  ],
  instructions: [
    {
      text: 'Cook the pasta in salted boiling water until al dente. Reserve ½ cup of pasta water before draining.',
    },
    {
      text: 'Heat olive oil in a large pan over medium heat. Add minced garlic and sauté for 1–2 minutes until fragrant.',
    },
    {
      text: 'Pour in the heavy cream and bring to a gentle simmer. Stir in parmesan until melted and smooth.',
    },
    {
      text: 'Add the drained pasta to the sauce, tossing to coat. Add pasta water as needed to loosen the sauce.',
    },
    { text: 'Season with salt and black pepper to taste. Serve immediately.' },
  ],
};

const PROGRESS_STEPS = [
  'Reading video metadata',
  'Detecting recipe content',
  'Extracting ingredients & steps',
  'Finalising...',
];

const STEP_DELAYS = [1200, 1200, 1600, 1200];

const PLATFORMS = [
  { name: 'YouTube', Icon: YouTubeIcon, bg: 'transparent' },
  { name: 'Instagram', Icon: InstagramIcon, bg: 'transparent' },
  { name: 'TikTok', Icon: TikTokIcon, bg: 'black' },
  { name: 'Facebook', Icon: FacebookIcon, bg: 'transparent' },
];

const CheckCircle = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle cx="10" cy="10" r="10" fill="var(--accent)" />
    <polyline
      points="5.5,10.5 8.5,13.5 14.5,7"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const ActiveCircle = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle cx="10" cy="10" r="9" stroke="var(--accent)" strokeWidth="2" fill="none" />
  </svg>
);

const PendingCircle = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle cx="10" cy="10" r="10" fill="var(--border)" />
  </svg>
);

const SpinnerArc = () => (
  <svg
    className="shrink-0 animate-spin text-(--accent)"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="8" r="6" stroke="var(--border)" strokeWidth="2" />
    <path d="M8 2a6 6 0 0 1 6 6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface ImportStepProps {
  onComplete: (data: MockExtractedRecipe) => void;
}

export const ImportStep = ({ onComplete }: ImportStepProps) => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'running'>('idle');
  const [completedStages, setCompletedStages] = useState(-1);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const isRunning = status === 'running';

  useEffect(() => {
    if (status !== 'running') return;

    let cumulative = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    STEP_DELAYS.forEach((delay, i) => {
      cumulative += delay;
      const t = setTimeout(() => {
        setCompletedStages(i);
        if (i === STEP_DELAYS.length - 1) {
          const done = setTimeout(() => onCompleteRef.current(MOCK_RECIPE), 500);
          timeouts.push(done);
        }
      }, cumulative);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [status]);

  const handleImport = () => {
    if (!url.trim() || isRunning) return;
    setCompletedStages(-1);
    setStatus('running');
  };

  return (
    <div>
      <p className="mb-3 text-xs font-semibold tracking-wide text-(--text3) uppercase">
        Supported Platforms
      </p>
      <div className="mb-4 flex justify-around">
        {PLATFORMS.map(({ name, Icon, bg }) => (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-solid border-(--border) bg-${bg}`}
            >
              <Icon width={40} height={40} />
            </div>
            <span className="text-xs text-(--text2)">{name}</span>
          </div>
        ))}
      </div>

      <p className="mb-2 text-xs font-semibold tracking-wide text-(--text3) uppercase">
        Paste Video URL
      </p>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        disabled={isRunning}
        className="mb-3 box-border w-full rounded-xl border border-solid border-(--border) bg-(--bg2) px-3.5 py-3 text-sm text-(--text) outline-none"
      />

      <div className="mb-5 rounded-xl bg-(--accent-tint-6) px-4 py-3.5">
        <p className="m-0 text-sm leading-[1.55] text-(--text2)">
          Our AI will extract the recipe title, ingredients, and steps directly from the video. You
          can review everything before publishing.
        </p>
      </div>

      {isRunning && (
        <div className="mb-6 rounded-xl border border-solid border-(--border) bg-(--card) py-1">
          {PROGRESS_STEPS.map((label, i) => {
            const isDone = completedStages >= i;
            const isActive = !isDone && completedStages === i - 1;

            return (
              <div key={label} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  {isDone ? <CheckCircle /> : isActive ? <ActiveCircle /> : <PendingCircle />}

                  <span
                    className={`text-sm ${isActive ? 'font-semibold text-(--accent)' : isDone ? 'text-(--text)' : 'text-(--text3)'}`}
                  >
                    {label}
                  </span>
                </div>
                {isActive && <SpinnerArc />}
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={handleImport}
        disabled={isRunning || !url.trim()}
        className={`w-full rounded-xl p-3 text-lg font-semibold text-white ${isRunning || !url.trim() ? 'cursor-default bg-[color-mix(in_oklch,var(--accent)_55%,var(--bg))]' : 'cursor-pointer bg-(--accent)'}`}
      >
        {isRunning ? 'Analysing...' : 'Import recipe →'}
      </button>
    </div>
  );
};
