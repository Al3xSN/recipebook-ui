'use client';

import { useState } from 'react';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const TimeGreeting = () => {
  const [greeting] = useState(getGreeting);

  return (
    <p
      suppressHydrationWarning
      style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', marginBottom: 4 }}
    >
      {greeting}
    </p>
  );
};
