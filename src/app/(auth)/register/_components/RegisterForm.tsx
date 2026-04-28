'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { EyeIcon } from '@/components/icons';
import { getStrength } from '@/utils/passwordStrenghts';

const strengthClasses: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-600',
  4: 'bg-green-600',
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
    setError(null);
    setIsLoading(true);

    const username = email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    try {
      const registrationResult = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username || 'user',
          email,
          password,
          ...(displayName ? { displayName } : {}),
        }),
      });

      if (!registrationResult.ok) {
        setError('Registration failed. Please try again.');
        return;
      }

      const loginResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
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
    <>
      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="displayName"
            className={`mb-1.5 block text-[10px] font-semibold tracking-widest text-(--text3) uppercase`}
          >
            Full name
          </label>

          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
            placeholder="Isabelle Chen"
            className={`w-full rounded-[10px] border border-(--border) bg-(--bg2) px-3 py-3 text-base text-(--text) transition-colors outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20`}
          />
        </div>

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
          <label
            htmlFor="password"
            className={`mb-1.5 block text-[10px] font-semibold tracking-widest text-(--text3) uppercase`}
          >
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

          {password.length > 0 && (
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4].map((seg) => (
                <div
                  key={seg}
                  className={`h-1 flex-1 rounded-full transition-[background] duration-200 ${strength >= seg ? strengthClasses[seg] : 'bg-(--border)'}`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className={`mb-1.5 block text-[10px] font-semibold tracking-widest text-(--text3) uppercase`}
          >
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
            className={`w-full rounded-[10px] border bg-(--bg2) px-3 py-3 text-base text-(--text) transition-colors outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20 ${passwordsMismatch ? 'border-red-500' : 'border-(--border)'}`}
          />

          {passwordsMismatch && (
            <p className="mt-1.5 text-xs text-red-500">Passwords don&apos;t match</p>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-2.5">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="sr-only"
            />

            <div
              className={`flex size-4.5 items-center justify-center rounded border-2 transition-[background,border-color] duration-150 ${agreedToTerms ? 'border-(--accent) bg-(--accent)' : 'border-(--border) bg-transparent'}`}
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

          <p className="text-sm leading-snug text-(--text2)">
            <span>I agree to the </span>
            <Link href="#" className="font-medium text-(--accent)">
              Terms of Service
            </Link>

            <span> and </span>
            <Link href="#" className="font-medium text-(--accent)">
              Privacy Policy
            </Link>
          </p>
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`mt-1 w-full rounded-xl bg-(--accent) py-3.5 text-sm font-semibold text-white transition-transform active:scale-[0.97] disabled:opacity-60 ${canSubmit ? 'shadow-[0_4px_18px_color-mix(in_oklch,var(--accent)_45%,transparent)]' : 'shadow-none'}`}
        >
          {isLoading ? 'Creating account...' : 'Continue'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-1.5 text-sm">
        <p className="text-(--text-2)">Already have an account? </p>

        <Link href="/login" className="font-semibold text-(--accent)">
          Log in
        </Link>
      </div>
    </>
  );
};
