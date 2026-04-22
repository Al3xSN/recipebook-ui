'use client';

import { useState, useEffect, useRef } from 'react';
import { YouTube, Instagram, TikTok, Facebook } from '@/components/icons';

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
  { name: 'YouTube', Icon: YouTube, bg: '#FF0000' },
  { name: 'Instagram', Icon: Instagram, bg: 'transparent' },
  { name: 'TikTok', Icon: TikTok, bg: '#010101' },
  { name: 'Facebook', Icon: Facebook, bg: '#1877F2' },
];

const CheckCircle = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
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
    style={{ flexShrink: 0 }}
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
    style={{ flexShrink: 0 }}
  >
    <circle cx="10" cy="10" r="10" fill="var(--border)" />
  </svg>
);

const SpinnerArc = () => (
  <svg
    className="animate-spin"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, color: 'var(--accent)' }}
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
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text3)',
          marginBottom: 12,
        }}
      >
        Supported Platforms
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
          marginBottom: 20,
        }}
      >
        {PLATFORMS.map(({ name, Icon, bg }) => (
          <div
            key={name}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                background: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon width={40} height={40} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text2)' }}>{name}</span>
          </div>
        ))}
      </div>

      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text3)',
          marginBottom: 8,
        }}
      >
        Paste Video URL
      </p>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        disabled={isRunning}
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 10,
          border: '1px solid var(--border)',
          background: 'var(--bg2)',
          color: 'var(--text)',
          fontSize: 14,
          outline: 'none',
          boxSizing: 'border-box',
          marginBottom: 12,
          opacity: isRunning ? 0.6 : 1,
        }}
      />

      <div
        style={{
          padding: '14px 16px',
          borderRadius: 12,
          background: 'color-mix(in oklch, var(--accent) 6%, var(--bg))',
          marginBottom: isRunning ? 16 : 24,
        }}
      >
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.55, margin: 0 }}>
          Our AI will extract the recipe title, ingredients, and steps directly from the video. You
          can review everything before publishing.
        </p>
      </div>

      {isRunning && (
        <div
          style={{
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--card)',
            padding: '4px 0',
            marginBottom: 24,
          }}
        >
          {PROGRESS_STEPS.map((label, i) => {
            const isDone = completedStages >= i;
            const isActive = !isDone && completedStages === i - 1;

            return (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {isDone ? <CheckCircle /> : isActive ? <ActiveCircle /> : <PendingCircle />}
                  <span
                    style={{
                      fontSize: 14,
                      color: isActive ? 'var(--accent)' : isDone ? 'var(--text)' : 'var(--text3)',
                      fontWeight: isActive ? 600 : 400,
                    }}
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
        style={{
          width: '100%',
          padding: '15px',
          borderRadius: 12,
          border: 'none',
          background:
            isRunning || !url.trim()
              ? 'color-mix(in oklch, var(--accent) 55%, var(--bg))'
              : 'var(--accent)',
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          cursor: isRunning || !url.trim() ? 'default' : 'pointer',
        }}
      >
        {isRunning ? 'Analysing...' : 'Import recipe →'}
      </button>
    </div>
  );
};
