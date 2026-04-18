'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiRequestError } from '@/lib/api';
import { TrashIcon, SpinnerIcon } from '@/components/icons';

export const DeleteRecipeButton = ({ recipeId }: { recipeId: string }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/recipes/${recipeId}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: res.statusText }));
        throw new ApiRequestError({ status: res.status, detail: body.detail ?? res.statusText });
      }
      router.back();
    } catch (err) {
      setIsDeleting(false);
      setError(err instanceof ApiRequestError ? err.detail : 'Failed to delete recipe.');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-red-500"
      >
        <TrashIcon className="h-3.5 w-3.5" />
        Delete
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => !isDeleting && setIsOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-1 text-base font-semibold text-gray-900">Delete recipe?</h2>
            <p className="mb-5 text-sm text-gray-500">This cannot be undone.</p>

            {error && (
              <p role="alert" className="mb-4 text-xs text-red-600">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : 'Delete'}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
