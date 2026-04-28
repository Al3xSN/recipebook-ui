'use client';

import { useState } from 'react';

export const TimeGreeting = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    }

    if (hour >= 12 && hour < 18) {
      return 'Good afternoon';
    }

    return 'Good evening';
  };

  const [greeting] = useState(getGreeting);

  return (
    <p suppressHydrationWarning className="mb-1 text-sm font-medium text-(--text2)">
      {greeting}
    </p>
  );
};
