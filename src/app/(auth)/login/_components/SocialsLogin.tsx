'use client';

import { signIn } from 'next-auth/react';
import { AppleIcon, GoogleIcon } from '@/components/icons';

export const SocialsLogin = () => (
  <div className="mb-5 flex flex-col gap-3">
    <button
      onClick={() => signIn('google', { callbackUrl: '/recipes' })}
      className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-solid border-(--border) bg-(--card) py-3 text-sm font-medium transition-opacity hover:opacity-80"
    >
      <GoogleIcon className="h-5 w-5" />
      <span>Continue with Google</span>
    </button>
  </div>
);
