import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="2" width="22" height="28" rx="3" fill="#C8602A" />
      <rect x="5" y="2" width="4" height="28" rx="2" fill="#A84E22" />
      <rect x="26" y="4" width="2.5" height="24" rx="1.2" fill="#E4D0B8" />
      <line
        x1="11"
        y1="11"
        x2="24"
        y2="11"
        stroke="#FDF6EC"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.65"
      />
      <line
        x1="11"
        y1="16"
        x2="24"
        y2="16"
        stroke="#FDF6EC"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.65"
      />
      <line
        x1="11"
        y1="19"
        x2="19"
        y2="19"
        stroke="#FDF6EC"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.65"
      />
      {/* Fork tines */}
      <line
        x1="13"
        y1="22"
        x2="13"
        y2="25"
        stroke="#FDF6EC"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="22"
        x2="16"
        y2="25"
        stroke="#FDF6EC"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="19"
        y1="22"
        x2="19"
        y2="25"
        stroke="#FDF6EC"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M13 25 Q16 27 19 25"
        stroke="#FDF6EC"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="25"
        x2="16"
        y2="28"
        stroke="#FDF6EC"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>,
    { ...size },
  );
}
