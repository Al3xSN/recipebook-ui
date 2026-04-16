'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface IUserMenuProps {
  displayName: string;
  onLogout: () => void;
}

export function UserMenu({ displayName, onLogout }: IUserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function close() {
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {displayName}
        <svg
          className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        className={`absolute right-0 top-full z-20 mt-1 w-40 origin-top rounded-lg border border-gray-200 bg-white py-1 shadow-md transition-all duration-150 ${
          open ? 'scale-y-100 opacity-100' : 'pointer-events-none scale-y-95 opacity-0'
        }`}
      >
        <Link
          href="/profile/me"
          onClick={close}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
          Profile
        </Link>
        <button
          onClick={() => {
            close();
            onLogout();
          }}
          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
