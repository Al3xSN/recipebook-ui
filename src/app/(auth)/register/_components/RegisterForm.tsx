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

const getStrength = (pw: string): 0 | 1 | 2 | 3 | 4 => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score as 0 | 1 | 2 | 3 | 4;
};

const strengthColors: Record<number, string> = {
  1: '#ef4444',
  2: '#f97316',
  3: '#ca8a04',
  4: '#16a34a',
};

export const RegisterForm = () => {
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const strength = password.length > 0 ? getStrength(password) : 0;
  const passwordsMismatch =
    confirmTouched && confirmPassword.length > 0 && confirmPassword !== password;
  const canSubmit =
    !isLoading &&
    agreedToTerms &&
    password.length >= 6 &&
    !passwordsMismatch &&
    confirmPassword === password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setIsLoading(true);

    const username = email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username || 'user',
          email,
          password,
          ...(displayName ? { displayName } : {}),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.detail ?? 'Registration failed. Please try again.');
        return;
      }

      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) {
        setError('Account created but sign-in failed. Please sign in manually.');
        router.replace('/login');
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
    <AuthShell showProgress>
      <h1
        style={{ color: 'var(--text)', fontSize: 30, fontWeight: 700 }}
        className="mb-1 leading-tight"
      >
        Create account
      </h1>
      <p style={{ color: 'var(--text2)' }} className="mb-7 text-sm">
        Join thousands of home cooks.
      </p>

      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label htmlFor="displayName" style={{ color: 'var(--text3)' }} className={fieldLabel}>
            Full name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
            placeholder="Isabelle Chen"
            style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
            className={fieldInput + ' focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]'}
          />
        </div>

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
            style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
            className={fieldInput + ' focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]'}
          />
        </div>

        <div>
          <label htmlFor="password" style={{ color: 'var(--text3)' }} className={fieldLabel}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              placeholder="At least 6 characters"
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
          {password.length > 0 && (
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4].map((seg) => (
                <div
                  key={seg}
                  style={{
                    borderRadius: 100,
                    background: strength >= seg ? strengthColors[seg] : 'var(--border)',
                    transition: 'background 200ms',
                  }}
                  className="h-1 flex-1"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" style={{ color: 'var(--text3)' }} className={fieldLabel}>
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => setConfirmTouched(true)}
            autoComplete="new-password"
            required
            placeholder="Repeat password"
            style={{
              background: 'var(--bg2)',
              borderColor: passwordsMismatch ? '#ef4444' : 'var(--border)',
              color: 'var(--text)',
            }}
            className={fieldInput + ' focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]'}
          />
          {passwordsMismatch && (
            <p style={{ color: '#ef4444' }} className="mt-1.5 text-xs">
              Passwords don&apos;t match
            </p>
          )}
        </div>

        {/* Terms */}
        <label className="flex cursor-pointer items-start gap-2.5">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="sr-only"
            />
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                border: `2px solid ${agreedToTerms ? 'var(--accent)' : 'var(--border)'}`,
                background: agreedToTerms ? 'var(--accent)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 150ms, border-color 150ms',
              }}
            >
              {agreedToTerms && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                  <path
                    d="M1 4l3 3 5-6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
          <span style={{ color: 'var(--text2)' }} className="text-sm leading-snug">
            I agree to the{' '}
            <a href="#" style={{ color: 'var(--accent)' }} className="font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" style={{ color: 'var(--accent)' }} className="font-medium">
              Privacy Policy
            </a>
          </span>
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            background: 'var(--accent)',
            borderRadius: 12,
            boxShadow: canSubmit
              ? '0 4px 18px color-mix(in oklch, var(--accent) 45%, transparent)'
              : 'none',
          }}
          className="mt-1 w-full py-3.5 text-sm font-semibold text-white transition-transform active:scale-[0.97] disabled:opacity-60"
        >
          {isLoading ? 'Creating account…' : 'Continue →'}
        </button>
      </form>

      <p style={{ color: 'var(--text2)' }} className="mt-6 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--accent)' }} className="font-semibold">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
};
