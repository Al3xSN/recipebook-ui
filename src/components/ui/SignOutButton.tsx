'use client';

import { signOut } from 'next-auth/react';

export const SignOutButton = () => (
  <button
    onClick={() => signOut({ redirectTo: '/' })}
    style={{
      width: '100%',
      padding: '13px 20px',
      borderRadius: 12,
      border: '1.5px solid var(--border)',
      background: 'transparent',
      color: 'var(--text2)',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.15s',
    }}
  >
    Sign out
  </button>
);
