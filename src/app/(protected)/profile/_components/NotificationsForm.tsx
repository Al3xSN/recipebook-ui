'use client';

import { useState } from 'react';

const NOTIFICATIONS = [
  { id: 'comments', label: 'New comments on your recipes' },
  { id: 'ratings', label: 'New ratings received' },
  { id: 'followers', label: 'New followers' },
  { id: 'newsletter', label: 'Weekly recipe newsletter' },
];

export const NotificationsForm = () => {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    comments: false,
    ratings: false,
    followers: false,
    newsletter: false,
  });

  const toggle = (id: string) => setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div>
      {NOTIFICATIONS.map(({ id, label }, i) => (
        <div
          key={id}
          className={`flex items-center justify-between px-6 py-4 ${i < NOTIFICATIONS.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
        >
          <span className="text-sm text-[var(--text)]">{label}</span>
          <button
            role="switch"
            aria-checked={enabled[id]}
            onClick={() => toggle(id)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 ${enabled[id] ? 'bg-[var(--accent)]' : 'bg-gray-200'}`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform duration-200 ${enabled[id] ? 'translate-x-5' : 'translate-x-0.5'}`}
            />
          </button>
        </div>
      ))}
    </div>
  );
};
