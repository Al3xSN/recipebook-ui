'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AuthShell } from '@/components/auth/AuthCard';
import { EyeIcon } from '@/components/icons';

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
    <AuthShell>
      <h1
        style={{ color: 'var(--text)', fontSize: 30, fontWeight: 700 }}
        className="mb-1 leading-tight"
      >
        Welcome back
      </h1>
      <p style={{ color: 'var(--text2)' }} className="mb-7 text-sm">
        Sign in to your RecipeBook account.
      </p>

      {/* Social login placeholders */}
      <div className="mb-5 flex flex-col gap-3">
        <button
          disabled
          title="Coming soon"
          style={{ border: '1px solid var(--border)', borderRadius: 12, background: 'var(--card)' }}
          className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 py-3 text-sm font-medium opacity-60"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          disabled
          title="Coming soon"
          style={{ border: '1px solid var(--border)', borderRadius: 12, background: 'var(--card)' }}
          className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 py-3 text-sm font-medium opacity-60"
        >
          <AppleIcon />
          Continue with Apple
        </button>
      </div>

      {/* Divider */}
      <div className="mb-5 flex items-center gap-3">
        <div style={{ background: 'var(--border)' }} className="h-px flex-1" />
        <span style={{ color: 'var(--text3)' }} className="text-xs">
          or continue with email
        </span>
        <div style={{ background: 'var(--border)' }} className="h-px flex-1" />
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" style={{ color: 'var(--text3)' }} className={fieldLabel}>
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
            style={{
              background: 'var(--bg2)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
            className={fieldInput + ' focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]'}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              style={{ color: 'var(--text3)' }}
              className={fieldLabel + ' mb-0'}
            >
              Password
            </label>
            <a href="#" style={{ color: 'var(--accent)' }} className="text-xs font-medium">
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
              style={{
                background: 'var(--bg2)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
              className={
                fieldInput + ' pr-14 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]'
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{ color: 'var(--border)' }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <EyeIcon open={showPassword} className="h-5 w-5" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            background: 'var(--accent)',
            borderRadius: 12,
            boxShadow: '0 4px 18px color-mix(in oklch, var(--accent) 45%, transparent)',
          }}
          className="mt-1 w-full py-3.5 text-sm font-semibold text-white transition-transform active:scale-[0.97] disabled:opacity-60"
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p style={{ color: 'var(--text2)' }} className="mt-6 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/register" style={{ color: 'var(--accent)' }} className="font-semibold">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.36.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);
