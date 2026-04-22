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
            style={{
              position: 'relative',
              display: 'inline-flex',
              height: 26,
              width: 44,
              flexShrink: 0,
              cursor: 'pointer',
              borderRadius: 100,
              border: 'none',
              transition: 'background 200ms',
              background: enabled[id] ? 'var(--accent)' : 'var(--border)',
              outline: 'none',
            }}
          >
            <span
              style={{
                pointerEvents: 'none',
                display: 'inline-block',
                height: 20,
                width: 20,
                marginTop: 3,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                transition: 'transform 200ms',
                transform: enabled[id] ? 'translateX(21px)' : 'translateX(3px)',
              }}
            />
          </button>
        </div>
      ))}
    </div>
  );
};
