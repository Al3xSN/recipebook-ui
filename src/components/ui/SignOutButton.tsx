'use client';

import { signOut } from 'next-auth/react';

export const SignOutButton = () => (
  <button
    onClick={() => signOut({ redirectTo: '/' })}
    className="text-sm font-medium text-(--accent) transition-opacity hover:opacity-70"
  >
    Sign out
  </button>
);
