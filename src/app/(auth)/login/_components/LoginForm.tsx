'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { EyeIcon } from '@/components/icons';

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
      const res = await signIn('credentials', { email, password, redirect: false });
      if (res.error !== undefined) {
        setError('Invalid email or password.');
        return;
      }

      router.replace('/recipes');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
          <label
            htmlFor="email"
            className={`mb-1.5 block text-[10px] font-semibold tracking-widest text-(--text3) uppercase`}
          >
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
            className={`w-full rounded-[10px] border border-(--border) bg-(--bg2) px-3 py-3 text-base text-(--text) transition-colors outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20`}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className={`mb-1.5 block text-[10px] font-semibold tracking-widest text-(--text3) uppercase`}
            >
              Password
            </label>

            <Link href="/forgot-password" className="text-xs font-medium text-(--accent)">
              Forgot password?
            </Link>
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
              className={`w-full rounded-[10px] border border-(--border) bg-(--bg2) px-3 py-3 pr-14 text-base text-(--text) transition-colors outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20`}
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
