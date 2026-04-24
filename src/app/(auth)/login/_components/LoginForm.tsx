'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { EyeIcon } from '@/components/icons';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { AppleIcon } from '@/components/icons/AppleIcon';

const fieldLabel = 'mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em]';
const fieldInput =
  'w-full rounded-[10px] border px-3 py-3 text-base outline-none transition-colors focus:ring-2';

export const LoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) {
        setError('Invalid email or password.');
      } else {
        router.replace('/recipes');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="mb-1 text-3xl leading-tight font-bold text-(--text)">Welcome back</h1>
      <p className="mb-7 text-sm text-(--text2)">Sign in to your RecipeBook account.</p>

      <div className="mb-5 flex flex-col gap-3">
        <button
          disabled
          title="Coming soon"
          className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl border border-solid border-(--border) bg-(--card) py-3 text-sm font-medium opacity-60"
        >
          <GoogleIcon className="h-5 w-5" />
          Continue with Google
        </button>
        <button
          disabled
          title="Coming soon"
          className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl border border-solid border-(--border) bg-(--card) py-3 text-sm font-medium opacity-60"
        >
          <AppleIcon className="h-5 w-5" />
          Continue with Apple
        </button>
      </div>

      <div className="mb-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-(--border)" />
        <span className="text-xs text-(--text3)">or continue with email</span>
        <div className="h-px flex-1 bg-(--border)" />
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className={`${fieldLabel} text-(--text3)`}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            placeholder="you@example.com"
            className={`${fieldInput} border-(--border) bg-(--bg2) text-(--text) focus:border-(--accent) focus:ring-(--accent)/20`}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className={`${fieldLabel} mb-0 text-(--text3)`}>
              Password
            </label>
            <a href="/forgot-password" className="text-xs font-medium text-(--accent)">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className={`${fieldInput} border-(--border) bg-(--bg2) pr-14 text-(--text) focus:border-(--accent) focus:ring-(--accent)/20`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-(--border)"
            >
              <EyeIcon open={showPassword} className="h-5 w-5" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 w-full rounded-xl bg-(--accent) py-3.5 text-sm font-semibold text-white shadow-[0_4px_18px_color-mix(in_oklch,var(--accent)_45%,transparent)] transition-transform active:scale-[0.97] disabled:opacity-60"
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-1.5">
        <p className="text-center text-sm text-(--text2)">Don&apos;t have an account?</p>
        <Link href="/register" className="text-sm font-semibold text-(--accent)">
          Sign up
        </Link>
      </div>
    </>
  );
};
