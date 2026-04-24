import type { SVGProps } from 'react';

export const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    {...props}
  >
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1z" />
    <polyline points="9,21 9,13 15,13 15,21" />
  </svg>
);
