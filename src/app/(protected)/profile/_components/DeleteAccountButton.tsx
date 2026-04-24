'use client';

import { useState } from 'react';

export const DeleteAccountButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-center text-sm text-(--text3) transition-colors hover:text-red-500"
      >
        Delete account
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-xl font-bold text-(--text)">Delete account?</h2>
            <p className="mb-6 text-sm text-(--text2)">
              This action cannot be undone. All your recipes, saved items, and connections will be
              permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-(--border) py-2.5 text-sm font-medium text-(--text2) transition-colors hover:bg-(--bg2)"
              >
                Cancel
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
