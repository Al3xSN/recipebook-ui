import { SVGProps } from 'react';

export const ListIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--accent)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </svg>
);
