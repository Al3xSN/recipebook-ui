import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="180" height="180" rx="36" fill="#FDF6EC" />
      <rect x="29" y="10" width="122" height="160" rx="16" fill="#C8602A" />
      <rect x="29" y="10" width="22" height="160" rx="11" fill="#A84E22" />
      <rect x="145" y="21" width="14" height="138" rx="7" fill="#E4D0B8" />
      <line
        x1="61"
        y1="61"
        x2="135"
        y2="61"
        stroke="#FDF6EC"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.65"
      />
      <line
        x1="61"
        y1="90"
        x2="135"
        y2="90"
        stroke="#FDF6EC"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.65"
      />
      <line
        x1="61"
        y1="101"
        x2="110"
        y2="101"
        stroke="#FDF6EC"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.65"
      />
      {/* Fork tines */}
      <line
        x1="77"
        y1="122"
        x2="77"
        y2="141"
        stroke="#FDF6EC"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="90"
        y1="122"
        x2="90"
        y2="141"
        stroke="#FDF6EC"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="103"
        y1="122"
        x2="103"
        y2="141"
        stroke="#FDF6EC"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M77 141 Q90 149 103 141"
        stroke="#FDF6EC"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="90"
        y1="141"
        x2="90"
        y2="159"
        stroke="#FDF6EC"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>,
    { ...size },
  );
}
