'use client';

import { useRouter } from 'next/navigation';

interface AuthShellProps {
  children: React.ReactNode;
  showProgress?: boolean;
}

export const AuthShell = ({ children, showProgress }: AuthShellProps) => {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }} className="px-5 pb-10">
      <div className="flex items-center pt-5">
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          style={{ background: 'var(--bg2)', borderRadius: '50%' }}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-base"
        >
          ←
        </button>

        {showProgress && (
          <div className="ml-4 flex flex-1 gap-2">
            <div
              style={{ background: 'var(--border)', borderRadius: 100 }}
              className="relative h-1 flex-1 overflow-hidden"
            >
              <div
                style={{ background: 'var(--accent)', borderRadius: 100, width: '55%' }}
                className="absolute inset-y-0 left-0"
              />
            </div>
            <div
              style={{ background: 'var(--border)', borderRadius: 100 }}
              className="h-1 flex-1"
            />
          </div>
        )}
      </div>

      <div className="mx-auto mt-8 max-w-sm">{children}</div>
    </div>
  );
};
