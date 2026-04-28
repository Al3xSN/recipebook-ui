import { SVGProps } from 'react';

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    {...props}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);
